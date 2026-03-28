import time
import hashlib
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime
from email.utils import parsedate_to_datetime
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb

# ==========================================
# 1. Configuration & Initialization
# ==========================================
print("Initializing Sentinel AI Ingestion Pipeline...")

# Initialize ChromaDB (Local SQLite)
chroma_client = chromadb.PersistentClient(path="./data")
collection = chroma_client.get_or_create_collection(name="sentinel_news")

# Load the local embedding model (Runs on CPU)
print("Loading all-MiniLM-L6-v2 embedding model...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize LangChain's chunker
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500, 
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", " ", ""]
)

# ==========================================
# 2. Data Sanitization Helpers
# ==========================================
def clean_html(raw_html):
    """Strips HTML tags and standardizes whitespace."""
    if not raw_html: 
        return ""
    text = BeautifulSoup(raw_html, "html.parser").get_text(separator=" ")
    return " ".join(text.split()) # Removes extra spaces/newlines

def parse_date(date_string):
    """Forces all RSS timestamps into strict YYYY-MM-DD format for filtering."""
    try:
        dt = parsedate_to_datetime(date_string)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        # Fallback to today if the RSS feed is missing a valid date
        return datetime.now().strftime("%Y-%m-%d")

# ==========================================
# 3. Core Scraping Logic
# ==========================================
def fetch_and_process_rss(url, source_name, ticker, seen_urls):
    """Scrapes RSS, sanitizes, chunks, and formats metadata."""
    print(f"Scraping {source_name} for target: {ticker}...")
    feed = feedparser.parse(url)
    
    docs, metadatas, ids = [], [], []
    
    for entry in feed.entries:
        # 1. NEW: Grab the URL and check for duplicates immediately
        article_url = entry.get("link", "")
        if article_url in seen_urls:
            continue # We already processed this article, skip it!
        
        seen_urls.add(article_url) # Mark as seen
        
        title = entry.get("title", "")
        summary = clean_html(entry.get("summary", ""))
        full_text = f"{title}. {summary}"
        
        if len(full_text) < 50:
            continue
            
        date_str = parse_date(entry.get("published", ""))
        chunks = text_splitter.split_text(full_text)
        
        for i, chunk in enumerate(chunks):
            docs.append(chunk)
            metadatas.append({
                "ticker": ticker,
                "date": date_str,
                "source": source_name
            })
            # 2. NEW: Use the URL as the base for the ID to guarantee consistency
            # We hash the URL just to keep the ID string short and clean
            url_hash = hashlib.md5(article_url.encode('utf-8')).hexdigest()
            chunk_id = f"{ticker}_{date_str}_{url_hash}_chunk{i}"
            ids.append(chunk_id)
            
    return docs, metadatas, ids

# ==========================================
# 4. Main Execution Loop
# ==========================================
def run_ingestion(ticker_to_track="RELIANCE.NS"):
    start_time = time.time()
    
    et_markets_url = "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"
    google_news_url = f"https://news.google.com/rss/search?q={ticker_to_track}+stock+india&hl=en-IN&gl=IN&ceid=IN:en"
    
    all_docs, all_metadatas, all_ids = [], [], []
    
    # NEW: Create a master set to track URLs across all sources
    global_seen_urls = set()
    
    docs, metas, ids = fetch_and_process_rss(et_markets_url, "ET Markets", "GENERAL", global_seen_urls)
    all_docs.extend(docs)
    all_metadatas.extend(metas)
    all_ids.extend(ids)
    
    docs, metas, ids = fetch_and_process_rss(google_news_url, "Google News", ticker_to_track, global_seen_urls)
    all_docs.extend(docs)
    all_metadatas.extend(metas)
    all_ids.extend(ids)
    
    if not all_docs:
        print("No articles found. Check network or RSS URLs.")
        return
        
    print(f"\n✅ Scraping complete. Total dense chunks generated: {len(all_docs)}")
    print("Vectorizing text (converting words to math)...")
    
    # Generate the embeddings locally in one batch
    embeddings = embedding_model.encode(all_docs).tolist()
    
    print("Upserting vectors and metadata into ChromaDB...")
    collection.upsert(
        documents=all_docs,
        embeddings=embeddings,
        metadatas=all_metadatas,
        ids=all_ids
    )
    
    exec_time = round(time.time() - start_time, 2)
    print(f"🚀 Pipeline execution finished in {exec_time} seconds. Database is primed.")

# ==========================================
# 4. Continuous Background Worker
# ==========================================
if __name__ == "__main__":
    # How often to check for new articles (e.g., every 15 minutes)
    INTERVAL_MINUTES = 15 
    
    print("\n" + "="*50)
    print(f" 🔄 Sentinel Background Ingestion Worker Started")
    print(f" ⏱️  Cycle: Every {INTERVAL_MINUTES} minutes")
    print("="*50)
    
    while True:
        try:
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n[{current_time}] Waking up scraper...")
            
            # Run the ingestion for your target ticker
            run_ingestion(ticker_to_track="RELIANCE.NS")
            
            print(f"💤 Ingestion cycle complete. Sleeping for {INTERVAL_MINUTES} minutes...")
            
        except Exception as e:
            print(f"🚨 [ERROR] Scraper encountered an issue: {str(e)}")
            print("Restarting on next cycle...")
            
        # Pause the script for the defined interval before running again
        time.sleep(INTERVAL_MINUTES * 60)