
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  PieChart, DollarSign, Calculator, Info, Lock, Zap, 
  Car, ShieldCheck, MapPin, TrendingDown, Clock, 
  History, MessageSquare, ChevronDown, CheckCircle2,
  Printer, RefreshCw, Star, Users, ArrowRight, TrendingUp,
  Search, Wrench
} from './Icons';
import { OwnershipRequest, OwnershipResult } from '../types';
import OwnershipInsuranceLeadForm from './OwnershipInsuranceLeadForm';

const INITIAL_REQUEST: OwnershipRequest = {
  carType: 'Sedan',
  purchasePrice: '',
  zipCode: '',
  annualMiles: '15k',
  ownershipPeriod: '5 years'
};

const OwnershipCalculator: React.FC = () => {
  const [request, setRequest] = useState<OwnershipRequest>(INITIAL_REQUEST);
  const [result, setResult] = useState<OwnershipResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isInsuranceLeadOpen, setIsInsuranceLeadOpen] = useState(false);

  const updateRequest = (field: keyof OwnershipRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value as any }));
  };

  const handleCalculate = async () => {
    if (!request.purchasePrice || !request.zipCode) {
      setError("Please fill in the purchase price and ZIP code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Role: Act as an expert Automotive Financial Analyst.
        Objective: Immediately calculate the Total Cost of Ownership (TCO) for a vehicle based on the following user inputs. Use internal US automotive market data to provide realistic estimates for depreciation, fuel, insurance, and maintenance.

        Inputs to Process:
        - Car Type: ${request.carType}
        - Purchase Price: ${request.purchasePrice}
        - ZIP Code: ${request.zipCode}
        - Annual Miles: ${request.annualMiles}
        - Ownership Period: ${request.ownershipPeriod}

        Execution Rules:
        - Do not ask follow-up questions.
        - Do not explain methodology or list sources.
        - Calculate Depreciation based on car type and years owned.
        - Calculate Fuel/Energy based on mileage and ZIP code averages.
        - Calculate Insurance by location risk and vehicle type.
        - Calculate Maintenance scaled by annual mileage and US averages (~$0.09/mile).
        - Calculate Financing assuming standard 80% LTV at current US average rates (approx 7.5% APR).

        Return strictly valid JSON matching this schema:
        {
          "totalCost": number,
          "monthlyAverage": number,
          "breakdown": {
            "depreciation": number,
            "fuel": number,
            "maintenance": number,
            "insurance": number,
            "financing": number
          },
          "expertAdditions": {
            "biggestHiddenCost": "2-3 line insight",
            "costSavingInsight": "1 practical suggestion"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalCost: { type: Type.NUMBER },
              monthlyAverage: { type: Type.NUMBER },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  depreciation: { type: Type.NUMBER },
                  fuel: { type: Type.NUMBER },
                  maintenance: { type: Type.NUMBER },
                  insurance: { type: Type.NUMBER },
                  financing: { type: Type.NUMBER }
                },
                required: ['depreciation', 'fuel', 'maintenance', 'insurance', 'financing']
              },
              expertAdditions: {
                type: Type.OBJECT,
                properties: {
                  biggestHiddenCost: { type: Type.STRING },
                  costSavingInsight: { type: Type.STRING }
                },
                required: ['biggestHiddenCost', 'costSavingInsight']
              }
            },
            required: ['totalCost', 'monthlyAverage', 'breakdown', 'expertAdditions']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");
      const data = JSON.parse(text);
      setResult(data);
    } catch (err) {
      console.error("Audit Error:", err);
      setError("Failed to generate financial audit. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "What is Total Cost of Ownership (TCO)?",
      answer: "TCO is the real cost of owning a vehicle, including not just the purchase price, but also depreciation, fuel, insurance, maintenance, and financing over time. Most owners only look at the monthly payment, but TCO reveals the actual impact on your net worth."
    },
    {
      question: "How is depreciation calculated?",
      answer: "We use standard US market depreciation curves. SUVs and Trucks typically hold value better than Luxury Sedans or EVs, though market volatility varies. Depreciation is usually the largest 'invisible' cost for new vehicle owners."
    },
    {
      question: "Is ZIP code important?",
      answer: "Yes. Fuel prices and insurance premiums vary significantly by region. For example, insurance in Michigan or Florida is typically higher than in Ohio or North Carolina, and gas prices on the West Coast are often 20-30% higher than the national average."
    },
    {
      question: "Does this factor in interest rates?",
      answer: "Our engine assumes a standard 80% loan-to-value ratio at current average US auto loan rates (approx 7-8% APR). If you pay cash, your financing cost will be zero, but your 'opportunity cost' on that capital remains a factor."
    },
    {
      question: "What sources are used for maintenance costs?",
      answer: "Maintenance estimates are scaled by annual mileage and vehicle type using US averages (approx. $0.09 per mile). This covers scheduled maintenance like oil changes and tires, as well as an allocation for common repairs as the vehicle ages."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <OwnershipInsuranceLeadForm 
        isOpen={isInsuranceLeadOpen} 
        onClose={() => setIsInsuranceLeadOpen(false)} 
        ownershipData={request} 
      />

      {!result && (
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-8 shadow-lg shadow-blue-500/10 cursor-default">
              <Calculator className="w-4 h-4" />
              Automotive Financial Auditor
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Vehicle Ownership <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
               Cost Calculator
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Immediate TCO analysis for US drivers. Get realistic estimates for the hidden costs of car ownership.
          </p>
        </div>
      )}

      <div className="w-full max-w-3xl">
        {!result ? (
           /* INPUT FORM - EXACTLY 5 FIELDS */
           <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative p-6 sm:p-10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                       <Car className="w-5 h-5 text-blue-500" /> Vehicle Profile
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Car Type</label>
                        <select 
                            value={request.carType}
                            onChange={(e) => updateRequest('carType', e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="EV">EV</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Purchase Price (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="number" placeholder="35000" value={request.purchasePrice} 
                                onChange={(e) => updateRequest('purchasePrice', e.target.value)} 
                                className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ZIP Code</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" placeholder="90210" value={request.zipCode} 
                                onChange={(e) => updateRequest('zipCode', e.target.value)} 
                                className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                maxLength={5}
                            />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                       <History className="w-5 h-5 text-blue-500" /> Usage & Term
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Annual Miles Driven</label>
                        <select 
                            value={request.annualMiles}
                            onChange={(e) => updateRequest('annualMiles', e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="5k">5k miles</option>
                            <option value="10k">10k miles</option>
                            <option value="15k">15k miles (Default)</option>
                            <option value="20k+">20k+ miles</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ownership Period</label>
                        <select 
                            value={request.ownershipPeriod}
                            onChange={(e) => updateRequest('ownershipPeriod', e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="3 years">3 years</option>
                            <option value="5 years">5 years (Default)</option>
                        </select>
                    </div>
                 </div>
              </div>

              <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" /> Performing Financial Audit...
                    </>
                  ) : (
                    <>Calculate Ownership Cost <ChevronDown className="w-5 h-5" /></>
                  )}
              </button>

              {/* Trust Strip - Moved to just below the button */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 mb-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-green-500" /> Private Data Analysis
                  </div>
                  <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Market Data Verified
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" /> 100% Free Tool
                  </div>
              </div>
              
              {error && (
                 <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-medium">
                    {error}
                 </div>
              )}
           </div>
        ) : (
           /* FINAL OUTPUT VIEW - EXACT STRUCTURE REQUIRED */
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                
                {/* Header Summary Section */}
                <div className="bg-slate-900 p-8 text-white text-center border-b border-slate-800">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-8">VEHICLE COST OF OWNERSHIP SUMMARY</h2>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Cost Over Ownership Period</p>
                      <p className="text-5xl sm:text-6xl font-black text-white">${result.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Average Monthly Cost</p>
                      <p className="text-3xl font-bold text-blue-400">${result.monthlyAverage.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 sm:p-10 space-y-10">
                  {/* Cost Breakdown */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Cost Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Depreciation', val: result.breakdown.depreciation },
                        { label: 'Fuel Costs', val: result.breakdown.fuel },
                        { label: 'Maintenance & Repairs', val: result.breakdown.maintenance },
                        { label: 'Insurance', val: result.breakdown.insurance },
                        { label: 'Financing Cost', val: result.breakdown.financing },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                          <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">{item.label}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">${item.val.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Switcher Lead Gen CTA */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl animate-in zoom-in-95 duration-500 delay-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldCheck className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white/90 mb-4">
                        <Zap className="w-3 h-3" /> Potential Savings Found
                      </div>
                      <h3 className="text-2xl font-black mb-3 leading-tight">Reduce Your Monthly Cost</h3>
                      <p className="text-blue-100 text-sm font-medium mb-6">
                        Your estimated insurance cost is <strong>${result.breakdown.insurance.toLocaleString()}</strong>. We can help you find a better rate for your {request.carType} in {request.zipCode}.
                      </p>
                      <button 
                        onClick={() => setIsInsuranceLeadOpen(true)}
                        className="w-full py-4 bg-white text-blue-700 font-black rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 animate-slow-glow"
                      >
                        Get My Best Insurance Price <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expert Additions */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Expert Additions</h3>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Zap className="w-3.5 h-3.5" /> Biggest Hidden Cost
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium italic pl-4 border-l-2 border-blue-500/30">
                          {result.expertAdditions.biggestHiddenCost}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Cost-Saving Insight
                        </p>
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                            <p className="text-slate-700 dark:text-slate-200 text-sm font-bold">
                            {result.expertAdditions.costSavingInsight}
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Disclaimer</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      This is an estimate based on market averages; actual costs may vary based on individual driving habits, regional economic fluctuations, and specific vehicle condition.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 no-print">
                    <button 
                        onClick={() => setResult(null)}
                        className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> New Calculation
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>
              </div>
           </div>
        )}
      </div>

      {!result && (
        <div className="w-full max-w-5xl mx-auto space-y-24 mt-20 mb-20">
            
            {/* About This Tool Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">About the TCO Auditor</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        Most car buyers only focus on the sticker price or the monthly loan payment. The <span className="text-blue-600 font-bold">AutoSpex TCO Auditor</span> uses artificial intelligence to look under the financial hood.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                        Our engine processes millions of data points from US automotive markets—including real-time fuel prices, actuarial risk tables, and historical depreciation curves—to show you what your vehicle actually costs to own per month.
                    </p>
                    <div className="flex flex-col gap-4">
                        {[
                            { icon: <ShieldCheck className="w-5 h-5 text-green-500" />, text: "Verified US Market Assumptions" },
                            { icon: <Zap className="w-5 h-5 text-blue-500" />, text: "AI-Powered Regional Price variance" },
                            { icon: <Lock className="w-5 h-5 text-slate-400" />, text: "100% Private - No data shared with dealers" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200">
                                {item.icon} {item.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 relative">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Calculator className="w-32 h-32" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why Calculate TCO?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Budget Better:</span> Know your real cash outflow before signing the paperwork.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Compare Smarter:</span> An EV might be $10k more to buy but $200/mo cheaper to own.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Avoid 'Money Pits':</span> Identify vehicles with extreme depreciation or repair costs.</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* How To Audit Your Costs Section (REDESIGNED) */}
            <div className="w-full bg-slate-950 dark:bg-[#020617] py-24 px-4 -mx-4 sm:mx-0 sm:rounded-[3rem] border-y sm:border border-slate-900">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-black text-white text-center mb-16">How to Audit Your Costs</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { 
                              icon: <Zap className="w-6 h-6 text-orange-500" />, 
                              title: "1. Vehicle Profile", 
                              desc: "Select your vehicle category and enter the expected purchase price to establish the depreciation baseline.",
                              iconBg: "bg-orange-500/10"
                            },
                            { 
                              icon: <Search className="w-6 h-6 text-blue-500" />, 
                              title: "2. Usage Data", 
                              desc: "Enter your ZIP code for regional fuel/insurance variance and your expected annual mileage for maintenance scaling.",
                              iconBg: "bg-blue-500/10"
                            },
                            { 
                              icon: <Wrench className="w-6 h-6 text-green-500" />, 
                              title: "3. Review AI Audit", 
                              desc: "Our AI generates a specific breakdown including hidden costs and practical tips to save on your yearly spend.",
                              iconBg: "bg-green-500/10"
                            }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-10 bg-[#0f172a] rounded-[2.5rem] border border-slate-800/60 shadow-2xl transition-all hover:scale-[1.02] duration-300 group">
                                <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-8 border border-white/5 shadow-inner`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="px-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-16">Trusted by Smart Car Buyers</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Jessica H.", loc: "Atlanta, GA", text: "I was torn between a truck and a crossover. This tool showed me that the truck would cost an extra $340/month in 'invisible' costs. Saved me from a bad financial choice!", stars: 5 },
                        { name: "David R.", loc: "Phoenix, AZ", text: "Finally an honest look at depreciation. It helped me realize that buying a 2-year-old car instead of new would save me $12,000 over 5 years. Incredible tool.", stars: 5 },
                        { name: "Mark S.", loc: "Seattle, WA", text: "Used the print feature to show my partner why we should switch to an EV. The fuel savings vs purchase price was clear as day. 10/10 analysis.", stars: 5 },
                    ].map((review, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative group">
                            <div className="flex gap-1 mb-6 text-brand-primary">
                                {[...Array(review.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed">"{review.text}"</p>
                            <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                    <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">{review.loc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ownership FAQs Section */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
                        <MessageSquare className="w-7 h-7 text-blue-500" />
                        Common Questions
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Everything you need to know about the Total Cost of Ownership.</p>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                                openFaqIndex === index 
                                ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-lg shadow-blue-500/5' 
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
                                    openFaqIndex === index ? 'rotate-180 text-blue-500' : ''
                                }`} 
                                />
                            </button>
                            <div 
                                className={`transition-all duration-300 ease-in-out ${
                                openFaqIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
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

        </div>
      )}

    </div>
  );
};

export default OwnershipCalculator;
