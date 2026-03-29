import pandas as pd
import numpy as np
from dataclasses import dataclass
from typing import Optional
import pandas_ta as ta


@dataclass
class BacktestResult:
    pattern_name: str
    total_occurrences: int
    wins: int
    losses: int
    win_rate: float          # percentage
    avg_gain_pct: float      # average % gain on wins
    avg_loss_pct: float      # average % loss on losses
    avg_hold_days: int
    best_gain_pct: float
    worst_loss_pct: float
    expectancy: float        # win_rate * avg_gain - loss_rate * avg_loss


def backtest_breakout(df: pd.DataFrame, forward_days: int = 15) -> BacktestResult:
    """
    Backtest resistance breakout across entire history.
    Entry: day of breakout close. Exit: forward_days later.
    """
    results = []

    for i in range(30, len(df) - forward_days):
        window = df.iloc[i-30:i]
        last = df.iloc[i]
        prev = df.iloc[i-1]

        resistance = window["high"].quantile(0.90)
        avg_vol = window["volume"].mean()

        if last["close"] > resistance and prev["close"] <= resistance and last["volume"] > avg_vol:
            entry = float(last["close"])
            future = df.iloc[i + forward_days]
            exit_price = float(future["close"])
            pct = (exit_price - entry) / entry * 100
            results.append(pct)

    return _compile_result("Resistance Breakout", results, forward_days)


def backtest_double_bottom(df: pd.DataFrame, forward_days: int = 20) -> BacktestResult:
    """Backtest double bottom pattern."""
    results = []

    for i in range(40, len(df) - forward_days):
        window = df.iloc[i-40:i]
        lows = window["low"].values

        troughs = []
        for j in range(2, len(lows) - 2):
            if lows[j] < lows[j-1] and lows[j] < lows[j+1] and lows[j] < lows[j-2] and lows[j] < lows[j+2]:
                troughs.append((j, lows[j]))

        if len(troughs) < 2:
            continue

        t1, t2 = troughs[-2], troughs[-1]
        gap = t2[0] - t1[0]
        price_diff_pct = abs(t2[1] - t1[1]) / (t1[1] + 1e-9)

        if 5 <= gap <= 25 and price_diff_pct < 0.03:
            entry = float(df.iloc[i]["close"])
            exit_price = float(df.iloc[i + forward_days]["close"])
            pct = (exit_price - entry) / entry * 100
            results.append(pct)

    return _compile_result("Double Bottom", results, forward_days)


def backtest_rsi_divergence(df: pd.DataFrame, forward_days: int = 15) -> BacktestResult:
    """Backtest bullish RSI divergence."""
    results = []
    rsi_series = ta.rsi(df["close"], length=14)
    if rsi_series is None:
        return _compile_result("Bullish RSI Divergence", [], forward_days)

    df2 = df.copy()
    df2["rsi"] = rsi_series

    for i in range(30, len(df2) - forward_days):
        window = df2.iloc[i-20:i]
        if window["rsi"].isna().any():
            continue

        price_trend = float(window["close"].iloc[-1]) - float(window["close"].iloc[0])
        rsi_trend = float(window["rsi"].iloc[-1]) - float(window["rsi"].iloc[0])
        last_rsi = float(window["rsi"].iloc[-1])

        if price_trend < 0 and rsi_trend > 5 and last_rsi < 45:
            entry = float(df2.iloc[i]["close"])
            exit_price = float(df2.iloc[i + forward_days]["close"])
            pct = (exit_price - entry) / entry * 100
            results.append(pct)

    return _compile_result("Bullish RSI Divergence", results, forward_days)


def backtest_bull_flag(df: pd.DataFrame, forward_days: int = 10) -> BacktestResult:
    """Backtest bull flag continuation."""
    results = []

    for i in range(25, len(df) - forward_days):
        pole = df.iloc[i-25:i-15]
        flag = df.iloc[i-15:i]

        pole_gain = (float(pole["close"].iloc[-1]) - float(pole["close"].iloc[0])) / (float(pole["close"].iloc[0]) + 1e-9)
        flag_range = (float(flag["high"].max()) - float(flag["low"].min())) / (float(flag["close"].iloc[0]) + 1e-9)
        flag_drift = (float(flag["close"].iloc[-1]) - float(flag["close"].iloc[0])) / (float(flag["close"].iloc[0]) + 1e-9)

        if pole_gain > 0.06 and flag_range < 0.06 and -0.04 < flag_drift < 0.01:
            entry = float(df.iloc[i]["close"])
            exit_price = float(df.iloc[i + forward_days]["close"])
            pct = (exit_price - entry) / entry * 100
            results.append(pct)

    return _compile_result("Bull Flag", results, forward_days)


def _compile_result(pattern_name: str, results: list, forward_days: int) -> BacktestResult:
    if not results:
        return BacktestResult(
            pattern_name=pattern_name,
            total_occurrences=0, wins=0, losses=0,
            win_rate=0, avg_gain_pct=0, avg_loss_pct=0,
            avg_hold_days=forward_days, best_gain_pct=0,
            worst_loss_pct=0, expectancy=0
        )

    arr = np.array(results)
    wins = arr[arr > 0]
    losses = arr[arr <= 0]

    win_rate = len(wins) / len(arr) * 100
    avg_gain = float(wins.mean()) if len(wins) > 0 else 0
    avg_loss = float(abs(losses.mean())) if len(losses) > 0 else 0
    expectancy = (win_rate / 100 * avg_gain) - ((1 - win_rate / 100) * avg_loss)

    return BacktestResult(
        pattern_name=pattern_name,
        total_occurrences=len(arr),
        wins=len(wins),
        losses=len(losses),
        win_rate=round(win_rate, 1),
        avg_gain_pct=round(avg_gain, 2),
        avg_loss_pct=round(avg_loss, 2),
        avg_hold_days=forward_days,
        best_gain_pct=round(float(arr.max()), 2),
        worst_loss_pct=round(float(arr.min()), 2),
        expectancy=round(expectancy, 2),
    )


PATTERN_BACKTEST_MAP = {
    "Resistance Breakout": backtest_breakout,
    "Double Bottom": backtest_double_bottom,
    "Bullish RSI Divergence": backtest_rsi_divergence,
    "Bull Flag": backtest_bull_flag,
}


def run_backtest(df: pd.DataFrame, pattern_name: str) -> Optional[BacktestResult]:
    """Run backtest for a specific detected pattern."""
    fn = PATTERN_BACKTEST_MAP.get(pattern_name)
    if fn and df is not None and len(df) >= 60:
        try:
            return fn(df)
        except Exception as e:
            print(f"Backtest failed for {pattern_name}: {e}")
    return None
