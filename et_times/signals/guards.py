from typing import List, Dict


def portfolio_guard(signal: Dict, portfolio: List[Dict]):
    """
    Prevent duplicate exposure to same stock
    """

    for holding in portfolio:
        if holding["stock"] == signal["stock"]:
            return False  # reject

    return True