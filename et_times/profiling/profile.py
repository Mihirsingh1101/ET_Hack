def normalize(value, min_val, max_val):
    if max_val == min_val:
        return 0
    return max(0, min(100, ((value - min_val) / (max_val - min_val)) * 100))


def compute_profile(user):
    income = user["income"]
    expenses = user["expenses"]
    emi = user.get("emi", 0)
    buffer = user.get("liquidity_buffer", 0)

    job = user.get("job_type", "salaried")

    drawdown = user.get("drawdown_reaction", 1)
    panic = user.get("panic_history", 1)
    max_loss = user.get("max_loss_pct", 15)

    check_freq = user.get("check_frequency", 1)
    hold_period = user.get("holding_period", 1)
    idea_source = user.get("idea_source", 1)

    exp_years = user.get("experience_years", 0)
    literacy_tools = len(user.get("literacy_tools", []))

    horizon = user.get("horizon", "medium")
    goal = user.get("goal", "wealth")

    # ---------- Derived ----------
    savings_rate = max(0, (income - expenses - emi) / income)
    debt_ratio = emi / income if income else 0

    # ---------- Capacity ----------
    job_score_map = {
        "govt": 100,
        "salaried": 75,
        "business": 50,
        "freelance": 35,
        "retired": 60
    }

    capacity = (
        normalize(savings_rate, 0, 0.6) * 0.4 +
        normalize(buffer, 0, 12) * 0.3 +
        job_score_map.get(job, 50) * 0.2 +
        normalize(1 - debt_ratio, 0, 1) * 0.1
    )

    # ---------- Tolerance ----------
    tolerance = (
        normalize(drawdown, 0, 4) * 0.4 +
        normalize(max_loss, 0, 60) * 0.35 +
        normalize(panic, 0, 3) * 0.25
    )

    # ---------- Behavior ----------
    behavior = (
        normalize(3 - check_freq, 0, 3) * 0.3 +
        normalize(hold_period, 0, 3) * 0.35 +
        normalize(idea_source, 0, 3) * 0.35
    )

    # ---------- Literacy ----------
    literacy = (
        normalize(exp_years, 0, 4) * 0.4 +
        normalize(literacy_tools, 0, 6) * 0.6
    )

    # ---------- Composite ----------
    composite = (
        capacity * 0.4 +
        tolerance * 0.3 +
        behavior * 0.3
    )

    # ---------- Profile Logic ----------
    is_speculative = check_freq <= 1 and hold_period <= 1 and idea_source <= 1
    is_advanced = literacy >= 65 and behavior >= 65 and horizon == "long" and composite >= 65

    if is_speculative and not is_advanced:
        profile = "speculative_trader"
    elif is_advanced:
        profile = "advanced_investor"
    elif composite < 30:
        profile = "conservative"
    elif composite < 52:
        profile = "cautious"
    elif composite < 72:
        profile = "aggressive"
    else:
        profile = "aggressive"

    # ---------- Flags ----------
    flags = []

    if savings_rate < 0.1:
        flags.append("low_savings_rate")

    if buffer < 2:
        flags.append("low_liquidity")

    if debt_ratio > 0.4:
        flags.append("high_debt")

    if panic <= 1 and tolerance > 50:
        flags.append("risk_misalignment")

    # ---------- Output ----------
    return {
        "profile": profile,
        "scores": {
            "capacity": round(capacity, 2),
            "tolerance": round(tolerance, 2),
            "behavior": round(behavior, 2),
            "literacy": round(literacy, 2),
            "composite": round(composite, 2)
        },
        "derived": {
            "savings_rate": round(savings_rate, 3),
            "debt_ratio": round(debt_ratio, 3)
        },
        "meta": {
            "goal": goal,
            "horizon": horizon
        },
        "flags": flags
    }