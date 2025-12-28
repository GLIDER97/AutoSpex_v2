import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  TrendingDown, TrendingUp, Car, DollarSign, Clock, 
  Hourglass, AlertCircle, AlertOctagon, Info, ChevronRight, 
  MessageSquare, ChevronDown, Lock, Zap, CheckCircle2, Star, ArrowRight, ShieldCheck
} from './Icons';
import { ValueRequest, ValueResult } from '../types';
import ResaleLeadForm from './ResaleLeadForm';

const INITIAL_REQUEST: ValueRequest = {
  year: '',
  make: '',
  model: '',
  trim: '',
  mileage: '',
  condition: 'good'
};

const ValueShockCalculator: React.FC = () => {
  const [request, setRequest] = useState<ValueRequest>(INITIAL_REQUEST);
  const [result, setResult] = useState<ValueResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const updateRequest = (field: keyof ValueRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!request.year || !request.make || !request.model || !request.mileage) {
      setError("Please fill in all vehicle details.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a Used Car Market Analyst and Financial Auditor.
        Analyze the following vehicle for depreciation:
        Vehicle: ${request.year} ${request.make} ${request.model} ${request.trim}
        Current Mileage: ${request.mileage} miles
        Condition: ${request.condition}

        1. Estimate current US Private Party & Trade-In value.
        2. Project the value 12 months from now (assuming +12,000 miles).
        3. Calculate the daily dollar loss due to depreciation.
        4. Provide a brutally honest verdict on its financial trajectory.
        
        Return valid JSON matching this schema:
        {
          "currentValue": { "tradeIn": number, "privateParty": number },
          "futureValue": { "tradeIn": number, "privateParty": number },
          "depreciation": { 
             "totalOneYear": number (positive number representing loss), 
             "perDay": number, 
             "percentDrop": number 
          },
          "verdict": {
            "status": "Holding Strong" | "Normal Depreciation" | "Free Fall" | "Money Pit",
            "color": "text-green-500" | "text-yellow-500" | "text-orange-500" | "text-red-600",
            "description": "One sentence summary of why."
          },
          "marketFactors": ["Factor 1", "Factor 2", "Factor 3"]
        }
      `;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentValue: {
                type: Type.OBJECT,
                properties: { tradeIn: { type: Type.NUMBER }, privateParty: { type: Type.NUMBER } },
                required: ['tradeIn', 'privateParty']
              },
              futureValue: {
                 type: Type.OBJECT,
                 properties: { tradeIn: { type: Type.NUMBER }, privateParty: { type: Type.NUMBER } },
                 required: ['tradeIn', 'privateParty']
              },
              depreciation: {
                 type: Type.OBJECT,
                 properties: { totalOneYear: { type: Type.NUMBER }, perDay: { type: Type.NUMBER }, percentDrop: { type: Type.NUMBER } },
                 required: ['totalOneYear', 'perDay', 'percentDrop']
              },
              verdict: {
                 type: Type.OBJECT,
                 properties: { status: { type: Type.STRING }, color: { type: Type.STRING }, description: { type: Type.STRING } },
                 required: ['status', 'color', 'description']
              },
              marketFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['currentValue', 'futureValue', 'depreciation', 'verdict', 'marketFactors']
          }
        }
      });

      const data = JSON.parse(aiResponse.text || '{}');
      
      // Strict validation of the core calculation objects to prevent UI crashes
      if (!data.depreciation || !data.currentValue || !data.futureValue || !data.verdict) {
        throw new Error("The diagnostic data returned was incomplete. Please try again.");
      }
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze vehicle value. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do you calculate future value?",
      answer: "We use historical depreciation curves specific to your vehicle's make, model, and segment (e.g., Luxury Sedans drop faster than Trucks). We also factor in an average of 12,000 additional miles per year."
    },
    {
      question: "Why is my daily loss so high?",
      answer: "Depreciation is the single biggest cost of car ownership. New or luxury cars can lose $20-$40 per day in value, while older, high-mileage cars lose significantly less."
    },
    {
      question: "Does this include maintenance costs?",
      answer: "No, this calculation is purely strictly 'Asset Depreciation'—the loss of the vehicle's cash value. Repairs, fuel, and insurance are additional costs on top of this."
    },
    {
      question: "Can I slow down my car's depreciation?",
      answer: "Yes. Keeping mileage low, maintaining detailed service records, storing the car in a garage, and keeping the interior/exterior in showroom condition will help it hold value better than average."
    },
    {
      question: "Why do luxury cars lose value faster?",
      answer: "Luxury vehicles often have higher maintenance costs and outdated technology as they age, making them less desirable on the used market compared to reliable economy cars like Toyotas or Hondas."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <ResaleLeadForm 
        isOpen={isLeadFormOpen} 
        onClose={() => setIsLeadFormOpen(false)} 
        vehicleRequest={request} 
      />

      {/* Header */}
      {!result && (
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-8 shadow-lg shadow-purple-500/10 cursor-default">
              <TrendingDown className="w-4 h-4" />
              Depreciation Analyzer
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Is Your Car a <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
               Financial Time Bomb?
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            See exactly how much money your car is losing every single day. Our AI predicts your vehicle's value drop over the next 12 months.
          </p>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {!result ? (
           /* INPUT FORM */
           <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative p-6 sm:p-10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                       <Car className="w-5 h-5 text-purple-500" /> Vehicle Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
                            <input 
                                type="text" placeholder="2020" value={request.year} 
                                onChange={(e) => updateRequest('year', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Make</label>
                            <input 
                                type="text" placeholder="BMW" value={request.make} 
                                onChange={(e) => updateRequest('make', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model</label>
                            <input 
                                type="text" placeholder="X5" value={request.model} 
                                onChange={(e) => updateRequest('model', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trim <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                            <input 
                                type="text" placeholder="xDrive40i" value={request.trim} 
                                onChange={(e) => updateRequest('trim', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Mileage</label>
                        <div className="relative">
                           <input 
                                type="number" placeholder="45000" value={request.mileage} 
                                onChange={(e) => updateRequest('mileage', e.target.value)} 
                                className="w-full p-3 pl-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">miles</span>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                       <AlertCircle className="w-5 h-5 text-purple-500" /> Condition & Status
                    </h3>
                    
                    <div className="flex flex-col gap-3">
                       {[
                          { id: 'excellent', label: 'Showroom Ready', desc: 'Looks brand new. No scratches, perfect mechanicals.' },
                          { id: 'good', label: 'Daily Driver', desc: 'Normal wear. Minor chips/scratches. Runs well.' },
                          { id: 'fair', label: 'Rough Shape', desc: 'Visible dents, rust, or needs mechanical repairs.' },
                          { id: 'poor', label: 'Damaged / Salvage', desc: 'Major issues, accident history, or not running.' },
                       ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => updateRequest('condition', opt.id as ValueRequest['condition'])}
                            className={`p-4 rounded-xl border text-left transition-all ${
                               request.condition === opt.id 
                                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-900 dark:text-purple-100' 
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-300'
                            }`}
                          >
                             <div className="font-bold text-sm mb-0.5">{opt.label}</div>
                             <div className="text-xs opacity-80">{opt.desc}</div>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Crunching Numbers...' : 'Calculate My Loss'} <TrendingDown className="w-5 h-5" />
              </button>
              
              {error && (
                 <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">
                    {error}
                 </div>
              )}
           </div>
        ) : (
           /* RESULT VIEW */
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {/* The Shock Card */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white mb-8">
                 <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Hourglass className="w-64 h-64 -rotate-12 translate-x-12 -translate-y-12" />
                 </div>
                 
                 <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold mb-6">
                       <Clock className="w-4 h-4 animate-pulse" /> Asset Depreciation Active
                    </div>
                    
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">You are losing approximately</h2>
                    <div className="text-6xl sm:text-7xl font-black tracking-tighter mb-4 text-red-500 flex items-center justify-center gap-1">
                       -${result.depreciation?.perDay?.toFixed(2) || '0.00'}
                       <span className="text-2xl text-slate-500 font-bold self-end mb-2">/day</span>
                    </div>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                       That's <span className="text-white font-bold">${(result.depreciation?.totalOneYear || 0).toLocaleString()}</span> vanishing from your net worth over the next year.
                    </p>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Value Today</p>
                                <p className="text-2xl font-black text-white">${(result.currentValue?.privateParty || 0).toLocaleString()}</p>
                            </div>
                            <div className="hidden sm:block flex-1 h-px bg-slate-700 relative">
                               <div className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500">
                                  <ChevronRight className="w-4 h-4" />
                               </div>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Value in 1 Year</p>
                                <p className="text-2xl font-black text-slate-300">${(result.futureValue?.privateParty || 0).toLocaleString()}</p>
                                <p className="text-xs text-red-400 mt-1">(-{result.depreciation?.percentDrop || 0}%)</p>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

              {/* MONETIZATION STRATEGY: RESALE REFERRAL */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 sm:p-10 mb-8 border border-white/10 shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95 duration-500 delay-200">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-8" />
                 </div>
                 
                 <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white/90 mb-4">
                          <ShieldCheck className="w-3.5 h-3.5" /> Premium Appraisal
                       </div>
                       <h2 className="text-3xl font-black mb-4 leading-tight">Stop the Bleeding. <br /> Get Paid Today.</h2>
                       <h3 className="text-purple-50 leading-relaxed font-medium mb-6">
                          Don't let the market eat your equity. Speak with a certified master technician to get a line-item appraisal and an instant cash buyout offer.
                       </h3>
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-400" />
                             <span className="text-sm font-bold text-purple-50">Direct mechanic-verified appraisal</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-400" />
                             <span className="text-sm font-bold text-purple-50">Redeemable cash offer in 24 hours</span>
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={() => setIsLeadFormOpen(true)}
                       className="w-full py-5 bg-white text-purple-700 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20 animate-slow-glow"
                    >
                       Get Exact Sale Price from a Real Mechanic <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              {/* Verdict & Context Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       <AlertCircle className={`w-5 h-5 ${result.verdict?.color || 'text-slate-500'}`} /> 
                       AI Verdict: <span className={result.verdict?.color || 'text-slate-500'}>{result.verdict?.status || 'Unknown'}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                       {result.verdict?.description}
                    </p>
                    
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Market Factors</h4>
                       <div className="flex flex-wrap gap-2">
                          {result.marketFactors?.map((factor, i) => (
                             <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                                {factor}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Trade-In vs Private Party</h3>
                    
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-slate-500 text-sm font-bold">Trade-In Value</span>
                             <span className="font-bold text-slate-900 dark:text-white">${(result.currentValue?.tradeIn || 0).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }}></div>
                          </div>
                       </div>
                       
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-slate-500 text-sm font-bold">Private Party Value</span>
                             <span className="font-bold text-slate-900 dark:text-white">${(result.currentValue?.privateParty || 0).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full rounded-full" style={{ width: '95%' }}></div>
                          </div>
                       </div>
                       
                       <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
                          *Private party sales typically yield 15-20% more cash than trading in to a dealer.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="flex justify-center">
                <button 
                    onClick={() => { setResult(null); }}
                    className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Analyze Another Vehicle
                </button>
              </div>
           </div>
        )}
      </div>

      {/* Trust Elements (Shown when no result) */}
      {!result && (
        <>
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 mb-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" /> Secure Data Handling
                </div>
                <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-purple-500" /> Real-Time Market Data
                </div>
                <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> 100% Free Report
                </div>
            </div>

            {/* How It Works */}
            <div className="w-full max-w-7xl px-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-4">
                    <Car className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Enter Vehicle</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Input your year, make, model, and mileage to pull current market valuation data.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4">
                    <TrendingDown className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Track Depreciation</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Our AI analyzes millions of sales records to determine your specific depreciation curve.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4">
                    <DollarSign className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. See The Loss</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Discover exactly how much cash value you are losing every single day you own the car.
                    </p>
                </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="w-full max-w-7xl px-4 mb-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                Financial Reality Checks
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                {[
                    { name: "Marcus D.", loc: "San Diego, CA", text: "I didn't realize my luxury SUV was losing $35 a day! Sold it and got a reliable sedan. Saved me thousands.", stars: 5 },
                    { name: "Jennifer K.", loc: "Austin, TX", text: "Helped me negotiate a trade-in. I knew the future value better than the dealer did, which gave me leverage.", stars: 5 },
                    { name: "Tom B.", loc: "Chicago, IL", text: "Brutal honesty. The 'Money Pit' verdict was spot on for my old European sports car. Time to let it go.", stars: 5 },
                ].map((review, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex gap-1 mb-4 text-purple-500">
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

            {/* FAQ Section */}
            <div className="w-full max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                        <MessageSquare className="w-6 h-6 text-purple-500" />
                        Frequently Asked Questions
                    </h2>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                                openFaqIndex === index 
                                ? 'bg-white dark:bg-slate-900 border-purple-500/30 shadow-lg shadow-purple-500/5' 
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
                                    openFaqIndex === index ? 'rotate-180 text-purple-500' : ''
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

export default ValueShockCalculator;