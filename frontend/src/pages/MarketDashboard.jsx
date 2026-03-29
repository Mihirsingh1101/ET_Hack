import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioModal from '../components/PortfolioModal';

const addToPortfolioApi = async (symbol, amount) => {
  if (!symbol) return;
  try {
    const res = await fetch(`http://localhost:8001/api/portfolio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, amount })
    });
    return res.ok;
  } catch (e) {
    console.error("Portfolio error:", e);
    return false;
  }
};

const TopProfileMatches = ({ onAdd }) => {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Top Profile Matches</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-[#e0e7ff] text-[#4338ca] rounded-full">Aggressive Strategy</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {/* Card 1 */}
        <div className="min-w-[280px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md group">
          <div onClick={() => navigate('/analysis?symbol=RELIANCE')} className="cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">RELIANCE</h3>
                <p className="text-gray-500 text-sm">₹2984.50</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#dcfce7] flex items-center justify-center">
                <span className="text-[#059669] text-xs font-bold">92%</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#ecfdf5] text-[#059669] text-xs font-semibold rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Strong Confluence
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd("RELIANCE"); }}
            className="absolute top-2 right-2 p-1.5 bg-slate-100 text-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white"
            title="Add to Portfolio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
        </div>
        
        {/* Card 2 */}
        <div className="min-w-[280px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md group relative">
          <div onClick={() => navigate('/analysis?symbol=TCS')} className="cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">TCS</h3>
                <p className="text-gray-500 text-sm">₹4120.15</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#dcfce7] flex items-center justify-center">
                <span className="text-[#059669] text-xs font-bold">88%</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#ecfdf5] text-[#059669] text-xs font-semibold rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Strong Confluence
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd("TCS"); }}
            className="absolute top-2 right-2 p-1.5 bg-slate-100 text-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white"
            title="Add to Portfolio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
        </div>
        
        {/* Card 3 */}
        <div className="min-w-[280px] bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md group relative">
          <div onClick={() => navigate('/analysis?symbol=HDFCBANK')} className="cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">HDFCBANK</h3>
                <p className="text-gray-500 text-sm">₹1450.00</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">--</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#ecfdf5] text-[#059669] text-xs font-semibold rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Strong Confluence
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd("HDFCBANK"); }}
            className="absolute top-2 right-2 p-1.5 bg-slate-100 text-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white"
            title="Add to Portfolio"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const TrackedSentiment = ({ onAdd }) => {
  const navigate = useNavigate();
  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-bold">My Tracked Sentiment</h2>
        <button className="flex items-center gap-1 px-4 py-2 bg-[#f1f5f9] text-[#2563eb] font-semibold text-sm rounded-xl hover:bg-[#e2e8f0] transition-colors">
          Expand All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        </button>
      </div>
      
      <div className="relative mb-10">
        <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] tracking-widest text-gray-400 font-bold uppercase">Sector Averages</div>
        <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sector Cards */}
          <div className="bg-[#059669] text-white p-5 rounded-2xl flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">Energy</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">1 Assets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] opacity-80 uppercase font-bold">Score</span>
              <span className="text-2xl font-bold">+0.85</span>
            </div>
          </div>
          <div className="bg-[#10b981] text-white p-5 rounded-2xl flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">Consumer</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">1 Assets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] opacity-80 uppercase font-bold">Score</span>
              <span className="text-2xl font-bold">+0.70</span>
            </div>
          </div>
          <div className="bg-[#6ee7b7] text-[#064e3b] p-5 rounded-2xl flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform cursor-default">
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">Technology</span>
              <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded">2 Assets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] opacity-70 uppercase font-bold">Score</span>
              <span className="text-2xl font-bold">+0.33</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] tracking-widest text-gray-400 font-bold uppercase">Individual Stocks</div>
        <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-3">
          <div className="group relative">
            <button onClick={() => navigate('/analysis?symbol=RELIANCE')} className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-bold transition-colors shadow-sm">RELIANCE &nbsp;&bull;&nbsp; +0.85</button>
            <button onClick={() => onAdd("RELIANCE")} className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white shadow-sm">+</button>
          </div>
          <div className="group relative">
            <button onClick={() => navigate('/analysis?symbol=ITC')} className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg text-sm font-bold transition-colors shadow-sm">ITC &nbsp;&bull;&nbsp; +0.70</button>
            <button onClick={() => onAdd("ITC")} className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white shadow-sm">+</button>
          </div>
          <div className="group relative">
            <button onClick={() => navigate('/analysis?symbol=TCS')} className="px-4 py-2 bg-[#6ee7b7] hover:bg-[#34d399] text-[#064e3b] rounded-lg text-sm font-bold transition-colors shadow-sm">TCS &nbsp;&bull;&nbsp; +0.45</button>
            <button onClick={() => onAdd("TCS")} className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white shadow-sm">+</button>
          </div>
          <div className="group relative">
            <button onClick={() => navigate('/analysis?symbol=INFY')} className="px-4 py-2 bg-[#6ee7b7] hover:bg-[#34d399] text-[#064e3b] rounded-lg text-sm font-bold transition-colors shadow-sm">INFY &nbsp;&bull;&nbsp; +0.20</button>
            <button onClick={() => onAdd("INFY")} className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white shadow-sm">+</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const MarketHighlights = () => (
  <section className="bg-[#0f172a] text-white rounded-[2.5rem] p-8 shadow-xl">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">Highlights</h2>
      <span className="text-[10px] font-bold px-2 py-1 border border-blue-500 text-blue-400 rounded">LIVE</span>
    </div>
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Market Sentiment Flags</span>
      </div>
      <div className="mb-10">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-5xl font-bold">0.72</span>
          <span className="text-gray-400 text-sm">Global FinBERT</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="bg-[#10b981] h-full w-[72%]"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] mt-1.5 shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-sm">Institutional Buying</h4>
              <span className="text-[9px] font-bold px-2 py-1 bg-[#064e3b] text-[#10b981] rounded text-center">BULLISH FLAG</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">IT Sector showing aggressive accumulation.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] mt-1.5 shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-sm">Crude Headwinds</h4>
              <span className="text-[9px] font-bold px-2 py-1 bg-[#451a03] text-[#ef4444] rounded text-center leading-none flex items-center h-5">BEARISH<br/>FLAG</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">Energy stocks facing margin pressure.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TechnicalFlags = ({ onAdd }) => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8001/api/flags')
      .then(res => res.json())
      .then(data => {
        setFlags(data.flags || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching flags:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Technical Flags</span>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-1 flex-grow">
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400 animate-pulse">Scanning Market...</p>
          </div>
        ) : flags.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-10 italic">No significant patterns detected.</p>
        ) : (
          flags.map((flag, index) => (
            <div 
              key={index}
              className={`group p-4 rounded-2xl flex items-center justify-between border transition-all duration-200 hover:shadow-md ${
                flag.direction === 'bullish' 
                  ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' 
                  : 'bg-rose-50 border-rose-100 hover:border-rose-300'
              }`}
            >
              <div 
                onClick={() => navigate(`/analysis?symbol=${flag.symbol}`)}
                className="flex items-center gap-4 cursor-pointer flex-grow"
              >
                <div className={`bg-white px-2.5 py-1 rounded shadow-sm text-[10px] font-black border ${
                  flag.direction === 'bullish' ? 'text-emerald-700 border-emerald-100' : 'text-rose-700 border-rose-100'
                }`}>
                  {flag.symbol}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{flag.name}</h4>
                  <p className={`text-[10px] font-bold uppercase ${
                    flag.direction === 'bullish' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {flag.type} {flag.direction === 'bullish' ? '↑' : '↓'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onAdd(flag.symbol)}
                  className="p-2 bg-white border border-slate-200 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm"
                  title="Add to Portfolio"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                  {flag.direction === 'bullish' ? (
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  ) : (
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default function MarketDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState('');
  const navigate = useNavigate();

  const handleOpenModal = (symbol) => {
    setActiveSymbol(symbol);
    setModalOpen(true);
  };

  const handleConfirmAdd = async (amount) => {
    const success = await addToPortfolioApi(activeSymbol, amount);
    if (success) {
      setModalOpen(false);
      alert(`Successfully added ₹${amount.toLocaleString()} in ${activeSymbol} to your portfolio!`);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen">
      <PortfolioModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        symbol={activeSymbol} 
        onConfirm={handleConfirmAdd} 
      />
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#1e40af] font-bold text-xl tracking-tight cursor-default">
             <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            SENTINEL
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </span>
            <input className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-[#f1f5f9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search tickers, trends, or news..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/portfolio')}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-[#1e40af] text-sm font-black rounded-2xl border border-slate-200 transition-all shadow-sm active:scale-95"
          >
            My Portfolio
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 cursor-pointer overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=User&background=1e40af&color=fff" alt="User" />
          </div>
        </div>
      </header>
      
      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <TopProfileMatches onAdd={handleOpenModal} />
          <TrackedSentiment onAdd={handleOpenModal} />
        </div>
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <MarketHighlights />
          <TechnicalFlags onAdd={handleOpenModal} />
        </aside>
      </main>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0f172a] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-colors z-50">
        <div className="relative">
          <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM6.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z"></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-[8px] mt-0.5">S</span>
          </div>
        </div>
      </button>
    </div>
  );
}
