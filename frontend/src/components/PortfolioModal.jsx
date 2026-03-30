import React, { useState } from 'react';

const PortfolioModal = ({ isOpen, onClose, symbol, onConfirm }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add to Portfolio</h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mt-1">{symbol}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Investment Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input 
                autoFocus
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50,000"
                className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => {
              if (amount && !isNaN(amount)) {
                onConfirm(parseFloat(amount));
                setAmount('');
              }
            }}
            disabled={!amount}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 transition-all active:scale-95"
          >
            Confirm Investment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;
