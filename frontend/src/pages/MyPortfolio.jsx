import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/portfolio');
      const data = await res.json();
      setPortfolio(data.portfolio || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setLoading(false);
    }
  };

  const deleteAsset = async (symbol) => {
    if (!window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) return;
    try {
      const res = await fetch(`http://localhost:8001/api/portfolio/${symbol}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log("Delete response:", data);
      if (res.ok) {
        fetchPortfolio();
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const totalInvested = portfolio.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div onClick={() => navigate('/dashboard')} className="flex items-center text-[#1e40af] font-bold text-2xl tracking-tight cursor-pointer">
          <svg className="w-10 h-10 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          SENTINEL <span className="text-slate-400 font-medium ml-2 border-l border-slate-200 pl-4">Portfolio</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0f172a] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Invested Capital</p>
            <h2 className="text-4xl font-black">₹{totalInvested.toLocaleString()}</h2>
            <div className="mt-6 flex items-center gap-2">
               <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">Active Portfolio</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Holdings</p>
            <h2 className="text-4xl font-black text-slate-800">{portfolio.length}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase mt-6 tracking-widest">Active Tickers</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center border-dashed border-slate-200">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl shadow-blue-600/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-800">Add New Asset</span>
            </button>
          </div>
        </section>

        {/* Asset List Section */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-slate-800">Your Current Assets</h3>
            <span className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-slate-500">Live Streaming</span>
          </div>

          <div className="p-4 sm:p-8">
            {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 animate-pulse">Synchronizing Terminal...</p>
              </div>
            ) : portfolio.length === 0 ? (
              <div className="flex flex-col items-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 mx-4">
                <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <p className="text-slate-500 font-bold text-lg mb-2 tracking-tight line-height-none">Your portfolio is empty</p>
                <p className="text-sm text-slate-400 font-medium mb-6">Start building your wealth by tracking stocks</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Go to Market Dashboard
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {portfolio.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-100 rounded-flex-2xl hover:bg-slate-50/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                      <div onClick={() => navigate(`/analysis?symbol=${item.symbol}`)} className="cursor-pointer">
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-black text-sm shadow-lg shadow-slate-900/10 mb-1 group-hover:bg-blue-600 transition-colors">
                          {item.symbol}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Added {new Date(item.added_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between sm:justify-end gap-12 flex-grow sm:flex-grow-0">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Invested Amount</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">₹{item.amount?.toLocaleString()}</p>
                      </div>
                      
                      <button 
                        onClick={() => deleteAsset(item.symbol)}
                        className="p-4 bg-rose-50 text-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white hover:shadow-xl shadow-rose-500/30 active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
