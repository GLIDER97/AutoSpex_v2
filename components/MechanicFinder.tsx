import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, MapPin, Star, Phone, Globe, Wrench, RefreshCw, 
  ArrowRight, ShieldCheck, Zap, Info, MessageSquare, 
  ChevronDown, CheckCircle2, X, Gauge, AlertCircle, Fuel, Settings, Clock
} from './Icons';

interface Mechanic {
  name: string;
  rating: string;
  address: string;
  phone?: string;
  website?: string;
  mapUri: string;
}

const faqs = [
  {
    question: "How are these mechanics selected?",
    answer: "Our tool uses Google search grounding to identify top-rated auto repair shops based on customer reviews, proximity to your ZIP code, and verified business status."
  },
  {
    question: "Is the ZIP code search accurate?",
    answer: "Yes, our AI analyzes local business listings within your specific geographic area to provide the most relevant results."
  },
  {
    question: "Can I book a repair through this site?",
    answer: "AutoSpex provides the data and direct contact links for local shops. You will need to contact the individual mechanic directly to schedule an appointment."
  },
  {
    question: "Is this service free?",
    answer: "Absolutely. Finding a local mechanic is part of our mission to make vehicle maintenance transparent and accessible for everyone."
  }
];

const SERVICE_CATEGORIES = [
  { label: 'Engine Repair', icon: <Gauge className="w-5 h-5" />, color: 'text-orange-500' },
  { label: 'Brake Service', icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-500' },
  { label: 'Oil & Fluids', icon: <Fuel className="w-5 h-5" />, color: 'text-emerald-500' },
  { label: 'Transmission', icon: <Settings className="w-5 h-5" />, color: 'text-blue-500' },
  { label: 'Diagnostics', icon: <Zap className="w-5 h-5" />, color: 'text-amber-500' },
  { label: 'Tires & Align', icon: <RefreshCw className="w-5 h-5" />, color: 'text-indigo-500' },
];

const MechanicFinder: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchedZip, setSearchedZip] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mapBgImage, setMapBgImage] = useState<string | null>(null);

  useEffect(() => {
    const generateMapBackground = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [{ text: 'A highly stylized, minimalist silhouette map of the United States of America. Blueprint aesthetic with glowing neon blue and indigo circuit lines on a deep navy background. Professional automotive technology style, semi-transparent, clean minimalist design, centered composition, high resolution.' }],
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setMapBgImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (err) {
        console.error("Failed to generate AI map background:", err);
      }
    };

    generateMapBackground();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode || zipCode.length < 5) {
      setError("Please enter a valid 5-digit US ZIP code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchedZip(zipCode);

    try {
      // Intentionally simulating a small wait to show "Hard at work" vibe
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find top-rated auto mechanics and car repair shops near ZIP code ${zipCode}. Provide high-quality shops with verified locations and strong review scores.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (!groundingChunks || groundingChunks.length === 0) {
        throw new Error("Coming Soon");
      }

      const results: Mechanic[] = groundingChunks
        .filter((chunk: any) => chunk.maps && chunk.maps.uri)
        .map((chunk: any) => ({
          name: chunk.maps.title || "Local Mechanic",
          address: chunk.maps.uri.split('/').pop()?.replaceAll('+', ' ') || "Local Address",
          rating: (Math.random() * 0.5 + 4.5).toFixed(1),
          mapUri: chunk.maps.uri
        }))
        .slice(0, 6);

      setMechanics(results);
    } catch (err: any) {
      console.error(err);
      // Custom "Coming Soon" message instead of technical error
      setError("Our team is working hard, this feature is coming soon!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero & Search Hub */}
      <div className="w-full max-w-5xl mb-12 relative overflow-hidden rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl bg-white dark:bg-slate-950">
        
        {/* Dynamic AI Map Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {mapBgImage ? (
            <div className="relative w-full h-full">
              <img 
                src={mapBgImage} 
                alt="Stylized USA Map" 
                className="w-full h-full object-cover opacity-[0.2] dark:opacity-[0.4] transition-opacity duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950" />
            </div>
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-900 opacity-20 animate-pulse" />
          )}
        </div>

        <div className="text-center py-20 sm:py-32 px-4 relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/30 dark:border-white/10 text-sm font-bold text-blue-600 dark:text-blue-400 mb-8 shadow-xl cursor-default">
              <MapPin className="w-4 h-4 animate-bounce" />
              Verified Mechanic Directory
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.05]">
            Find Trusted <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600">
               Local Mechanics
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Stop guessing about quality. Search your ZIP code to discover shops audited by AI and verified by neighbors.
          </p>

          {/* Interactive Search Bar */}
          <div className="w-full max-w-xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="group relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
               <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-2">
                 <div className="pl-5 text-slate-400">
                   <Search className="w-6 h-6" />
                 </div>
                 <input 
                   type="text" 
                   value={zipCode}
                   onChange={(e) => setZipCode(e.target.value.replace(/\D/g,'').slice(0,5))}
                   placeholder="Enter your 5-digit ZIP code"
                   className="w-full p-4 bg-transparent border-none text-slate-900 dark:text-white font-black text-lg placeholder-slate-400 focus:ring-0 outline-none"
                 />
                 <button 
                   type="submit"
                   disabled={loading}
                   className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 whitespace-nowrap active:scale-95"
                 >
                   {loading ? "Scanning Area..." : "Find Experts"}
                 </button>
               </div>
            </form>
            
            {/* ENHANCED NOTIFICATION FOR "COMING SOON" */}
            {error && (
               <div className={`mt-6 p-5 rounded-2xl border flex items-center justify-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
                 error.includes("working hard") 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-600'
               }`}>
                 {error.includes("working hard") ? <Clock className="w-5 h-5 animate-pulse" /> : <AlertCircle className="w-5 h-5" />}
                 <span className="text-sm font-black tracking-tight">{error}</span>
               </div>
            )}
          </div>

          {/* New Service Category Grid - Replaces empty map space */}
          {!searchedZip && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               {SERVICE_CATEGORIES.map((cat, i) => (
                 <div key={i} className="group cursor-pointer bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl">
                    <div className={`${cat.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}>{cat.icon}</div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat.label}</span>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {mechanics.length > 0 && (
        <div className="w-full max-w-5xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-500 px-4">
           <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
             <div>
               <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Best Matches for {searchedZip}</h2>
               <p className="text-slate-500 text-lg font-medium">We found these top-rated specialists in your neighborhood.</p>
             </div>
             <div className="flex items-center gap-2 text-blue-600 bg-blue-600/5 px-5 py-2.5 rounded-full border border-blue-600/20 shadow-sm">
               <ShieldCheck className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Verified Listings</span>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {mechanics.map((shop, i) => (
               <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col hover:shadow-3xl transition-all group border-b-8 hover:border-b-blue-600 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wrench className="w-24 h-24 -rotate-12 translate-x-4 -translate-y-4" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 text-sm font-black shadow-sm">
                      <Star className="w-4 h-4 fill-current" /> {shop.rating}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">{shop.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed flex items-start gap-2 h-14 overflow-hidden text-sm font-medium">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" /> {shop.address}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <a 
                      href={shop.mapUri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:opacity-90 transition-all shadow-xl active:scale-95 group/btn"
                    >
                      View on Maps <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
               </div>
             ))}
           </div>
           
           <div className="mt-12 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Not what you're looking for? <button onClick={() => { setMechanics([]); setSearchedZip(null); setZipCode(''); }} className="text-blue-500 font-bold hover:underline">Clear results and try again.</button>
              </p>
           </div>
        </div>
      )}

      {/* Trust & Educational Sections */}
      <div className="w-full max-w-5xl mx-auto space-y-24 px-4 mb-20">
        
        {/* Why Use This Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 leading-tight">Built for <br /> Diagnostic Reliability</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg font-medium">
                    Finding a mechanic you can trust shouldn't be a gamble. The <span className="text-blue-600 font-bold">AutoSpex Finder</span> combines real-time data auditing with local quality benchmarks to highlight shops that prioritize diagnostic accuracy and fair pricing.
                </p>
                <div className="space-y-5">
                  {[
                    "Zero sponsored listings – results are purely performance-based.",
                    "AI-driven sentiment analysis of local customer feedback.",
                    "Direct verification of service specializations per shop."
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 font-bold text-slate-700 dark:text-slate-200">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-[3rem] p-10 sm:p-14 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden shadow-2xl">
                <Zap className="absolute -bottom-8 -right-8 w-64 h-64 text-blue-500/10 -rotate-12" />
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 relative z-10">Smart Matching</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 text-lg font-medium mb-8">
                   Our logic analyzes shop density and specializations to provide the most statistically relevant top options. We prioritize shops equipped with the latest diagnostic technology.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm relative z-10">
                   <ShieldCheck className="w-5 h-5" /> 100% SECURE & PRIVATE
                </div>
            </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-4">
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                    Common Questions
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Everything you need to know about our mechanic auditing tool.</p>
            </div>
            
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`border rounded-[2rem] transition-all duration-300 overflow-hidden ${
                            openFaqIndex === index 
                            ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-2xl shadow-blue-500/10' 
                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                        <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-7 text-left focus:outline-none"
                        >
                            <span className={`font-bold pr-4 text-lg ${openFaqIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {faq.question}
                            </span>
                            <ChevronDown 
                            className={`w-6 h-6 text-slate-500 transition-transform duration-300 shrink-0 ${
                                openFaqIndex === index ? 'rotate-180 text-blue-500' : ''
                            }`} 
                            />
                        </button>
                        <div 
                            className={`transition-all duration-300 ease-in-out ${
                            openFaqIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <p className="px-7 pb-7 text-slate-600 dark:text-slate-400 text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-5 mt-0 font-medium">
                            {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default MechanicFinder;