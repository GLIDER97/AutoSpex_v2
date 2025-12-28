import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Tag, Zap, Sparkles, MessageSquare, ChevronDown, 
  ArrowRight, RefreshCw, Star, Info, Lock, 
  CheckCircle2, Car, Smile, Users, LayoutGrid, ShoppingCart,
  Search, BookOpen, Heart
} from './Icons';
import { VanityPlateRequest, VanityPlateItem } from '../types';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const INITIAL_REQUEST: VanityPlateRequest = {
  carModel: '',
  hobbies: '',
  vibe: 'Funny',
  state: 'California'
};

const PLATE_FRAMES = [
  {
    name: "Carbon Fiber License Plate Frames",
    url: "https://Autospex.short.gy/bj8ZmK",
    img: "https://m.media-amazon.com/images/I/81elHawdahL._AC_SL1500_.jpg"
  },
  {
    name: "Stainless Steel Polish Mirror License Plate",
    url: "https://Autospex.short.gy/3C6GkX",
    img: "https://m.media-amazon.com/images/I/51B0iU0yX9L._AC_.jpg"
  },
  {
    name: "Bling Sparkly Rhinestone License Plate Frames",
    url: "https://Autospex.short.gy/H7Y5ym",
    img: "https://m.media-amazon.com/images/I/71CTGQJYlIL._AC_SL1500_.jpg"
  }
];

const faqs = [
  {
    question: "How does the AI come up with plate ideas?",
    answer: "Our AI uses creative branding logic combined with 'leetspeak' rules and automotive culture data to generate combinations that represent your vehicle's personality and your personal interests."
  },
  {
    question: "What is the character limit for vanity plates?",
    answer: "Most US states allow for up to 7 characters, including spaces and symbols. Our generator optimizes suggestions to fit standard 7-character US plate layouts for maximum compatibility."
  },
  {
    question: "Are these suggestions guaranteed to be available?",
    answer: "No. Our tool generates creative possibilities. Since DMV databases change daily, you must verify availability on your official state DMV website before applying."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, the AI Vanity Plate Generator is 100% free. We are supported by our network of professional automotive partners to keep these creative tools accessible for everyone."
  },
  {
    question: "Can I request a custom report for my plate?",
    answer: "Yes, you can connect with our professional partners to find more information about vehicle customization and local registration laws in your area."
  }
];

const testimonials = [
  {
    name: "Caleb R.",
    loc: "San Diego, CA",
    text: "I was stuck for weeks trying to find something for my Tesla. This tool gave me 'AMPEDUP' and it was actually available at the DMV!",
    stars: 5
  },
  {
    name: "Elena G.",
    loc: "Austin, TX",
    text: "The 'Punny' vibe is hilarious. I ended up with a plate that makes everyone at the car meet smile. Highly recommend!",
    stars: 5
  },
  {
    name: "Marcus T.",
    loc: "Miami, FL",
    text: "Fast, easy, and super creative. It even factored in my love for rock climbing. This is the best vanity plate tool on the web.",
    stars: 5
  }
];

const PlateGenerator: React.FC = () => {
  const [request, setRequest] = useState<VanityPlateRequest>(INITIAL_REQUEST);
  const [results, setResults] = useState<VanityPlateItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const updateRequest = (field: keyof VanityPlateRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value as any }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.carModel || !request.hobbies) {
      setError("Tell us more about yourself (Car & Hobbies)!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate 6 clever, creative vanity plate ideas for a ${request.carModel} in ${request.state} with hobbies ${request.hobbies} and vibe ${request.vibe}. Ensure they are 7 characters or less.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    plate: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    category: { type: Type.STRING }
                  },
                  required: ['plate', 'meaning', 'category']
                }
              }
            },
            required: ['plates']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No ideas generated.");
      const data = JSON.parse(text);
      setResults(data.plates);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("AI stalled! Try giving us more specific details about your vibe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {!results && (
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-orange-600 dark:text-orange-400 mb-8 shadow-lg shadow-orange-500/10 cursor-default">
              <Tag className="w-4 h-4" />
              AI Creative Branding
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            AI Vanity Plate <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
               Generator
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Generate creative, personalized license plate ideas based on your car, hobbies, and personality.
          </p>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {!results ? (
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 mb-20">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-500" /> Car Model
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tesla Model Y, Jeep Wrangler" 
                    value={request.carModel}
                    onChange={(e) => updateRequest('carModel', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" /> Hobbies & Interests
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Coding, Hiking, Coffee" 
                    value={request.hobbies}
                    onChange={(e) => updateRequest('hobbies', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Smile className="w-4 h-4 text-orange-500" /> The Vibe
                  </label>
                  <select 
                    value={request.vibe}
                    onChange={(e) => updateRequest('vibe', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="Funny">Funny</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Aggressive">Aggressive</option>
                    <option value="Intellectual">Intellectual</option>
                    <option value="Punny">Punny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-500" /> State (Limits)
                  </label>
                  <select 
                    value={request.state}
                    onChange={(e) => updateRequest('state', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? "Cooking Up Ideas..." : "Generate Vanity Plates"}
              </button>

              {error && (
                <p className="text-center text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900">
                  {error}
                </p>
              )}
            </form>
          </div>
        ) : (
          /* RESULTS VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 mb-20">
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Tag className="w-32 h-32 -rotate-12 translate-x-8 -translate-y-8 text-white" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-4">YOUR VANITY PLATE IDEAS</h2>
                <p className="text-slate-400 text-sm">Targeted suggestions for your {request.carModel} in {request.state}</p>
              </div>

              <div className="grid gap-4">
                {results.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-orange-500/50 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/50">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-[0.2em] mb-1">
                          {item.plate.toUpperCase()}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                          {item.meaning}
                        </p>
                      </div>
                      <button className="hidden sm:block p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500 transition-colors border border-slate-100 dark:border-slate-700">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MONETIZATION: PLATE FRAMES AFFILIATE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Complete the Look</h2>
                    <p className="text-slate-500 text-sm">Protect and style your new vanity plate with these top-rated frames.</p>
                 </div>
                 <div className="flex items-center gap-1 text-orange-400 bg-orange-400/5 px-4 py-2 rounded-full border border-orange-400/20 shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enthusiast Picks</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 {PLATE_FRAMES.map((product, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-2xl transition-all group relative overflow-hidden">
                      <div className="h-32 flex items-center justify-center mb-6 relative">
                         <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 rounded-2xl -z-0 opacity-40 group-hover:opacity-60 transition-opacity" />
                         <img 
                           src={product.img} 
                           alt={product.name} 
                           className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" 
                         />
                      </div>
                      <div className="flex-grow flex flex-col">
                         <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2 mb-6 leading-snug group-hover:text-orange-500 transition-colors">
                           {product.name}
                         </h3>
                         <a 
                           href={product.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] hover:opacity-90 transition-all mt-auto"
                         >
                           Buy on Amazon <ShoppingCart className="w-3 h-3" />
                         </a>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-center">
                 <a 
                    href="https://Autospex.short.gy/hY2kzq" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                 >
                    View All Styles on Amazon <ArrowRight className="w-4 h-4" />
                 </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setResults(null)}
                className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Start Over
              </button>
              <button 
                onClick={() => window.print()}
                className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Print Ideas
              </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-medium italic mt-4">
               *As an Amazon Associate, AutoSpex earns from qualifying purchases.
            </p>
          </div>
        )}
      </div>

      {/* EDUCATIONAL & TRUST SECTIONS */}
      <div className="w-full max-w-5xl mx-auto space-y-24 px-4 mb-20">
        
        {/* About the Tool */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Personalize Your Ride</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    A license plate is more than just a legal requirement—it's a statement. The <span className="text-orange-500 font-bold">AutoSpex Plate Generator</span> uses Google Gemini AI to analyze your vehicle's specs and your personal interests to craft the perfect 7-character combinations.
                </p>
                <div className="space-y-4">
                   {[
                     { icon: <Heart className="w-5 h-5 text-red-500" />, text: "Factor in your specific hobbies and passions." },
                     { icon: <Zap className="w-5 h-5 text-blue-500" />, text: "AI-driven creativity that goes beyond simple acronyms." },
                     { icon: <Lock className="w-5 h-5 text-green-500" />, text: "Secure & Trusted • Professional service matching available." }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200">
                        {item.icon} {item.text}
                     </div>
                   ))}
                </div>
            </div>
            <div className="order-1 md:order-2 bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-8 border border-orange-100 dark:border-orange-900/30 relative overflow-hidden shadow-xl">
                <Smile className="absolute -bottom-8 -right-8 w-48 h-48 text-orange-500/10 -rotate-12" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why Use AI?</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   Classic vanity plate generators just shuffle characters. Our AI understands <span className="font-bold text-orange-600">context</span>. It knows that a "Cyberpunk" Tesla needs different ideas than a "Vintage" Bronco. It thinks like a branding expert to make sure your plate is memorable and clever.
                </p>
            </div>
        </div>

        {/* How to Use */}
        <div className="w-full bg-slate-900 rounded-[3rem] py-16 px-8 sm:px-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <LayoutGrid className="w-64 h-64" />
            </div>
            <div className="relative z-10">
                <h2 className="text-3xl font-black text-center mb-16">How to Create Your Plate</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { step: "01", icon: <Car className="w-6 h-6" />, title: "Vehicle Identity", desc: "Start by entering your car make and model to give the AI context for the 'vibe'." },
                        { step: "02", icon: <Smile className="w-6 h-6" />, title: "Personal Flair", desc: "Add your hobbies, profession, or interests to make the plate uniquely yours." },
                        { step: "03", icon: <Tag className="w-6 h-6" />, title: "Select Vibe", desc: "Choose from Funny, Minimalist, or Intellectual to set the tone of the suggestions." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-slate-900 flex items-center justify-center mb-6 font-black text-xl shadow-lg shadow-orange-500/20">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Testimonials */}
        <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-16">Enthusiast Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all">
                        <div className="flex gap-1 mb-6 text-orange-400">
                            {[...Array(t.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center font-black text-xs">
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

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
                    <MessageSquare className="w-7 h-7 text-orange-500" />
                    Common Questions
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Everything you need to know about AI-generated plates.</p>
            </div>
            
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                            openFaqIndex === index 
                            ? 'bg-white dark:bg-slate-900 border-orange-500/30 shadow-lg shadow-orange-500/5' 
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
                                openFaqIndex === index ? 'rotate-180 text-orange-500' : ''
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

      {!results && (
        <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6 mt-16 text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-green-500" /> Secure & Trusted
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-500" /> State Specific Limits
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" /> AI-Powered Logic
          </div>
        </div>
      )}
    </div>
  );
};

export default PlateGenerator;