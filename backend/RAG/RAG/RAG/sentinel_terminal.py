import os
import chromadb
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage

# ==========================================
# 0. SETUP & API KEYS
# ==========================================
# Set your Groq API key here (or export it in your terminal)
os.environ["GROQ_API_KEY"] = "your_groq_api_key_here"

# Initialize the LLM (Llama 3 70B is blazing fast for this)
llm = ChatGroq(temperature=0.0, model_name="llama3-70b-8192")

# Initialize Local Vector DB
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="et_markets_news")

# ==========================================
# 1. MOCK INGESTION (Background Loop)
# ==========================================
print("--> [SYSTEM] Ingesting recent market news into Vector DB...")
news_data = [
    "Reliance Industries announces a massive $100B green energy push, aiming for zero carbon by 2035.",
    "Global crude oil prices dip 2%, easing margin pressures on Indian refiners like Reliance.",
    "Morgan Stanley upgrades Reliance to 'Overweight', citing strong telecom and retail growth.",
    "TCS reports flat Q3 earnings, missing street estimates slightly.", # Irrelevant to Reliance
    "HDFC Bank announces new credit card partnerships to boost retail lending.", # Irrelevant
    "Reliance Retail acquires a major European fashion brand to expand its global footprint.",
    "Market analysts predict heavy FII inflows into Indian large-cap stocks this quarter."
]

# Add to ChromaDB with metadata
collection.add(
    documents=news_data,
    metadatas=[
        {"ticker": "RELIANCE.NS", "date": "2026-03-27"},
        {"ticker": "RELIANCE.NS", "date": "2026-03-27"},
        {"ticker": "RELIANCE.NS", "date": "2026-03-27"},
        {"ticker": "TCS.NS", "date": "2026-03-27"},
        {"ticker": "HDFCBANK.NS", "date": "2026-03-27"},
        {"ticker": "RELIANCE.NS", "date": "2026-03-27"},
        {"ticker": "MACRO", "date": "2026-03-27"}
    ],
    ids=[f"doc_{i}" for i in range(len(news_data))]
)

# ==========================================
# 2. THE TRIGGER (JSON Input from Member 1/2)
# ==========================================
insight_trigger = {
    "timestamp": "2026-03-28T00:45:00Z",
    "ticker": "RELIANCE.NS",
    "user_profile": "Aggressive, Long-term Wealth",
    "insight": "Sentiment shifted to Highly Positive (+0.84) alongside a MACD Bullish Crossover."
}

# ==========================================
# 3. DYNAMIC RETRIEVAL (Up to 7, Filtered)
# ==========================================
print(f"--> [SYSTEM] Insight Triggered for {insight_trigger['ticker']}. Procuring documents...")

# Query ChromaDB for up to 7 documents, filtering exactly by Ticker
results = collection.query(
    query_texts=[insight_trigger["insight"]],
    n_results=7,
    where={"ticker": insight_trigger["ticker"]} # Hard Metadata Filter
)

# Quality Control: Only keep documents with a good distance score (lower is better in Chroma)
DISTANCE_THRESHOLD = 1.5 
relevant_docs = []
for doc, distance in zip(results['documents'][0], results['distances'][0]):
    if distance < DISTANCE_THRESHOLD:
        relevant_docs.append(doc)

print(f"--> [SYSTEM] Procured {len(relevant_docs)} highly relevant documents out of 7 requested.\n")
context_string = "\n".join([f"- {doc}" for doc in relevant_docs])

# ==========================================
# 4. CONVERSATIONAL PIPELINE SETUP
# ==========================================
# Initialize Memory
memory = ConversationBufferMemory(return_messages=True)

# Create the Chat Prompt Template
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Sentinel AI, an elite financial assistant. 
    You are discussing a recent insight regarding {ticker}.
    
    User Profile: {user_profile}
    The Catalyst Insight: {insight}
    
    Verified News Context (Do not use outside knowledge):
    {context}
    
    Rules:
    1. Be conversational, professional, and concise.
    2. Only use the provided News Context to explain the 'Why'.
    3. If the user asks something not covered in the context, say you don't have the data.
    """),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}")
])

# Create the runnable chain
chain = prompt | llm

# ==========================================
# 5. THE TERMINAL CHAT LOOP
# ==========================================
print("==================================================")
print(f"⚡ SENTINEL TERMINAL INITIALIZED ⚡")
print(f"Alert: {insight_trigger['insight']}")
print("==================================================\n")

# Start the conversation with an initial prompt behind the scenes
initial_question = "Explain this setup and why it is happening based on the news."
print(f"User: {initial_question}")

response = chain.invoke({
    "ticker": insight_trigger["ticker"],
    "user_profile": insight_trigger["user_profile"],
    "insight": insight_trigger["insight"],
    "context": context_string,
    "question": initial_question,
    "history": memory.load_memory_variables({})["history"]
})

# Save to memory
memory.save_context({"input": initial_question}, {"output": response.content})
print(f"\nSentinel AI: {response.content}\n")

# Enter the continuous chat loop
while True:
    try:
        user_input = input("You (Type 'exit' to quit): ")
        if user_input.lower() in ['exit', 'quit']:
            print("Terminating session...")
            break
            
        print("\nSentinel AI is thinking...")
        
        # Invoke the chain with history
        reply = chain.invoke({
            "ticker": insight_trigger["ticker"],
            "user_profile": insight_trigger["user_profile"],
            "insight": insight_trigger["insight"],
            "context": context_string,
            "question": user_input,
            "history": memory.load_memory_variables({})["history"]
        })
        
        # Save the new exchange to memory
        memory.save_context({"input": user_input}, {"output": reply.content})
        
        print(f"\nSentinel AI: {reply.content}\n")
        
    except KeyboardInterrupt:
        print("\nTerminating session...")
        break