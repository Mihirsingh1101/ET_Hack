def position_size(profile):
    mapping = {
        "conservative": "2-5%",
        "cautious": "5-10%",
        "aggressive": "10-20%",
        "speculative_trader": "max 5%",
        "advanced_investor": "variable (conviction-based)"
    }

    return mapping.get(profile, "5%")