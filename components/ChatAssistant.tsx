
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, Zap, X, Sparkles, Bot, RefreshCw } from './Icons';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  code: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ code }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hello! I'm your AI mechanic. I see you're dealing with a ${code} code. Ask me anything about symptoms, step-by-step diagnostic procedures, or estimated repair costs.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are an expert automotive master technician. 
          You are assisting a vehicle owner with OBD-II fault code ${code}. 
          Provide clear, technical but accessible advice. 
          Prioritize safety first. If a code is critical, advise immediate stop.
          Include approximate labor hours and parts costs if asked. 
          Address the user directly. Keep responses concise but thorough.`,
        },
      });

      // Prepare conversation history for the model
      const response = await chat.sendMessage({ message: userMsg });
      const text = response.text;

      if (!text) throw new Error("No response from assistant");

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting to my diagnostic database. Please try again in a moment." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // The Trigger Card (Visible in Sidebar)
  const TriggerCard = (
    <button 
      onClick={() => setIsOpen(true)}
      className="w-full text-left group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-xl shadow-blue-500/20 dark:shadow-blue-900/20 border border-blue-500/30 hover:scale-[1.02] transition-all duration-300"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Bot className="w-32 h-32 -rotate-12 translate-x-8 -translate-y-8 text-white" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="bg-white/10 backdrop-blur-md w-fit p-3 rounded-2xl border border-white/10">
          <Sparkles className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">AI Mechanic</h3>
          <p className="text-blue-100 text-sm font-medium leading-relaxed">
            Have questions about {code}? Get instant, expert-level answers powered by Gemini.
          </p>
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm bg-white/10 w-fit px-4 py-2 rounded-xl mt-2 group-hover:bg-white/20 transition-colors">
          Start Chat <MessageSquare className="w-4 h-4" />
        </div>
      </div>
    </button>
  );

  const Modal = isOpen ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg h-[600px] max-h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">AI Mechanic</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Online • Powered by Gemini</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
          <div className="text-center py-4">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[13px] text-slate-600 dark:text-slate-500">
              Diagnostic Session Started for {code}
            </div>
          </div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                ${msg.role === 'user' 
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400' 
                  : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'}
              `}>
                {msg.role === 'user' ? <div className="text-[13px] font-bold">You</div> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div 
                className={`
                  max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-200 dark:border-slate-700' 
                    : 'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 rounded-tl-none border border-blue-100 dark:border-blue-500/20'}
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500/50 transition-colors overflow-hidden">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, fixes, or costs..."
                className="w-full bg-transparent border-none py-3.5 pl-4 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-all shadow-lg shadow-blue-500/20"
              >
                {isTyping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-600 mt-3">
            AI technician can make mistakes. Please verify safety-critical repair data.
          </p>
        </div>

      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {TriggerCard}
      {Modal}
    </>
  );
};

export default ChatAssistant;
