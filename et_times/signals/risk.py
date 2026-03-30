def risk_budget_check(profile, current_risk):

    limits = {
        "conservative": 0.3,
        "cautious": 0.5,
        "aggressive": 0.7,
        "speculative_trader": 0.9,
        "advanced_investor": 0.8
    }

    return current_risk < limits.get(profile, 0.5)

def compute_portfolio_risk(portfolio):
    """
    Assume each holding has:
    {
        "weight": 0.2,
        "risk": "low"/"medium"/"high"
    }
    """

    risk_map = {
        "low": 0.2,
        "medium": 0.5,
        "high": 1.0
    }

    total = 0

    for p in portfolio:
        total += p["weight"] * risk_map.get(p.get("risk", "medium"), 0.5)

    return total