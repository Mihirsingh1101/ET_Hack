import json
import requests
from chart_intelligence.pattern_detector import PatternSignal
from chart_intelligence.backtester import BacktestResult
from typing import Optional

# Ollama runs locally — no API key needed.
# Install: https://ollama.com  then run: ollama pull llama3.1
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.1"   # swap to "mistral" or "gemma2" if preferred


def generate_explanation(
    symbol: str,
    stock_name: str,
    signal: PatternSignal,
    backtest: Optional[BacktestResult],
    current_price: float,
) -> str:
    """
    Use a local Ollama model (llama3.1 / mistral / gemma2) to generate
    a plain-English explanation of the detected pattern.
    Completely free, runs offline, no API key required.
    """

    backtest_info = ""
    if backtest and backtest.total_occurrences >= 5:
        backtest_info = f"""
Historical backtest on {symbol} (5 years):
- Pattern appeared {backtest.total_occurrences} times
- Win rate: {backtest.win_rate}%
- Average gain on wins: +{backtest.avg_gain_pct}%
- Average loss on losses: -{backtest.avg_loss_pct}%
- Hold period: ~{backtest.avg_hold_days} trading days
- Best case: +{backtest.best_gain_pct}%
- Worst case: {backtest.worst_loss_pct}%
- Expectancy: {backtest.expectancy}% per trade
"""
    else:
        backtest_info = "Insufficient historical data for backtest on this stock."

    prompt = f"""You are a senior technical analyst for Indian equity markets.
Explain this chart pattern detection to a retail investor in clear, simple language.

Stock: {stock_name} ({symbol})
Current price: Rs.{current_price:.2f}
Pattern detected: {signal.name}
Type: {signal.type}
Direction: {signal.direction}
Confidence: {signal.confidence * 100:.0f}%
Key levels: {json.dumps(signal.key_levels)}
Technical description: {signal.description}

{backtest_info}

Write a 3-paragraph response:
1. What this pattern means in simple terms (no jargon)
2. What the historical data says about this pattern on THIS specific stock
3. What the investor should watch for next — specific price levels, volume, or conditions to confirm or invalidate

Keep it concise, factual, and actionable. Use Rs. for prices. Do NOT give direct buy/sell advice.
Mention the win rate and expected gain/loss naturally in your explanation.
Respond with plain text only, no markdown formatting."""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 500,
                },
            },
            timeout=120,
        )
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except requests.exceptions.ConnectionError:
        return (
            "Ollama is not running. Start it with: ollama serve\n"
            "Then pull a model: ollama pull llama3.1"
        )
    except requests.exceptions.Timeout:
        return "AI explanation timed out. The model may still be loading — try again in a moment."
    except Exception as e:
        return f"AI explanation unavailable: {str(e)}"
