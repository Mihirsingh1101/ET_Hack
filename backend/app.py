from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from chart_intelligence.data_fetcher import fetch_ohlcv, fetch_historical_5y, get_stock_info
from chart_intelligence.pattern_detector import detect_all_patterns
from chart_intelligence.backtester import run_backtest
from chart_intelligence.ai_explainer import generate_explanation

import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=4)

@app.get("/api/analyze/{symbol}")
async def analyze_stock(symbol: str, period: str = "6mo"):
    loop = asyncio.get_event_loop()

    df = await loop.run_in_executor(executor, fetch_ohlcv, symbol, period, "1d")
    if df is None:
        return {"error": "Invalid stock"}

    df_5y = await loop.run_in_executor(executor, fetch_historical_5y, symbol)
    info = await loop.run_in_executor(executor, get_stock_info, symbol)

    signals = detect_all_patterns(df)

    results = []
    for sig in signals:
        bt = run_backtest(df_5y, sig.name) if df_5y is not None else None

        explanation = await loop.run_in_executor(
            executor,
            generate_explanation,
            symbol,
            info.get("name", symbol),
            sig,
            bt,
            float(info.get("current_price", 0)),
        )

        results.append({
            "name": sig.name,
            "type": sig.type,
            "direction": sig.direction,
            "confidence": sig.confidence,
            "description": sig.description,
            "detected_at": sig.detected_at,
            "key_levels": sig.key_levels,
            "win_rate": bt.win_rate if bt else None,
            "avg_gain_pct": bt.avg_gain_pct if bt else None,
            "avg_loss_pct": bt.avg_loss_pct if bt else None,
            "total_occurrences": bt.total_occurrences if bt else None,
            "expectancy": bt.expectancy if bt else None,
            "ai_explanation": explanation,
        })

    df_reset = df.reset_index()
    # Handle the difference in yfinance indexing
    if "Date" in df_reset.columns:
        df_reset = df_reset.rename(columns={"Date": "date"})
    elif "Datetime" in df_reset.columns:
        df_reset = df_reset.rename(columns={"Datetime": "date"})
    elif "index" in df_reset.columns:
        df_reset = df_reset.rename(columns={"index": "date"})
        
    if "date" in df_reset.columns:
        df_reset["date"] = df_reset["date"].dt.strftime('%Y-%m-%d')
    else:
        df_reset["date"] = df_reset.iloc[:, 0].dt.strftime('%Y-%m-%d')
        
    ohlcv_data = df_reset[["date", "open", "high", "low", "close", "volume"]].to_dict(orient="records")

    return {
        "stock": info,
        "patterns": results,
        "ohlcv": ohlcv_data
    }

@app.get("/api/flags")
async def get_realtime_flags():
    """Scans the designated watchlist and returns live technical flags grouped by confidence."""
    loop = asyncio.get_event_loop()
    watchlist = [
        "RELIANCE",
        "HDFCBANK",
        "ICICIBANK",
        "INFY",
        "BHARTIARTL",
        "TCS",
        "LT",
        "ITC",
        "SBIN",
        "AXISBANK"
    ]
    
    all_flags = []
    
    # We fetch 3 months of data to ensure pattern detect has enough context while being fast
    for sym in watchlist:
        try:
            df = await loop.run_in_executor(executor, fetch_ohlcv, sym, "3mo", "1d")
            if df is not None:
                signals = detect_all_patterns(df)
                for sig in signals:
                    all_flags.append({
                        "symbol": sym,
                        "name": sig.name,
                        "type": sig.type,
                        "direction": sig.direction,
                        "confidence": sig.confidence,
                        "description": sig.description,
                        "detected_at": sig.detected_at
                    })
        except Exception as e:
            print(f"Error scanning {sym}: {e}")
            
    # Sort all flags globally by confidence descending
    all_flags.sort(key=lambda x: x.get("confidence", 0), reverse=True)
    
    return {"flags": all_flags[:8]} # Return top 8 flags across all stocks

import json
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime

class PortfolioItem(BaseModel):
    symbol: str
    amount: float = 0.0

PORTFOLIO_FILE = Path(__file__).parent.absolute() / "portfolio.json"

@app.post("/api/portfolio")
async def add_to_portfolio(item: PortfolioItem):
    """Appends a new stock to the local portfolio.json file."""
    portfolio = []
    print(f"Adding to portfolio: {item.symbol} with amount {item.amount}")
    if PORTFOLIO_FILE.exists():
        try:
            with open(PORTFOLIO_FILE, "r") as f:
                portfolio = json.load(f)
        except json.JSONDecodeError:
            portfolio = []
            
    # Add new item
    entry = {
        "symbol": item.symbol.strip().upper(),
        "amount": item.amount,
        "added_at": datetime.now().isoformat()
    }
    
    # If exists, update
    for p in portfolio:
        if p.get("symbol", "").strip().upper() == entry["symbol"]:
            p["amount"] = entry["amount"]
            p["added_at"] = entry["added_at"]
            print(f"Updated existing entry for {entry['symbol']}")
            break
    else:
        portfolio.append(entry)
        print(f"Added new entry for {entry['symbol']}")
        
    with open(PORTFOLIO_FILE, "w") as f:
        json.dump(portfolio, f, indent=4)
            
    return {"message": "Success", "portfolio": portfolio}

@app.delete("/api/portfolio/{symbol}")
async def delete_from_portfolio(symbol: str):
    """Deletes a symbol from the portfolio."""
    target = symbol.strip().upper()
    print(f"Attempting to delete asset: '{target}'")
    
    if not PORTFOLIO_FILE.exists():
        print("Portfolio file not found.")
        return {"message": "Portfolio not found", "portfolio": []}
    
    try:
        with open(PORTFOLIO_FILE, "r") as f:
            portfolio = json.load(f)
        
        original_size = len(portfolio)
        # Filter out the symbol
        new_portfolio = [p for p in portfolio if p.get("symbol", "").strip().upper() != target]
        
        if len(new_portfolio) < original_size:
            print(f"Successfully removed '{target}' from list.")
        else:
            print(f"Warning: Symbol '{target}' not found in current portfolio.")
            # Let's list what we have
            print(f"Current assets: {[p.get('symbol') for p in portfolio]}")
        
        with open(PORTFOLIO_FILE, "w") as f:
            json.dump(new_portfolio, f, indent=4)
            
        print(f"Wrote updated portfolio to {PORTFOLIO_FILE}")
        return {"message": "Deleted", "portfolio": new_portfolio}
    except Exception as e:
        print(f"DELETE error: {str(e)}")
        return {"message": f"Error: {str(e)}", "portfolio": []}

@app.get("/api/portfolio")
async def get_portfolio():
    """Returns the current portfolio."""
    print("Fetching portfolio data...")
    if not PORTFOLIO_FILE.exists():
        return {"portfolio": []}
    try:
        with open(PORTFOLIO_FILE, "r") as f:
            data = json.load(f)
            print(f"Found {len(data)} items.")
            return {"portfolio": data}
    except json.JSONDecodeError:
        print("JSON Error reading portfolio.")
        return {"portfolio": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)