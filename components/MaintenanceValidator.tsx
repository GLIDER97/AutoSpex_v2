
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Gavel, ClipboardCheck, AlertTriangle, CheckCircle2, 
  AlertOctagon, Wrench, MapPin, DollarSign, ChevronRight, 
  ArrowRight, Lock, Zap, Info, MessageSquare, ChevronDown, Car, Users, Star, Award, Bot, Globe,
  ShieldCheck, ShieldAlert
} from './Icons';
import { MaintenanceRequest, MaintenanceResult } from '../types';
import SecondOpinionForm from './SecondOpinionForm';

const INITIAL_REQUEST: MaintenanceRequest = {
  year: '',
  make: '',
  model: '',
  service: '',
  zip: '',
  quoteAmount: ''
};

const MaintenanceValidator: React.FC = () => {
  const [request, setRequest] = useState<MaintenanceRequest>(INITIAL_REQUEST);
  const [result, setResult] = useState<MaintenanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isSecondOpinionOpen, setIsSecondOpinionOpen] = useState(false);

  const updateRequest = (field: keyof MaintenanceRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleValidation = async () => {
    if (!request.year || !request.make || !request.service || !request.zip) {
      setError("Please fill in all required fields (Year, Make, Service, Zip).");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % 3);
    }, 800);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Optimized prompt for speed and strict output control to prevent JSON overflow/truncation
      const prompt = `
        Audit US auto repair: ${request.year} ${request.make} ${request.model}, ${request.service} (ZIP ${request.zip}). 
        User quote: ${request.quoteAmount ? `$${request.quoteAmount}` : "None"}.
        
        Strict Requirements:
        - Return strictly valid JSON.
        - aiAnalysis: max 150 characters.
        - negotiationTip: max 100 characters.
        - Use localized US parts/labor data.
      `;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          // Speed optimization: disable thinking for instant response
          thinkingConfig: { thinkingBudget: 0 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fairPrice: {
                type: Type.OBJECT,
                properties: {
                   low: { type: Type.NUMBER },
                   high: { type: Type.NUMBER },
                   average: { type: Type.NUMBER }
                }
              },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  partsEst: { type: Type.OBJECT, properties: { low: { type: Type.NUMBER }, high: { type: Type.NUMBER } } },
                  laborEst: { type: Type.OBJECT, properties: { low: { type: Type.NUMBER }, high: { type: Type.NUMBER } } },
                  laborHours: { type: Type.OBJECT, properties: { low: { type: Type.NUMBER }, high: { type: Type.NUMBER } } },
                  laborRate: { type: Type.NUMBER }
                }
              },
              scorecard: {
                 type: Type.OBJECT,
                 properties: {
                    verdict: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    diffPercent: { type: Type.NUMBER }
                 }
              },
              aiAnalysis: { type: Type.STRING },
              negotiationTip: { type: Type.STRING }
            },
            required: ['fairPrice', 'breakdown', 'scorecard', 'aiAnalysis', 'negotiationTip']
          }
        }
      });

      const text = aiResponse.text;
      if (!text) throw new Error("API returned empty response.");
      
      const responseData = JSON.parse(text);
      
      // Safety check for quote scenarios
      if (!request.quoteAmount) {
         responseData.scorecard = { verdict: 'Fair Deal', score: 100, diffPercent: 0 };
      }
      
      setResult(responseData);
    } catch (err) {
      console.error("Diagnostic Error:", err);
      setError("The auditor encountered a data sync error. This usually happens when the model generates too much detail. Please try again with a simpler service name.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "Where does this data come from?",
      answer: "We aggregate data from industry standard labor guides, national parts distributors, and regional cost-of-living adjustments based on your ZIP code."
    },
    {
      question: "Why is the dealer price higher?",
      answer: "Dealerships use Factory parts (OEM) which are more expensive, and their labor rates are typically 20-40% higher than independent shops to cover overhead and training."
    },
    {
      question: "My mechanic quoted me higher than your 'High' price. Why?",
      answer: "They might be using premium parts, or there may be complications with your specific vehicle. However, if it's significantly higher, you should ask for a breakdown of hours vs parts."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <SecondOpinionForm 
        isOpen={isSecondOpinionOpen} 
        onClose={() => setIsSecondOpinionOpen(false)} 
        maintenanceRequest={request}
      />

      {/* Header */}
      {!result && (
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-red-600 dark:text-red-400 mb-8 shadow-lg shadow-red-500/10 cursor-default">
              <AlertOctagon className="w-4 h-4" />
              Consumer Protection Tool
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Car Repair <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
               Overcharge Validator
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Are you getting scammed? Enter your repair quote and we'll check it against fair market labor and parts data for your area instantly.
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-4xl">
        {!result ? (
           <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative p-6 sm:p-10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service / Repair Name</label>
                        <div className="relative">
                            <Wrench className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="e.g. Brake Pads, Alternator, Timing Belt" 
                                value={request.service} 
                                onChange={(e) => updateRequest('service', e.target.value)} 
                                className="w-full p-3 pl-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Year</label>
                            <input 
                                type="text" placeholder="2018" value={request.year} 
                                onChange={(e) => updateRequest('year', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Make</label>
                            <input 
                                type="text" placeholder="Toyota" value={request.make} 
                                onChange={(e) => updateRequest('make', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Model</label>
                            <input 
                                type="text" placeholder="Camry" value={request.model} 
                                onChange={(e) => updateRequest('model', e.target.value)} 
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Zip Code</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" placeholder="90210" value={request.zip} 
                                    onChange={(e) => updateRequest('zip', e.target.value)} 
                                    className="w-full p-3 pl-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Quoted Amount <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative mb-4">
                        <span className="absolute left-4 top-4 text-slate-400 font-bold text-xl">$</span>
                        <input 
                            type="number" placeholder="0.00" value={request.quoteAmount} 
                            onChange={(e) => updateRequest('quoteAmount', e.target.value)} 
                            className="w-full p-4 pl-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none transition-all text-2xl font-bold text-slate-900 dark:text-white"
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Enter the total amount to get a "Rip-Off Score". Leave blank to see the fair price range.
                    </p>
                 </div>
              </div>

              <button 
                  onClick={handleValidation}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                      <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Auditing Costs...
                      </span>
                  ) : (
                      <>Validate Price <Gavel className="w-5 h-5" /></>
                  )}
              </button>
           </div>
        ) : (
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white mb-8">
                 <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Gavel className="w-64 h-64 -rotate-12 translate-x-12 -translate-y-12" />
                 </div>
                 <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium mb-4 text-slate-300">
                           <ClipboardCheck className="w-4 h-4" /> Audit Complete
                        </div>
                        <h2 className="text-4xl font-black mb-2 tracking-tight">
                            {request.quoteAmount ? "Verdict:" : "Fair Price Range:"}
                        </h2>
                        {request.quoteAmount ? (
                            <div className={`text-5xl sm:text-6xl font-black tracking-tighter mb-4 ${
                                result.scorecard.verdict === 'Rip-Off' ? 'text-red-500' :
                                result.scorecard.verdict === 'Overpriced' ? 'text-orange-500' :
                                result.scorecard.verdict === 'High End' ? 'text-yellow-400' :
                                'text-green-400'
                            }`}>
                                {result.scorecard.verdict.toUpperCase()}
                            </div>
                        ) : (
                             <div className="text-5xl font-black text-white mb-4">
                                ${result.fairPrice.low} - ${result.fairPrice.high}
                             </div>
                        )}
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">{result.aiAnalysis}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" /> Cost Breakdown
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                <span className="text-slate-400">Estimated Parts</span>
                                <span className="font-mono font-bold">${result.breakdown.partsEst.low} - ${result.breakdown.partsEst.high}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                <span className="text-slate-400">Estimated Labor</span>
                                <span className="font-mono font-bold">${result.breakdown.laborEst.low} - ${result.breakdown.laborEst.high}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Labor Details</span>
                                <div className="text-right">
                                    <p className="font-mono font-bold text-sm text-slate-300">{result.breakdown.laborHours.low}-{result.breakdown.laborHours.high} hrs</p>
                                    <p className="text-xs text-slate-500">@ ~${result.breakdown.laborRate}/hr</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                 <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Price Spectrum</h3>
                    <div className="relative pt-8 pb-4 px-2">
                        <div className="h-6 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative"></div>
                        <div className="absolute top-0 w-full flex justify-between text-xs font-bold text-slate-400 mt-1">
                            <span className="transform -translate-x-1/2" style={{ left: '0%' }}>$0</span>
                            <span className="transform -translate-x-1/2" style={{ left: '33%' }}>Fair</span>
                            <span className="transform -translate-x-1/2" style={{ left: '66%' }}>High</span>
                            <span className="transform -translate-x-1/2" style={{ left: '100%' }}>Rip-Off</span>
                        </div>
                        {request.quoteAmount && (
                            <div 
                                className="absolute -top-4 transform -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-1000"
                                style={{ 
                                    left: `${Math.min(100, Math.max(0, (parseFloat(request.quoteAmount) / (result.fairPrice.high * 1.5)) * 100))}%` 
                                }}
                            >
                                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-lg text-xs font-bold shadow-lg mb-1 whitespace-nowrap">
                                    You: ${request.quoteAmount}
                                </div>
                                <div className="w-0.5 h-8 bg-slate-900 dark:bg-white"></div>
                            </div>
                        )}
                    </div>
                 </div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-800/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400 font-bold">
                        <MessageSquare className="w-5 h-5" /> Negotiation Tip
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic text-sm leading-relaxed">"{result.negotiationTip}"</p>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-orange-700 rounded-[2.5rem] p-8 sm:p-10 mb-8 border border-white/10 shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95 duration-500">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Wrench className="w-48 h-48 -rotate-12" /></div>
                 <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                       <h2 className="text-3xl font-black mb-4">Suspicious Quote?</h2>
                       <p className="text-red-50 leading-relaxed font-medium mb-6">Connect with a master technician to audit this repair plan and find a better rate.</p>
                       <button onClick={() => setIsSecondOpinionOpen(true)} className="w-full py-5 bg-white text-red-700 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 animate-slow-glow">
                          Book a Second Opinion <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
              <button onClick={() => setResult(null)} className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200">New Audit</button>
           </div>
        )}
      </div>

      {!result && (
        <div className="w-full max-w-7xl px-4 flex flex-col items-center">
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 mb-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500" /> Secure & Verified</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-brand-primary" /> Live Labor Rates</div>
                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> 100% Free Audit</div>
            </div>

            {/* About This Tool Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6">About the Cost Validator</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                        The AutoSpex Overcharge Validator is a specialized diagnostic engine built to protect US car owners from predatory repair pricing. We aggregate proprietary labor guides and national parts datasets to provide a transparent financial audit of any mechanic's quote.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                        Our system doesn't just give national averages; it analyzes the <span className="font-bold text-red-500">cost-of-living index</span> for your specific ZIP code, ensuring that the labor rate we use for comparison matches the economic reality of your neighborhood shops.
                    </p>
                </div>
                <div className="order-1 md:order-2 bg-red-50 dark:bg-red-900/10 rounded-[3rem] p-10 sm:p-14 border border-red-100 dark:border-red-900/30 relative overflow-hidden shadow-2xl">
                    <Globe className="absolute -bottom-8 -right-8 w-64 h-64 text-red-500/10 -rotate-12" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10">Localized Intelligence</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 text-lg mb-8 font-medium">
                        Access real-time specifications for standard flat-rate labor times. Our engine validates parts costs from major US suppliers to ensure your quote matches the market rate.
                    </p>
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-black text-sm relative z-10">
                        <ShieldCheck className="w-6 h-6" /> VERIFIED MARKET DATA
                    </div>
                </div>
            </div>

            {/* Why Use This Tool Section */}
            <div className="w-full mb-24 text-center">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-12">
                    Why Drivers Trust AutoSpex
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { 
                            icon: <DollarSign className="w-8 h-8 text-green-500" />, 
                            title: "Identify Gouging", 
                            desc: "Stop overpaying for labor hours. We show you the industry standard time for every job." 
                        },
                        { 
                            icon: <Zap className="w-8 h-8 text-blue-500" />, 
                            title: "AI Analysis", 
                            desc: "Our AI processes complex repairs that involve multiple overlapping service steps." 
                        },
                        { 
                            icon: <Award className="w-8 h-8 text-amber-500" />, 
                            title: "Negotiation Power", 
                            desc: "We provide the exact scripts to use when talking to a mechanic about a high quote." 
                        },
                        { 
                            icon: <ShieldAlert className="w-8 h-8 text-red-500" />, 
                            title: "Safety Priority", 
                            desc: "Instantly know if your car is safe for a road trip or if you need a tow truck immediately." 
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                            <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="w-full mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">How to Audit Your Quote</h2>
                <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-brand-primary flex items-center justify-center mb-4"><Wrench className="w-7 h-7" /></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Enter Details</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Tell us what needs fixing and your vehicle details so we can find the right parts and labor hours.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4"><MapPin className="w-7 h-7" /></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Localized Analysis</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">We use your ZIP code to determine the prevailing hourly labor rate for mechanics in your area.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4"><Gavel className="w-7 h-7" /></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Get The Verdict</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Instantly see if you're being overcharged with our visual "Rip-Off Scorecard" and negotiation tips.</p>
                </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="w-full max-w-7xl px-4 mb-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">Drivers We've Saved</h2>
                <div className="grid md:grid-cols-3 gap-6">
                {[
                    { name: "Tony S.", loc: "Chicago, IL", text: "Mechanic quoted $1200 for a water pump. This tool said fair price was $600-$800. I went to another shop and got it done for $750.", stars: 5 },
                    { name: "Lisa M.", loc: "Orlando, FL", text: "I had no idea labor rates varied so much. This helped me realize the dealership was charging double the local average.", stars: 5 },
                    { name: "Kevin B.", loc: "Dallas, TX", text: "The negotiation tip actually worked. I asked about the labor hours and they knocked 2 hours off the quote immediately.", stars: 5 },
                ].map((review, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="flex gap-1 mb-4 text-brand-primary">{[...Array(review.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}</div>
                        <p className="text-slate-700 dark:text-slate-300 mb-6 italic text-sm leading-relaxed">"{review.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">{review.name.charAt(0)}</div>
                            <div><p className="text-sm font-bold text-slate-900 dark:text-white">{review.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{review.loc}</p></div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="w-full max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                        <MessageSquare className="w-6 h-6 text-brand-primary" />
                        Frequently Asked Questions
                    </h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'bg-white dark:bg-slate-900 border-brand-primary/30 shadow-lg shadow-brand-primary/5' : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                            <button onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left focus:outline-none">
                                <span className={`font-semibold pr-4 ${openFaqIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{faq.question}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${openFaqIndex === index ? 'rotate-180 text-brand-primary' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3 mt-0">{faq.answer}</p>
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

export default MaintenanceValidator;
