import re
import chromadb
from sentence_transformers import SentenceTransformer

# ==========================================
# 1. Initialize DB & Model (Foreground)
# ==========================================
print("Waking up the Retriever...")
# Connect to the local database we just built
chroma_client = chromadb.PersistentClient(path="./data")

# Safe: if collection is missing, create it automatically
try:
    collection = chroma_client.get_collection(name="sentinel_news")
except Exception as e:
    print(f"Collection not found, creating new one...")
    collection = chroma_client.create_collection(name="sentinel_news")

# Load the exact same model to ensure the math matches
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# ==========================================
# 2. Query Parser (The Regex Router)
# ==========================================
def parse_query(raw_query):
    """
    Extracts the @TICKER and isolates the semantic question.
    Example: "@RELIANCE.NS why the jump?" -> "RELIANCE.NS", "why the jump?"
    """
    # Look for the '@' symbol followed by uppercase letters, numbers, or dots
    match = re.search(r'@([A-Z0-9.]+)', raw_query.upper())
    
    if match:
        ticker = match.group(1)
        # Strip the ticker tag out so it doesn't skew the semantic search
        clean_query = re.sub(r'@[A-Z0-9.]+', '', raw_query, flags=re.IGNORECASE).strip()
        return ticker, clean_query
        
    # If the user didn't tag a ticker, default to general market news
    return "GENERAL", raw_query

# ==========================================
# 3. Semantic Search (The Procurement)
# ==========================================
def search_insight(raw_query, top_k=7, max_distance=1.2):
    """
    Embeds the query, filters by metadata, and retrieves up to `top_k` context chunks.
    Uses `max_distance` to drop irrelevant documents and prevent AI confusion.
    """
    ticker, clean_query = parse_query(raw_query)
    print(f"\n[Router] Target Ticker: {ticker}")
    print(f"[Router] Semantic Intent: '{clean_query}'")
    
    # 1. Convert the user's text question into a math vector
    query_vector = embedding_model.encode(clean_query).tolist()
    
    # 2. The "Where" Clause: This prevents AI hallucinations by isolating the ticker
    where_filter = {"ticker": ticker} if ticker != "GENERAL" else None
    
    print(f"[Search] Scanning ChromaDB for up to {top_k} results...")
    
    # 3. Execute the query, explicitly asking for the 'distances' score
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        where=where_filter,
        include=["documents", "metadatas", "distances"] # Fetch the math scores!
    )
    
    # 4. Filter and format the output cleanly for our upcoming LLM prompt
    retrieved_snippets = []
    
    # ChromaDB returns nested lists, so we check if we actually found anything
    if results['documents'] and len(results['documents'][0]) > 0:
        for i in range(len(results['documents'][0])):
            doc_text = results['documents'][0][i]
            meta = results['metadatas'][0][i]
            distance = results['distances'][0][i] # Extract the relevance score
            
            # THE DYNAMIC FILTER: If the text is too irrelevant, skip it!
            if distance > max_distance:
                print(f"   [!] Dropped chunk (Distance {distance:.2f} > {max_distance}) - Irrelevant")
                continue
            
            source = meta.get('source', 'Unknown Source')
            date = meta.get('date', 'Unknown Date')
            
            # Bundle the text with its verified source citation
            snippet = f"[Source: {source}, Date: {date}] {doc_text}"
            retrieved_snippets.append(snippet)
            
    return retrieved_snippets

# ==========================================
# 4. Execution & Testing
# ==========================================
if __name__ == "__main__":
    # Simulate a judge asking a live question
    test_query = "@RELIANCE.NS Why are the shares moving today?"
    print(f"--- Live Input: {test_query} ---")
    
    snippets = search_insight(test_query)
    
    print("\n=== VERIFIED CONTEXT RETRIEVED ===")
    if not snippets:
        print("No relevant data found for this query.")
    else:
        for idx, s in enumerate(snippets):
            print(f"\nInsight {idx + 1}:")
            print(s)
    print("\n==================================")