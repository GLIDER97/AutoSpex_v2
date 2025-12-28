import React from 'react';
import { 
    Gauge, 
    Search, 
    ShieldCheck, 
    ArrowRight, 
    Zap, 
    CheckCircle2, 
    Users, 
    DollarSign,
    Car,
    BarChart,
    ShieldAlert,
    Lock,
    Calculator,
    AlertOctagon,
    TrendingDown,
    TrendingUp,
    PieChart,
    Tag,
    Palette,
    Star,
    Globe,
    Target,
    LayoutGrid,
    MessageSquare,
    Wrench
} from './Icons';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {

  const allTools = [
    {
      id: 'fault-code-decoder',
      title: 'Fault Code Decoder',
      desc: 'Translate P-codes into plain English. Get repair costs, severity alerts, and AI fixes.',
      icon: <Gauge className="w-7 h-7" />,
      colorClass: 'text-brand-primary',
      bgClass: 'bg-brand-primary/10',
      hoverClass: 'hover:border-brand-primary/50 hover:shadow-brand-primary/5',
      accentClass: 'bg-brand-primary',
      cta: 'Start Diagnosis'
    },
    {
      id: 'vin-lookup',
      title: 'VIN Lookup Tool',
      desc: 'Decode 17-digit VINs to reveal factory specs, engine data, and manufacturing plant info.',
      icon: <Search className="w-7 h-7" />,
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
      hoverClass: 'hover:border-blue-500/50 hover:shadow-blue-500/5',
      accentClass: 'bg-blue-500',
      cta: 'Check VIN'
    },
    {
      id: 'maintenance-validator',
      title: 'Repair Cost Validator',
      desc: "Audit mechanic quotes against regional labor rates and parts costs instantly.",
      icon: <AlertOctagon className="w-7 h-7" />,
      colorClass: 'text-red-500',
      bgClass: 'bg-red-500/10',
      hoverClass: 'hover:border-red-500/50 hover:shadow-red-500/5',
      accentClass: 'bg-red-500',
      cta: 'Audit Price'
    },
    {
      id: 'insurance-estimator',
      title: 'Insurance Estimator',
      desc: 'Private premiums estimator based on vehicle model, age, and regional risk factors.',
      icon: <ShieldCheck className="w-7 h-7" />,
      colorClass: 'text-indigo-500',
      bgClass: 'bg-indigo-500/10',
      hoverClass: 'hover:border-indigo-500/50 hover:shadow-indigo-500/5',
      accentClass: 'bg-indigo-500',
      cta: 'Get Estimate'
    },
    {
      id: 'mpg-calculator',
      title: 'MPG & Fuel Calculator',
      desc: "Calculate cost per mile and audit vehicle efficiency against factory EPA ratings.",
      icon: <Calculator className="w-7 h-7" />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      hoverClass: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
      accentClass: 'bg-emerald-500',
      cta: 'Calculate Cost'
    },
    {
      id: 'value-shock-calculator',
      title: 'Resale Value Shock',
      desc: "See true daily depreciation and projected 12-month value loss for your vehicle.",
      icon: <TrendingDown className="w-7 h-7" />,
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10',
      hoverClass: 'hover:border-purple-500/50 hover:shadow-purple-500/5',
      accentClass: 'bg-purple-500',
      cta: 'Check Value'
    },
    {
        id: 'affordability-predictor',
        title: 'Price & Affordability',
        desc: "Find market prices and verify if a car fits your specific monthly budget safely.",
        icon: <TrendingUp className="w-7 h-7" />,
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        hoverClass: 'hover:border-orange-500/50 hover:shadow-orange-500/5',
        accentClass: 'bg-orange-500',
        cta: 'Predict Price'
    },
    {
        id: 'ownership-calculator',
        title: 'Total Ownership Cost',
        desc: "Calculate the long-term impact of owning a vehicle, including hidden financing costs.",
        icon: <PieChart className="w-7 h-7" />,
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-600/10',
        hoverClass: 'hover:border-blue-600/50 hover:shadow-blue-600/5',
        accentClass: 'bg-blue-600',
        cta: 'Audit TCO'
    },
    {
        id: 'plate-generator',
        title: 'Vanity Plate Creator',
        desc: "Brainstorm personalized license plate ideas based on your hobbies and car vibe.",
        icon: <Tag className="w-7 h-7" />,
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-600/10',
        hoverClass: 'hover:border-amber-600/50 hover:shadow-amber-600/5',
        accentClass: 'bg-amber-600',
        cta: 'Create Plate'
    },
    {
        id: 'wrap-designer',
        title: 'AI Wrap Designer',
        desc: "Visualize custom vinyl wrap concepts using generative AI photorealistic modeling.",
        icon: <Palette className="w-7 h-7" />,
        colorClass: 'text-pink-500',
        bgClass: 'bg-pink-500/10',
        hoverClass: 'hover:border-pink-500/50 hover:shadow-pink-500/5',
        accentClass: 'bg-pink-500',
        cta: 'Design Wrap'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl px-4 mt-8 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
                1,248 active diagnostic sessions today
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                Smart Intelligence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-500 to-blue-600">
                    For Every Driver.
                </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xl sm:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto">
                Stop guessing. AutoSpex uses AI and official government databases to decode your vehicle data instantly. No signups. No hidden fees.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                <button 
                    onClick={() => onNavigate('ownership-calculator')}
                    className="px-8 py-4 rounded-2xl bg-brand-primary text-slate-900 font-bold text-lg hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    Cost of Ownership <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                     onClick={() => onNavigate('wrap-designer')}
                    className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
                >
                    Car Wrap Designer
                </button>
            </div>

            {/* TRUST BAR / LOGO STRIP */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 mb-6">Powered by Official Data Sources</p>
                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-40 dark:opacity-20 grayscale transition-opacity hover:opacity-100 dark:hover:opacity-60">
                    <div className="flex items-center gap-2 font-bold text-xl italic tracking-tighter">NHTSA</div>
                    <div className="flex items-center gap-2 font-black text-xl">EPA<span className="text-sm font-normal not-italic">.gov</span></div>
                    <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-widest">OBD-II</div>
                    <div className="flex items-center gap-2 font-bold text-xl">Google<span className="font-normal">AI</span></div>
                    <div className="flex items-center gap-2 font-serif font-bold text-xl">SAE International</div>
                </div>
            </div>
        </div>

        {/* HOW IT WORKS - GLOBAL PROCESS */}
        <div className="w-full bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/50 py-24 mb-24 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">The AutoSpex Method</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">How we turn cryptic automotive codes into actionable intelligence for you.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 -z-10 translate-y-[-2rem]"></div>
                    
                    {[
                        { 
                            step: "01", 
                            title: "Input Data", 
                            desc: "Enter your 17-digit VIN, any OBD-II fault code, or a repair quote you received.",
                            icon: <LayoutGrid className="w-6 h-6" />
                        },
                        { 
                            step: "02", 
                            title: "AI Analysis", 
                            desc: "Our engine cross-references millions of data points from US market tables and technical manuals.",
                            icon: <Zap className="w-6 h-6" />
                        },
                        { 
                            step: "03", 
                            title: "Expert Verdict", 
                            desc: "Get a plain-English report with localized costs, safety alerts, and DIY difficulty rankings.",
                            icon: <CheckCircle2 className="w-6 h-6" />
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-brand-primary transition-colors">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{item.step}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Tools Grid */}
        <div className="w-full max-w-7xl px-4 mb-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Vehicle Intelligence Toolkit</h2>
                    <p className="text-slate-500 mt-1">Specialized tools to help you talk to mechanics with confidence.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">10 Built-in Tools</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => onNavigate(tool.id)}
                        className={`group bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 ${tool.hoverClass} transition-all cursor-pointer shadow-sm hover:shadow-xl relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                            {/* Fix: Cast tool.icon to React.ReactElement<any> to resolve TypeScript error regarding className prop in cloneElement */}
                            {React.cloneElement(tool.icon as React.ReactElement<any>, { className: "w-32 h-32" })}
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${tool.bgClass} ${tool.colorClass} flex items-center justify-center mb-6 group-hover:${tool.accentClass} group-hover:text-white transition-colors`}>
                            {tool.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{tool.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
                            {tool.desc}
                        </p>
                        <span className={`inline-flex items-center gap-2 font-bold ${tool.colorClass} group-hover:translate-x-1 transition-transform text-sm`}>
                            {tool.cta} <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* HOMEPAGE TESTIMONIALS */}
        <div className="max-w-7xl px-4 mb-24 w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">Trusted by 50,000+ Drivers</h2>
                <p className="text-slate-500">Real stories from vehicle owners who saved money using AutoSpex.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { 
                        name: "James T.", 
                        text: "Saved me $400 at the mechanic. I knew exactly what was wrong before I went in, so they couldn't upsell me on unnecessary parts.", 
                        tool: "OBD Decoder",
                        stars: 5 
                    },
                    { 
                        name: "Sarah L.", 
                        text: "Finally, a site that doesn't demand my phone number! The insurance estimator gave me a realistic ballpark instantly.", 
                        tool: "Insurance Estimator",
                        stars: 5 
                    },
                    { 
                        name: "Mike D.", 
                        text: "I used the TCO tool to realize my 'cheap' SUV was actually costing me $300 more per month than a hybrid. Sold it the next week.", 
                        tool: "Cost of Ownership",
                        stars: 5 
                    }
                ].map((review, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex gap-1 mb-6 text-orange-400">
                            {[...Array(review.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic mb-8 leading-relaxed">"{review.text}"</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-sm">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{review.tool} User</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* PRIVACY MANIFESTO */}
        <div className="max-w-5xl mx-auto px-4 mb-24 w-full">
            <div className="bg-slate-950 rounded-[3rem] p-10 sm:p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-64 h-64 -rotate-12 translate-x-24 -translate-y-24" />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black mb-6">Our Data Integrity <br /> Guarantee.</h2>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                <span className="text-slate-300 font-medium">Your search data is private. Partner sharing only occurs upon form submission.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                <span className="text-slate-300 font-medium">Qualified lead matching. Connect with verified service partners.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                <span className="text-slate-300 font-medium">Professional service supported by lead-based revenue.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem]">
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            "AutoSpex exists because the automotive industry is built on information asymmetry. We give you back the data that belongs to you, so you can make informed decisions about your most important asset."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">AutoSpex Engineering Team</h4>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Built in Austin, TX</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FINAL CONVERSION CTA */}
        <div className="w-full max-w-4xl px-4 text-center mb-24 py-16 animate-in fade-in zoom-in duration-1000">
             <div className="bg-gradient-to-br from-brand-primary to-orange-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-primary/30">
                <Gauge className="w-12 h-12 text-slate-900" strokeWidth={3} />
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">Stop Overpaying Today.</h2>
             <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Whether it's a $1,000 repair quote or a cryptic error code, get the truth in seconds. Professional quote matching available.
             </p>
             <button 
                onClick={() => onNavigate('fault-code-decoder')}
                className="px-12 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-500/20"
             >
                Diagnose My Vehicle
             </button>
        </div>

    </div>
  );
};

export default HomePage;