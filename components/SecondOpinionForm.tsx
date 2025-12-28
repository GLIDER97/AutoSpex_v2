
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
/* Added DollarSign to imports */
import { X, ChevronRight, Users, Phone, Mail, MapPin, Wrench, CheckCircle2, RefreshCw, ArrowRight, DollarSign } from './Icons';
import { MaintenanceRequest } from '../types';

interface SecondOpinionFormProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceRequest: MaintenanceRequest;
}

const SecondOpinionForm: React.FC<SecondOpinionFormProps> = ({ isOpen, onClose, maintenanceRequest }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: maintenanceRequest.zip || ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadEntry = {
      timestamp: new Date().toISOString(),
      contact: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        zip: formData.zip
      },
      auditInputs: {
        year: maintenanceRequest.year,
        make: maintenanceRequest.make,
        model: maintenanceRequest.model,
        service: maintenanceRequest.service,
        originalZip: maintenanceRequest.zip,
        quoteAmount: maintenanceRequest.quoteAmount
      },
      source: 'Repair_Overcharge_Validator_SecondOpinion'
    };

    // Simulate saving to Car_repair_leads.json
    console.log("Saving lead to Car_repair_leads.json:", leadEntry);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        {!submitted && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-red-600 transition-all duration-500" 
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
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Second Opinion</h2>
                    <p className="text-slate-500 text-sm">Reviewing your {maintenanceRequest.year} {maintenanceRequest.make} {maintenanceRequest.service} quote.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                          <Wrench className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Task</p>
                          <p className="font-bold text-slate-900 dark:text-white">{maintenanceRequest.service}</p>
                       </div>
                    </div>
                    {maintenanceRequest.quoteAmount && (
                       <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                             <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Quote</p>
                             <p className="font-bold text-slate-900 dark:text-white">${maintenanceRequest.quoteAmount}</p>
                          </div>
                       </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                  >
                    Confirm & Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Contact Info</h2>
                    <p className="text-slate-500 text-sm">Our expert technicians will contact you with an alternative audit.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="Full Name"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" required placeholder="Phone Number"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" required placeholder="Email Address"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="ZIP Code"
                        value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="flex-1 py-4 font-bold text-slate-500">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-[2] py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get My Quote'}
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
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Submission Success</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium">
                Your lead is submitted successfully. Our certified car mechanic will contact you soon.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SecondOpinionForm;
