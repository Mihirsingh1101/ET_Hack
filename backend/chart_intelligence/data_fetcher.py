import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional


def get_nse_ticker(symbol: str) -> str:
    """Convert plain NSE symbol to Yahoo Finance format (e.g. RELIANCE -> RELIANCE.NS)"""
    symbol = symbol.upper().strip()
    if not symbol.endswith(".NS") and not symbol.endswith(".BO"):
        return f"{symbol}.NS"
    return symbol


def fetch_ohlcv(
    symbol: str,
    period: str = "1y",
    interval: str = "1d"
) -> Optional[pd.DataFrame]:
    """
    Fetch OHLCV data for an NSE stock from Yahoo Finance.
    period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y
    interval: 1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo
    """
    ticker = get_nse_ticker(symbol)
    try:
        df = yf.download(ticker, period=period, interval=interval, auto_adjust=True, progress=False)
        if df.empty:
            return None
        df.columns = [c[0].lower() if isinstance(c, tuple) else c.lower() for c in df.columns]
        df = df[["open", "high", "low", "close", "volume"]].dropna()
        df.index = pd.to_datetime(df.index)
        return df
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None


def fetch_historical_5y(symbol: str) -> Optional[pd.DataFrame]:
    """Fetch 5 years of daily data for backtesting."""
    return fetch_ohlcv(symbol, period="5y", interval="1d")


def get_stock_info(symbol: str) -> dict:
    """Get basic stock metadata."""
    ticker = get_nse_ticker(symbol)
    try:
        info = yf.Ticker(ticker).info
        return {
            "symbol": symbol.upper(),
            "name": info.get("longName", symbol.upper()),
            "sector": info.get("sector", "N/A"),
            "market_cap": info.get("marketCap"),
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
        }
    except Exception:
        return {"symbol": symbol.upper(), "name": symbol.upper()}
