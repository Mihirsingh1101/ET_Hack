# ============================================================
# final_hf.py — Sentinel AI Quantitative Momentum Engine (FastAPI)
# Uses Hugging Face InferenceClient + API Endpoints
# ============================================================

import os
import requests
import feedparser
from urllib.parse import quote
from datetime import datetime, timezone, timedelta
from dateutil import parser as dateparser
import yfinance as yf
import pandas as pd
import math
import time
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn

# ============================================================
# 1. API SECURITY & HF SETUP
# ============================================================
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("🚨 HF_TOKEN is missing! Please check your .env file.")

# Initialize the official Hugging Face Client
hf_client = InferenceClient(provider="hf-inference", api_key=HF_TOKEN)

# Initialize FastAPI App
app = FastAPI(title="Sentinel AI - Quantitative Engine API")

# Add CORS Middleware (Allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# PYDANTIC SCHEMAS (For API Inputs)
# ============================================================
class AnalyzeRequest(BaseModel):
    company_name: str

class InsightData(BaseModel):
    ticker: str
    sector: str
    insight_text: str
    timestamp: str

class ChatRequest(BaseModel):
    user_message: str
    insight_data: InsightData
    chat_history: List[Dict[str, str]] = []

def analyze_sentiment_hf(text, retries=3):
    """Uses the official Hugging Face InferenceClient to score text."""
    for attempt in range(retries):
        try:
            result = hf_client.text_classification(text, model="ProsusAI/finbert")
            
            # Safely parse the Hugging Face payload
            scores = {}
            for r in result:
                label = r.label if hasattr(r, 'label') else r['label']
                score = r.score if hasattr(r, 'score') else r['score']
                scores[label] = float(score)
            
            return {
                "positive": scores.get("positive", 0.0),
                "negative": scores.get("negative", 0.0),
                "neutral": scores.get("neutral", 1.0)
            }
            
        except Exception as e:
            error_msg = str(e).lower()
            if "loading" in error_msg or "503" in error_msg:
                print(f"    [API] Waking up FinBERT model... (Waiting 10s)")
                time.sleep(10)
            else:
                print(f"    [API ERROR] Attempt {attempt + 1} failed: {e}")
                time.sleep(2)
                
    return {"positive": 0.0, "negative": 0.0, "neutral": 1.0}

# ============================================================
# 2. TICKER LOOKUP
# ============================================================
# Hardcoded stock dictionary as fallback
HARDCODED_STOCKS = {
    "reliance industries": "RELIANCE",
    "reliance": "RELIANCE",
    "tata consultancy services": "TCS",
    "tcs": "TCS",
    "hdfc bank": "HDFCBANK",
    "hdfc": "HDFCBANK",
    "infosys": "INFY",
    "wipro": "WIPRO",
    "itc": "ITC",
    "larsen & toubro": "LT",
    "hindustan unilever": "HINDUNILVR",
    "state bank of india": "SBIN",
    "icici bank": "ICICIBANK",
    "icici": "ICICIBANK",
    "bajaj auto": "BAJAJ-AUTO",
    "maruti": "MARUTI",
    "hero motocorp": "HEROMOTOCO",
    "sun pharma": "SUNPHARMA",
    "dr. reddy's": "DRREDDY",
    "axis bank": "AXISBANK",
    "kotak bank": "KOTAKBANK",
    "asian paints": "ASIANPAINT",
    "airtel": "BHARTIARTL",
    "power grid": "POWERGRID",
    "ntpc": "NTPC",
    "ongc": "ONGC",
    "coal india": "COALINDIA",
    "ioc": "IOCL",
    "cipla": "CIPLA",
    "lupin": "LUPIN",
}

try:
    df = pd.read_csv("EQUITY_L.csv")
    stock_dict = dict(zip(df["NAME OF COMPANY"], df["SYMBOL"]))
    stock_dict.update(HARDCODED_STOCKS)  # Merge with hardcoded as fallback
except FileNotFoundError:
    print("⚠️ EQUITY_L.csv not found. Using hardcoded stock database.")
    stock_dict = HARDCODED_STOCKS

def find_ticker(company_input, stock_dict):
    company_input = company_input.lower().strip()
    
    # First check hardcoded dictionary for exact match
    if company_input in stock_dict:
        ticker = stock_dict[company_input]
        print(f"✅ Matched: '{company_input}' → '{ticker}'")
        return ticker
    
    # Then search through all entries
    for nse_name, symbol in stock_dict.items():
        nse_lower = nse_name.lower()
        if company_input in nse_lower or nse_lower.startswith(company_input):
            print(f"✅ Matched: '{company_input}' → '{nse_name}' ({symbol})")
            return symbol
    return None

def get_sector(ticker):
    try:
        stock = yf.Ticker(ticker + ".NS")
        return stock.get_info().get("sector", None)
    except Exception:
        return None

# ============================================================
# 3. SCRAPERS
# ============================================================
def scrape_stock_news(company_name, ticker=None, days=7):
    short_name = ticker if ticker else company_name.split()[0]
    queries = [f"{company_name} India", f"{short_name} India", f"{short_name} NSE"]
    headers = {"User-Agent": "Mozilla/5.0"}
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    best_articles = []
    
    for query in queries:
        encoded = quote(query)
        url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"
        try:
            response = requests.get(url, headers=headers, timeout=10)
            feed = feedparser.parse(response.content)
            articles = []
            for entry in feed.entries:
                try:
                    published = dateparser.parse(entry.published)
                    if published.tzinfo is None: published = published.replace(tzinfo=timezone.utc)
                    if published >= cutoff:
                        articles.append({"title": entry.title, "url": entry.link, "time": published})
                except Exception:
                    continue
            if len(articles) > len(best_articles):
                best_articles = articles
        except Exception:
            continue

    best_articles = sorted(best_articles, key=lambda x: x["time"], reverse=True)
    seen = set()
    unique = []
    for a in best_articles:
        if a["title"] not in seen:
            seen.add(a["title"])
            unique.append(a)
    print(f"✅ Stock news   → {len(unique)} articles")
    return unique

def scrape_sector_news(sector, days=7):
    if not sector: return []
    queries = [f"{sector} sector India", f"{sector} stocks India", f"{sector} NSE"]
    headers = {"User-Agent": "Mozilla/5.0"}
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    best_articles = []
    
    for query in queries:
        encoded = quote(query)
        url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"
        try:
            response = requests.get(url, headers=headers, timeout=10)
            feed = feedparser.parse(response.content)
            articles = []
            for entry in feed.entries:
                try:
                    published = dateparser.parse(entry.published)
                    if published.tzinfo is None: published = published.replace(tzinfo=timezone.utc)
                    if published >= cutoff:
                        articles.append({"title": entry.title, "url": entry.link, "time": published})
                except Exception:
                    continue
            if len(articles) > len(best_articles):
                best_articles = articles
        except Exception:
            continue

    best_articles = sorted(best_articles, key=lambda x: x["time"], reverse=True)
    seen = set()
    unique = []
    for a in best_articles:
        if a["title"] not in seen:
            seen.add(a["title"])
            unique.append(a)
    print(f"✅ Sector news  → {len(unique)} articles")
    return unique

def scrape_market_news(days=7):
    url = "https://economictimes.indiatimes.com/rssfeedsdefault.cms"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        feed = feedparser.parse(response.content)
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        articles = []
        for entry in feed.entries:
            try:
                published = dateparser.parse(entry.published)
                if published.tzinfo is None: published = published.replace(tzinfo=timezone.utc)
                if published >= cutoff:
                    articles.append({"title": entry.title, "url": entry.link, "time": published})
            except Exception:
                continue
        articles = sorted(articles, key=lambda x: x["time"], reverse=True)
        seen = set()
        unique = []
        for a in articles:
            if a["title"] not in seen:
                seen.add(a["title"])
                unique.append(a)
        print(f"✅ Market news  → ET RSS → {len(unique)} articles")
        return unique
    except Exception as e:
        print(f"❌ ET RSS failed: {e}")
        return []

# ============================================================
# 4. SCORING (MOMENTUM SHIFT ALGORITHM)
# ============================================================
def score_articles_weighted(articles, decay=0.5):
    """Calculates overall sentiment delta and 48-hour momentum shift."""
    if not articles:
        return 0.0, 0.0, []

    now = datetime.now(timezone.utc)
    scored = []
    
    recent_sum, recent_weight = 0.0, 0.0
    older_sum, older_weight = 0.0, 0.0

    for article in articles:
        scores = analyze_sentiment_hf(article["title"])
        
        signed = scores["positive"] - scores["negative"]
        age_days = (now - article["time"]).total_seconds() / 86400
        weight = math.exp(-decay * age_days)

        scored.append({
            "title": article["title"],
            "url": article["url"],
            "time": article["time"],
            "signed": signed,
            "weight": round(weight, 4),
            "age_days": age_days
        })
        time.sleep(0.1) 

    if not scored:
        return 0.0, 0.0, []

    # 1. Overall Weighted Delta
    total_weight = sum(a["weight"] for a in scored)
    overall_delta = sum(a["signed"] * a["weight"] for a in scored) / total_weight if total_weight > 0 else 0.0

    # 2. Momentum Shift (Last 48 hours vs previous 5 days)
    for a in scored:
        if a["age_days"] <= 2.0:
            recent_sum += a["signed"] * a["weight"]
            recent_weight += a["weight"]
        else:
            older_sum += a["signed"] * a["weight"]
            older_weight += a["weight"]

    recent_delta = recent_sum / recent_weight if recent_weight > 0 else overall_delta
    older_delta = older_sum / older_weight if older_weight > 0 else 0.0
    sentiment_shift = recent_delta - older_delta 

    scored = sorted(scored, key=lambda x: abs(x["signed"]), reverse=True)
    return round(overall_delta, 4), round(sentiment_shift, 4), scored

def extract_real_url(google_url):
    try:
        response = requests.get(google_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5, allow_redirects=True)
        return response.url
    except Exception:
        return google_url

def get_top_3_urls(scored):
    sorted_by_sentiment = sorted(scored, key=lambda x: abs(x["signed"]), reverse=True)
    return [extract_real_url(a["url"]) for a in sorted_by_sentiment[:3]]

def interpret_signal(stock_delta, sector_delta, market_delta):
    if stock_delta > 0.1 and sector_delta > 0 and market_delta > 0: return "🟢 Strong Bullish — Stock, Sector & Market positive"
    elif stock_delta > 0.1 and sector_delta > 0: return "🟢 Bullish — Stock & Sector positive despite weak market"
    elif stock_delta > 0.1 and sector_delta < 0: return "🟡 Stock resilient against weak sector"
    elif stock_delta < -0.1 and sector_delta > 0: return "🔴 Stock underperforming vs sector"
    elif stock_delta < -0.1 and sector_delta < 0 and market_delta < 0: return "🔴 Strong Bearish — Stock, Sector & Market negative"
    else: return "🟡 Mixed signals / Neutral momentum — monitor closely"

# ============================================================
# 5. FASTAPI ENDPOINTS
# ============================================================

@app.get("/")
def read_root():
    """Welcome message for the API root."""
    return {"status": "online", "message": "Sentinel AI Quantitative Engine API is running."}

@app.get("/health")
def health_check():
    """Endpoint for system health checks."""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/analyze")
def analyze_company(request: AnalyzeRequest):
    """
    Analyzes sentiment for a given company.
    Returns quantitative data + the formatted insight string needed for the chatbot.
    """
    company = request.company_name.strip()
    ticker = find_ticker(company, stock_dict)
    
    if not ticker:
        raise HTTPException(status_code=404, detail=f"Could not find '{company}' in NSE database")

    print(f"\n🔄 Running Sentinel Engine for: {company} ({ticker})")
    
    articles = scrape_stock_news(company, ticker=ticker, days=7)
    sector = get_sector(ticker)
    sector_articles = scrape_sector_news(sector, days=7) if sector else []
    market_articles = scrape_market_news(days=7)

    stock_delta, stock_shift, stock_scored = score_articles_weighted(articles)
    sector_delta, sector_shift, sector_scored = score_articles_weighted(sector_articles)
    market_delta, market_shift, market_scored = score_articles_weighted(market_articles)
    
    stock_urls = get_top_3_urls(stock_scored)
    signal = interpret_signal(stock_delta, sector_delta, market_delta)

    live_headlines = " | ".join([a['title'] for a in stock_scored[:3]]) if stock_scored else "No recent headlines found."
    combined_insight = f"FinBERT Signal: {signal}. Stock Delta: {stock_delta:+.4f}. 48-Hour Momentum Shift: {stock_shift:+.4f}. Key driving headlines: {live_headlines}"

    return {
        "status": "success",
        "company": company,
        "ticker": ticker,
        "sector": sector or "N/A",
        "stock_delta": stock_delta,
        "stock_shift": stock_shift,
        "sector_delta": sector_delta,
        "sector_shift": sector_shift,
        "market_delta": market_delta,
        "market_shift": market_shift,
        "signal": signal,
        "urls": stock_urls,
        # This structure should be saved on the frontend and passed into /chat
        "insight_data": {
            "ticker": f"{ticker}.NS",
            "sector": sector or "Unknown",
            "insight_text": combined_insight,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        }
    }

@app.post("/chat")
def chat_with_sentinel(request: ChatRequest):
    """
    Acts as a proxy, forwarding user chat messages to the RAG API (running on port 8003).
    """
    rag_payload = {
        "user_message": request.user_message,
        "insight_data": dict(request.insight_data),
        "chat_history": request.chat_history
    }

    try:
        response = requests.post("http://127.0.0.1:8003/chat", json=rag_payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=f"RAG API Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503, 
            detail="Could not reach Sentinel RAG API. Ensure 'python api.py' is running on port 8003."
        )

# ============================================================
# SERVER STARTUP
# ============================================================
if __name__ == "__main__":
    print("\n🚀 Starting Sentinel Quant Engine API on Port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)