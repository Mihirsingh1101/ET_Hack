import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CandleChart from '../components/CandleChart';
import PortfolioModal from '../components/PortfolioModal';

export default function StockAnalysis() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSymbol = queryParams.get('symbol') || "RELIANCE";

  const [symbol, setSymbol] = useState(initialSymbol);
  const [inputVal, setInputVal] = useState(initialSymbol);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("6mo");
const [addedMsg, setAddedMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  // Portfolio Optimizer States
  const [maxInvestment, setMaxInvestment] = useState(100000);
  const [optResult, setOptResult] = useState(null);
  const [optLoading, setOptLoading] = useState(false);
  const [optError, setOptError] = useState(null);

  const navigate = useNavigate();
  
  const API = "http://localhost:8001";

  const runOptimization = async () => {
    if (!symbol) return;
    setOptLoading(true);
    setOptError(null);
    try {
      const res = await fetch(`${API}/api/optimize-addition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, max_investment: maxInvestment })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Optimization failed.");
      setOptResult(json);
    } catch (e) {
      setOptError(e.message);
      console.error(e);
    } finally {
      setOptLoading(false);
    }
  };

  const analyze = async (sym) => {
    if (!sym) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API}/api/analyze/${sym}?period=${period}&explain=true`);
      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      setData(json);
      setSymbol(sym);
      setOptResult(null);
    } catch (e) {
      setError(e.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyze(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) analyze(inputVal.trim().toUpperCase());
  };

  const handleConfirmAdd = async (amount) => {
    if (!symbol) return;
    try {
      const res = await fetch(`${API}/api/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, amount })
      });
      if (res.ok) {
        setModalOpen(false);
        setAddedMsg("Added to Portfolio!");
        setTimeout(() => setAddedMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans antialiased text-gray-900">
      <PortfolioModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        symbol={symbol} 
        onConfirm={handleConfirmAdd} 
      />
      <div className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* Header Section */}
        <header className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col md:flex-row items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                className="bg-transparent border-none outline-none w-full text-sm font-medium focus:ring-0" 
                placeholder="Enter symbol (e.g. RELIANCE)" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              />
            </form>
            
            {loading && <span className="text-sm text-blue-600 font-medium animate-pulse ml-4 whitespace-nowrap">Analyzing...</span>}
            {error && <span className="text-sm text-rose-600 font-medium ml-4 whitespace-nowrap">{error}</span>}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-gray-100 rounded-lg p-1 mr-2 shrink-0">
               {["3mo", "6mo", "1y", "2y"].map(p => (
                 <button 
                  key={p} 
                  onClick={() => {setPeriod(p); analyze(symbol);}}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   {p.toUpperCase()}
                 </button>
               ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-amber-200 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm shrink-0">
              <svg className="h-4 w-4 fill-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Watchlist
            </button>
          </div>
        </header>

        {/* Dynamic Header Data */}
        {data && data.stock && (
        <div className="mb-6 flex justify-between items-center px-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">{data.stock.symbol}</h1>
                <span className="bg-gray-100/80 border border-gray-200 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{data.stock.name}</span>
                {data.stock.sector && <span className="bg-blue-50 border border-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{data.stock.sector}</span>}
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xl font-bold text-gray-900">₹{parseFloat(data.stock.current_price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            
             <div className="flex flex-col items-end gap-2">
               <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle className="text-emerald-100" cx="16" cy="16" fill="transparent" r="14" stroke="currentColor" strokeWidth="3"></circle>
                        <circle className="text-emerald-500" cx="16" cy="16" fill="transparent" r="14" stroke="currentColor" strokeDasharray="88" strokeDashoffset="10" strokeWidth="3"></circle>
                      </svg>
                      <span className="absolute text-[10px] font-bold text-emerald-700">{data.patterns?.length || 0}</span>
                    </div>
                    <span className="text-emerald-700 text-xs font-bold whitespace-nowrap">Detected Patterns</span>
               </div>
               <button 
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm cursor-pointer border border-[#047857] active:scale-95"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  {addedMsg || "Add to Portfolio"}
               </button>
             </div>
        </div>
        )}

        {/* Dashboard Layout Grid */}
        <div className="grid grid-cols-12 gap-6 pb-12">
          {/* Left Sidebar - Technical Toolbox */}
          <aside className="col-span-12 lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 h-full border border-gray-100 shadow-sm min-h-[600px]">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Toolbox</h2>
              <nav className="space-y-2.5">
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-md flex items-center justify-between transition-all">
                  <span>Candlesticks</span>
                  <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                  RSI (14)
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                  MACD (12,26,9)
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                  Bollinger Bands
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                  Volume Profile
                </button>
              </nav>
            </div>
          </aside>

          {/* Central Content */}
          <main className="col-span-12 lg:col-span-7">
            <div className="bg-white rounded-xl p-6 h-full border border-gray-100 shadow-sm flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Price Chart</h2>
                <div className="flex items-center gap-4 text-xs font-semibold">
                   <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Bullish Signal</span>
                   <span className="flex items-center gap-1.5 text-rose-600"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Bearish Signal</span>
                </div>
              </div>
              
              <div className="flex-grow rounded-xl border border-gray-100 bg-white flex items-center justify-center relative overflow-hidden shadow-inner">
                {!data && loading && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-blue-600 border-r-blue-600 animate-spin"></div>
                    <span className="text-gray-400 font-medium text-sm">Fetching detailed OHLCV data...</span>
                  </div>
                )}
                {!data && !loading && !error && (
                  <span className="text-gray-400 font-medium text-sm">Enter a stock ticker to begin anlysis.</span>
                )}
                {data && (
                  <div className="w-full h-full p-2">
                    <CandleChart ohlcv={data.ohlcv} patterns={data.patterns} />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <section className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
               {/* decorative background element */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-2xl"></div>
              <div className="flex items-center gap-2 mb-6">
                 <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest z-10 relative">Allocation Optimizer</h2>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Max Investment (₹)</label>
                  <input 
                    type="number" 
                    value={maxInvestment}
                    onChange={(e) => setMaxInvestment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button 
                  onClick={runOptimization}
                  disabled={optLoading || !symbol}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {optLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Analyze Portfolio Impact"}
                </button>

                {optError && <p className="text-[10px] text-rose-400 font-bold">{optError}</p>}

                {optResult && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Before Vol</span>
                        <p className="text-sm font-black text-slate-300">{optResult.before.vol}%</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-emerald-500 font-bold uppercase">After Vol</span>
                        <p className="text-sm font-black text-emerald-400">{optResult.after.vol}%</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <span className="text-[9px] text-blue-400 font-bold uppercase block mb-1">Recommendation</span>
                      <p className="text-xs font-bold text-white mb-2">{optResult.recommendation}</p>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-slate-400 font-medium">Optimal Buy:</span>
                        <span className="text-sm font-black text-yellow-400">₹{optResult.optimal_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {Object.entries(optResult.condition_results).map(([lbl, match]) => (
                        <div key={lbl} className={`flex-1 text-[8px] font-black py-1 px-1.5 rounded text-center border ${match === "MATCH" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-600"}`}>
                          {lbl}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col h-[calc(100%-400px)] min-h-[350px]">
              <div className="flex items-center gap-2 mb-6 shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Technical Flags</h2>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-1">
                {!data ? (
                  loading ? <p className="text-sm text-gray-400">Loading flags...</p> : <p className="text-sm text-gray-400">Awaiting analysis...</p>
                ) : data.patterns?.map((p, i) => (
                  <div key={i} className={`flex flex-col gap-3 p-4 rounded-xl border transition-colors hover:shadow-sm ${p.direction === 'bullish' ? 'bg-emerald-50/50 border-emerald-100' : p.direction === 'bearish' ? 'bg-rose-50/50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5 w-full pr-2">
                        <div className="flex items-center flex-wrap gap-2">
                           <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm bg-white border ${p.direction === 'bullish' ? 'text-emerald-600 border-emerald-100' : p.direction === 'bearish' ? 'text-rose-600 border-rose-100' : 'text-gray-600 border-gray-200'}`}>
                             {p.name}
                           </span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.confidence >= 0.7 ? 'bg-blue-100/70 text-blue-700' : 'bg-gray-200/70 text-gray-700'}`}>
                             {Math.round(p.confidence * 100)}% CONFIDENCE
                           </span>
                        </div>
                        <span className="text-[11px] text-gray-600 font-medium leading-relaxed">{p.description}</span>
                      </div>
                      {p.direction === "bullish" ? (
                        <svg className="h-6 w-6 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-9.293a1 1 0 011.414-1.414L9 9.414l1.293-1.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-4-4z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>
                    
                    {/* AI Explanation Integrated Box */}
                    {p.ai_explanation && (
                      <div className="mt-1 p-3 bg-white/60 rounded-lg border border-white/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                        <div className="pl-2">
                          <span className="text-[10px] font-bold text-blue-600 block mb-1 uppercase tracking-wider">AI INSIGHT</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {p.ai_explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}