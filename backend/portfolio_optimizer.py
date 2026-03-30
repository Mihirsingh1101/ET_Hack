import numpy as np
import pandas as pd
import yfinance as yf
import os

# ═════════════════════════════════════════════════════════
#  CONFIG
# ═════════════════════════════════════════════════════════
LOOKBACK_YEARS = 2
RISK_FREE_RATE = 0.065   # annual, e.g. 0.065 = 6.5%
TRADING_DAYS   = 252
STEPS          = 500     # higher = more precise optimal amount

def fetch_returns(tickers, years):
    frames = {}
    for ticker in tickers:
        # Ensure .NS suffix for Indian stocks if not present
        search_ticker = ticker
        if not ticker.endswith(".NS") and not ticker.endswith(".BO") and "." not in ticker:
            search_ticker = f"{ticker}.NS"
            
        try:
            df = yf.download(search_ticker, period=f"{years}y", auto_adjust=True, progress=False, threads=False)
            if df.empty:
                continue
            # Handle MultiIndex columns if necessary
            close = df["Close"].iloc[:, 0] if isinstance(df.columns, pd.MultiIndex) else df["Close"]
            frames[ticker] = close
        except Exception as e:
            print(f"  WARNING: Failed to fetch {ticker}: {e}")

    prices  = pd.DataFrame(frames)
    returns = prices.pct_change(fill_method=None)
    returns = returns.dropna(axis=1, how="all").dropna(axis=0, how="any")
    return returns

def portfolio_vol(weights, cov_matrix):
    w = np.array(weights, dtype=float)
    return np.sqrt(w @ cov_matrix @ w) * np.sqrt(TRADING_DAYS)

def portfolio_return(weights, mean_returns):
    return np.dot(np.array(weights, dtype=float), mean_returns) * TRADING_DAYS

def portfolio_sharpe(ret, vol):
    if vol == 0: return 0
    return (ret - RISK_FREE_RATE) / vol

def condition_aggressive(after_ret, after_vol):
    return after_ret >= 5.0 and after_vol <= 25.0

def condition_moderate(after_ret, after_vol):
    return after_ret >= 0.0 and after_vol <= 20.0

def condition_conservative(after_ret, after_vol):
    return after_ret >= -5.0 and after_vol <= 17.0

CONDITIONS = [
    ("AGGRESSIVE",   condition_aggressive),
    ("MODERATE",     condition_moderate),
    ("CONSERVATIVE", condition_conservative),
]

def classify(after_ret_pct, after_vol_pct):
    for label, condition_fn in CONDITIONS:
        if condition_fn(after_ret_pct, after_vol_pct):
            return label
    return "DON'T INVEST"

def run_portfolio_optimization(portfolio, new_asset, max_investment):
    """
    portfolio: dict { "SYMBOL": amount }
    new_asset: string "SYMBOL"
    max_investment: float
    """
    existing_tickers = list(portfolio.keys())
    all_tickers = existing_tickers + [new_asset]
    
    # Fetch returns for all
    returns = fetch_returns(all_tickers, LOOKBACK_YEARS)
    available = returns.columns.tolist()
    
    if new_asset not in available:
        return {"error": f"Could not fetch data for {new_asset}"}
        
    valid_existing = [t for t in existing_tickers if t in available]
    if not valid_existing and portfolio:
         # Portfolio has items but none fetched
         pass 

    existing_amounts = np.array([portfolio[t] for t in valid_existing], dtype=float)
    existing_total = existing_amounts.sum()
    
    if existing_total == 0:
        # User starting fresh or empty portfolio
        # Just give metrics for the new asset at max investment
        cov_matrix = returns[[new_asset]].cov().values
        mean_returns = returns[[new_asset]].mean().values
        
        y = max_investment
        vol = portfolio_vol([1.0], cov_matrix) * 100
        ret = portfolio_return([1.0], mean_returns) * 100
        sharpe = portfolio_sharpe(ret/100, vol/100)
        label = classify(ret, vol)
        
        return {
            "before": {"total": 0, "ret": 0, "vol": 0, "sharpe": 0},
            "after": {"total": y, "ret": round(ret, 2), "vol": round(vol, 2), "sharpe": round(sharpe, 3)},
            "optimal_amount": y,
            "optimal_weight": 100.0,
            "recommendation": label,
            "condition_results": {lbl: condition_fn(ret, vol) for lbl, condition_fn in CONDITIONS}
        }

    all_valid = valid_existing + [new_asset]
    cov_matrix = returns[all_valid].cov().values
    mean_returns = returns[all_valid].mean().values
    
    # BEFORE metrics
    base_cov = returns[valid_existing].cov().values
    base_w = existing_amounts / existing_total
    before_ret = portfolio_return(base_w, mean_returns[:len(valid_existing)]) * 100
    before_vol = portfolio_vol(base_w, base_cov) * 100
    before_sharpe = portfolio_sharpe(before_ret/100, before_vol/100)
    
    # SWEEP
    y_values = np.linspace(0, max_investment, STEPS)
    vols, rets = [], []
    
    for y in y_values:
        total = existing_total + y
        w = np.append(existing_amounts, y) / total
        vols.append(portfolio_vol(w, cov_matrix))
        rets.append(portfolio_return(w, mean_returns))
        
    vols = np.array(vols)
    rets = np.array(rets)
    
    min_idx = np.argmin(vols)
    optimal_y = y_values[min_idx]
    optimal_vol = vols[min_idx] * 100
    optimal_ret = rets[min_idx] * 100
    optimal_total = existing_total + optimal_y
    optimal_wt = (optimal_y / optimal_total) * 100
    optimal_sharpe = portfolio_sharpe(optimal_ret/100, optimal_vol/100)
    
    label = classify(optimal_ret, optimal_vol)
    
    return {
        "before": {
            "total": round(existing_total, 2),
            "ret": round(before_ret, 2),
            "vol": round(before_vol, 2),
            "sharpe": round(before_sharpe, 3)
        },
        "after": {
            "total": round(optimal_total, 2),
            "ret": round(optimal_ret, 2),
            "vol": round(optimal_vol, 2),
            "sharpe": round(optimal_sharpe, 3)
        },
        "optimal_amount": round(optimal_y, 2),
        "optimal_weight": round(optimal_wt, 2),
        "recommendation": label,
        "condition_results": {lbl: ("MATCH" if condition_fn(optimal_ret, optimal_vol) else "NO MATCH") for lbl, condition_fn in CONDITIONS}
    }
