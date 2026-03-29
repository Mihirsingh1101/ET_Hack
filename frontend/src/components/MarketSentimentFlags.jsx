import React, { useState, useEffect } from 'react';
import { ChatService } from '../services/ChatService';

export default function MarketSentimentFlags({ companyName = "Reliance" }) {
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
          <span className="inline-block animate-spin">⏳</span> Loading flags...
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

  const normalizeScore = (delta) => {
    return Math.max(0, Math.min(1, (delta + 1) / 2));
  };

  const sectorScore = normalizeScore(sentimentData.sector_delta);
  const marketScore = normalizeScore(sentimentData.market_delta);

  const getScoreLabel = (score) => {
    if (score > 0.6) return '🟢 Bullish';
    if (score > 0.4) return '🟡 Neutral';
    return '🔴 Bearish';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        📊 MARKET SENTIMENT FLAGS
      </h3>

      <div className="space-y-4">
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
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
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

      {/* Refresh Button */}
      <button
        onClick={fetchSentiment}
        disabled={loading}
        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? 'Analyzing...' : '🔄 Refresh Analysis'}
      </button>
    </div>
  );
}
