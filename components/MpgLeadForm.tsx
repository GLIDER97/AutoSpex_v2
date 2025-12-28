
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Mail, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, Zap } from './Icons';

interface MpgLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorInputs: any;
}

const MpgLeadForm: React.FC<MpgLeadFormProps> = ({ isOpen, onClose, calculatorInputs }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadEntry = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      calculatorInputs,
      source: 'MPG_Fuel_Rewards_Sign_Up'
    };

    // Simulate backend storage logic for mpg_fuel_rewards_leads.json
    console.log("Saving lead to mpg_fuel_rewards_leads.json:", leadEntry);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Redirect to Upside in a new tab
      window.open('https://www.upside.com/find-offers', '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 sm:p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Earn Cash Back</h2>
              <p className="text-slate-500 text-sm">Join our rewards network to get up to 25¢/gal back on fuel.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text" required placeholder="Full Name"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input 
                  type="email" required placeholder="Email Address"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get My Savings'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-widest">
               <ShieldCheck className="w-3 h-3" /> Secure Redirect to Offers
            </div>
          </form>
        ) : (
          <div className="text-center py-10 animate-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">One More Step!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium leading-relaxed">
              We've saved your profile. We are now redirecting you to Upside to claim your cash-back offers...
            </p>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl"
            >
              Continue to Offers
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MpgLeadForm;
