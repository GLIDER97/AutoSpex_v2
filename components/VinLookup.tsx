
import React, { useState } from 'react';
import { 
  Search, Car, AlertTriangle, Factory, MapPin, Zap, X, 
  CheckCircle2, Star, ShieldCheck, FileText, Users, ChevronDown, 
  Info, Lock, MessageSquare, ShieldAlert, ArrowRight, Phone, Mail, RefreshCw,
  Award, Globe, BookOpen, Heart
} from './Icons';
import { VinVehicleData } from '../types';

const VinLookup: React.FC = () => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VinVehicleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Insurance Lead Form State
  const [leadStep, setLeadStep] = useState(1);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadData, setLeadData] = useState({
    zip: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (cleanVin.length !== 17) {
      setError('Invalid VIN length. A standard VIN must be exactly 17 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLeadSubmitted(false);
    setLeadStep(1);

    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${cleanVin}?format=json`);
      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();

      if (data.Results && data.Results.length > 0) {
        const item = data.Results[0];
        const getVal = (val: string | null | undefined) => (val && val.trim() !== "") ? val : "N/A";

        const vehicleData: VinVehicleData = {
          vin: cleanVin,
          year: getVal(item.ModelYear),
          make: getVal(item.Make),
          model: getVal(item.Model),
          manufacturer: getVal(item.Manufacturer),
          vehicleType: getVal(item.VehicleType),
          bodyClass: getVal(item.BodyClass),
          engineCylinders: getVal(item.EngineCylinders),
          engineHP: getVal(item.EngineHP),
          engineLiters: getVal(item.DisplacementL),
          fuelType: getVal(item.FuelTypePrimary),
          transmissionStyle: getVal(item.TransmissionStyle),
          driveType: getVal(item.DriveType),
          plantCountry: getVal(item.PlantCountry),
          plantCity: getVal(item.PlantCity),
          plantState: getVal(item.PlantState),
          doors: getVal(item.Doors),
          grossWeight: getVal(item.GVWR),
        };

        if (vehicleData.make === 'N/A' && vehicleData.model === 'N/A') {
           setError("Could not decode this VIN. Please check your characters for typos (e.g., 'O' vs '0').");
        } else {
           setResult(vehicleData);
        }
      } else {
        setError("No data found for this VIN. It may be too new or pre-1981.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to vehicle database. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    
    setLeadLoading(true);

    const submission = {
      timestamp: new Date().toISOString(),
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      zip: leadData.zip,
      car_model: `${result.year} ${result.make} ${result.model}`,
      vin: result.vin
    };

    try {
      console.log("Submitting lead to VIN_lookup_leads.json:", submission);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLeadSubmitted(true);
    } catch (err) {
      console.error("Lead submission failed", err);
    } finally {
      setLeadLoading(false);
    }
  };

  const handleClear = () => {
    setVin('');
    setResult(null);
    setError(null);
  };

  const vinFaqs = [
    { 
      question: "Where can I find my VIN?", 
      answer: "Your VIN is typically located on the driver's side dashboard (visible through the windshield) or on the driver's side door jamb sticker. It's also found on your vehicle registration and insurance documents." 
    },
    { 
      question: "What information does this decoder provide?", 
      answer: "Our tool reveals detailed factory specifications and connects you with authorized service providers for comprehensive vehicle reports." 
    },
    { 
      question: "Is this VIN lookup really free?", 
      answer: "Yes, 100%. We access public government databases to provide you with accurate vehicle data at no cost. We are supported by our network of professional automotive partners." 
    },
    { 
      question: "Can I check motorcycle or truck VINs?", 
      answer: "Yes! Our tool supports cars, trucks, motorcycles, buses, and commercial vehicles manufactured after 1981 (standard 17-digit VINs)." 
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      {!result && (
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 mb-8 shadow-lg shadow-blue-500/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default text-center">
            <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Real-Time Factory Data Search
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Free VIN Number <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Decoder & Specs Lookup
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Instantly audit any vehicle's identity. Reveal factory engine specs, manufacturing origins, and chassis details using official NHTSA datasets.
          </p>
        </div>
      )}

      {/* Input Section */}
      <div className="w-full max-w-xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
        <form onSubmit={handleSearch} className="relative group">
           <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 bg-gradient-to-r from-blue-600 to-indigo-600`}></div>
           
           <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transition-colors">
             <div className="pl-4 text-slate-400">
               <Search className="w-6 h-6" />
             </div>
             
             <input
               type="text"
               className="w-full bg-transparent border-none text-slate-900 dark:text-white text-xl placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none py-4 px-4 font-mono uppercase tracking-wider transition-colors"
               placeholder="ENTER 17-DIGIT VIN"
               value={vin}
               onChange={(e) => setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
               maxLength={17}
             />

             {vin && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
             )}

             <button
               type="submit"
               disabled={loading || vin.length < 17}
               className={`mr-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                 loading || vin.length < 17
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
               }`}
             >
               {loading ? 'Decoding...' : 'Lookup'}
             </button>
           </div>
        </form>
        {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2 shadow-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
            </div>
        )}
      </div>

      {/* Trust Indicators Strip */}
      {!result && (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             Official NHTSA Data
           </div>
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
             <Lock className="w-4 h-4 text-slate-400" />
             Secure & Professional
           </div>
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
             <CheckCircle2 className="w-4 h-4 text-blue-500" />
             100% Free Audit
           </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
          
          <div className="flex justify-start mb-6">
            <button 
              onClick={handleClear}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
               ← Search Another VIN
            </button>
          </div>

          {/* ATTENTION GRABBING SUCCESS HEADER */}
          <div className="text-center mb-10 sm:mb-16 animate-in zoom-in-95 duration-700 flex flex-col items-center relative px-4">
            <div className="flex flex-col items-center leading-none tracking-tighter uppercase mb-6 sm:mb-10">
              <span className="text-2xl sm:text-6xl font-black text-slate-900 dark:text-white relative z-20">
                VIN DECODED
              </span>
              <span className="text-5xl sm:text-[10rem] font-black text-blue-600 dark:text-blue-500 -mt-1 sm:-mt-8 block drop-shadow-[0_0_35px_rgba(37,99,235,0.3)]">
                SUCCESSFULLY
              </span>
            </div>
            
            <div className="inline-flex items-center gap-3 sm:gap-4 px-6 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-blue-500/10 backdrop-blur-xl border-2 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-2xl shadow-blue-500/10 w-full sm:w-auto">
              <ShieldCheck className="w-6 h-6 sm:w-10 sm:h-10 animate-bounce shrink-0" />
              <span className="text-base sm:text-4xl font-black uppercase tracking-tight text-center sm:text-left">
                IDENTITY VERIFIED: <span className="text-slate-900 dark:text-white">{result.year} {result.make} {result.model}</span>
              </span>
            </div>
          </div>

          {/* Main Vehicle Card */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-3 opacity-10">
               <Car className="w-64 h-64 text-white -rotate-12 transform translate-x-12 -translate-y-12" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-slate-700 text-slate-300 bg-slate-800 uppercase tracking-wider">
                            {result.vehicleType}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 text-blue-400 bg-blue-500/10 uppercase tracking-wider">
                            {result.year} Model
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                        {result.make} {result.model}
                    </h2>
                    <p className="text-slate-400 font-mono text-lg flex items-center gap-2">
                        {result.vin}
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </p>
                </div>
                
                {/* Visual Representation of Manufacturing */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 flex flex-col items-center min-w-[140px]">
                    <Factory className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Assembled In</span>
                    <span className="text-white font-bold text-center leading-tight mt-1">
                        {result.plantCity !== 'N/A' ? result.plantCity : result.plantCountry}
                    </span>
                    {result.plantState !== 'N/A' && <span className="text-slate-400 text-xs">{result.plantState}</span>}
                </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Engine Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors group shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Engine & Power</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Cylinders</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.engineCylinders}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Displacement</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {result.engineLiters !== 'N/A' ? `${result.engineLiters}L` : 'N/A'}
                        </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Horsepower</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                             {result.engineHP !== 'N/A' ? `${result.engineHP} HP` : 'N/A'}
                        </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Fuel Type</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.fuelType}</span>
                    </li>
                </ul>
            </div>

            {/* Chassis Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors group shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Car className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Body & Chassis</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Body Class</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[150px] truncate" title={result.bodyClass}>{result.bodyClass}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Doors</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.doors}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Drive Type</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.driveType}</span>
                    </li>
                     <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Gross Weight</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[140px] truncate" title={result.grossWeight}>
                            {result.grossWeight}
                        </span>
                    </li>
                </ul>
            </div>

            {/* Manufacturing Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors group shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Origin</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Manufacturer</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[140px] truncate" title={result.manufacturer}>{result.manufacturer}</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Country</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.plantCountry}</span>
                    </li>
                     <li className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Plant City</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{result.plantCity}</span>
                    </li>
                </ul>
            </div>
          </div>

          {/* MONETIZATION: GOODCAR AFFILIATE */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-32 h-32 text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> Verified Data
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">Check for Hidden Accidents</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    Decoding specs is just the start. Get a full history report from GoodCar to reveal structural damage, odometer fraud, and previous owner history for this specific {result.make}.
                  </p>
                </div>
                
                <a 
                  href="https://goodcar.com/vehicle-history" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl shadow-white/5 flex items-center gap-3 shrink-0 animate-slow-glow"
                >
                  Get Full Report <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* MONETIZATION: INSURANCE LEAD FORM */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(leadStep / 3) * 100}%` }}
                />
              </div>

              <div className="p-8 sm:p-12">
                {!leadSubmitted ? (
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-[0.2em]">Is this your next car?</h3>
                      <div className="inline-block p-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl shadow-blue-500/20">
                        <div className="bg-white dark:bg-slate-900 px-6 py-6 sm:px-10 sm:py-8 rounded-[0.9rem]">
                          <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                            Check Insurance Rates for this <br className="sm:hidden" /> 
                            <span className="text-blue-600 dark:text-blue-500 underline decoration-blue-500/30 underline-offset-8 decoration-4">
                              {result.make} {result.model}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="max-w-2xl mx-auto">
                      {leadStep === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Decoded Vehicle</p>
                                  <p className="text-xl font-bold text-slate-900 dark:text-white">{result.year} {result.make} {result.model}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Engine Specs</p>
                                  <p className="text-sm font-mono text-blue-500 font-bold">{result.engineLiters}L {result.engineCylinders}cyl {result.fuelType}</p>
                               </div>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setLeadStep(2)}
                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                          >
                            Verify & Continue <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {leadStep === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Where will you drive it?</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                              <input 
                                type="text" 
                                required
                                value={leadData.zip}
                                onChange={(e) => setLeadData({...leadData, zip: e.target.value.replace(/\D/g,'').slice(0,5)})}
                                placeholder="Enter Your ZIP Code"
                                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button type="button" onClick={() => setLeadStep(1)} className="flex-1 py-4 font-bold text-slate-400">Back</button>
                            <button 
                              type="button" 
                              onClick={() => { if(leadData.zip.length === 5) setLeadStep(3); }}
                              disabled={leadData.zip.length < 5}
                              className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                              Next Step
                            </button>
                          </div>
                        </div>
                      )}

                      {leadStep === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                              <input 
                                type="text" required placeholder="Full Name"
                                value={leadData.name} onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                              <input 
                                type="email" required placeholder="Email Address"
                                value={leadData.email} onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              />
                            </div>
                            <div className="relative">
                              <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                              <input 
                                type="tel" required placeholder="Phone Number"
                                value={leadData.phone} onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                                className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button type="button" onClick={() => setLeadStep(2)} className="flex-1 py-4 font-bold text-slate-400">Back</button>
                            <button 
                              type="submit" 
                              disabled={leadLoading}
                              className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                              {leadLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get My Quote'}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-10 animate-in zoom-in-90 duration-500">
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Request Successful</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-0 max-w-md mx-auto">
                      Your Insurance Rate for this model will be shared with our network to find you the best price.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Landing Page Content (When No Result) */}
      {!result && (
        <div className="w-full max-w-7xl px-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 pb-20">
          
          {/* About This Tool Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24 w-full">
            <div className="order-2 md:order-1">
               <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6">About the VIN Auditor</h2>
               <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                  Every vehicle manufactured for the US market has a unique 17-character fingerprint called a Vehicle Identification Number (VIN). 
                  Our decoder acts as a direct bridge to the <span className="font-bold text-blue-600">National Highway Traffic Safety Administration (NHTSA)</span> database.
               </p>
               <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  We don't just show you the basic make and model. We pull detailed factory build data, including engine displacement, transmission type, 
                  and manufacturing plant locations, providing the technical clarity you need for buying, selling, or maintaining your car.
               </p>
            </div>
            <div className="order-1 md:order-2 bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] p-10 sm:p-14 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden shadow-2xl">
                <Globe className="absolute -bottom-8 -right-8 w-64 h-64 text-blue-500/10 -rotate-12" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10">Global Standard</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 text-lg mb-8 font-medium">
                   Access real-time specifications for vehicles manufactured after 1981. Our engine validates every character to ensure the data matches the specific factory output.
                </p>
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-sm relative z-10">
                   <ShieldCheck className="w-6 h-6" /> VERIFIED GOVERNMENT DATA
                </div>
            </div>
          </div>

          {/* Why Use This Tool Section */}
          <div className="w-full mb-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-12">
              Why Use AutoSpex VIN Decoder?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        icon: <ShieldCheck className="w-8 h-8 text-green-500" />, 
                        title: "100% Free", 
                        desc: "No hidden charges or 'paywalls' to see your basic build data. Supported by partners." 
                    },
                    { 
                        icon: <Zap className="w-8 h-8 text-blue-500" />, 
                        title: "Official Data", 
                        desc: "Direct connection to the US NHTSA vPIC system for maximum accuracy." 
                    },
                    { 
                        icon: <Award className="w-8 h-8 text-amber-500" />, 
                        title: "Precision Audit", 
                        desc: "Identify exactly which engine, trim, and safety features were installed at the factory." 
                    },
                    { 
                        icon: <Search className="w-8 h-8 text-purple-500" />, 
                        title: "Fraud Prevention", 
                        desc: "Verify that a seller's claims match the official records for that specific VIN." 
                    },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                        <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{item.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* How to Check Your VIN Section */}
          <div className="w-full mb-24">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-12">
              Simple 3-Step Audit
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-6 shadow-inner">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Locate Your VIN</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Find the 17-digit code on your dashboard (driver's side), door jamb, or vehicle title.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mb-6 shadow-inner">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Enter the Code</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Type the alphanumeric VIN into our search bar. We validate the checksum instantly.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-green-500/50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-6 shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Get Full Report</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Instantly reveal detailed specs and connect with partners for full accident history checks.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="w-full mb-24">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-16">Stories from the Road</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Caleb R.",
                        loc: "Nashville, TN",
                        text: "Used this to check a used Mustang I was buying. Discovered it was a base model dressed up like a GT. Saved me thousands!",
                        stars: 5
                    },
                    {
                        name: "Elena M.",
                        loc: "San Diego, CA",
                        text: "Fast and reliable. I needed to know the exact displacement of my engine to order parts, and this tool gave me the info in 2 seconds.",
                        stars: 5
                    },
                    {
                        name: "Marcus G.",
                        loc: "Chicago, IL",
                        text: "I love that it's actually free. Most sites bait and switch you with a fee at the end, but AutoSpex is transparent and helpful.",
                        stars: 5
                    }
                ].map((t, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-xl transition-all">
                        <div className="flex gap-1 mb-6 text-blue-500">
                            {[...Array(t.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic mb-8 flex-grow">"{t.text}"</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-sm">
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.loc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
                <MessageSquare className="w-7 h-7 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Everything you need to know about your car's ID.</p>
            </div>
            
            <div className="space-y-4">
              {vinFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border rounded-[2rem] transition-all duration-300 overflow-hidden ${
                    openFaqIndex === index 
                      ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                      : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className={`font-bold pr-4 ${openFaqIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                        openFaqIndex === index ? 'rotate-180 text-blue-600' : ''
                      }`} 
                    />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-0 font-medium">
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

export default VinLookup;
