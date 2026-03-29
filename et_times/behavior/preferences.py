def update_user_preferences(history):
    """
    history: list of user actions
    each action should include:
    {
        "signal_type": "...",
        "action": "BUY" | "IGNORE"
    }
    """

    ignored = {}

    for h in history:
        if h["action"] == "IGNORE":
            t = h["signal_type"]
            ignored[t] = ignored.get(t, 0) + 1

    return ignored


def preference_filter(signal, ignored_map, threshold=5):
    """
    If user has ignored a signal type too many times, suppress it
    """

    if ignored_map.get(signal["type"], 0) >= threshold:
        return False

    return True