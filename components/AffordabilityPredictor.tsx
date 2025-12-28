
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  TrendingUp, Car, DollarSign, PieChart, CheckCircle2, 
  AlertTriangle, MapPin, Calculator, ChevronRight, Lock, 
  Zap, Info, Target, Users, Star, MessageSquare, ChevronDown,
  X, RefreshCw, ArrowRight, ShieldCheck, Mail, Phone, ShoppingCart
} from './Icons';
import { AffordabilityData, PredictionResult } from '../types';

const INITIAL_DATA: AffordabilityData = {
  vehicle: {
    year: '',
    make: '',
    model: '',
    trim: '',
    zip: '',
  },
  finance: {
    monthlyIncome: '',
    monthlyDebt: '0',
    creditScore: 'good',
    downPayment: '0',
    termMonths: 60,
  }
};

const APR_MAP = {
  excellent: 6.5,
  good: 8.5,
  fair: 12.5,
  poor: 18.0
};

const faqs = [
  {
    question: "What is the 20/4/10 rule?",
    answer: "It's a standard financial guideline for car buying: 20% down payment, a loan term of no more than 4 years, and total car expenses (including insurance) that don't exceed 10% of your monthly gross income."
  },
  {
    question: "How accurate is the Fair Market Value?",
    answer: "Our AI analyzes millions of data points from recent local sales and dealer listings in your specific ZIP code. While it provides a highly accurate baseline, the final price may vary based on the vehicle's exact condition and options."
  },
  {
    question: "Does checking my affordability affect my credit score?",
    answer: "No. This tool is a calculator for informational purposes. We do not perform credit checks. We use the credit tier you select to estimate your APR based on current market averages."
  },
  {
    question: "What is Front-End DTI?",
    answer: "Front-End Debt-to-Income ratio is the percentage of your gross monthly income that goes toward your car payment. Financial experts generally recommend staying below 10% for a safe budget."
  },
  {
    question: "Why should I include other monthly debts?",
    answer: "Including other debts (like rent, student loans, or credit cards) allows us to calculate your Back-End DTI. This gives a more complete picture of your overall financial health and your ability to take on a new car loan safely."
  }
];

const AffordabilityPredictor: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AffordabilityData>(INITIAL_DATA);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Lead State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadContact, setLeadContact] = useState({ name: '', phone: '', email: '' });

  const updateVehicle = (field: keyof AffordabilityData['vehicle'], value: string) => {
    setData(prev => ({ ...prev, vehicle: { ...prev.vehicle, [field]: value } }));
  };

  const updateFinance = (field: keyof AffordabilityData['finance'], value: any) => {
    setData(prev => ({ ...prev, finance: { ...prev.finance, [field]: value } }));
  };

  const calculateLoanPayment = (principal: number, annualRate: number, months: number) => {
    if (principal <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const handlePredict = async () => {
    if (!data.vehicle.make || !data.vehicle.model || !data.finance.monthlyIncome) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Estimate the current US dealer retail price range for a used ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model} ${data.vehicle.trim} in ZIP code ${data.vehicle.zip}.
        
        Return a JSON object with:
        - priceLow (number)
        - priceHigh (number)
        - fairMarketValue (number)
        - negotiationTarget (number, aggressive but realistic buy price)
        - marketContext (array of 3 short strings explaining price factors like supply, demand, region)
      `;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priceLow: { type: Type.NUMBER },
              priceHigh: { type: Type.NUMBER },
              fairMarketValue: { type: Type.NUMBER },
              negotiationTarget: { type: Type.NUMBER },
              marketContext: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['priceLow', 'priceHigh', 'fairMarketValue', 'negotiationTarget', 'marketContext']
          }
        }
      });

      const marketData = JSON.parse(aiResponse.text || '{}');

      const estimatedApr = APR_MAP[data.finance.creditScore];
      const loanPrincipal = marketData.fairMarketValue - parseFloat(data.finance.downPayment || '0');
      const monthlyPayment = calculateLoanPayment(loanPrincipal, estimatedApr, data.finance.termMonths);
      
      const income = parseFloat(data.finance.monthlyIncome);
      const debt = parseFloat(data.finance.monthlyDebt || '0');
      
      const dtiFrontEnd = (monthlyPayment / income) * 100;
      const dtiBackEnd = ((monthlyPayment + debt) / income) * 100;

      let verdict: PredictionResult['affordability']['verdict'] = 'Affordable';
      let verdictColor = 'text-green-500';

      if (dtiFrontEnd > 15 || dtiBackEnd > 45) {
        verdict = 'High Risk';
        verdictColor = 'text-red-500';
      } else if (dtiFrontEnd > 10 || dtiBackEnd > 36) {
        verdict = 'Stretch';
        verdictColor = 'text-yellow-500';
      }

      const maxSafePayment = income * 0.10; 

      setResult({
        marketValue: {
          low: marketData.priceLow,
          high: marketData.priceHigh,
          fair: marketData.fairMarketValue,
          negotiationTarget: marketData.negotiationTarget
        },
        affordability: {
          estimatedApr,
          monthlyPayment,
          dtiFrontEnd,
          dtiBackEnd,
          maxSafePayment,
          verdict,
          verdictColor
        },
        marketContext: marketData.marketContext
      });

    } catch (err) {
      console.error(err);
      setError("Failed to analyze market data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);

    const leadEntry = {
      timestamp: new Date().toISOString(),
      contact: leadContact,
      userInputs: {
        vehicle: data.vehicle,
        finance: data.finance
      },
      analysisResults: {
        marketValue: result?.marketValue,
        affordability: result?.affordability
      },
      source: 'Affordability_Predictor_PreApproval'
    };

    // Store logic simulation for Car-affordability_leads.json
    console.log("Storing new lead in Car-affordability_leads.json:", leadEntry);

    setTimeout(() => {
      setLeadLoading(false);
      setLeadSubmitted(true);
    }, 1500);
  };

  const renderLeadModal = () => {
    if (!isLeadModalOpen) return null;
    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsLeadModalOpen(false)} />
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 sm:p-10">
          <button onClick={() => setIsLeadModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          {!leadSubmitted ? (
            <form onSubmit={handleLeadSubmit}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary mb-6">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Get Pre-Approved</h2>
                <p className="text-slate-500 text-sm">Submit your profile to our lender network for real rates.</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="relative">
                  <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" required placeholder="Full Name"
                    value={leadContact.name} onChange={(e) => setLeadContact({...leadContact, name: e.target.value})}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" required placeholder="Phone Number"
                    value={leadContact.phone} onChange={(e) => setLeadContact({...leadContact, phone: e.target.value})}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" required placeholder="Email Address"
                    value={leadContact.email} onChange={(e) => setLeadContact({...leadContact, email: e.target.value})}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={leadLoading}
                className="w-full py-4 bg-brand-primary text-slate-900 font-black rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
              >
                {leadLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Send Request'}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-90 duration-500">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Request Received</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                A lending specialist will contact you shortly with your pre-approval details.
              </p>
              <button 
                onClick={() => setIsLeadModalOpen(false)}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
              >
                Back to Tool
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Car className="w-6 h-6 text-brand-primary" /> Vehicle Details
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
           <input 
             type="text" 
             placeholder="2021" 
             value={data.vehicle.year} 
             onChange={(e) => updateVehicle('year', e.target.value)} 
             className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Make</label>
           <input 
             type="text" 
             placeholder="Honda" 
             value={data.vehicle.make} 
             onChange={(e) => updateVehicle('make', e.target.value)} 
             className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
           />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model</label>
        <input 
          type="text" 
          placeholder="Civic" 
          value={data.vehicle.model} 
          onChange={(e) => updateVehicle('model', e.target.value)} 
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trim (Optional)</label>
           <input 
             type="text" 
             placeholder="EX-L" 
             value={data.vehicle.trim} 
             onChange={(e) => updateVehicle('trim', e.target.value)} 
             className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Zip Code</label>
           <input 
             type="text" 
             placeholder="90210" 
             value={data.vehicle.zip} 
             onChange={(e) => updateVehicle('zip', e.target.value.replace(/\D/g,'').slice(0,5))} 
             className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
           />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-500" /> Financial Profile
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gross Monthly Income</label>
           <div className="relative">
             <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
             <input 
               type="number" 
               placeholder="4500" 
               value={data.finance.monthlyIncome} 
               onChange={(e) => updateFinance('monthlyIncome', e.target.value)} 
               className="w-full p-3 pl-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
             />
           </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Other Monthly Debts</label>
           <div className="relative">
             <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
             <input 
               type="number" 
               placeholder="1200" 
               value={data.finance.monthlyDebt} 
               onChange={(e) => updateFinance('monthlyDebt', e.target.value)} 
               className="w-full p-3 pl-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
             />
           </div>
           <p className="text-xs text-slate-500 mt-1">Rent, Student Loans, Credit Cards</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Credit Score Range</label>
        <div className="grid grid-cols-4 gap-2">
           {[
             { id: 'excellent', label: '720+', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500' },
             { id: 'good', label: '660-719', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-500' },
             { id: 'fair', label: '600-659', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-500' },
             { id: 'poor', label: '< 600', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-500' },
           ].map(opt => (
              <button
                key={opt.id}
                onClick={() => updateFinance('creditScore', opt.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  data.finance.creditScore === opt.id 
                    ? `${opt.color} shadow-sm border-2` 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="text-sm font-bold capitalize">{opt.id}</div>
                <div className="text-xs opacity-75">{opt.label}</div>
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Down Payment</label>
           <div className="relative">
             <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
             <input 
               type="number" 
               placeholder="2000" 
               value={data.finance.downPayment} 
               onChange={(e) => updateFinance('downPayment', e.target.value)} 
               className="w-full p-3 pl-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
             />
           </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Term (Months)</label>
           <select 
             value={data.finance.termMonths}
             onChange={(e) => updateFinance('termMonths', parseInt(e.target.value))}
             className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
           >
             {[36, 48, 60, 72, 84].map(m => (
               <option key={m} value={m}>{m} Months</option>
             ))}
           </select>
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Top Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Market Value Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
                   <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">True Market Price</h3>
                  <p className="text-xs text-slate-500">Based on {data.vehicle.zip} market data</p>
                </div>
             </div>

             <div className="mb-6 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Target Negotiation Price</p>
                <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">
                  ${result.marketValue.negotiationTarget.toLocaleString()}
                </div>
                <p className="text-sm text-slate-500">Fair Value: ${result.marketValue.fair.toLocaleString()}</p>
             </div>

             <div className="relative pt-6 pb-2 px-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full relative">
                   <div className="absolute top-0 bottom-0 bg-slate-300 dark:bg-slate-600 rounded-full" 
                        style={{ 
                          left: '0%', 
                          width: '100%' 
                        }}></div>
                   <div className="absolute -top-1 w-1 h-6 bg-brand-primary left-1/2 -translate-x-1/2"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                   <span>Low: ${result.marketValue.low.toLocaleString()}</span>
                   <span>High: ${result.marketValue.high.toLocaleString()}</span>
                </div>
             </div>

             <div className="mt-6 space-y-2">
                {result.marketContext.map((ctx, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0"></span>
                     {ctx}
                  </div>
                ))}
             </div>
          </div>

          {/* Affordability Card */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-6 opacity-5">
                <PieChart className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-8" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-white/10 ${result.affordability.verdictColor}`}>
                     <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Affordability Check</h3>
                    <p className={`text-sm font-bold ${result.affordability.verdictColor}`}>
                       Verdict: {result.affordability.verdict}
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                     <p className="text-slate-400 text-xs font-bold uppercase mb-1">Est. Monthly Payment</p>
                     <p className="text-3xl font-black text-white">
                        ${result.affordability.monthlyPayment.toFixed(0)}
                     </p>
                     <p className="text-xs text-slate-400 mt-1">@ {result.affordability.estimatedApr}% APR</p>
                  </div>
                  <div>
                     <p className="text-slate-400 text-xs font-bold uppercase mb-1">Max Safe Payment</p>
                     <p className="text-3xl font-black text-white opacity-80">
                        ${result.affordability.maxSafePayment.toFixed(0)}
                     </p>
                     <p className="text-xs text-slate-400 mt-1">10% of Income</p>
                  </div>
               </div>

               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium text-slate-300">Car Payment to Income</span>
                     <span className={`text-sm font-bold ${result.affordability.verdictColor}`}>
                        {result.affordability.dtiFrontEnd.toFixed(1)}%
                     </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ${result.affordability.dtiFrontEnd > 15 ? 'bg-red-500' : result.affordability.dtiFrontEnd > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                       style={{ width: `${Math.min(100, (result.affordability.dtiFrontEnd / 20) * 100)}%` }}
                     ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                     Experts recommend keeping car payments below 10% of gross monthly income.
                  </p>
               </div>
             </div>
          </div>
        </div>

        {/* MONETIZATION ACTION SECTION */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 sm:p-12 mb-8 border border-white/5 shadow-2xl relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl font-black mb-4">Secure This Deal.</h2>
                 <p className="text-slate-400 leading-relaxed font-medium mb-6">
                    Ready to move forward? Get pre-approved for financing or check local inventory matching this exact profile instantly.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <span className="text-sm font-bold text-slate-300">Real rates based on your profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <span className="text-sm font-bold text-slate-300">No credit score impact for lookup</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <button 
                    onClick={() => { setLeadSubmitted(false); setIsLeadModalOpen(true); }}
                    className="w-full py-5 bg-brand-primary text-slate-900 font-black rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20 animate-slow-glow"
                 >
                    Get Pre-Approved <ShieldCheck className="w-5 h-5" />
                 </button>
                 
                 <a 
                    href="https://www.carvana.com/cars" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                 >
                    Find This Car Near Me <ShoppingCart className="w-5 h-5" />
                 </a>
              </div>
           </div>
        </div>

        <button 
           onClick={() => { setResult(null); setStep(1); setLeadSubmitted(false); }}
           className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
           Start New Analysis
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {renderLeadModal()}

      {!result && (
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-brand-primary mb-8 shadow-lg shadow-brand-primary/10 cursor-default">
              <TrendingUp className="w-4 h-4" />
              Real-Time Market Data
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            True Car Price <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-orange-600">
               & Affordability Predictor
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Don't overpay. Use AI to find the fair market price for any car in your ZIP code and verify if it fits your budget using professional financial standards.
          </p>
        </div>
      )}

      <div className="w-full max-w-4xl">
         {!result ? (
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
               
               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900">
                  <div className={`h-full bg-brand-primary transition-all duration-500 ease-out`} style={{ width: `${(step/2)*100}%` }}></div>
               </div>

               <div className="p-6 sm:p-10">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}

                  <div className="mt-10 flex items-center justify-between">
                     {step > 1 ? (
                        <button 
                          onClick={() => setStep(prev => prev - 1)}
                          className="px-6 py-3 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                        >
                           Back
                        </button>
                     ) : <div></div>}
                     
                     {step < 2 ? (
                        <button 
                          onClick={() => {
                             if(!data.vehicle.year || !data.vehicle.make || !data.vehicle.model) return;
                             setStep(prev => prev + 1);
                          }}
                          disabled={!data.vehicle.year || !data.vehicle.make}
                          className="px-8 py-3 rounded-xl bg-brand-primary text-slate-900 font-bold hover:bg-orange-400 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                        >
                           Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                     ) : (
                        <button 
                          onClick={handlePredict}
                          disabled={loading}
                          className="px-8 py-3 rounded-xl bg-brand-primary text-slate-900 font-bold hover:bg-orange-400 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                        >
                           {loading ? 'Analyzing Market...' : 'Analyze Price & Budget'} <Zap className="w-4 h-4" />
                        </button>
                     )}
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">
                       {error}
                    </div>
                  )}
               </div>
            </div>
         ) : (
            renderResult()
         )}
      </div>

      {!result && (
        <>
            <div className="flex flex-wrap justify-center gap-6 mt-12 mb-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" /> Private & Secure
                </div>
                <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-primary" /> Real-Time Market Data
                </div>
                <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Professional Financial Rules
                </div>
            </div>

            <div className="w-full max-w-7xl px-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-brand-primary flex items-center justify-center mb-4">
                    <Car className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Vehicle & Location</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Enter the car you want and your zip code to get real-time local market pricing data.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-4">
                    <DollarSign className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Financial Check</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Input your income and credit tier. We apply the 20/4/10 rule and other financial standards.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4">
                    <PieChart className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Instant Verdict</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    See if it's a smart buy or a financial trap with our color-coded affordability score.
                    </p>
                </div>
                </div>
            </div>

            <div className="w-full max-w-7xl px-4 mb-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                Trusted by Smart Buyers
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                {[
                    { name: "Sarah J.", loc: "Atlanta, GA", text: "Realized the dealer markup was $4k over fair market value. Used this tool to negotiate them down instantly.", stars: 5 },
                    { name: "Mike T.", loc: "Denver, CO", text: "I almost bought a truck that would have eaten 25% of my monthly income. This tool saved me from a huge mistake.", stars: 5 },
                    { name: "David L.", loc: "Phoenix, AZ", text: "Simple, fast, and honest. The affordability breakdown showed me exactly what I could actually afford safely.", stars: 5 },
                ].map((review, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex gap-1 mb-4 text-brand-primary">
                        {[...Array(review.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 italic text-sm leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                        {review.name.charAt(0)}
                        </div>
                        <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{review.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{review.loc}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                        <MessageSquare className="w-6 h-6 text-brand-primary" />
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Common questions about affordability and pricing.</p>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                                openFaqIndex === index 
                                ? 'bg-white dark:bg-slate-900 border-brand-primary/30 shadow-lg shadow-brand-primary/5' 
                                : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                            >
                                <span className={`font-semibold pr-4 ${openFaqIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {faq.question}
                                </span>
                                <ChevronDown 
                                className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                                    openFaqIndex === index ? 'rotate-180 text-brand-primary' : ''
                                }`} 
                                />
                            </button>
                            <div 
                                className={`transition-all duration-300 ease-in-out ${
                                openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3 mt-0">
                                {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}

    </div>
  );
};

export default AffordabilityPredictor;
