import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RiskAssessment() {
  const [selectedRisk, setSelectedRisk] = useState(localStorage.getItem('user_risk') || null);
  const [panicHistory, setPanicHistory] = useState(parseInt(localStorage.getItem('user_panic')) || 1);
  const [drawdownReaction, setDrawdownReaction] = useState(parseInt(localStorage.getItem('user_drawdown')) || 1);

  const handleContinue = () => {
    localStorage.setItem('user_risk', selectedRisk);
    localStorage.setItem('user_panic', panicHistory);
    localStorage.setItem('user_drawdown', drawdownReaction);
  };

  const riskOptions = [
    {
      id: 'conservative',
      title: 'Conservative',
      desc: 'Capital preservation first.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
        </svg>
      )
    },
    {
      id: 'moderate',
      title: 'Moderate',
      desc: 'Balanced growth and risk.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0a48.474 48.474 0 00-3 .52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"></path>
        </svg>
      )
    },
    {
      id: 'aggressive',
      title: 'Aggressive',
      desc: 'High risk, high reward.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.96 5.96m0 0L2.25 21l.75-7.5 7.38-5.84zm0 0l5.96 5.96"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-start pt-12 px-4">
      <nav aria-label="Progress" className="w-full max-w-xl mb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-blue-600">Goal</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-400">Risk</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-400">Capital</span>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 bg-blue-600 h-1.5 rounded-l-full"></div>
          <div className="flex-1 bg-gray-100 h-1.5"></div>
          <div className="flex-1 bg-gray-100 h-1.5 rounded-r-full"></div>
        </div>
      </nav>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <section className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            How do you handle market volatility?
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {riskOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedRisk(option.id)}
              className={`flex flex-col items-center justify-center p-8 bg-white border rounded-2xl shadow-sm cursor-pointer transition-all duration-200 group ${
                selectedRisk === option.id 
                  ? 'border-blue-600 ring-2 ring-blue-600 shadow-md transform -translate-y-1' 
                  : 'border-gray-100 hover:border-blue-600 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              <div className={`mb-6 transition-colors ${selectedRisk === option.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                {option.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{option.title}</h2>
              <p className="text-sm text-slate-500 text-center">{option.desc}</p>
            </button>
          ))}
        </section>

        {selectedRisk && (
           <section className="mt-16 w-full flex flex-col items-center gap-12 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
              {/* Panic History */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Have you sold investments during a market crash?</h3>
                <div className="flex bg-white p-1.5 rounded-2xl gap-2 shadow-inner">
                  {[
                    { id: 0, label: 'Never' },
                    { id: 1, label: 'Rarely' },
                    { id: 3, label: 'Often' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPanicHistory(p.id)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                        panicHistory === p.id 
                          ? 'bg-blue-600 shadow-lg text-white' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawdown Reaction */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Reaction to a 20% portfolio drop?</h3>
                <div className="flex bg-white p-1.5 rounded-2xl gap-2 shadow-inner">
                  {[
                    { id: 0, label: 'Panic' },
                    { id: 2, label: 'Wait' },
                    { id: 4, label: 'Buy More' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDrawdownReaction(d.id)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                        drawdownReaction === d.id 
                          ? 'bg-blue-600 shadow-lg text-white' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link 
              to="/capital" 
              onClick={handleContinue}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <span className="text-lg">Continue</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
