import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MarketDashboard from './pages/MarketDashboard';
import StockAnalysis from './pages/StockAnalysis';
import CapitalSelection from './pages/CapitalSelection';
import RiskAssessment from './pages/RiskAssessment';
import ObjectiveSelection from './pages/ObjectiveSelection';
import MyPortfolio from './pages/MyPortfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MarketDashboard />} />
        <Route path="/analysis" element={<StockAnalysis />} />
        <Route path="/objective" element={<ObjectiveSelection />} />
        <Route path="/risk" element={<RiskAssessment />} />
        <Route path="/capital" element={<CapitalSelection />} />
        <Route path="/portfolio" element={<MyPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
