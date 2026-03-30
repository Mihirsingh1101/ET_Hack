RISK_MAP = {
    "low": 0.2,
    "medium": 0.5,
    "high": 1.0
}


def performance_boost(signal, performance_stats):

    t = signal["type"]

    if t not in performance_stats:
        return 0

    stats = performance_stats[t]

    # ignore low sample size
    if stats["count"] < 5:
        return 0

    boost = 0

    # reward good signals
    if stats["avg_return"] > 2:
        boost += 0.1

    if stats["win_rate"] > 0.6:
        boost += 0.1

    # penalize bad ones
    if stats["avg_return"] < -2:
        boost -= 0.15

    if stats["win_rate"] < 0.4:
        boost -= 0.1

    return boost


def score_signal(profile, s, performance_stats=None):
    risk = RISK_MAP.get(s["risk_level"], 0.5)
    confidence = s["confidence"]
    upside = s.get("expected_return", 0)

    base = 0

    if profile == "conservative":
        base = (confidence * 0.6) + ((1 - risk) * 0.4)

    elif profile == "cautious":
        base = (confidence * 0.5) + ((1 - risk) * 0.3) + (upside * 0.2)

    elif profile == "aggressive":
        base = (confidence * 0.4) + (upside * 0.4) + ((1 - risk) * 0.2)

    elif profile == "speculative_trader":
        base = (upside * 0.6) + (confidence * 0.3) - (risk * 0.1)

    elif profile == "advanced_investor":
        base = (confidence * 0.4) + (upside * 0.3) + ((1 - risk) * 0.3)

    else:
        base = confidence

    # Apply performance feedback
    if performance_stats:
        base += performance_boost(s, performance_stats)

    return max(0, min(1, base))