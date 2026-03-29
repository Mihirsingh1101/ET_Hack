from datetime import datetime


def apply_time_decay(signal: dict, current_time: datetime):

    if "timestamp" not in signal:
        return signal

    age_hours = (current_time - signal["timestamp"]).total_seconds() / 3600

    if age_hours > 24:
        signal["confidence"] *= 0.7
    elif age_hours > 12:
        signal["confidence"] *= 0.85

    return signal


def throttle(signals, max_signals=5):
    return signals[:max_signals]