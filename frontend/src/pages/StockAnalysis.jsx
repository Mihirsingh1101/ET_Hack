import React from 'react';
import MarketSentiment from '../components/MarketSentiment';

export default function StockAnalysis() {
  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans antialiased text-gray-900">
      <div className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* Header Section */}
        <header className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between border border-gray-100">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">RELIANCE</h1>
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-medium">NSE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-emerald-600">₹2984.50</span>
                <span className="text-sm text-emerald-500 flex items-center">
                  <svg className="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  (+1.24%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-amber-200 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium">
              <svg className="h-5 w-5 fill-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Watchlist
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              Add to Portfolio
            </button>
          </div>
        </header>

        {/* Dashboard Layout Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Technical Toolbox */}
          <aside className="col-span-12 lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 h-full border border-gray-100 shadow-sm min-h-[600px]">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Technical Toolbox</h2>
              <nav className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                  RSI (14)
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white flex items-center justify-between shadow-md">
                  <span>MACD (12,26,9)</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
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
            <div className="bg-white rounded-xl p-6 h-full border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center bg-gray-100/50 p-1 rounded-lg">
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-white shadow-sm text-gray-800">1D</button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-gray-600">1W</button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-gray-600">1M</button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-gray-600">3M</button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-gray-600">1Y</button>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle className="text-emerald-100" cx="16" cy="16" fill="transparent" r="14" stroke="currentColor" strokeWidth="3"></circle>
                      <circle className="text-emerald-500" cx="16" cy="16" fill="transparent" r="14" stroke="currentColor" strokeDasharray="88" strokeDashoffset="10" strokeWidth="3"></circle>
                    </svg>
                    <span className="absolute text-[10px] font-bold text-emerald-700">92</span>
                  </div>
                  <span className="text-emerald-700 text-xs font-bold whitespace-nowrap">Confluence Match</span>
                </div>
              </div>
              
              <div className="flex-grow rounded-xl border border-gray-50 bg-[#fbfcfd] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
                <span className="text-gray-300 font-medium">Market Intelligence Chart Visualization</span>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <MarketSentiment companyName="Reliance Industries" />

            <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Technical Flags</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded shadow-sm">MACD</span>
                    <span className="text-sm font-bold text-gray-800">Bullish Crossover</span>
                  </div>
                  <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-rose-600 bg-white px-1.5 py-0.5 rounded shadow-sm">RSI</span>
                    <span className="text-sm font-bold text-gray-800">Approaching Overbought</span>
                  </div>
                  <svg className="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
