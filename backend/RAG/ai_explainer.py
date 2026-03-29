import json
import os
import sys
from datetime import datetime, timezone
from typing import Optional

# ─────────────────────────────────────────────────────────────────────────────
# Route imports to the RAG pipeline modules
# ─────────────────────────────────────────────────────────────────────────────
_RAG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag")
if _RAG_DIR not in sys.path:
    sys.path.insert(0, _RAG_DIR)

import retrieve  # rag/retrieve.py  – ChromaDB vector search
import generate  # rag/generate.py  – OpenRouter LLM

# Local imports (kept here so callers don't need to re-import them)
from pattern_detector import PatternSignal
from backtester import BacktestResult


def generate_explanation(
    symbol: str,
    stock_name: str,
    signal: PatternSignal,
    backtest: Optional[BacktestResult],
    current_price: float,
) -> str:
    """
    Drive the full RAG pipeline to generate a plain-English explanation of the
    detected chart pattern, enriched with verified news context.

    Flow:
      1. Convert PatternSignal + BacktestResult into the `insight_data` dict
         that the RAG pipeline understands.
      2. Retrieve relevant ChromaDB snippets via `retrieve.search_insight`.
      3. Generate the final explanation via `generate.chat_about_insight`.
    """

    # ── Step 1 – Build backtest summary text ─────────────────────────────────
    if backtest and backtest.total_occurrences >= 5:
        backtest_summary = (
            f"Historical backtest on {symbol} (5 years):\n"
            f"  • Pattern appeared {backtest.total_occurrences} times\n"
            f"  • Win rate: {backtest.win_rate}%\n"
            f"  • Avg gain on wins: +{backtest.avg_gain_pct}%\n"
            f"  • Avg loss on losses: -{backtest.avg_loss_pct}%\n"
            f"  • Hold period: ~{backtest.avg_hold_days} trading days\n"
            f"  • Best case: +{backtest.best_gain_pct}%  |  "
            f"Worst case: {backtest.worst_loss_pct}%\n"
            f"  • Expectancy: {backtest.expectancy}% per trade"
        )
    else:
        backtest_summary = "Insufficient historical data for backtest on this stock."

    # ── Step 2 – Compose the insight_text payload ─────────────────────────────
    insight_text = (
        f"Current price: Rs.{current_price:.2f}\n"
        f"Pattern detected: {signal.name}\n"
        f"Type: {signal.type}\n"
        f"Direction: {signal.direction}\n"
        f"Confidence: {signal.confidence * 100:.0f}%\n"
        f"Key levels: {json.dumps(signal.key_levels)}\n"
        f"Technical description: {signal.description}\n\n"
        f"{backtest_summary}"
    )

    insight_data = {
        "ticker": symbol,
        "sector": "Indian Equity",
        "insight_text": insight_text.strip(),
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
    }

    # ── Step 3a – Retrieve ticker-specific news from ChromaDB ─────────────────
    news_query = f"@{symbol} {signal.name} {signal.direction} trend"
    news_snippets = retrieve.search_insight(news_query, top_k=3, max_distance=1.3)

    # ── Step 3b – Retrieve technical knowledge docs (pattern + indicator) ─────
    # Use a general query (no @ticker) so the retriever scans the full knowledge base
    knowledge_query = f"{signal.name} {signal.type} {signal.direction} technical analysis chart pattern indicator"
    knowledge_snippets = retrieve.search_insight(knowledge_query, top_k=5, max_distance=1.5)

    # Merge: knowledge first (authoritative), then live news
    snippets = knowledge_snippets + news_snippets

    # ── Step 4 – Generate explanation via OpenRouter (through RAG pipeline) ───
    prompt = (
        f"The quantitative engine has detected a '{signal.name}' pattern on {symbol} "
        f"({stock_name}). This is a {signal.direction} {signal.type} signal with "
        f"{signal.confidence * 100:.0f}% confidence at a current price of ₹{current_price:.2f}. "
        f"Using the retrieved technical knowledge and any news context, give a complete, "
        f"clear explanation of: (1) what the {signal.name} pattern means, "
        f"(2) what the key price levels imply for traders, "
        f"(3) whether the backtest data supports acting on this signal, and "
        f"(4) any fundamental news catalyst if found."
    )

    try:
        response = generate.chat_about_insight(
            user_message=prompt,
            insight_data=insight_data,
            news_snippets=snippets,
            chat_history=[],
        )
        return response.strip()

    except Exception as exc:
        return f"RAG explanation unavailable: {exc}"
