import React, { useState } from 'react';
import { ChevronRight, MessageSquare } from './Icons';

const faqs = [
  {
    question: "What is an OBD-II code?",
    answer: "An On-Board Diagnostics (OBD-II) code is a standardized alphanumeric string (like P0300) that your vehicle's computer generates when it detects a fault. It acts as a digital fingerprint for specific issues within your engine, transmission, or emissions systems."
  },
  {
    question: "How do I find my car's fault code?",
    answer: "You need an OBD-II scanner tool. Plug it into the diagnostic port typically found under your driver's side dashboard. The scanner will display the specific error codes (P-codes), which you can then enter into our tool for a plain-English explanation."
  },
  {
    question: "Are the repair cost estimates accurate?",
    answer: "Our estimates are based on national US averages for parts and labor (calculated at standard shop rates of ~$100-$150/hr). While they provide a realistic baseline, specific costs will vary depending on your vehicle make, model, location, and choice of mechanic."
  },
  {
    question: "Can I drive with the Check Engine Light on?",
    answer: "It depends on the code. Generally, a steady light indicates a non-urgent issue (like a loose gas cap), while a flashing light signals a severe problem (like an engine misfire) that requires immediate attention to prevent damage. Our tool provides a specific 'Safety Status' for every code."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, this diagnostic decoder is 100% free for car owners. We believe every driver deserves access to transparent repair information and safety data without a paywall."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-24 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 dark:text-slate-400">Common questions about vehicle diagnostics and our tool.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
              openIndex === index 
                ? 'bg-white dark:bg-slate-900 border-brand-primary/30 shadow-lg shadow-brand-primary/5' 
                : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className={`font-semibold pr-4 ${openIndex === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                {faq.question}
              </span>
              <ChevronRight 
                className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                  openIndex === index ? 'rotate-90 text-brand-primary' : ''
                }`} 
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
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
  );
};

export default FAQSection;