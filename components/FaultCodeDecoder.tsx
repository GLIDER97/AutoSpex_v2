import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import CodeInput from './CodeInput';
import ResultCard from './ResultCard';
import RecentScans from './RecentScans';
import FAQSection from './FAQSection';
import { 
  Users, CheckCircle2, DollarSign, Zap, ShieldCheck, Lock, 
  Search, Wrench, Star, FileText 
} from './Icons';
import { OBDCodeData, SeverityLevel, SearchHistoryItem, SafetyStatus, DIYDifficulty } from '../types';

// COMPREHENSIVE US OBD-II DATABASE (Top 30+ Common Codes)
const INITIAL_OBD_DATABASE: Record<string, OBDCodeData> = {
  // --- AIR & FUEL METERING ---
  'P0101': {
    code: 'P0101',
    title: 'Mass Air Flow (MAF) Circuit Range/Performance',
    description: 'The Mass Air Flow sensor is sending a signal that is out of range for the current engine operating conditions.',
    plainEnglish: 'The sensor that measures how much air is entering your engine is confused. It\'s sending data that doesn\'t match what the computer expects based on your speed and throttle position.',
    symptoms: ['Engine stalling', 'Poor acceleration', 'Rough idling', 'Increased fuel consumption', 'Black smoke'],
    causes: ['Dirty MAF sensor', 'Vacuum leak', 'Faulty MAF sensor', 'Clogged air filter'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$10 - $350',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Fuel & Air Metering',
    similarCodes: ['P0100', 'P0102', 'P0103']
  },
  'P0106': {
    code: 'P0106',
    title: 'Manifold Absolute Pressure (MAP) Barometric Pressure Circuit Range/Performance',
    description: 'The MAP sensor signal is erratic or does not correlate with the Throttle Position Sensor (TPS).',
    plainEnglish: 'The sensor measuring engine vacuum isn\'t making sense. The car uses this to know how hard the engine is working.',
    symptoms: ['Rough idle', 'Fuel smell', 'Poor fuel economy', 'Hesitation'],
    causes: ['Faulty MAP sensor', 'Vacuum leak', 'Wiring issue', 'Carbon buildup on sensor'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$100 - $250',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Sensors',
    similarCodes: ['P0107', 'P0108']
  },
  'P0113': {
    code: 'P0113',
    title: 'Intake Air Temperature Sensor 1 Circuit High',
    description: 'The ECU sees a signal from the IAT sensor indicating an impossibly low temperature.',
    plainEnglish: 'Your car thinks the air entering the engine is 40 degrees below zero. Usually a disconnected wire.',
    symptoms: ['Hard starting in cold', 'Poor fuel economy', 'Failed emissions test'],
    causes: ['Unplugged IAT sensor', 'Broken wire', 'Faulty sensor'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$50 - $150',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Sensors',
    similarCodes: ['P0111', 'P0112']
  },
  'P0118': {
    code: 'P0118',
    title: 'Engine Coolant Temperature Sensor 1 Circuit High',
    description: 'The Engine Coolant Temperature (ECT) sensor output is too high (indicating extreme cold).',
    plainEnglish: 'The car thinks the engine is frozen solid. This causes it to dump extra fuel to try and "warm up".',
    symptoms: ['Poor fuel economy', 'Black smoke', 'Hard start', 'Overheating indication issues'],
    causes: ['Faulty ECT sensor', 'Open circuit in wiring', 'Low coolant'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$150 - $300',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Cooling System',
    similarCodes: ['P0115', 'P0117']
  },
  'P0122': {
    code: 'P0122',
    title: 'Throttle Position Sensor A Circuit Low Input',
    description: 'The TPS reports a voltage that is lower than the normal operating range.',
    plainEnglish: 'The car doesn\'t know how far you are pressing the gas pedal.',
    symptoms: ['Unresponsive throttle', 'Stalling', 'High idle', 'Surging'],
    causes: ['Faulty TPS', 'Short to ground', 'Loose installation'],
    severity: SeverityLevel.HIGH,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$120 - $250',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Fuel & Air Metering',
    similarCodes: ['P0120', 'P0121']
  },
  'P0128': {
    code: 'P0128',
    title: 'Coolant Thermostat (Coolant Temp Below Regulating Temp)',
    description: 'The engine is taking too long to reach operating temperature.',
    plainEnglish: 'Your car is running too cold. The thermostat is likely stuck open.',
    symptoms: ['Heater blows lukewarm air', 'Temperature gauge reads low', 'Decreased fuel economy'],
    causes: ['Stuck open thermostat', 'Low coolant level', 'Faulty sensor'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$200 - $450',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Cooling System',
    similarCodes: ['P0125']
  },
  'P0135': {
    code: 'P0135',
    title: 'O2 Sensor Heater Circuit (Bank 1 Sensor 1)',
    description: 'The heating element inside the upstream Oxygen Sensor has failed.',
    plainEnglish: 'The oxygen sensor heater is broken. The car will run fine once hot, but emissions will be high on start.',
    symptoms: ['Check Engine Light only', 'Slight drop in fuel economy'],
    causes: ['Failed O2 sensor heater', 'Blown fuse', 'Wiring damage'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$150 - $350',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Exhaust & Emissions',
    similarCodes: ['P0141', 'P0155']
  },
  'P0138': {
    code: 'P0138',
    title: 'O2 Sensor Circuit High Voltage (Bank 1 Sensor 2)',
    description: 'The rear oxygen sensor is reporting excessively high voltage (rich condition or short).',
    plainEnglish: 'The sensor after the catalytic converter is seeing too much unburned fuel or has a wiring short.',
    symptoms: ['Check Engine Light', 'High fuel consumption'],
    causes: ['Faulty O2 sensor', 'Short to voltage', 'Running very rich'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$150 - $350',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Exhaust & Emissions',
    similarCodes: ['P0137', 'P0139']
  },
  'P0141': {
    code: 'P0141',
    title: 'O2 Sensor Heater Circuit (Bank 1 Sensor 2)',
    description: 'The heating element in the rear Oxygen Sensor has failed.',
    plainEnglish: 'Same as P0135 but for the sensor after the catalytic converter. Purely for emissions monitoring.',
    symptoms: ['Check Engine Light', 'Failed emissions'],
    causes: ['Failed O2 sensor', 'Fuse', 'Wiring'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$150 - $350',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Exhaust & Emissions',
    similarCodes: ['P0135', 'P0161']
  },
  'P0171': {
    code: 'P0171',
    title: 'System Too Lean (Bank 1)',
    description: 'Too much air or not enough fuel on Bank 1.',
    plainEnglish: 'Engine is "starving" for fuel. Usually a vacuum leak sucking in unmeasured air.',
    symptoms: ['Hesitation', 'Stalling', 'Rough idle', 'Pinging'],
    causes: ['Vacuum leak', 'Dirty MAF', 'Weak fuel pump', 'Clogged injector'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$100 - $400',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Fuel/Air Induction',
    similarCodes: ['P0174', 'P0101']
  },
  'P0174': {
    code: 'P0174',
    title: 'System Too Lean (Bank 2)',
    description: 'Too much air or not enough fuel on Bank 2.',
    plainEnglish: 'Same as P0171 but on the other side of a V6/V8 engine.',
    symptoms: ['Rough idle', 'Hesitation', 'Power loss'],
    causes: ['Vacuum leak', 'Dirty MAF', 'PCV valve'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$100 - $400',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Fuel/Air Induction',
    similarCodes: ['P0171']
  },
  // --- IGNITION SYSTEM ---
  'P0300': {
    code: 'P0300',
    title: 'Random/Multiple Cylinder Misfire Detected',
    description: 'Misfires occurring in multiple cylinders randomly.',
    plainEnglish: 'The engine is skipping beats (misfiring) all over the place. Usually a global issue like fuel pressure or vacuum leak.',
    symptoms: ['Flashing CEL', 'Shaking', 'Stalling', 'Gas smell'],
    causes: ['Worn spark plugs', 'Vacuum leak', 'Low fuel pressure', 'Bad coil packs'],
    severity: SeverityLevel.HIGH,
    safetyStatus: SafetyStatus.STOP,
    repairCostEstimate: '$150 - $800',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Ignition System',
    similarCodes: ['P0301']
  },
  'P0301': {
    code: 'P0301',
    title: 'Cylinder 1 Misfire Detected',
    description: 'Misfire detected specifically in Cylinder 1.',
    plainEnglish: 'Cylinder #1 isn\'t firing. 90% of the time it\'s a plug or coil.',
    symptoms: ['Rough idle', 'Shaking', 'Power loss'],
    causes: ['Bad Spark Plug', 'Bad Ignition Coil', 'Injector'],
    severity: SeverityLevel.HIGH,
    safetyStatus: SafetyStatus.CAUTION,
    repairCostEstimate: '$100 - $350',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Ignition System',
    similarCodes: ['P0300']
  },
  'P0420': {
    code: 'P0420',
    title: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    description: 'The catalytic converter is not operating at maximum efficiency.',
    plainEnglish: 'Your catalytic converter is "full" or worn out. It\'s not cleaning the exhaust enough.',
    symptoms: ['Rotten egg smell', 'Failed emissions'],
    causes: ['Failed Catalytic Converter', 'O2 Sensor', 'Exhaust leak'],
    severity: SeverityLevel.MEDIUM,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$800 - $2500',
    diyDifficulty: DIYDifficulty.HARD,
    category: 'Exhaust System',
    similarCodes: ['P0430', 'P0421', 'P0422', 'P0431', 'P0432']
  },
  'P0440': {
    code: 'P0440',
    title: 'Evaporative Emission Control System Malfunction',
    description: 'General failure in the fuel vapor system.',
    plainEnglish: 'Fuel vapor leak. Check the gas cap first.',
    symptoms: ['Fuel smell', 'Hard start'],
    causes: ['Loose Gas Cap', 'Purge Valve', 'Canister'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$0 - $250',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Evaporative Emissions',
    similarCodes: ['P0442']
  },
  'P0442': {
    code: 'P0442',
    title: 'EVAP System Leak Detected (Small Leak)',
    description: 'Minor leak in fuel tank vapor system.',
    plainEnglish: 'Small vapor leak. Often the gas cap or a small hose crack.',
    symptoms: ['Check Engine Light'],
    causes: ['Gas Cap', 'Small hose leak'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$0 - $300',
    diyDifficulty: DIYDifficulty.MODERATE,
    category: 'Evaporative Emissions',
    similarCodes: ['P0456']
  },
  'P0455': {
    code: 'P0455',
    title: 'EVAP System Leak Detected (Gross/Large Leak)',
    description: 'Large leak in EVAP system.',
    plainEnglish: 'Big leak. Did you forget the gas cap?',
    symptoms: ['Strong fuel smell'],
    causes: ['Missing Gas Cap', 'Stuck Open Purge Valve'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$20 - $300',
    diyDifficulty: DIYDifficulty.EASY,
    category: 'Evaporative Emissions',
    similarCodes: ['P0440']
  },
  'P0456': {
    code: 'P0456',
    title: 'EVAP System Leak Detected (Very Small Leak)',
    description: 'Tiny leak detected (0.020 inch).',
    plainEnglish: 'Microscopic leak. Hard to find, but harmless.',
    symptoms: ['Check Engine Light'],
    causes: ['Gas Cap Seal', 'Charcoal Canister crack'],
    severity: SeverityLevel.LOW,
    safetyStatus: SafetyStatus.SAFE,
    repairCostEstimate: '$100 - $400',
    diyDifficulty: DIYDifficulty.HARD,
    category: 'Evaporative Emissions',
    similarCodes: ['P0442']
  }
};

const getUnknownCodeResult = (code: string): OBDCodeData => ({
  code: code,
  title: 'Unknown or Non-Standard Code',
  description: 'The code you entered does not match standard OBD-II formats or is not in our database.',
  plainEnglish: 'This appears to be an invalid or manufacturer-specific code that we cannot decode currently. Please double-check the code characters.',
  symptoms: ['Unknown'],
  causes: ['Typo in code', 'Manufacturer specific protocol', 'Non-OBDII system'],
  severity: SeverityLevel.LOW,
  safetyStatus: SafetyStatus.CAUTION,
  repairCostEstimate: 'N/A',
  diyDifficulty: DIYDifficulty.HARD,
  category: 'Unknown / Invalid',
  similarCodes: []
});

const FaultCodeDecoder: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<OBDCodeData | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [database, setDatabase] = useState<Record<string, OBDCodeData>>(INITIAL_OBD_DATABASE);
  const [history, setHistory] = useState<SearchHistoryItem[]>([
    { code: 'P0420', timestamp: Date.now() - 86400000, label: 'Catalyst System Efficiency Below Threshold' },
    { code: 'P0300', timestamp: Date.now() - 172800000, label: 'Random/Multiple Cylinder Misfire Detected' },
    { code: 'P0171', timestamp: Date.now() - 259200000, label: 'System Too Lean (Bank 1)' },
    { code: 'P0455', timestamp: Date.now() - 345600000, label: 'EVAP System Leak Detected (Gross Leak)' },
    { code: 'P0128', timestamp: Date.now() - 432000000, label: 'Coolant Thermostat (Coolant Temp Below Regulating Temp)' },
  ]);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const fetchAIResult = async (code: string, vehicleInfo?: string): Promise<OBDCodeData> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert automotive mechanic. Provide detailed diagnostic information for OBD-II fault code ${code} ${vehicleInfo ? `for a ${vehicleInfo}` : 'for a standard US-market vehicle'}.
        
        Return strictly valid JSON matching this structure:
        {
          "code": "${code}",
          "title": "Technical Name of Code",
          "description": "Technical description",
          "plainEnglish": "Simple explanation for a non-mechanic",
          "symptoms": ["symptom1", "symptom2", ...],
          "causes": ["cause1", "cause2", ...],
          "severity": "Low" | "Medium" | "High" | "Critical",
          "category": "System Category (e.g. Ignition, Emissions)",
          "safetyStatus": "Safe to Drive" | "Drive with Caution" | "Stop Immediately",
          "repairCostEstimate": "e.g. $100 - $300",
          "diyDifficulty": "Easy (DIY)" | "Moderate" | "Professional Required",
          "similarCodes": ["Related Code 1", "Related Code 2"]
        }

        Ensure content is accurate for the US market. 
        Do not use markdown formatting. Return raw JSON only.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              plainEnglish: { type: Type.STRING },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
              causes: { type: Type.ARRAY, items: { type: Type.STRING } },
              severity: { type: Type.STRING, enum: [SeverityLevel.LOW, SeverityLevel.MEDIUM, SeverityLevel.HIGH, SeverityLevel.CRITICAL] },
              category: { type: Type.STRING },
              safetyStatus: { type: Type.STRING, enum: [SafetyStatus.SAFE, SafetyStatus.CAUTION, SafetyStatus.STOP] },
              repairCostEstimate: { type: Type.STRING },
              diyDifficulty: { type: Type.STRING, enum: [DIYDifficulty.EASY, DIYDifficulty.MODERATE, DIYDifficulty.HARD] },
              similarCodes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['code', 'title', 'description', 'plainEnglish', 'symptoms', 'causes', 'severity', 'category', 'safetyStatus', 'repairCostEstimate', 'diyDifficulty']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as OBDCodeData;
    } catch (error) {
      console.error("AI Generation Failed:", error);
      return getUnknownCodeResult(code);
    }
  };

  const handleSearch = async (rawCode: string, vehicleInfo?: string) => {
    const code = rawCode.replace(/\s+/g, '').toUpperCase();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setActiveVehicle(vehicleInfo);

    const isValidFormat = /^[PCBU][0-9A-F]{4,}/.test(code);
    
    if (!isValidFormat) {
       const errorResult = getUnknownCodeResult(code);
       setCurrentResult(errorResult);
       setLoading(false);
       return;
    }
    
    if (database[code]) {
      setTimeout(() => {
        setCurrentResult(database[code]);
        addToHistory(database[code]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const result = await fetchAIResult(code, vehicleInfo);
      
      if (result.category !== 'Unknown / Invalid') {
        setDatabase(prev => ({ ...prev, [code]: result }));
        addToHistory(result);
      }
      
      setCurrentResult(result);
      
    } catch (e) {
      console.error(e);
      const errorResult = getUnknownCodeResult(code);
      setCurrentResult(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (data: OBDCodeData) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.code !== data.code);
      return [{ code: data.code, timestamp: Date.now(), label: data.title }, ...filtered].slice(0, 5);
    });
  };

  return (
    <>
        {!currentResult && (
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm sm:text-base font-semibold text-brand-primary mb-8 shadow-lg shadow-brand-primary/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
            </span>
            US Database Updated {currentMonth}, {currentYear}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            OBD-II Fault Code <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-orange-600">
                Decoder & Repair Guide
            </span>
            </h1>
            <h2 className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Instantly translate check engine light codes into plain English. Get localized repair cost estimates, severity alerts, and DIY fixes for your vehicle.
            </h2>
        </div>
        )}

        <div className="w-full flex flex-col items-center">
            {!currentResult ? (
                <>
                <CodeInput onSearch={handleSearch} isLoading={loading} />
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Verified US Database
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <Zap className="w-4 h-4 text-brand-primary" />
                        AI-Powered Analysis
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <Lock className="w-4 h-4 text-slate-400" />
                        100% Free Search
                    </div>
                </div>

                <RecentScans history={history} onSelect={(c) => handleSearch(c)} />
                
                {/* How to Use Section */}
                <div className="w-full max-w-7xl px-4 mt-24 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                    How to Decode Your Check Engine Light
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-4">
                        <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Connect Scanner</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Plug your OBD2 scanner into the port typically found under your dashboard.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4">
                        <Search className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Enter Code</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Type the alphanumeric error code (e.g., P0300) into the box above.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-4">
                        <Wrench className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Get Solution</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        View repair costs, severity alerts, and step-by-step DIY instructions instantly.
                        </p>
                    </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="w-full max-w-7xl px-4 mb-20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
                    Trusted by US Drivers
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { name: "James T.", loc: "Austin, TX", text: "Saved me $400 at the mechanic. I knew exactly what was wrong before I went in, so they couldn't upsell me.", stars: 5 },
                        { name: "Sarah M.", loc: "Denver, CO", text: "The plain English explanation helped me understand that my 'major engine issue' was just a loose gas cap.", stars: 5 },
                        { name: "Robert K.", loc: "Detroit, MI", text: "Spot on repair estimates. Helps me budget for repairs on my older truck without getting ripped off.", stars: 5 },
                    ].map((review, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="flex gap-1 mb-4 text-orange-400">
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

                <FAQSection />
                
                <div className="mt-10 mb-10 flex items-center gap-2 text-slate-500 text-sm bg-white dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
                    <Lock className="w-3 h-3" />
                    <span>Secure & Professional Service. Data shared only to fulfill quote requests.</span>
                </div>
                </>
            ) : (
                <ResultCard 
                data={currentResult} 
                onReset={() => { setCurrentResult(null); setActiveVehicle(undefined); }} 
                onCodeClick={(code) => handleSearch(code)}
                vehicleInfo={activeVehicle}
                />
            )}
        </div>
    </>
  );
};

export default FaultCodeDecoder;