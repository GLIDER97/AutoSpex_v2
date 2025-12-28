import React from 'react';
import { History, ChevronRight } from './Icons';
import { SearchHistoryItem } from '../types';

interface RecentScansProps {
  history: SearchHistoryItem[];
  onSelect: (code: string) => void;
}

const RecentScans: React.FC<RecentScansProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-12">
      <div className="flex items-center gap-2 mb-4 px-2">
        <History className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Recent Scans</h3>
      </div>
      
      <div className="space-y-2">
        {history.map((item, index) => (
          <button
            key={`${item.code}-${index}`}
            onClick={() => onSelect(item.code)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all duration-200 group text-left shadow-sm dark:shadow-none"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-primary transition-colors shrink-0">
                {item.code}
              </span>
              <span className="text-[13px] text-slate-500 truncate" title={item.label}>
                {item.label || 'View Details'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentScans;