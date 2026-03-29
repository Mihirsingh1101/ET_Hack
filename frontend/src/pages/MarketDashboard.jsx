import React from 'react';
import MarketSentimentCard from '../components/MarketSentimentCard';
import MarketSentimentFlags from '../components/MarketSentimentFlags';
import TechnicalFlags from '../components/TechnicalFlags';

const TopProfileMatches = () => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">Top Profile Matches</h2>
      <span className="text-xs font-semibold px-3 py-1 bg-[#e0e7ff] text-[#4338ca] rounded-full">Aggressive Strategy</span>
    </div>
    
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {/* Card 1 */}
      <div className="min-w-[280px] bg-white rounded-2xl p-5 border-2 border-blue-500 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-8 bg-blue-500 rounded-bl-3xl"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">RELIANCE</h3>
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
      
      {/* Card 2 */}
      <div className="min-w-[280px] bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">TCS</h3>
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
      
      {/* Card 3 */}
      <div className="min-w-[280px] bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">HDFCBANK</h3>
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
    </div>
  </section>
);

export default function MarketDashboard() {
  return (
    <div className="bg-[#f8fafc] text-[#1e293b] min-h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#1e40af] font-bold text-xl tracking-tight">
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
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 cursor-pointer">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
        </div>
      </header>
      
      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <TopProfileMatches />
          <MarketSentimentFlags companyName="Reliance Industries" />
        </div>
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <MarketSentimentCard companyName="Reliance Industries" />
          <TechnicalFlags />
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
