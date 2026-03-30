from datetime import datetime

from .filter import filter_signals
from .scorer import score_signal
from .explainer import explain_signal
from .position import position_size
from .guards import portfolio_guard
from .utils import apply_time_decay, throttle
from .risk import compute_portfolio_risk, risk_budget_check

from behavior.preferences import preference_filter


def personalize_signals(
    profile,
    signals,
    portfolio=None,
    ignored_map=None,
    performance_stats=None
):

    if portfolio is None:
        portfolio = []

    if ignored_map is None:
        ignored_map = {}

    current_time = datetime.utcnow()

    current_risk = compute_portfolio_risk(portfolio)

    filtered = filter_signals(profile, signals)

    enriched = []

    for s in filtered:
        if "timestamp" in s and isinstance(s["timestamp"], str):
            try:
                s["timestamp"] = datetime.fromisoformat(s["timestamp"])
            except Exception:
            # fallback if format is weird
                s["timestamp"] = datetime.utcnow()
        if not preference_filter(s, ignored_map):
            continue

        if not portfolio_guard(s, portfolio):
            continue

        if not risk_budget_check(profile, current_risk):
            continue

        s = apply_time_decay(s, current_time)

        score = score_signal(profile, s, performance_stats)

        enriched.append({
            "stock": s["stock"],
            "signal_type": s["type"],
            "priority_score": round(score, 3),
            "action": "BUY" if score > 0.6 else "WATCH",
            "explanation": explain_signal(profile, s),
            "position_size": position_size(profile)
        })

    enriched.sort(key=lambda x: x["priority_score"], reverse=True)

    return throttle(enriched, max_signals=5)