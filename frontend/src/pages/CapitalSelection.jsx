import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CapitalSelection() {
  const [capital, setCapital] = useState(50000);

  const displayCapital = () => {
    if (capital >= 500000) {
      return '$500,000+';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(capital);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Stepper Section */}
        <section className="w-full max-w-sm mb-20 relative">
          <div className="flex justify-between text-xs font-semibold text-blue-600 mb-2 px-1">
            <span>Goal</span>
            <span>Risk</span>
            <span>Capital</span>
          </div>
          <div className="relative w-full h-1 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full w-full"></div>
          </div>
        </section>

        {/* Heading Section */}
        <section className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
            Select your investable capital range
          </h1>
        </section>

        {/* Capital Selector Section */}
        <section className="w-full max-w-md flex flex-col items-center mb-24">
          <div className="mb-8">
            <span className="text-5xl font-bold text-blue-600">
              {displayCapital()}
            </span>
          </div>
          <div className="w-full px-4 relative">
            {/* Custom Tailwind slider styling added in global css, using standard input range here */}
            <input 
              type="range" 
              min="1000" 
              max="500000" 
              step="1000" 
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            />
            <div className="flex justify-between mt-4 text-sm font-medium text-gray-400">
              <span>$1K</span>
              <span>$500K+</span>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="w-full flex justify-center">
          <Link to="/analysis" className="flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
            <svg className="h-5 w-5 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <span className="text-lg">Generate My Terminal</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
