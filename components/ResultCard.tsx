
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Zap, Info, ShieldCheck, ShieldAlert, DollarSign, Wrench, ArrowRight } from './Icons';
import { OBDCodeData, SafetyStatus, DIYDifficulty } from '../types';
import ChatAssistant from './ChatAssistant';
import LeadForm from './LeadForm';
import AffiliateSection from './AffiliateSection';

interface ResultCardProps {
  data: OBDCodeData;
  onReset: () => void;
  onCodeClick: (code: string) => void;
  vehicleInfo?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset, onCodeClick, vehicleInfo }) => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const getSafetyColor = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.STOP: return 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case SafetyStatus.CAUTION: return 'text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
      case SafetyStatus.SAFE: return 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      default: return 'text-slate-500';
    }
  };

  const getDifficultyColor = (diff: DIYDifficulty) => {
    switch (diff) {
      case DIYDifficulty.EASY: return 'text-green-500 dark:text-green-400';
      case DIYDifficulty.MODERATE: return 'text-yellow-600 dark:text-yellow-400';
      case DIYDifficulty.HARD: return 'text-red-500 dark:text-red-400';
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      <LeadForm 
        isOpen={isLeadFormOpen} 
        onClose={() => setIsLeadFormOpen(false)} 
        errorCode={data.code}
        vehicleName={vehicleInfo}
      />
      
      {/* Top Action Bar */}
      <div className="flex items-center mb-8">
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md dark:shadow-black/40"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Scan
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
               <Zap className="w-64 h-64 text-white -rotate-12 transform translate-x-12 -translate-y-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${getSafetyColor(data.safetyStatus)}`}>
                  {data.safetyStatus === SafetyStatus.SAFE ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  {data.safetyStatus}
                </span>

                <span className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-700 text-slate-300 bg-slate-800">
                  {data.category}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter mb-2">
                {data.code}
              </h1>
              <h2 className="text-xl sm:text-2xl text-slate-200 font-semibold leading-relaxed mb-1">
                {data.title}
              </h2>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group/cost shadow-lg dark:shadow-none">
              <div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[13px] uppercase font-bold tracking-wider mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Est. Repair Cost
                </div>
                <div className="text-2xl font-mono text-slate-900 dark:text-white font-semibold mb-4">
                  {data.repairCostEstimate}
                </div>
              </div>
              
              {/* RELOCATED & ANIMATED: Primary Lead CTA */}
              <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-brand-primary text-slate-900 font-black text-xs hover:bg-orange-400 transition-all flex items-center justify-center gap-2 animate-slow-glow group"
              >
                Get The Exact Repair Quote <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[13px] uppercase font-bold tracking-wider mb-2">
                <Wrench className="w-4 h-4 text-brand-primary" />
                DIY Difficulty
              </div>
              <div className={`text-xl font-semibold ${getDifficultyColor(data.diyDifficulty)}`}>
                {data.diyDifficulty}
              </div>
            </div>
          </div>

          {/* Plain English Explanation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
             <h3 className="text-slate-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
               <Info className="w-5 h-5 text-blue-500" />
               Plain English Explanation
             </h3>
             <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base border-l-2 border-slate-200 dark:border-slate-700 pl-4">
               {data.plainEnglish}
             </p>
          </div>

           {/* Technical Details Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100 font-semibold">
                <AlertTriangle className="w-4 h-4 text-brand-primary" />
                <h3>Symptoms</h3>
              </div>
              <ul className="space-y-3">
                {data.symptoms.slice(0, 5).map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                <h3>Likely Causes</h3>
              </div>
              <ul className="space-y-3">
                {data.causes.slice(0, 5).map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 flex-shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar / Chat Column */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* What To Do Next Section */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

               <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                 What To Do Next?
                 <div className="h-px bg-slate-800 flex-grow ml-2"></div>
               </h3>
               
               <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20 text-base font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">1</div>
                       <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                    </div>
                    <div className="pb-3 pt-1">
                      <p className="text-white font-bold text-lg mb-2">Check Safety Status</p>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {data.safetyStatus === SafetyStatus.STOP 
                          ? <span className="text-red-400 font-bold">CRITICAL: Do not drive. Call a tow truck immediately.</span>
                          : "Verify if the car is safe to drive short distances or requires immediate attention."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 text-base font-bold">2</div>
                       <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                    </div>
                    <div className="pb-3 pt-1">
                      <p className="text-white font-bold text-lg mb-2">Get Repair Quote</p>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium mb-3">
                        Request a localized fair-price quote to ensure you don't get overcharged.
                      </p>
                      <button 
                        onClick={() => setIsLeadFormOpen(true)}
                        className="text-xs font-bold text-brand-primary underline underline-offset-4 hover:text-orange-400 transition-colors"
                      >
                        Start Quote Request →
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 text-base font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">3</div>
                    </div>
                    <div className="pt-1">
                      <p className="text-white font-bold text-lg mb-2">Ask AI Mechanic</p>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        Use the chat below to get a vehicle-specific diagnosis and step-by-step repair guide.
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            <ChatAssistant code={data.code} />
            
             {data.similarCodes && data.similarCodes.length > 0 && (
              <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-brand-primary rounded-full"></span>
                  Similar Codes
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {data.similarCodes.map(code => (
                    <button 
                      key={code}
                      onClick={() => onCodeClick(code)}
                      className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-primary/50 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer group w-full shadow-sm dark:shadow-none"
                    >
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors text-sm">{code}</span>
                    </button>
                  ))}
                </div>
              </div>
             )}
          </div>
        </div>
      </div>

      {/* Recommended Scanners Affiliate Section */}
      <AffiliateSection />
    </div>
  );
};

export default ResultCard;
