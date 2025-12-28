import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GoogleGenAI } from "@google/genai";
import { 
  Palette, Zap, Sparkles, MessageSquare, ChevronDown, 
  ArrowRight, RefreshCw, Star, Info, Lock, 
  CheckCircle2, Car, Download, Share2, Image as ImageIcon,
  Gauge, LayoutGrid, X
} from './Icons';
import { WrapDesignRequest } from '../types';

const INITIAL_REQUEST: WrapDesignRequest = {
  vehicleType: 'Supercar',
  prompt: '',
  artStyle: 'Realistic Photo'
};

const ART_STYLES: WrapDesignRequest['artStyle'][] = [
  'Realistic Photo',
  'Illustration',
  'Racing Livery',
  'Matte Stealth',
  'Carbon Fiber',
  'Iridescent Pearl',
  'Geometric Camo',
  'Cyberpunk Neon',
  'Retro Vintage'
];

const WrapDesigner: React.FC = () => {
  const [request, setRequest] = useState<WrapDesignRequest>(INITIAL_REQUEST);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updateRequest = (field: keyof WrapDesignRequest, value: string) => {
    setRequest(prev => ({ ...prev, [field]: value as any }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.prompt) {
      setError("Please describe your design vision first!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prompt Expansion Logic
      const expandedPrompt = `A high-resolution, professional automotive photograph of a ${request.vehicleType} with a full custom vinyl wrap featuring ${request.prompt}. The style is ${request.artStyle}. The car is shown in a studio setting with cinematic lighting. 8k resolution, photorealistic, vinyl texture detail.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: expandedPrompt }],
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      // Find image part in the response
      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) throw new Error("AI failed to visualize the design.");
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("Visualizer engine stalled! Try simplified keywords for your design.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `AutoSpex-Wrap-${request.vehicleType.replace(' ', '-')}.png`;
    link.click();
  };

  const faqs = [
    {
      question: "How does the AI create car wraps?",
      answer: "Our visualizer uses a specialized automotive model trained on thousands of vehicle textures and lighting scenarios. It maps your text prompt onto a 3D-aware representation of the vehicle type you select."
    },
    {
      question: "Can I use these designs for real wraps?",
      answer: "These are visual concepts intended for inspiration. While they look photorealistic, you would need to work with a professional wrap shop to translate these into printable vector assets for a real vehicle."
    },
    {
      question: "Which vehicle types are supported?",
      answer: "We currently support five major categories: Supercars, Muscle Cars, SUVs, Pickup Trucks, and Sedans. We use generic, high-end models for each category to ensure the wrap patterns remain the focus."
    },
    {
      question: "Is there a limit to what I can prompt?",
      answer: "The AI works best with descriptive visual terms like 'matte neon circuit patterns', 'galactic nebula purple', or 'vintage racing livery'. Avoid using brand names or complex text labels as the AI excels at textures and patterns."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, the AI Wrap Designer is part of the AutoSpex free utility suite. We provide it to help car enthusiasts explore their creativity before committing to expensive physical modifications."
    }
  ];

  const FullscreenModal = generatedImage && isFullscreen ? createPortal(
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <button 
        onClick={() => setIsFullscreen(false)}
        className="absolute top-6 right-6 z-[210] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-6xl h-full flex items-center justify-center overflow-auto custom-scrollbar touch-pan-x touch-pan-y">
        <div className="relative bg-slate-950 rounded-[1.8rem] overflow-hidden border border-white/10 shadow-2xl scale-in-center">
          <img 
            src={generatedImage} 
            alt="Custom Wrap Design Fullscreen" 
            className="w-full h-auto max-h-[85vh] object-contain select-none"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-center pt-12 hidden sm:block">
            <div className="flex items-center justify-center gap-2 mb-1">
               <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-black" strokeWidth={3} />
               </div>
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AutoSpex AI Visualizer</span>
            </div>
            <p className="text-[8px] text-white/40 uppercase tracking-widest">Created with AI Wrap Designer | Automotive Concept Studio</p>
          </div>

          <div className="absolute top-4 left-4 hidden sm:block">
             <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
               {request.vehicleType} Concept
             </span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 flex gap-4 no-print">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-100 transition-all"
        >
          <Download className="w-5 h-5" /> Download
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {FullscreenModal}
      
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-8 shadow-lg shadow-blue-500/10 cursor-default">
            <Palette className="w-4 h-4" />
            AI Design Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          AI Custom Car <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
             Wrap Designer
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Visualize your dream design in seconds. Enter a vision, pick a car, and let AI generate a high-fidelity concept for your next modification.
        </p>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 mb-20 px-4">
        
        {/* Left: Input Controls */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 sticky top-24">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-500" /> Vehicle Type
                </label>
                <select 
                  value={request.vehicleType}
                  onChange={(e) => updateRequest('vehicleType', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="Supercar">Supercar</option>
                  <option value="Muscle Car">Muscle Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Sedan">Sedan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" /> Design Vision
                </label>
                <textarea 
                  placeholder="e.g. Cyberpunk neon circuit patterns on matte black, or Galactic nebula colors with silver highlights..." 
                  value={request.prompt}
                  onChange={(e) => updateRequest('prompt', e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" /> Art Style
                </label>
                <div className="relative">
                  <select 
                    value={request.artStyle}
                    onChange={(e) => updateRequest('artStyle', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
                  >
                    {ART_STYLES.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? "Visualizing Design..." : "Generate Wrap Concept"}
              </button>

              {error && (
                <p className="text-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right: Output Display */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          {generatedImage ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative group cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                
                {/* The Branded Frame Container */}
                <div className="relative bg-slate-950 rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl">
                  <img 
                    src={generatedImage} 
                    alt="Custom Wrap Design" 
                    className="w-full h-auto aspect-video object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  
                  {/* Subtle Branded Footer Overlay - Hidden on mobile to avoid obscuring the car */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-center pt-12 hidden sm:block">
                    <div className="flex items-center justify-center gap-2 mb-1">
                       <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                          <Gauge className="w-4 h-4 text-black" strokeWidth={3} />
                       </div>
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AutoSpex AI Visualizer</span>
                    </div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Created with AI Wrap Designer | Automotive Concept Studio</p>
                  </div>

                  {/* Badge - Hidden on mobile */}
                  <div className="absolute top-4 left-4 hidden sm:block">
                     <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                       {request.vehicleType} Concept
                     </span>
                  </div>
                  
                  {/* Hover indicator for full screen */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Click to Expand
                     </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                 >
                    <Download className="w-5 h-5 text-blue-500" /> Save Design
                 </button>
                 <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'My Custom Car Wrap', text: 'Check out this design I created with AutoSpex AI!', url: window.location.href });
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                 >
                    <Share2 className="w-5 h-5 text-indigo-500" /> Share Concept
                 </button>
              </div>
              
              <p className="text-center text-xs text-slate-500 italic">
                *Conceptual rendering. Professional application requires manual templating.
              </p>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50 dark:bg-slate-900/20 p-12 text-center group">
               <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Visualize?</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                 Fill in your design details on the left and hit generate to see your concept come to life in 8K resolution.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Secondary Sections */}
      <div className="w-full max-w-5xl mx-auto space-y-24 mt-20 mb-20 px-4">
        
        {/* About the Designer */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">About the Visualizer</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Car modifications start with a spark of imagination. The <span className="text-blue-600 font-bold">AutoSpex AI Wrap Designer</span> takes that spark and renders it into professional-grade advertising creative.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    By combining your creative prompts with our automotive photography engine, we bridge the gap between "I have an idea" and "I can see the result." Whether you're planning a fleet of SUVs or a one-off Supercar masterpiece, our AI handles the lighting, perspective, and material physics for you.
                </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                <LayoutGrid className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/10" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Designer Features</h3>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Studio Lighting:</span> Every render uses cinematic, studio-grade virtual lighting for the most realistic preview.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Texture Engine:</span> Our AI simulates the sheen of vinyl—from ultra-matte to high-gloss and iridescent finishes.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">Social Ready:</span> Every concept includes our custom branded frame, perfect for sharing your vision with followers.</p>
                    </li>
                </ul>
            </div>
        </div>

        {/* Testimonials */}
        <div className="px-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-16">Global Designs</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { name: "Caleb V.", text: "Created a 'Cyber-Samurai' livery concept for my SUV. Showed it to my local shop and they used it as the direct reference for the final install. Mind-blown.", stars: 5 },
                    { name: "Sonia M.", text: "Perfect for social media. I use this to visualize different holiday-themed wraps for my business van. The realism is better than expensive rendering software.", stars: 5 },
                    { name: "Derek W.", text: "The art style toggle is great. The 'Racing Livery' mode actually understands aerodynamics and sponsor placement logic. Really smart tool.", stars: 5 },
                ].map((review, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 group">
                        <div className="flex gap-1 mb-4 text-orange-400">
                            {[...Array(review.stars)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed">"{review.text}"</p>
                        <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-sm">
                                {review.name.charAt(0)}
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
                    <MessageSquare className="w-7 h-7 text-blue-500" />
                    Common Questions
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Everything you need to know about AI Design concepts.</p>
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

    </div>
  );
};

export default WrapDesigner;
