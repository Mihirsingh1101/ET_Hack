def explain_signal(profile, s):
    base = s["explanation_raw"]

    if profile == "conservative":
        return f"{base}. This appears relatively stable with controlled downside risk."

    elif profile == "cautious":
        return f"{base}. Fits a balanced growth strategy with moderate risk."

    elif profile == "aggressive":
        return f"{base}. Momentum suggests potential upside — opportunity window active."

    elif profile == "speculative_trader":
        return f"{base}. Short-term move possible — use strict stop-loss."

    elif profile == "advanced_investor":
        return f"{base}. Aligns with broader structural or valuation-based opportunity."

    return base