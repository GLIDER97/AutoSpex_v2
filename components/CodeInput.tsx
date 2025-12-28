import React, { useState, useRef } from 'react';
import { Search, X, Camera, Car, Upload } from './Icons';

interface CodeInputProps {
  onSearch: (code: string, vehicleInfo?: string) => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ onSearch, isLoading }) => {
  const [code, setCode] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && code !== 'SCANNING...') {
      const vehicleInfo = year && make ? `${year} ${make} ${model}` : undefined;
      onSearch(code.trim().toUpperCase(), vehicleInfo);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate scanning process
      setCode('SCANNING...');
      
      // Artificial delay to simulate OCR/Analysis
      setTimeout(() => {
        setCode('P0300'); // Mock result code
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
        
        {/* Main Code Input */}
        <div className="relative group">
          <div 
            className={`
              absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500
              bg-gradient-to-r from-brand-primary to-orange-600
              ${isFocused ? 'opacity-70 blur-md' : ''}
            `}
          ></div>
          
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transition-colors">
            <div className="pl-4 text-slate-400">
              <Search className={`w-6 h-6 ${isFocused ? 'text-brand-primary' : ''} transition-colors`} />
            </div>
            
            <input
              type="text"
              className="w-full bg-transparent border-none text-slate-900 dark:text-white text-xl placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none py-4 px-4 font-mono uppercase tracking-wider transition-colors"
              placeholder="P0420"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={12}
              disabled={isLoading || code === 'SCANNING...'}
            />

            {code && !isLoading && code !== 'SCANNING...' && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Hidden File Input for Camera/Upload */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />

            {/* Photo Scan Button - Enhanced Visibility */}
            <button
              type="button"
              onClick={handleCameraClick}
              className="p-3 mr-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-brand-primary hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary dark:hover:text-slate-900 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-brand-primary hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] group-active:scale-95"
              title="Scan Code / Upload Photo"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!code || isLoading || code === 'SCANNING...'}
              className={`
                mr-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${code && code !== 'SCANNING...'
                  ? 'bg-brand-primary text-slate-900 hover:bg-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}
              `}
            >
              {isLoading || code === 'SCANNING...' ? 'Scanning...' : 'Decode'}
            </button>
          </div>
        </div>

        {/* Optional Vehicle Details Toggle */}
        <div className="flex flex-col gap-2">
          <button 
            type="button"
            onClick={() => setShowVehicleDetails(!showVehicleDetails)}
            className="flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 w-fit ml-1 transition-colors"
          >
            <Car className="w-4 h-4" />
            {showVehicleDetails ? 'Hide Vehicle Details' : 'Add Vehicle (Optional) for better accuracy'}
          </button>

          {showVehicleDetails && (
            <div className="grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
              <input
                type="text"
                placeholder="Year"
                className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <input
                type="text"
                placeholder="Make"
                className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
              <input
                type="text"
                placeholder="Model"
                className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CodeInput;