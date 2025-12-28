
import React from 'react';
import { Zap } from './Icons';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-16 relative z-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 lg:grid-cols-5 gap-12">
        
        {/* Column 1: Brand & Desc */}
        <div className="md:col-span-2">
           <a href="#" onClick={(e) => handleNav(e, 'home')} className="flex items-center gap-2 mb-6 cursor-pointer">
             <div className="bg-gradient-to-tr from-brand-primary to-orange-600 rounded-lg p-1.5 shadow-lg shadow-orange-500/20 dark:shadow-orange-900/20">
               <Zap className="w-5 h-5 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white leading-none">
                  AutoSpex
                </span>
             </div>
           </a>
           <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
             The ultimate free diagnostic tool for car owners. We translate complex automotive data into plain English, helping you save money on repairs and drive safer.
           </p>
           <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-primary dark:hover:text-white hover:border-brand-primary transition-colors cursor-pointer">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-primary dark:hover:text-white hover:border-brand-primary transition-colors cursor-pointer">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
             </div>
           </div>
        </div>

        {/* Column 2: Tools */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Free Tools</h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'fault-code-decoder')}
                className="hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-2"
              >
                OBD Fault Decoder
              </a>
            </li>
            <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'vin-lookup')}
                className="hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-2"
              >
                VIN Decoder
              </a>
            </li>
            <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'insurance-estimator')}
                className="hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-2"
              >
                Insurance Estimator
              </a>
            </li>
            <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'affordability-predictor')}
                className="hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-2"
              >
                Price & Affordability
              </a>
            </li>
             <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'mpg-calculator')}
                className="hover:text-brand-primary cursor-pointer transition-colors flex items-center gap-2"
              >
                MPG Calculator
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Resources</h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="hover:text-brand-primary cursor-pointer transition-colors">Blog & Guides</li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">Diagnostic Tutorials</li>
            <li className="hover:text-brand-primary cursor-pointer transition-colors">Error Code Library</li>
            <li>
              <a 
                href="#"
                onClick={(e) => handleNav(e, 'about-us')}
                className="hover:text-brand-primary cursor-pointer transition-colors"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href="#" onClick={(e) => handleNav(e, 'privacy-policy')} className="hover:text-brand-primary cursor-pointer transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleNav(e, 'terms-of-service')} className="hover:text-brand-primary cursor-pointer transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleNav(e, 'cookie-policy')} className="hover:text-brand-primary cursor-pointer transition-colors">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => handleNav(e, 'contact-us')} className="hover:text-brand-primary cursor-pointer transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-600 text-[13px]">
        <p>© {new Date().getFullYear()} AutoSpex. All rights reserved.</p>
        <p>Data provided for informational purposes only. Consult a professional mechanic for repairs.</p>
      </div>
    </footer>
  );
};

export default Footer;
