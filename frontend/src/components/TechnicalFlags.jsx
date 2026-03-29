import React from 'react';

export default function TechnicalFlags() {
  return (
    <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Technical Flags</span>
      </div>
      <div className="space-y-4">
        <div className="bg-[#fef2f2] rounded-2xl p-4 flex items-center justify-between border border-[#fee2e2]">
          <div className="flex items-center gap-4">
            <div className="bg-white px-2 py-1 rounded text-[10px] font-bold text-[#b91c1c] border border-[#fee2e2]">NIFTY</div>
            <div>
              <h4 className="font-bold text-sm">RSI at 74</h4>
              <p className="text-[10px] text-[#b91c1c] font-semibold">Overbought Zone</p>
            </div>
          </div>
          <div className="text-center">
            <svg className="w-8 h-8 text-[#ef4444] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="text-[8px] font-bold text-[#b91c1c] uppercase">Alert</span>
          </div>
        </div>
        
        <div className="bg-[#f0fdf4] rounded-2xl p-4 flex items-center justify-between border border-[#dcfce7]">
          <div className="flex items-center gap-4">
            <div className="bg-white px-2 py-1 rounded text-[10px] font-bold text-[#15803d] border border-[#dcfce7]">BANK<br/>NIFTY</div>
            <div>
              <h4 className="font-bold text-sm">MACD Cross</h4>
              <p className="text-[10px] text-[#15803d] font-semibold">Bullish Momentum</p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 flex items-center justify-center">
               <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <span className="text-[8px] font-bold text-[#15803d] uppercase">Signal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
