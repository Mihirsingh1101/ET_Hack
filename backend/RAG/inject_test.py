import chromadb
from sentence_transformers import SentenceTransformer

print("Booting up injection sequence...")

# 1. Connect to your existing local database
client = chromadb.PersistentClient(path="./data")
collection = client.get_collection(name="sentinel_news")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. The Synthetic News Article
synthetic_text = "Infosys has officially secured a massive $1.5 Billion Generative AI transformation deal with a major European banking consortium. This historic contract has prompted the company to significantly raise its FY27 revenue guidance, driving massive institutional buying."
synthetic_ticker = "INFY.NS"

# 3. Convert to math
print(f"Embedding synthetic news for {synthetic_ticker}...")
vector = embedding_model.encode(synthetic_text).tolist()

# 4. Inject into ChromaDB
collection.add(
    documents=[synthetic_text],
    embeddings=[vector],
    metadatas=[{"ticker": synthetic_ticker, "source": "Hackathon Test Data", "date": "2026-03-28"}],
    ids=["synthetic_test_001"]
)

print("✅ Synthetic catalyst successfully injected into ChromaDB!")
print(f"Total documents now in database: {collection.count()}")