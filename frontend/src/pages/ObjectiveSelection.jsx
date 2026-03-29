import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ObjectiveSelection() {
  const [selectedObjective, setSelectedObjective] = useState(localStorage.getItem('user_goal') || null);
  const [selectedHorizon, setSelectedHorizon] = useState(localStorage.getItem('user_horizon') || 'medium');

  const handleContinue = () => {
    localStorage.setItem('user_goal', selectedObjective);
    localStorage.setItem('user_horizon', selectedHorizon);
  };

  const objectiveOptions = [
    {
      id: 'wealth',
      title: 'Wealth Accumulation',
      desc: 'Maximizing long-term growth.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
      )
    },
    {
      id: 'income',
      title: 'Passive Income',
      desc: 'Consistent dividend yields.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      )
    },
    {
      id: 'capital',
      title: 'Capital Preservation',
      desc: 'Protecting existing assets.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-start pt-12 px-4">
      <nav aria-label="Progress" className="w-full max-w-xl mb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-400">Goal</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-400">Risk</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-400">Capital</span>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 bg-gray-100 h-1.5 rounded-l-full"></div>
          <div className="flex-1 bg-gray-100 h-1.5"></div>
          <div className="flex-1 bg-gray-100 h-1.5 rounded-r-full"></div>
        </div>
      </nav>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <section className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            What is your primary investment objective?
          </h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {objectiveOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedObjective(option.id)}
              className={`flex flex-col items-center justify-center p-8 bg-white border rounded-2xl shadow-sm cursor-pointer transition-all duration-200 group ${
                selectedObjective === option.id 
                  ? 'border-blue-600 ring-2 ring-blue-600 shadow-md transform -translate-y-1' 
                  : 'border-gray-100 hover:border-blue-600 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              <div className={`mb-6 transition-colors ${selectedObjective === option.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                {option.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{option.title}</h2>
              <p className="text-sm text-slate-500 text-center">{option.desc}</p>
            </button>
          ))}
        </section>

        {selectedObjective && (
           <section className="mt-16 w-full flex flex-col items-center gap-8">
            <div className="w-full max-w-xl">
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">What is your time horizon?</h2>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                {[
                  { id: 'short', label: 'Short (<1yr)' },
                  { id: 'medium', label: 'Medium (1-3yrs)' },
                  { id: 'long', label: 'Long (3yrs+)' }
                ].map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHorizon(h.id)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      selectedHorizon === h.id 
                        ? 'bg-white shadow-lg text-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <Link 
              to="/risk" 
              onClick={handleContinue}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 mt-4"
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
