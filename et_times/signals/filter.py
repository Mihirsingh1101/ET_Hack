def filter_signals(profile, signals):
    result = []

    for s in signals:

        if profile == "conservative":
            if s["risk_level"] == "high":
                continue
            if s["expected_horizon"] == "short":
                continue

        elif profile == "cautious":
            if s["risk_level"] == "high" and s["confidence"] < 0.75:
                continue

        elif profile == "speculative_trader":
            if s["expected_horizon"] != "short":
                continue

        # aggressive + advanced = mostly open
        result.append(s)

    return result