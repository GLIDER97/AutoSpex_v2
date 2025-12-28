
import React from 'react';
import { ShoppingCart, Star, ArrowRight } from './Icons';

const SCANNERS = [
  {
    name: "ANCEL AD310 Classic Enhanced Universal OBD II Scanner",
    url: "https://Autospex.short.gy/diGnAb",
    img: "https://m.media-amazon.com/images/I/61KElcCN4BL._AC_SY606_.jpg",
    rating: 4.6
  },
  {
    name: "MOTOPOWER MP69033 Car OBD2 Scanner",
    url: "https://Autospex.short.gy/be8MeQ",
    img: "https://m.media-amazon.com/images/I/61ybpjOSa1L._AC_SX679_.jpg",
    rating: 4.5
  },
  {
    name: "VDIAGTOOL VD10 OBD2 Scanner Code Reader",
    url: "https://Autospex.short.gy/WwUbod",
    img: "https://m.media-amazon.com/images/I/61VZXoBoDKL._AC_SX679_.jpg",
    rating: 4.4
  }
];

const AffiliateSection: React.FC = () => {
  return (
    <div className="mt-20 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-brand-primary" />
            Recommended Diagnostic Tools
          </h2>
          <p className="text-slate-500 max-w-xl">Don't rely on expensive shop scans. Own your data with these top-rated OBD-II scanners from Amazon.</p>
        </div>
        <div className="flex items-center gap-1 text-orange-400 bg-orange-400/5 px-4 py-2 rounded-full border border-orange-400/20">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs font-black uppercase tracking-widest">Amazon Best Sellers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SCANNERS.map((scanner, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group overflow-hidden"
          >
            <div className="h-48 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 rounded-2xl -z-0 opacity-50" />
              <img 
                src={scanner.img} 
                alt={scanner.name} 
                className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-1 mb-2 text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(scanner.rating) ? 'fill-current' : 'opacity-30'}`} />
                ))}
                <span className="text-[10px] font-bold text-slate-400 ml-1">{scanner.rating}</span>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-4 leading-snug h-10 group-hover:text-brand-primary transition-colors">
                {scanner.name}
              </h3>

              <div className="flex items-center justify-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={scanner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF9900] text-white font-bold text-sm hover:bg-[#e68a00] transition-colors shadow-lg shadow-orange-500/10"
                >
                  Buy on Amazon <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-[10px] text-slate-400 mt-8 font-medium italic">
        *As an Amazon Associate, AutoSpex earns from qualifying purchases.
      </p>
    </div>
  );
};

export default AffiliateSection;
