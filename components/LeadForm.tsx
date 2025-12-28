
import React, { useState } from 'react';
/* Fixed: User icon is not exported from Icons, using Users instead */
import { X, ChevronRight, Users, Phone, Mail, MapPin, Car, CheckCircle2, RefreshCw } from './Icons';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  errorCode: string;
  vehicleName?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, errorCode, vehicleName = "" }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '',
    carName: vehicleName,
    errorCode: errorCode
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend submission to OBD2_leads.json
    const leadEntry = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'OBD_Decoder_Quote_Tool'
    };

    console.log("Saving lead to OBD2_leads.json:", leadEntry);

    // Artificial delay for UX
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        {!submitted && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-brand-primary transition-all duration-500" 
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
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Repair Quote</h2>
                    <p className="text-slate-500 text-sm">Review your vehicle details for a precision audit.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Error Code</label>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xl text-brand-primary">
                        {errorCode}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Car Model</label>
                      <div className="relative">
                        <Car className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={formData.carName}
                          onChange={(e) => setFormData({...formData, carName: e.target.value})}
                          placeholder="e.g. 2018 Toyota Camry"
                          className="w-full p-4 pl-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleNext}
                    disabled={!formData.carName}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Contact Details</h2>
                    <p className="text-slate-500 text-sm">Where should we send your fair-price report?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      {/* Fixed: Changed User to Users since User is not exported from Icons */}
                      <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="Full Name"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" required placeholder="Phone Number"
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" required placeholder="Email Address"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" required placeholder="ZIP Code"
                        value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="flex-1 py-4 font-bold text-slate-500">Back</button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-[2] py-4 bg-brand-primary text-slate-900 font-bold rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Request Quote'}
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
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Request Received</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                We're auditing local repair rates for your {formData.carName}. Check your email for the full report.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
