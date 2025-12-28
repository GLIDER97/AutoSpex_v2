
import React from 'react';
import { ShieldCheck, FileText, Lock, MessageSquare, Send, Mail, MapPin, Target, Zap, Users, Award } from './Icons';

const LegalLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="w-full max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
        {icon}
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
      {children}
    </div>
  </div>
);

export const AboutUs: React.FC = () => (
  <LegalLayout title="About AutoSpex" icon={<Zap className="w-8 h-8" />}>
    <section className="mb-12">
      <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
        AutoSpex is a mobile-first intelligence platform built to bridge the gap between complex automotive data and the everyday driver. Born from the frustration of cryptic "Check Engine" lights and opaque repair quotes, we empower car owners with the tools they need to drive with confidence.
      </p>
    </section>

    <div className="grid md:grid-cols-2 gap-8 mb-16">
      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Target className="w-24 h-24 text-brand-primary" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <Target className="w-6 h-6 text-brand-primary" />
          Our Mission
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          To provide every vehicle owner with instant, transparent, and accurate diagnostic data. We aim to eliminate repair anxiety by translating technical jargon into plain English and providing localized, fair-market price benchmarks.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Zap className="w-24 h-24 text-blue-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-500" />
          Our Vision
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          To become the world's most trusted automotive intelligence platform. We envision a future where car maintenance is no longer a "guessing game" but a data-driven process that saves consumers billions in unnecessary repair costs.
        </p>
      </div>
    </div>

    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The AutoSpex Difference</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-2">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Unbiased Data</h4>
            <p className="text-sm">We don't sell parts or perform repairs. Our only interest is providing you with the truth about your car.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-brand-primary flex items-center justify-center mb-2">
               <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">AI Analysis</h4>
            <p className="text-sm">Leveraging Google Gemini to analyze market trends and diagnostic patterns in real-time.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-2">
               <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Community Driven</h4>
            <p className="text-sm">Our estimates are refined by real-world repair data shared by thousands of drivers like you.</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Built for the Modern Driver</h2>
        <p>
          Whether you're looking up a 17-digit VIN before a purchase, decoding a mysterious check engine light, or auditing a $1,000 repair quote from your local dealer, AutoSpex provides the digital leverage needed to make smart decisions.
        </p>
        <p className="mt-4">
          Based in the tech-forward automotive hub of Austin, Texas, our team of engineers and former service advisors is dedicated to making vehicle ownership simpler, cheaper, and safer for everyone.
        </p>
      </div>
    </section>
  </LegalLayout>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy" icon={<ShieldCheck className="w-8 h-8" />}>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
      <p>At AutoSpex, we prioritize your privacy. When you use our tools, we collect technical vehicle information such as VIN numbers and OBD-II fault codes to provide diagnostic analysis. We do not store personal identifiers like your name or address unless explicitly provided via contact forms.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Data</h2>
      <p>Your vehicle data is processed using advanced AI models (such as Google Gemini) to generate plain-English explanations and repair estimates. This data is used anonymously to improve our diagnostic accuracy and user experience.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Data Sharing</h2>
      <p>We do not sell your data to third parties, dealerships, or insurance companies. Information is shared only with our technical partners (like AI providers) for the sole purpose of delivering the service you requested.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Security</h2>
      <p>We implement standard security measures to protect the information transmitted through our application. However, please be aware that no internet transmission is 100% secure.</p>
    </section>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service" icon={<FileText className="w-8 h-8" />}>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Informational Purposes Only</h2>
      <p>AutoSpex provides automotive diagnostic information for educational and informational purposes only. Our results are generated by AI and may contain inaccuracies. <strong>Always consult a certified professional mechanic before performing any repairs on your vehicle.</strong></p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. User Responsibility</h2>
      <p>By using this tool, you assume full responsibility for any actions taken based on the provided information. AutoSpex is not liable for any vehicle damage, personal injury, or financial loss resulting from the use of our services.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Accuracy of Estimates</h2>
      <p>Repair costs, insurance estimates, and vehicle valuations are based on market averages and AI predictions. Actual costs will vary depending on your location, specific vehicle condition, and provider choice.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Service Access</h2>
      <p>We reserve the right to modify or discontinue any part of the AutoSpex platform at any time without notice.</p>
    </section>
  </LegalLayout>
);

export const CookiePolicy: React.FC = () => (
  <LegalLayout title="Cookie Policy" icon={<Lock className="w-8 h-8" />}>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. What are Cookies?</h2>
      <p>Cookies are small text files stored on your device to help websites function properly. We use "Essential Cookies" to save your preferences, such as your choice of Light or Dark mode.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Cookies</h2>
      <p>We use session-based storage and local storage to remember your recent scans and interface settings. We may also use analytics cookies to understand how our tools are being used, which helps us improve the platform.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Managing Preferences</h2>
      <p>You can disable cookies in your browser settings, though some features of AutoSpex (like theme persistence) may not function correctly without them.</p>
    </section>
  </LegalLayout>
);

export const ContactUs: React.FC = () => (
  <LegalLayout title="Contact Us" icon={<MessageSquare className="w-8 h-8" />}>
    <div className="grid md:grid-cols-2 gap-12 mt-4">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h3>
          <p className="mb-6">Have questions about a diagnostic result or feedback for our team? We'd love to hear from you.</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Mail className="w-5 h-5 text-brand-primary" />
              <span>support@autospex.ai</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-brand-primary" />
              <span>Automotive Tech District, Austin, TX</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-2">Business Inquiries</h4>
          <p className="text-sm">For partnership or API access requests, please contact our business development team at <strong>partners@autospex.ai</strong>.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input type="email" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Message</label>
            <textarea rows={4} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-brand-primary outline-none transition-all" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full py-3 bg-brand-primary text-slate-900 font-bold rounded-xl hover:bg-orange-400 transition-colors flex items-center justify-center gap-2">
            Send Message <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </LegalLayout>
);
