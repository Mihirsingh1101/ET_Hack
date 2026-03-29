import React, { useState, useEffect } from 'react';
import { ChatService } from '../services/ChatService';

export default function MarketSentiment({ companyName = "Reliance" }) {
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentiment();
  }, [companyName]);

  const fetchSentiment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ChatService.analyzeSentiment(companyName);
      setSentimentData(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch sentiment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
        <div className="text-center text-slate-400">
          <span className="inline-block animate-spin">⏳</span> Analyzing market sentiment...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-red-700/30">
        <p className="text-red-400 text-sm">⚠️ {error}</p>
        <button
          onClick={fetchSentiment}
          className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!sentimentData) {
    return null;
  }

  // Normalize sentiment deltas to 0-1 scale for visualization
  const normalizeScore = (delta) => {
    return Math.max(0, Math.min(1, (delta + 1) / 2));
  };

  const stockScore = normalizeScore(sentimentData.stock_delta);
  const sectorScore = normalizeScore(sentimentData.sector_delta);
  const marketScore = normalizeScore(sentimentData.market_delta);

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score > 0.6) return 'from-green-500 to-emerald-400';
    if (score > 0.4) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-rose-400';
  };

  const getScoreLabel = (score) => {
    if (score > 0.6) return '🟢 Bullish';
    if (score > 0.4) return '🟡 Neutral';
    return '🔴 Bearish';
  };

  return (
    <div className="space-y-4">
      {/* Main Sentiment Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ⚡ MARKET SENTIMENT
          </h3>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">LIVE</span>
        </div>

        {/* Stock Score */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              {(stockScore * 100).toFixed(0)}
            </span>
            <span className="text-slate-400 text-sm">FinBERT Score</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getScoreColor(stockScore)} transition-all duration-500`}
              style={{ width: `${stockScore * 100}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Stock Delta</p>
            <p className={`text-lg font-bold ${sentimentData.stock_delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {sentimentData.stock_delta > 0 ? '+' : ''}{sentimentData.stock_delta.toFixed(4)}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Momentum Shift (48h)</p>
            <p className={`text-lg font-bold ${sentimentData.stock_shift > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {sentimentData.stock_shift > 0 ? '+' : ''}{sentimentData.stock_shift.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Signal Interpretation */}
        <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-white mb-2">{sentimentData.signal}</p>
        </div>
      </div>

      {/* Highlights Card - Sector & Market Analysis */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          📊 MARKET SENTIMENT FLAGS
        </h3>

        <div className="space-y-3">
          {/* Sector */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Sector Sentiment</p>
              <p className="text-xs text-slate-400">{sentimentData.sector || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {(sectorScore * 100).toFixed(0)}
              </p>
              <p className="text-xs text-slate-400">{getScoreLabel(sectorScore)}</p>
            </div>
          </div>

          {/* Market */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div>
              <p className="text-sm font-semibold text-white">Broad Market</p>
              <p className="text-xs text-slate-400">Overall Market Sentiment</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {(marketScore * 100).toFixed(0)}
              </p>
              <p className="text-xs text-slate-400">{getScoreLabel(marketScore)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchSentiment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Analyzing...' : '🔄 Refresh Analysis'}
      </button>
    </div>
  );
}
