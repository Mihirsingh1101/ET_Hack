import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-[#020617] text-white min-h-screen flex flex-col overflow-hidden" 
         style={{ background: 'radial-gradient(circle at center, #0a0f2b 0%, #020617 100%)' }}>
      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span className="text-xl font-extrabold tracking-widest uppercase">Sentinel</span>
        </div>
        <div>
          <a className="text-sm font-semibold hover:text-blue-400 transition-colors cursor-pointer">Log In</a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Market Intelligence,<br />
            <span style={{ 
              background: 'linear-gradient(to right, #60a5fa, #818cf8)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Tailored to Your Risk.
            </span>
          </h1>
        </div>
        
        {/* Call to Action */}
        <div className="mt-10">
          <Link to="/objective" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
            Build My AI Profile
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </Link>
        </div>
      </main>

      <footer aria-hidden="true" className="py-12"></footer>
    </div>
  );
}
