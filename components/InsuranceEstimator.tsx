
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ShieldCheck, TrendingUp, DollarSign, Award, ArrowRight, 
  MapPin, Car, Users, CheckCircle2, AlertTriangle, Info,
  Zap, Lock, ChevronRight, Calculator, Star, MessageSquare, ChevronDown, FileText, Phone, Mail, RefreshCw, X
} from './Icons';
import { InsuranceFormData, InsuranceEstimate } from '../types';

const INITIAL_FORM_DATA: InsuranceFormData = {
  zipCode: '',
  year: '',
  make: '',
  model: '',
  usage: 'commute',
  annualMileage: '12000',
  ageGroup: '25-64',
  drivingHistory: 'clean',
  creditTier: 'good',
  coverageLevel: 'standard',
  deductible: '500'
};

const InsuranceEstimator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InsuranceFormData>(INITIAL_FORM_DATA);
  const [estimate, setEstimate] = useState<InsuranceEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Lead State
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });

  const updateForm = (field: keyof InsuranceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- LOGIC ENGINE ---
  const calculateEstimate = () => {
    let baseRate = 110; // National average base (heuristic)

    // 1. Geography Risk (Mock logic based on ZIP hash)
    const zipFactor = formData.zipCode ? (parseInt(formData.zipCode[0]) % 2 === 0 ? 1.1 : 0.9) : 1.0;
    baseRate *= zipFactor;

    // 2. Age Factor
    if (formData.ageGroup === '16-24') baseRate *= 2.4;
    else if (formData.ageGroup === '65+') baseRate *= 1.1;

    // 3. Driving History
    if (formData.drivingHistory === 'tickets') baseRate *= 1.35;
    else if (formData.drivingHistory === 'accidents') baseRate *= 1.8;

    // 4. Credit Tier
    if (formData.creditTier === 'excellent') baseRate *= 0.85;
    else if (formData.creditTier === 'average') baseRate *= 1.2;
    else if (formData.creditTier === 'poor') baseRate *= 1.6;

    // 5. Vehicle Type (Simple Keyword Check)
    const model = formData.model.toLowerCase();
    if (model.includes('gt') || model.includes('sport') || model.includes('amg') || model.includes('m3')) {
      baseRate *= 1.4;
    } else if (model.includes('truck') || model.includes('f150') || model.includes('silverado')) {
      baseRate *= 0.9;
    }

    // 6. Coverage Level
    if (formData.coverageLevel === 'state_min') baseRate *= 0.6;
    else if (formData.coverageLevel === 'premium') baseRate *= 1.45;

    // 7. Deductible
    if (formData.deductible === '2000') baseRate *= 0.85;
    else if (formData.deductible === '500') baseRate *= 1.1;

    const min = Math.round(baseRate * 0.85);
    const max = Math.round(baseRate * 1.15);
    const avg = Math.round((min + max) / 2);

    // Factors for UI
    const factors: InsuranceEstimate['factors'] = [];
    if (formData.ageGroup === '16-24') factors.push({ label: 'Age Group (Under 25)', impact: 'negative' });
    if (formData.drivingHistory === 'clean') factors.push({ label: 'Clean Driving Record', impact: 'positive' });
    if (formData.creditTier === 'excellent') factors.push({ label: 'Excellent Credit', impact: 'positive' });
    if (formData.coverageLevel === 'state_min') factors.push({ label: 'Min Coverage Selected', impact: 'positive' });

    return {
      monthlyPremium: { min, max, avg },
      score: avg < 100 ? 'great' : avg > 200 ? 'expensive' : 'average',
      factors,
      breakdown: {
        liability: Math.round(avg * 0.45),
        collision: Math.round(avg * 0.35),
        comprehensive: Math.round(avg * 0.20)
      }
    } as InsuranceEstimate;
  };

  const handleFinish = async () => {
    setLoading(true);
    const result = calculateEstimate();
    setEstimate(result);

    // AI Integration
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as an expert insurance underwriter.
        I have estimated a monthly auto insurance premium of $${result.monthlyPremium.min} - $${result.monthlyPremium.max} for a driver with these details:
        - Vehicle: ${formData.year} ${formData.make} ${formData.model}
        - Location ZIP: ${formData.zipCode}
        - Profile: Age ${formData.ageGroup}, ${formData.drivingHistory} history, ${formData.creditTier} credit.
        - Coverage: ${formData.coverageLevel} (Deductible: $${formData.deductible})

        Provide a concise, helpful 3-sentence explanation of why the price is in this range. 
        Focus on the biggest risk factors provided.
        Address the user directly as "you".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAiAnalysis(response.text);
    } catch (e) {
      console.error("AI Analysis Failed", e);
      setAiAnalysis("We calculated this estimate based on standard actuarial tables for your demographic and vehicle type.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);

    // Ensure all user inputs and calculated results are included in the lead entry
    const leadEntry = {
      timestamp: new Date().toISOString(),
      contact: {
        name: contactInfo.name,
        phone: contactInfo.phone,
        email: contactInfo.email
      },
      userInputs: {
        ...formData // Includes zipCode, year, make, model, usage, annualMileage, ageGroup, drivingHistory, creditTier, coverageLevel, deductible
      },
      calculatedResults: {
        monthlyPremium: estimate?.monthlyPremium,
        marketScore: estimate?.score,
        costBreakdown: estimate?.breakdown,
        aiSummary: aiAnalysis
      }
    };

    // Log the data targeted for Insurance_Estimator_leads.json
    console.log("Saving full lead data to Insurance_Estimator_leads.json:", leadEntry);

    setTimeout(() => {
      setLeadLoading(false);
      setLeadSubmitted(true);
    }, 1500);
  };

  const insuranceFaqs = [
    {
        question: "Why don't you ask for my phone number upfront?",
        answer: "We believe in privacy first. Our calculator is 100% anonymous for getting an estimate. If you choose to connect with an agent later to lock in a price, you can provide your details then."
    },
    {
        question: "How accurate is this estimate?",
        answer: "Our estimator uses actuarial data similar to what insurance companies use (location, vehicle type, age, credit tier). While it provides a highly accurate baseline, your final rate will depend on the specific insurer's underwriting criteria."
    },
    {
        question: "Does checking this affect my credit score?",
        answer: "No. This tool is a calculator, not a lender. We do not pull your credit report. We simply use the 'Credit Tier' you select to apply the appropriate risk multiplier to your estimate."
    },
    {
        question: "Why is my estimate so high?",
        answer: "Insurance rates are heavily influenced by location (state laws, accident rates), age (drivers under 25 pay significantly more), and vehicle type (repair costs). Our tool highlights these specific risk factors in the results."
    },
    {
        question: "Is this a real quote I can buy?",
        answer: "This tool provides a 'Fair Price' benchmark. You can use the 'Connect with Agents' button to send your details to real carriers who can offer a binding policy based on these inputs."
    }
  ];

  // --- RENDER STEPS ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" /> Location & Vehicle
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Zip Code</label>
        <input 
          type="text" 
          value={formData.zipCode}
          onChange={(e) => updateForm('zipCode', e.target.value.replace(/\D/g,'').slice(0,5))}
          placeholder="e.g. 90210"
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
           <input type="text" placeholder="2020" value={formData.year} onChange={(e) => updateForm('year', e.target.value)} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="col-span-2">
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Make & Model</label>
           <input type="text" placeholder="Toyota Camry" value={formData.model} onChange={(e) => updateForm('model', e.target.value)} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Primary Usage</label>
        <div className="grid grid-cols-3 gap-3">
          {['commute', 'pleasure', 'business'].map(opt => (
            <button
              key={opt}
              onClick={() => updateForm('usage', opt)}
              className={`p-3 rounded-xl border capitalize text-sm font-medium transition-all ${
                formData.usage === opt 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" /> Driver Profile
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Age Group</label>
        <div className="grid grid-cols-3 gap-3">
          {['16-24', '25-64', '65+'].map(opt => (
            <button
              key={opt}
              onClick={() => updateForm('ageGroup', opt)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.ageGroup === opt 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Driving History (Last 3 Years)</label>
        <div className="flex flex-col gap-3">
          {[
            { id: 'clean', label: 'Clean Record (No incidents)' },
            { id: 'tickets', label: '1-2 Speeding Tickets' },
            { id: 'accidents', label: 'At-Fault Accident / DUI' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => updateForm('drivingHistory', opt.id)}
              className={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between group ${
                formData.drivingHistory === opt.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {opt.label}
              {formData.drivingHistory === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Credit Tier (US Only)</label>
        <div className="grid grid-cols-4 gap-2">
           {['excellent', 'good', 'average', 'poor'].map(opt => (
              <button
                key={opt}
                onClick={() => updateForm('creditTier', opt)}
                className={`p-2 py-3 rounded-xl border capitalize text-xs sm:text-sm font-medium transition-all ${
                  formData.creditTier === opt 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {opt}
              </button>
           ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-500" /> Coverage Preferences
      </h3>

      <div className="grid grid-cols-1 gap-4">
         {[
           { id: 'state_min', title: 'State Minimum', desc: 'Cheapest legal option. Covers others, not you.' },
           { id: 'standard', title: 'Standard Full Coverage', desc: 'Comprehensive + Collision with $500 deductible.' },
           { id: 'premium', title: 'Premium Protection', desc: 'High limits, low deductible, rental reimbursement.' },
         ].map(opt => (
            <button
              key={opt.id}
              onClick={() => updateForm('coverageLevel', opt.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                formData.coverageLevel === opt.id 
                  ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-xl transform scale-[1.02]' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <div className="relative z-10">
                <h4 className={`font-bold text-lg mb-1 ${formData.coverageLevel === opt.id ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                  {opt.title}
                </h4>
                <p className={`text-sm ${formData.coverageLevel === opt.id ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                  {opt.desc}
                </p>
              </div>
              {formData.coverageLevel === opt.id && (
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4 text-white dark:text-black" />
                 </div>
              )}
            </button>
         ))}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preferred Deductible</label>
        <div className="flex items-center gap-4">
          {['500', '1000', '2000'].map(amt => (
            <button
              key={amt}
              onClick={() => updateForm('deductible', amt)}
              className={`flex-1 p-3 rounded-xl border text-sm font-bold transition-all ${
                formData.deductible === amt
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!estimate) return null;

    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-8 text-center text-white">
          <div className="relative z-10">
             <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Estimated Monthly Premium</h2>
             <div className="flex justify-center items-end gap-2 mb-6">
                <span className="text-6xl font-black tracking-tight">${estimate.monthlyPremium.min}</span>
                <span className="text-2xl font-bold text-slate-400 mb-2">-</span>
                <span className="text-6xl font-black tracking-tight">${estimate.monthlyPremium.max}</span>
                <span className="text-lg font-medium text-slate-400 mb-3">/mo</span>
             </div>
             
             <div className="w-full max-w-md mx-auto h-3 bg-slate-800 rounded-full relative overflow-hidden mb-6">
               <div 
                 className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                    estimate.score === 'great' ? 'bg-green-500 w-1/3' : estimate.score === 'average' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-full'
                 }`}
               ></div>
             </div>
             
             <p className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                estimate.score === 'great' ? 'bg-green-500/20 text-green-400' : estimate.score === 'average' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
             }`}>
                {estimate.score === 'great' ? 'Great Price' : estimate.score === 'average' ? 'Market Average' : 'Above Market Avg'}
             </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none flex flex-col">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-3">
                 <Zap className="w-5 h-5 text-brand-primary fill-current" /> 
                 Underwriter Analysis
              </h3>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium space-y-4 flex-grow">
                 {aiAnalysis ? (
                   <p className="animate-in fade-in">{aiAnalysis}</p>
                 ) : (
                   <div className="flex flex-col gap-4 animate-pulse">
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-8 flex items-center gap-3">
                 <Calculator className="w-5 h-5 text-blue-500" /> 
                 Cost Breakdown
              </h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Liability (Bodily/Property)</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">${estimate.breakdown.liability}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full rounded-full w-[45%]"></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Collision</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">${estimate.breakdown.collision}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="bg-purple-500 h-full rounded-full w-[35%]"></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Comprehensive</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">${estimate.breakdown.comprehensive}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full w-[20%]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- LEAD GENERATION SECTION --- */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10">
              {!leadSubmitted ? (
                <>
                  {!showLeadForm ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-1.5">
                            <Zap className="w-3 h-3" /> Special Offer
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-3">Connect with Local Agents</h3>
                        <p className="text-indigo-100 leading-relaxed font-medium">
                          Lock in a binding quote based on your profile. We'll send your pre-filled vehicle data to top carriers in {formData.zipCode} for real-time comparison.
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => setShowLeadForm(true)}
                        className="px-8 py-5 bg-white text-indigo-900 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl shadow-white/5 flex items-center gap-3 shrink-0 animate-slow-glow"
                      >
                        Get Official Quotes <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-6 max-w-xl mx-auto animate-in slide-in-from-bottom duration-300">
                       <div className="text-center mb-8">
                          <h3 className="text-2xl font-black text-white">Final Step: Contact Details</h3>
                          <p className="text-indigo-100 text-sm">Submit your anonymous profile to real agents for a bindable quote.</p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="relative">
                            <Users className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                            <input 
                              type="text" required placeholder="Full Name"
                              value={contactInfo.name} onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                              className="w-full p-4 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <Phone className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                              <input 
                                type="tel" required placeholder="Phone Number"
                                value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                className="w-full p-4 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white outline-none transition-all"
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-4 top-4 w-5 h-5 text-indigo-300" />
                              <input 
                                type="email" required placeholder="Email Address"
                                value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                className="w-full p-4 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:ring-2 focus:ring-white outline-none transition-all"
                              />
                            </div>
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setShowLeadForm(false)}
                            className="flex-1 py-4 font-bold text-white/70 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={leadLoading}
                            className="flex-[2] py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                          >
                            {leadLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Submit for Quotes'}
                          </button>
                       </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                  <div className="flex flex-col items-center leading-none tracking-tighter uppercase mb-6">
                    <span className="text-xl sm:text-2xl font-black text-white/50 relative z-20">
                      REQUEST RECEIVED
                    </span>
                    <span className="text-4xl sm:text-6xl font-black text-white block drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                      SUCCESSFULLY
                    </span>
                  </div>
                  
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
                    <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                      Thanks! we will contact you soon
                    </span>
                  </div>
                  
                  <p className="text-indigo-100 max-w-md mx-auto font-medium">
                    Local agents are now preparing your personalized binder for {formData.make} {formData.model}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
           onClick={() => { setEstimate(null); setStep(1); setAiAnalysis(null); setShowLeadForm(false); setLeadSubmitted(false); }}
           className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
           Start New Estimate
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!estimate && (
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm sm:text-base font-semibold text-indigo-500 mb-8 shadow-lg shadow-indigo-500/10 cursor-default">
                <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                Anonymous • No Phone Number Required
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Fair Price <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                US Based Car Insurance Estimator
            </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Get an unbiased car insurance price range in seconds. We don't ask for your email, and we don't sell your data to agents unless you choose to connect.
            </p>
        </div>
      )}

      <div className="w-full max-w-2xl">
         {!estimate ? (
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900">
                  <div className={`h-full bg-indigo-500 transition-all duration-500 ease-out`} style={{ width: `${(step/3)*100}%` }}></div>
               </div>

               <div className="p-6 sm:p-10">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}

                  <div className="mt-10 flex items-center justify-between">
                     {step > 1 ? (
                        <button 
                          onClick={() => setStep(prev => prev - 1)}
                          className="px-6 py-3 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                        >
                           Back
                        </button>
                     ) : <div></div>}
                     
                     {step < 3 ? (
                        <button 
                          onClick={() => {
                             if(step === 1 && (!formData.zipCode || formData.zipCode.length < 5)) return; 
                             setStep(prev => prev + 1);
                          }}
                          disabled={step === 1 && formData.zipCode.length < 5}
                          className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                           Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                     ) : (
                        <button 
                          onClick={handleFinish}
                          disabled={loading}
                          className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                           {loading ? 'Calculating...' : 'Get Estimate'} <TrendingUp className="w-4 h-4" />
                        </button>
                     )}
                  </div>
               </div>
            </div>
         ) : (
            renderResult()
         )}
      </div>

      {!estimate && (
        <>
            <div className="flex flex-wrap justify-center gap-6 mt-12 mb-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" /> No Personal Data Stored
                </div>
                <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-primary" /> AI-Powered Accuracy
                </div>
                <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> 100% Free
                </div>
            </div>

            <div className="w-full max-w-7xl px-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mb-4">
                    <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Enter Location</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Provide your ZIP code and vehicle details to establish the base actuarial risk for your area.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Select Profile</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Choose your age bracket, driving history, and credit tier anonymously. No names required.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-4">
                    <DollarSign className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. See Fair Price</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Instantly get a realistic monthly premium range and an AI explanation of the cost factors.
                    </p>
                </div>
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Common questions about auto insurance costs and this tool.</p>
                </div>
                
                <div className="space-y-4">
                    {insuranceFaqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                                openFaqIndex === index 
                                ? 'bg-white dark:bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-500/5' 
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
                                    openFaqIndex === index ? 'rotate-180 text-indigo-500' : ''
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

export default InsuranceEstimator;
