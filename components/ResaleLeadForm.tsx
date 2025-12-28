
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, Users, Phone, Mail, Car, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck } from './Icons';
import { ValueRequest } from '../types';

interface ResaleLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleRequest: ValueRequest;
}

const ResaleLeadForm: React.FC<ResaleLeadFormProps> = ({ isOpen, onClose, vehicleRequest }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadEntry = {
      timestamp: new Date().toISOString(),
      contact: formData,
      vehicle: {
        year: vehicleRequest.year,
        make: vehicleRequest.make,
        model: vehicleRequest.model,
        trim: vehicleRequest.trim,
        mileage: vehicleRequest.mileage,
        condition: vehicleRequest.condition
      },
      source: 'Resale_Value_Shock_Referral'
    };

    // Simulate saving to Car_resale_leads.json
    console.log("Saving lead to Car_resale_leads.json:", leadEntry);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Redirect to Carvana in a new tab after a brief delay
      setTimeout(() => {
        window.open('https://www.carvana.com/sell-my-car', '_blank', 'noopener,noreferrer');
      }, 1000);
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {!submitted && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-purple-600 transition-all duration-500" 
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        )}

        <div className="p-8 sm:p-10">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Verify Vehicle</h2>
                    <p className="text-slate-500 text-sm">Our mechanics use these specs to calculate your final offer.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                          <Car className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Vehicle</p>
                          <p className="font-bold text-slate-900 dark:text-white text-lg">
                            {vehicleRequest.year} {vehicleRequest.make} {vehicleRequest.model}
                          </p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Mileage</span>
                        <span className="text-slate-700 dark:text-slate-200 font-black">{vehicleRequest.mileage.toLocaleString()} mi</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Condition</span>
                        <span className="text-slate-700 dark:text-slate-200 font-black capitalize">{vehicleRequest.condition}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    Confirm Details <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Contact Details</h2>
                    <p className="text-slate-500 text-sm">Where should our technician send the final appraisal?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="Full Name"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" required placeholder="Email Address"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" required placeholder="Phone Number"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="flex-1 py-4 font-bold text-slate-500">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-[2] py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get Exact Price'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-90 duration-500">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Report Ready!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium leading-relaxed">
                Your appraisal lead is submitted. We are now redirecting you to our final verification partner to lock in your offer...
              </p>
              <div className="flex flex-col gap-3">
                 <div className="animate-pulse text-xs font-bold text-slate-400 uppercase tracking-widest">Redirecting to Carvana</div>
                 <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full animate-[progress_2s_ease-in-out]" />
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ResaleLeadForm;
