import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import FaultCodeDecoder from './components/FaultCodeDecoder';
import VinLookup from './components/VinLookup';
import InsuranceEstimator from './components/InsuranceEstimator';
import MpgCalculator from './components/MpgCalculator';
import AffordabilityPredictor from './components/AffordabilityPredictor';
import MaintenanceValidator from './components/MaintenanceValidator';
import ValueShockCalculator from './components/ValueShockCalculator';
import OwnershipCalculator from './components/OwnershipCalculator';
import PlateGenerator from './components/PlateGenerator';
import WrapDesigner from './components/WrapDesigner';
import MechanicFinder from './components/MechanicFinder';
import { PrivacyPolicy, TermsOfService, CookiePolicy, ContactUs, AboutUs } from './components/LegalPages';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch(currentView) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'fault-code-decoder': return <FaultCodeDecoder />;
      case 'vin-lookup': return <VinLookup />;
      case 'insurance-estimator': return <InsuranceEstimator />;
      case 'mpg-calculator': return <MpgCalculator />;
      case 'affordability-predictor': return <AffordabilityPredictor />;
      case 'maintenance-validator': return <MaintenanceValidator />;
      case 'value-shock-calculator': return <ValueShockCalculator />;
      case 'ownership-calculator': return <OwnershipCalculator />;
      case 'plate-generator': return <PlateGenerator />;
      case 'wrap-designer': return <WrapDesigner />;
      case 'mechanic-finder': return <MechanicFinder />;
      case 'privacy-policy': return <PrivacyPolicy />;
      case 'terms-of-service': return <TermsOfService />;
      case 'cookie-policy': return <CookiePolicy />;
      case 'contact-us': return <ContactUs />;
      case 'about-us': return <AboutUs />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-primary selection:text-slate-900 flex flex-col font-sans transition-colors duration-300">
      
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onNavigate={handleNavigate}
      />

      <main className="flex-grow flex flex-col relative overflow-hidden pt-20">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-100" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-100" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center">
            {renderView()}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;