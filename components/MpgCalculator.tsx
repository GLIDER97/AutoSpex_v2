
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Calculator, 
  Fuel, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Gauge, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Car,
  Zap,
  Leaf,
  Wrench,
  Lock,
  Star,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  ShoppingCart,
  ShieldCheck
} from './Icons';
import MpgLeadForm from './MpgLeadForm';

interface MpgCalculatorProps {}

type Mode = 'budget' | 'trip' | 'analysis';

interface EpaData {
  city: number;
  hwy: number;
  combined: number;
  tips: string[];
}

const MPG_PRODUCTS = [
  {
    name: "Chevron Techron Concentrate Plus Fuel System Cleaner",
    img: "https://m.media-amazon.com/images/I/716nfT-StoL._SX569_.jpg",
    url: "https://www.amazon.com/s?k=Chevron+Techron+Fuel+System+Cleaner"
  },
  {
    name: "K&N Premium High-Flow Replacement Air Filter",
    img: "https://m.media-amazon.com/images/I/81u8OQIm0kL._SX569_.jpg",
    url: "https://www.amazon.com/s?k=KN+High+Flow+Air+Filter"
  },
  {
    name: "AstroAI Digital Tire Pressure Gauge 150 PSI",
    img: "https://m.media-amazon.com/images/I/61EZNZQXXfL._SL1500_.jpg",
    url: "https://www.amazon.com/s?k=AstroAI+Digital+Tire+Pressure+Gauge"
  }
];

const MpgCalculator: React.FC<MpgCalculatorProps> = () => {
  const [mode, setMode] = useState<Mode>('budget');
  
  // Shared State
  const [mpg, setMpg] = useState<number>(25);
  const [fuelPrice, setFuelPrice] = useState<number>(3.50);

  // Budget Mode State
  const [commuteDistance, setCommuteDistance] = useState<number>(30); // Round trip
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  // Trip Mode State
  const [tripDistance, setTripDistance] = useState<number>(400);
  const [passengers, setPassengers] = useState<number>(1);

  // Analysis Mode State
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [observedMpg, setObservedMpg] = useState<string>('');
  const [epaData, setEpaData] = useState<EpaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Monetization State
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // --- Calculations ---
  const costPerMile = fuelPrice / (mpg || 1);
  const gallonsPer100 = (100 / (mpg || 1)).toFixed(1);

  // Budget Calcs
  const dailyCost = costPerMile * commuteDistance;
  const monthlyCost = dailyCost * daysPerWeek * 4.33; // Avg weeks/month
  const yearlyCost = monthlyCost * 12;

  // Trip Calcs
  const tripTotalCost = costPerMile * tripDistance;
  const tripGallons = tripDistance / (mpg || 1);
  const costPerPerson = tripTotalCost / (passengers || 1);

  // --- AI Analysis Handler ---
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleYear || !vehicleMake || !vehicleModel) return;

    setLoading(true);
    setAnalysisError(null);
    setEpaData(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Get the official EPA fuel economy ratings for a ${vehicleYear} ${vehicleMake} ${vehicleModel}.
        Return a JSON object with:
        - city (number, mpg)
        - hwy (number, mpg)
        - combined (number, mpg)
        - tips (array of 3 strings, mechanical reasons why this specific car might get low mpg)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              city: { type: Type.NUMBER },
              hwy: { type: Type.NUMBER },
              combined: { type: Type.NUMBER },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        setEpaData(JSON.parse(text) as EpaData);
      }
    } catch (err) {
      console.error(err);
      setAnalysisError("Could not retrieve vehicle data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getEfficiencyScore = () => {
    if (!epaData || !observedMpg) return null;
    const obs = parseFloat(observedMpg);
    const diff = obs - epaData.combined;
    const pct = (diff / epaData.combined) * 100;
    
    if (pct > -10) return { status: 'Good', color: 'text-green-500', bg: 'bg-green-500' };
    if (pct > -20) return { status: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { status: 'Poor', color: 'text-red-500', bg: 'bg-red-500' };
  };

  const getCalculatorInputs = () => ({
    mode,
    mpg,
    fuelPrice,
    commuteDistance,
    daysPerWeek,
    tripDistance,
    passengers,
    vehicleYear,
    vehicleMake,
    vehicleModel,
    observedMpg
  });

  const mpgFaqs = [
    {
      question: "How do you calculate Cost Per Mile?",
      answer: "Cost Per Mile is calculated by dividing the price of gas per gallon by your vehicle's miles per gallon (MPG). For example, if gas is $3.50 and your car gets 25 MPG, your cost per mile is $3.50 / 25 = $0.14."
    },
    {
      question: "Where does the 'Efficiency Audit' data come from?",
      answer: "We use AI to cross-reference official US EPA fuel economy ratings for your specific make, model, and year. This provides a baseline to see if your car is performing as expected."
    },
    {
      question: "Why is my real MPG lower than the EPA rating?",
      answer: "Real-world MPG is often lower due to factors like driving style (aggressive acceleration), tire pressure, use of A/C, cargo weight, and vehicle age. A drop of 10-15% is common, but more than 20% may indicate a mechanical issue."
    },
    {
      question: "Is this tool free to use?",
      answer: "Yes, our MPG and Fuel Cost Calculator is 100% free to use. We generate revenue by connecting users with authorized fuel rewards partners."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <MpgLeadForm 
        isOpen={isLeadFormOpen} 
        onClose={() => setIsLeadFormOpen(false)} 
        calculatorInputs={getCalculatorInputs()}
      />

      {/* Header */}
      <div className="text-center mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-emerald-600 mb-8 shadow-lg shadow-emerald-500/10 cursor-default">
            <Fuel className="w-4 h-4" />
            Smart Fuel Intelligence
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          MPG Calculator <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
             & Cost Analyzer
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Calculate your true daily commute costs, plan road trip budgets, and audit your vehicle's efficiency against factory specs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-12 shadow-inner">
        {[
          { id: 'budget', label: 'Commute Budget', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'trip', label: 'Trip Planner', icon: <MapPin className="w-4 h-4" /> },
          { id: 'analysis', label: 'Efficiency Audit', icon: <Gauge className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as Mode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 mb-12">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          
          {mode === 'budget' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Commute Calculator</h2>
                  <p className="text-sm text-slate-500">How much does work actually cost you?</p>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Vehicle MPG</label>
                      <span className="font-mono font-bold text-emerald-600">{mpg} mpg</span>
                    </div>
                    <input 
                      type="range" min="5" max="100" step="1" 
                      value={mpg} onChange={(e) => setMpg(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Gas Price</label>
                      <span className="font-mono font-bold text-emerald-600">${fuelPrice.toFixed(2)}/gal</span>
                    </div>
                    <input 
                      type="range" min="1.00" max="7.00" step="0.05" 
                      value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Daily Miles (Round Trip)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={commuteDistance} 
                          onChange={(e) => setCommuteDistance(Number(e.target.value))}
                          className="w-full p-3 pl-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <span className="absolute right-4 top-3.5 text-sm text-slate-400">mi</span>
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Days Per Week</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setDaysPerWeek(Math.max(1, daysPerWeek - 1))}
                          className="w-10 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-emerald-500 font-bold text-xl transition-colors"
                        >-</button>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-11 flex items-center justify-center font-mono font-bold">
                          {daysPerWeek}
                        </div>
                        <button 
                          onClick={() => setDaysPerWeek(Math.min(7, daysPerWeek + 1))}
                          className="w-10 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-emerald-500 font-bold text-xl transition-colors"
                        >+</button>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {mode === 'trip' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trip Cost Planner</h2>
                  <p className="text-sm text-slate-500">Calculate fuel needs for your next adventure.</p>
                </div>
              </div>

               <div className="space-y-6">
                 <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-2 block">One-Way Distance</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={tripDistance} 
                        onChange={(e) => setTripDistance(Number(e.target.value))}
                        className="w-full p-4 pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <MapPin className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
                      <span className="absolute right-4 top-4.5 text-sm text-slate-400 font-bold">MILES</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-2 block">MPG</label>
                      <input 
                        type="number" value={mpg} onChange={(e) => setMpg(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Price/Gal</label>
                      <input 
                        type="number" step="0.01" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-4 block">Passengers (Split Cost)</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(num => (
                         <button
                           key={num}
                           onClick={() => setPassengers(num)}
                           className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                             passengers === num 
                               ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                               : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                           }`}
                         >
                           {num}
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {mode === 'analysis' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Efficiency Audit</h2>
                  <p className="text-sm text-slate-500">Compare your real-world MPG vs Factory EPA ratings.</p>
                </div>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                   <input 
                     type="text" placeholder="Year" required
                     value={vehicleYear} onChange={e => setVehicleYear(e.target.value)}
                     className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                   <input 
                     type="text" placeholder="Make" required
                     value={vehicleMake} onChange={e => setVehicleMake(e.target.value)}
                     className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                   <input 
                     type="text" placeholder="Model" required
                     value={vehicleModel} onChange={e => setVehicleModel(e.target.value)}
                     className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Observed MPG (Dashboard)</label>
                  <input 
                     type="number" placeholder="e.g. 18.5" step="0.1" required
                     value={observedMpg} onChange={e => setObservedMpg(e.target.value)}
                     className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Analyzing...' : 'Run Audit'} <Zap className="w-5 h-5" />
                </button>
              </form>

              {analysisError && (
                 <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {analysisError}
                 </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* Budget Results */}
           {mode === 'budget' && (
             <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white animate-in slide-in-from-right delay-100">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <DollarSign className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-8" />
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">True Cost Per Mile</h3>
                   <div className="text-6xl font-black tracking-tighter mb-8 text-emerald-400">
                     ${costPerMile.toFixed(2)}
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="text-slate-400 font-medium">Daily Cost</span>
                        <span className="text-2xl font-bold">${dailyCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="text-slate-400 font-medium">Monthly Fuel</span>
                        <span className="text-2xl font-bold">${monthlyCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Yearly Spend</span>
                        <span className="text-3xl font-bold text-emerald-400">${yearlyCost.toFixed(0)}</span>
                      </div>
                   </div>
                   
                   <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-start gap-3">
                         <TrendingUp className="w-5 h-5 text-emerald-400 mt-1" />
                         <p className="text-sm text-slate-300 leading-relaxed">
                            Improving your MPG by just <span className="text-white font-bold">5 MPG</span> would save you <span className="text-emerald-400 font-bold">${((yearlyCost) - ((monthlyCost * 12 * (mpg / (mpg + 5))))).toFixed(0)}</span> per year.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Trip Results */}
           {mode === 'trip' && (
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white animate-in slide-in-from-right delay-100">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <MapPin className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-8" />
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-blue-200 font-bold text-xs uppercase tracking-widest mb-1">Estimated Trip Cost</h3>
                   <div className="text-6xl font-black tracking-tighter mb-2">
                     ${tripTotalCost.toFixed(2)}
                   </div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-sm font-medium mb-8">
                      <Fuel className="w-4 h-4" /> {tripGallons.toFixed(1)} Gallons Required
                   </div>

                   {passengers > 1 && (
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                           <Users className="w-5 h-5 text-blue-200" />
                           <span className="font-bold text-lg">Split the Bill</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-blue-100">Cost per person</span>
                           <span className="text-4xl font-black text-white">${costPerPerson.toFixed(2)}</span>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           )}

           {/* Analysis Results */}
           {mode === 'analysis' && epaData && (
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-right delay-100">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-slate-900 dark:text-white">EPA Rating vs You</h3>
                   <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase text-slate-500">
                     Combined MPG
                   </span>
                </div>

                <div className="flex justify-center items-center gap-8 mb-8">
                   <div className="text-center">
                      <p className="text-sm text-slate-500 mb-1">Factory EPA</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{epaData.combined}</p>
                   </div>
                   <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
                   <div className="text-center">
                      <p className="text-sm text-slate-500 mb-1">Your Car</p>
                      <p className={`text-3xl font-black ${getEfficiencyScore()?.color}`}>
                         {observedMpg}
                      </p>
                   </div>
                </div>

                {/* Gauge Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-6 relative">
                   <div 
                      className="absolute top-0 bottom-0 left-0 bg-slate-300 dark:bg-slate-600 transition-all duration-1000"
                      style={{ width: '100%' }} // Background placeholder
                   ></div>
                   <div 
                      className={`absolute top-0 bottom-0 left-0 ${getEfficiencyScore()?.bg} transition-all duration-1000`}
                      style={{ width: `${Math.min(100, (parseFloat(observedMpg) / (epaData.combined * 1.5)) * 100)}%` }}
                   ></div>
                </div>

                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                   getEfficiencyScore()?.status === 'Good' 
                     ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                     : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                   {getEfficiencyScore()?.status === 'Good' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                   <span className="font-bold">Efficiency Status: {getEfficiencyScore()?.status}</span>
                </div>

                <div>
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                     <Wrench className="w-4 h-4 text-slate-400" /> Potential Fixes
                   </h4>
                   <ul className="space-y-2">
                      {epaData.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                           {tip}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
           )}

        </div>
      </div>

      {/* --- MONETIZATION: FUEL REWARDS & AFFILIATE --- */}
      <div className="w-full max-w-5xl space-y-12 mb-20 px-4">
          
          {/* Fuel Rewards CTA */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden text-white animate-in slide-in-from-bottom-4 duration-700">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Fuel className="w-64 h-64 -rotate-12 translate-x-24 -translate-y-24" />
             </div>
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white/90 mb-4">
                    <Zap className="w-3 h-3" /> Exclusive Offer
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">Earn Cash Back <br /> on Every Gallon.</h2>
                  <p className="text-emerald-50 leading-relaxed font-medium mb-8">
                    Your estimated monthly fuel spend is <strong>${monthlyCost.toFixed(2)}</strong>. Join our partner network and save up to 25¢ per gallon at thousands of local stations.
                  </p>
                  <button 
                    onClick={() => setIsLeadFormOpen(true)}
                    className="px-10 py-5 bg-white text-emerald-700 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20 animate-slow-glow"
                  >
                    Earn Cash Back on Fuel <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="hidden md:flex flex-col gap-4">
                  {[
                    "Instant savings at 30,000+ stations",
                    "Redeem cash via PayPal or Bank",
                    "Stack with your credit card rewards"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Amazon Affiliate Products */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">MPG-Boosting Products</h2>
                  <p className="text-slate-500">Mechanical upgrades and maintenance tools you can use today to increase efficiency.</p>
               </div>
               <div className="flex items-center gap-1 text-orange-400 bg-orange-400/5 px-4 py-2 rounded-full border border-orange-400/20 shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black uppercase tracking-widest">Efficiency Picks</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {MPG_PRODUCTS.map((product, idx) => (
                 <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="h-32 flex items-center justify-center mb-6 relative">
                       <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 rounded-2xl -z-0 opacity-40 group-hover:opacity-60 transition-opacity" />
                       <img 
                         src={product.img} 
                         alt={product.name} 
                         className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" 
                       />
                    </div>
                    <div className="flex-grow flex flex-col">
                       <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2 mb-6 leading-snug group-hover:text-emerald-500 transition-colors">
                         {product.name}
                       </h3>
                       <a 
                         href={product.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs hover:opacity-90 transition-all mt-auto"
                       >
                         Buy on Amazon <ShoppingCart className="w-4 h-4" />
                       </a>
                    </div>
                 </div>
               ))}
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-8 font-medium italic">
               *As an Amazon Associate, AutoSpex earns from qualifying purchases.
            </p>
          </div>
      </div>

      {/* Trust Indicators - Updated to remove "Private" */}
      <div className="flex flex-wrap justify-center gap-6 mb-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified EPA Data
         </div>
         <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" /> Secure Data Handling
         </div>
         <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" /> Free Service • Partner Supported
         </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-7xl px-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
         <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
            How It Works
         </h2>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-4">
                  <Calculator className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Select Mode</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Choose between Commute Budgeting, Trip Planning, or our AI-powered Efficiency Audit.
               </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Enter Details</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Input basic details like your MPG, gas price, and distance.
               </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. See True Cost</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Instantly reveal your cost per mile, monthly budget, or vehicle health status.
               </p>
            </div>
         </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
         <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
               <MessageSquare className="w-6 h-6 text-emerald-500" />
               Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Common questions about fuel costs and efficiency.</p>
         </div>
         
         <div className="space-y-4">
            {mpgFaqs.map((faq, index) => (
               <div 
                  key={index} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                     openFaqIndex === index 
                     ? 'bg-white dark:bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
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
                           openFaqIndex === index ? 'rotate-180 text-emerald-500' : ''
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

    </div>
  );
};

export default MpgCalculator;
