import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Gauge, 
  Menu, 
  X, 
  ChevronDown, 
  Car, 
  Calculator, 
  BarChart, 
  DollarSign, 
  BookOpen, 
  Search, 
  FileText, 
  Wrench, 
  Sun, 
  Moon, 
  Info, 
  MessageSquare,
  ShieldCheck,
  Home,
  TrendingUp,
  AlertOctagon,
  TrendingDown,
  PieChart,
  Tag,
  Palette,
  MapPin
} from './Icons';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const tools = [
    { 
      name: 'Fault Code Decoder', 
      icon: <Gauge className="w-4 h-4" />, 
      view: 'fault-code-decoder'
    },
    { 
      name: 'VIN Lookup', 
      icon: <Search className="w-4 h-4" />, 
      view: 'vin-lookup'
    },
    { 
      name: 'Insurance Cost Estimator', 
      icon: <ShieldCheck className="w-4 h-4" />, 
      view: 'insurance-estimator'
    },
    { 
      name: 'Car Price & Affordability', 
      icon: <TrendingUp className="w-4 h-4" />, 
      view: 'affordability-predictor'
    },
    { 
      name: 'Maintenance Validator', 
      icon: <AlertOctagon className="w-4 h-4" />, 
      view: 'maintenance-validator'
    },
    { 
      name: 'Resale Value Shock', 
      icon: <TrendingDown className="w-4 h-4" />, 
      view: 'value-shock-calculator'
    },
    { 
      name: 'Vehicle Ownership Calculator', 
      icon: <PieChart className="w-4 h-4" />, 
      view: 'ownership-calculator'
    },
    { 
      name: 'MPG Calculator', 
      icon: <Calculator className="w-4 h-4" />, 
      view: 'mpg-calculator'
    },
    { 
      name: 'Vanity Plate Generator', 
      icon: <Tag className="w-4 h-4" />, 
      view: 'plate-generator'
    },
    { 
      name: 'AI Wrap Designer', 
      icon: <Palette className="w-4 h-4" />, 
      view: 'wrap-designer'
    }
  ];

  const resources = [
    { name: 'Latest News', icon: <BookOpen className="w-4 h-4" />, view: '#' },
    { name: 'Repair Guides', icon: <FileText className="w-4 h-4" />, view: '#' },
    { name: 'Maintenance', icon: <Wrench className="w-4 h-4" />, view: '#' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              onClick={(e) => handleNavClick(e, 'home')}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg group-hover:scale-105 transition-transform duration-300">
                 <Gauge className="w-6 h-6" strokeWidth={2.5} />
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-primary rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  AutoSpex
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-brand-primary uppercase mt-0.5">
                  Vehicle Intelligence
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center space-x-8">
              
              <a 
                href="#"
                onClick={(e) => handleNavClick(e, 'home')}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                Home
              </a>

              {/* Tools Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('tools')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 transition-all duration-200 ${
                    activeDropdown === 'tools' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {tools.map((item, idx) => (
                      <a 
                        key={idx} 
                        href="#"
                        onClick={(e) => {
                          if(item.view !== '#') handleNavClick(e, item.view);
                          else e.preventDefault();
                          setActiveDropdown(null);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover/item:bg-brand-primary/10 group-hover/item:text-brand-primary transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'mechanic-finder')}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Find Mechanic Nearby
              </a>

              {/* Resources Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 transition-all duration-200 ${
                    activeDropdown === 'resources' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden">
                    {resources.map((item, idx) => (
                      <a 
                        key={idx} 
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover/item:bg-blue-500/10 group-hover/item:text-blue-500 transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <a 
                href="#" 
                onClick={(e) => handleNavClick(e, 'about-us')}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                About
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Theme Toggle - Visible Always */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2.5 rounded-xl text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Desktop CTA (Optional, looks nice) */}
              <a 
                href="#"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/10"
              >
                Get App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Rendered via Portal to avoid overflow/z-index issues */}
      {createPortal(
        <div className={`relative z-[100] lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div 
            className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-200 dark:border-slate-800 ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                       <Gauge className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">AutoSpex</span>
                 </div>
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Mobile Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar theme-transition">
                
                <a 
                    href="#"
                    onClick={(e) => handleNavClick(e, 'home')}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors bg-slate-50 dark:bg-slate-900 font-bold"
                >
                    <Home className="w-5 h-5 text-slate-500" />
                    Home
                </a>

                {/* Tools Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Features</h3>
                  <div className="space-y-1">
                    {tools.map((item, idx) => (
                      <a 
                        key={idx}
                        href="#"
                        onClick={(e) => {
                           if (item.view !== '#') handleNavClick(e, item.view);
                           else {
                             e.preventDefault();
                             setIsMobileMenuOpen(false);
                           }
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        <div className="text-slate-400 dark:text-slate-500">
                          {item.icon}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <a 
                    href="#"
                    onClick={(e) => handleNavClick(e, 'mechanic-finder')}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                    <span className="font-medium text-slate-700 dark:text-slate-200">Find Mechanic Nearby</span>
                </a>

                {/* Resources Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resources</h3>
                  <div className="space-y-1">
                    {resources.map((item, idx) => (
                      <a 
                        key={idx} 
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        <div className="text-slate-400 dark:text-slate-500">
                          {item.icon}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1 mb-6">
                    <a 
                      href="#" 
                      onClick={(e) => handleNavClick(e, 'about-us')}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <Info className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-200">About Us</span>
                    </a>
                    <a 
                      href="#" 
                      onClick={(e) => handleNavClick(e, 'contact-us')}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-200">Contact Support</span>
                    </a>
                  </div>

                  {/* Primary CTA Button */}
                  <a href="#" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:bg-amber-400 transition-colors">
                    Download App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Navbar;