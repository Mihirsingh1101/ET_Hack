import pandas as pd
import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional
import pandas_ta as ta


@dataclass
class PatternSignal:
    name: str
    type: str          # breakout | reversal | continuation | divergence | support_resistance
    direction: str     # bullish | bearish | neutral
    confidence: float  # 0-1
    description: str
    detected_at: str   # ISO date string
    key_levels: dict   # e.g. {"resistance": 2500, "support": 2300}
    lookback_bars: int = 20


def detect_breakout(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Price closing above recent resistance with volume confirmation."""
    if len(df) < 30:
        return None

    recent = df.tail(30)
    last = df.iloc[-1]
    prev = df.iloc[-2]

    resistance = recent["high"].quantile(0.90)
    avg_vol = recent["volume"].mean()
    last_vol = last["volume"]

    if last["close"] > resistance and prev["close"] <= resistance:
        vol_confirm = last_vol > avg_vol * 1.2
        confidence = 0.75 if vol_confirm else 0.55
        return PatternSignal(
            name="Resistance Breakout",
            type="breakout",
            direction="bullish",
            confidence=confidence,
            description=f"Price broke above resistance at {resistance:.2f} {'with strong volume' if vol_confirm else 'on average volume'}.",
            detected_at=str(df.index[-1].date()),
            key_levels={"resistance": round(float(resistance), 2), "current_close": round(float(last["close"]), 2)},
        )
    return None


def detect_support_bounce(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Price bouncing off key support level."""
    if len(df) < 30:
        return None

    recent = df.tail(30)
    last = df.iloc[-1]
    prev_3 = df.tail(3)

    support = recent["low"].quantile(0.10)
    touched_support = prev_3["low"].min() <= support * 1.01  # within 1%
    bouncing = last["close"] > prev_3["low"].min() * 1.015

    if touched_support and bouncing:
        return PatternSignal(
            name="Support Bounce",
            type="support_resistance",
            direction="bullish",
            confidence=0.65,
            description=f"Price bounced off key support at {support:.2f}. Buyers stepped in near this level.",
            detected_at=str(df.index[-1].date()),
            key_levels={"support": round(float(support), 2), "current_close": round(float(last["close"]), 2)},
        )
    return None


def detect_double_top(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Detect double top reversal pattern."""
    if len(df) < 40:
        return None

    window = df.tail(40)
    highs = window["high"].values

    # Find two local peaks
    peaks = []
    for i in range(2, len(highs) - 2):
        if highs[i] > highs[i-1] and highs[i] > highs[i+1] and highs[i] > highs[i-2] and highs[i] > highs[i+2]:
            peaks.append((i, highs[i]))

    if len(peaks) < 2:
        return None

    p1, p2 = peaks[-2], peaks[-1]
    gap = p2[0] - p1[0]
    price_diff_pct = abs(p2[1] - p1[1]) / p1[1]

    if 5 <= gap <= 25 and price_diff_pct < 0.03:
        neckline = window["low"].iloc[p1[0]:p2[0]].min()
        current_close = float(df.iloc[-1]["close"])
        if current_close < neckline * 1.02:
            return PatternSignal(
                name="Double Top",
                type="reversal",
                direction="bearish",
                confidence=0.70,
                description=f"Two peaks formed near {p1[1]:.2f}. Price has broken below neckline at {neckline:.2f}, signalling a bearish reversal.",
                detected_at=str(df.index[-1].date()),
                key_levels={"peak_1": round(float(p1[1]), 2), "peak_2": round(float(p2[1]), 2), "neckline": round(float(neckline), 2)},
            )
    return None


def detect_double_bottom(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Detect double bottom reversal pattern."""
    if len(df) < 40:
        return None

    window = df.tail(40)
    lows = window["low"].values

    troughs = []
    for i in range(2, len(lows) - 2):
        if lows[i] < lows[i-1] and lows[i] < lows[i+1] and lows[i] < lows[i-2] and lows[i] < lows[i+2]:
            troughs.append((i, lows[i]))

    if len(troughs) < 2:
        return None

    t1, t2 = troughs[-2], troughs[-1]
    gap = t2[0] - t1[0]
    price_diff_pct = abs(t2[1] - t1[1]) / t1[1]

    if 5 <= gap <= 25 and price_diff_pct < 0.03:
        neckline = window["high"].iloc[t1[0]:t2[0]].max()
        current_close = float(df.iloc[-1]["close"])
        if current_close > neckline * 0.98:
            return PatternSignal(
                name="Double Bottom",
                type="reversal",
                direction="bullish",
                confidence=0.72,
                description=f"Two troughs formed near {t1[1]:.2f}. Price has broken above neckline at {neckline:.2f}, signalling a bullish reversal.",
                detected_at=str(df.index[-1].date()),
                key_levels={"trough_1": round(float(t1[1]), 2), "trough_2": round(float(t2[1]), 2), "neckline": round(float(neckline), 2)},
            )
    return None


def detect_rsi_divergence(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Detect RSI divergence (price and RSI moving in opposite directions)."""
    if len(df) < 30:
        return None

    rsi_series = ta.rsi(df["close"], length=14)
    if rsi_series is None or rsi_series.dropna().empty:
        return None

    df2 = df.copy()
    df2["rsi"] = rsi_series
    df2 = df2.dropna(subset=["rsi"]).tail(20)

    if len(df2) < 10:
        return None

    price_trend = df2["close"].iloc[-1] - df2["close"].iloc[0]
    rsi_trend = df2["rsi"].iloc[-1] - df2["rsi"].iloc[0]
    last_rsi = float(df2["rsi"].iloc[-1])

    # Bearish divergence: price up, RSI down
    if price_trend > 0 and rsi_trend < -5 and last_rsi > 60:
        return PatternSignal(
            name="Bearish RSI Divergence",
            type="divergence",
            direction="bearish",
            confidence=0.65,
            description=f"Price is making higher highs, but RSI ({last_rsi:.1f}) is declining — momentum is weakening. This often precedes a pullback.",
            detected_at=str(df.index[-1].date()),
            key_levels={"rsi": round(last_rsi, 1), "current_close": round(float(df["close"].iloc[-1]), 2)},
        )

    # Bullish divergence: price down, RSI up
    if price_trend < 0 and rsi_trend > 5 and last_rsi < 45:
        return PatternSignal(
            name="Bullish RSI Divergence",
            type="divergence",
            direction="bullish",
            confidence=0.65,
            description=f"Price is making lower lows, but RSI ({last_rsi:.1f}) is rising — selling pressure is easing. This often signals a reversal.",
            detected_at=str(df.index[-1].date()),
            key_levels={"rsi": round(last_rsi, 1), "current_close": round(float(df["close"].iloc[-1]), 2)},
        )
    return None


def detect_bull_flag(df: pd.DataFrame) -> Optional[PatternSignal]:
    """Detect bull flag continuation pattern: sharp rally followed by tight consolidation."""
    if len(df) < 25:
        return None

    pole = df.tail(25).head(10)
    flag = df.tail(15)

    pole_gain = (float(pole["close"].iloc[-1]) - float(pole["close"].iloc[0])) / float(pole["close"].iloc[0])
    flag_range = (float(flag["high"].max()) - float(flag["low"].min())) / float(flag["close"].iloc[0])
    flag_drift = (float(flag["close"].iloc[-1]) - float(flag["close"].iloc[0])) / float(flag["close"].iloc[0])

    if pole_gain > 0.06 and flag_range < 0.06 and -0.04 < flag_drift < 0.01:
        breakout_level = float(flag["high"].max())
        return PatternSignal(
            name="Bull Flag",
            type="continuation",
            direction="bullish",
            confidence=0.68,
            description=f"A sharp {pole_gain*100:.1f}% rally (the pole) followed by tight consolidation (the flag). Breakout above {breakout_level:.2f} would confirm continuation.",
            detected_at=str(df.index[-1].date()),
            key_levels={"pole_gain_pct": round(pole_gain * 100, 1), "flag_high": round(breakout_level, 2)},
        )
    return None


def detect_all_patterns(df: pd.DataFrame) -> List[PatternSignal]:
    """Run all detectors and return list of detected signals."""
    detectors = [
        detect_breakout,
        detect_support_bounce,
        detect_double_top,
        detect_double_bottom,
        detect_rsi_divergence,
        detect_bull_flag,
    ]
    signals = []
    for detector in detectors:
        try:
            signal = detector(df)
            if signal:
                signals.append(signal)
        except Exception as e:
            print(f"Detector {detector.__name__} failed: {e}")
    # Sort by confidence descending
    signals.sort(key=lambda x: x.confidence, reverse=True)
    return signals
