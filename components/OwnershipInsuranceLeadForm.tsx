
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Phone, Mail, Car, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, MapPin, History } from './Icons';
import { OwnershipRequest } from '../types';

interface OwnershipInsuranceLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  ownershipData: OwnershipRequest;
}

const OwnershipInsuranceLeadForm: React.FC<OwnershipInsuranceLeadFormProps> = ({ isOpen, onClose, ownershipData }) => {
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
      calculatorInputs: {
        carType: ownershipData.carType,
        purchasePrice: ownershipData.purchasePrice,
        zipCode: ownershipData.zipCode,
        annualMiles: ownershipData.annualMiles,
        ownershipPeriod: ownershipData.ownershipPeriod
      },
      source: 'Vehicle_Ownership_Insurance_Switcher'
    };

    // Simulate backend storage logic for vehicle_ownership_leads.json
    console.log("Saving lead to vehicle_ownership_leads.json:", leadEntry);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {!submitted && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
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
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Compare Rates</h2>
                    <p className="text-slate-500 text-sm">Review your audit profile for a personalized insurance comparison.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <Car className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Vehicle</p>
                          <p className="font-bold text-slate-900 dark:text-white capitalize">
                            {ownershipData.carType} (${parseInt(ownershipData.purchasePrice).toLocaleString()})
                          </p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-3.5 h-3.5 text-slate-400" />
                           <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ownershipData.zipCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <History className="w-3.5 h-3.5 text-slate-400" />
                           <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ownershipData.annualMiles}/yr</span>
                        </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    Confirm & Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Contact Details</h2>
                    <p className="text-slate-500 text-sm">Where should we send your rate comparison report?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="Full Name"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" required placeholder="Email Address"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" required placeholder="Phone Number"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="flex-1 py-4 font-bold text-slate-500">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get Best Price'}
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
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Request Sent!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium leading-relaxed">
                Your details have been submitted successfully. The insurance rate comparison will be sent to your inbox shortly.
              </p>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl"
              >
                Return to Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OwnershipInsuranceLeadForm;
