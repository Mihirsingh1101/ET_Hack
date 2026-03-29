import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CapitalSelection() {
  const [capital, setCapital] = useState(50000);
  const [income, setIncome] = useState(10000);
  const [expenses, setExpenses] = useState(5000);
  const [jobType, setJobType] = useState('salaried');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateTerminal = async () => {
    setLoading(true);
    const profilePayload = {
      goal: localStorage.getItem('user_goal') || 'wealth',
      horizon: localStorage.getItem('user_horizon') || 'medium',
      risk: localStorage.getItem('user_risk') || 'moderate',
      panic_history: parseInt(localStorage.getItem('user_panic')) || 1,
      drawdown_reaction: parseInt(localStorage.getItem('user_drawdown')) || 1,
      income: parseFloat(income),
      expenses: parseFloat(expenses),
      capital: parseFloat(capital),
      job_type: jobType,
      // Add neutral defaults for the rest as requested to keep survey fast
      emi: 0,
      liquidity_buffer: 6,
      max_loss_pct: 15,
      check_frequency: 1,
      holding_period: 2,
      idea_source: 2,
      experience_years: 2,
      literacy_tools: []
    };

    try {
      const res = await fetch('http://localhost:8001/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      });
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Profiling error:", err);
      navigate('/dashboard'); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const displayVal = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-start pt-12 px-4">
       <nav aria-label="Progress" className="w-full max-w-xl mb-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center font-semibold text-blue-600">Goal</div>
          <div className="flex-1 text-center font-semibold text-blue-600">Risk</div>
          <div className="flex-1 text-center font-semibold text-blue-600">Capital</div>
        </div>
        <div className="flex gap-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="flex-1 bg-blue-600"></div>
          <div className="flex-1 bg-blue-600"></div>
          <div className="flex-1 bg-blue-600"></div>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center pb-20">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">
          Finalize your financial profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Capital Slider */}
          <div className="md:col-span-2 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-xl font-bold text-slate-800">Total Investable Capital</h3>
              <span className="text-3xl font-black text-blue-600">{displayVal(capital)}</span>
            </div>
            <input 
              type="range" min="1000" max="500000" step="5000" 
              value={capital} onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>$1,000</span>
              <span>$500,000+</span>
            </div>
          </div>

          {/* Monthly Income */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Income</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" value={income} onChange={(e) => setIncome(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-10 pr-4 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Expenses</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-10 pr-4 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="md:col-span-2 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Primary Employment</h3>
            <div className="flex flex-wrap gap-3">
              {['salaried', 'business', 'freelance', 'govt', 'retired'].map(type => (
                <button
                  key={type}
                  onClick={() => setJobType(type)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm capitalize transition-all ${
                    jobType === type ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={generateTerminal}
          disabled={loading}
          className="mt-16 flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white font-bold py-5 px-16 rounded-[2rem] shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
          )}
          <span className="text-xl">Generate My Terminal</span>
        </button>
      </main>
    </div>
  );
}
