import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, HelpCircle, Crown, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound, playClickSound } from '../utils/soundEffects';
import { isProMember, setProMember } from '../utils/storage';

export default function Pricing({ onShowToast }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(isProMember());
    const handleProUpdate = () => setIsPro(isProMember());
    window.addEventListener('toolshub_pro_updated', handleProUpdate);
    return () => window.removeEventListener('toolshub_pro_updated', handleProUpdate);
  }, []);

  const handleUpgrade = (tier) => {
    if (tier === 'Pro' || tier === 'Team') {
      setProMember(true);
      setIsPro(true);
      playSuccessSound();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onShowToast) onShowToast(`🎉 Activated ${tier} Membership! Unlimited batch downloads, 4K media, and disposable emails unlocked.`);
    } else {
      setProMember(false);
      setIsPro(false);
      playClickSound();
      if (onShowToast) onShowToast('Switched back to Free Tier.');
    }
  };

  const faqs = [
    { q: 'Is the core tools hub completely free?', a: 'Yes! Over 50+ developer, document, calculation, and Nepal localization utilities are 100% free forever without requiring any account registration.' },
    { q: 'Which payment methods are supported in Nepal?', a: 'We support instant local digital wallets including eSewa, Khalti, FonePay, and ConnectIPS, along with international debit/credit cards.' },
    { q: 'Where are my files and tokens processed?', a: 'All file compressions, QR code generations, text differences, and JWT token decodings are processed locally inside your browser sandbox for privacy.' },
    { q: 'Can I cancel or switch my Pro status anytime?', a: 'Yes, subscriptions can be activated, cancelled or reset at any time with one click.' }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Tools that pay for themselves
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Start free forever. Upgrade when you need unlimited disposable email inboxes, high-speed batch playlist downloads, or programmatic Swagger API tokens.
        </p>

        {isPro && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg animate-pulse">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Pro Membership is Currently Active on this Browser</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Free Forever</span>
            <div className="font-display text-4xl font-black text-white mt-3">
              NPR 0 <span className="text-xs font-normal text-slate-500 font-mono">/ forever</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-sans">Essential tools for students, freelancers, and daily users.</p>

            <ul className="mt-7 space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>50+ Free Client-Side Utilities</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% In-Browser Privacy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2 Free Disposable Email Inboxes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Nepal Localization Suite</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Free')}
            className={`mt-8 w-full py-3 rounded-xl border border-[#222631] text-xs font-bold transition-all cursor-pointer ${
              !isPro ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-[#181b22] hover:border-[#323846] text-slate-300'
            }`}
          >
            {!isPro ? '✓ Current Active Plan' : 'Switch to Free Tier'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-2xl bg-[#161922] border-2 border-indigo-500/60 flex flex-col justify-between relative shadow-xl">
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-indigo-600 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest">
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Pro Developer & Creator</span>
            </div>
            <div className="font-display text-4xl font-black text-white mt-3">
              NPR 499 <span className="text-xs font-normal text-slate-400 font-mono">/ mo ($4.99)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-sans">For power developers, agencies, and businesses in Nepal.</p>

            <ul className="mt-7 space-y-3.5 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-semibold">Unlimited Disposable Email Inboxes & OTPs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Unlimited Batch Playlist & 4K Media Downloads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dedicated Custom API Key for Swagger Docs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Unlimited AI Assistant & Code Tokens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Nepal IRD Compliant Invoices & PAN Export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority Developer Email & Direct Support</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="mt-7 pt-4 border-t border-[#222631]">
              <div className="text-[11px] text-slate-400 font-semibold mb-2">Supported Nepal Gateways:</div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800/60">eSewa</span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-950/60 text-purple-300 font-bold border border-purple-800/60">Khalti</span>
                <span className="px-2.5 py-1 rounded-xl bg-rose-950/60 text-rose-300 font-bold border border-rose-800/60">FonePay</span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade('Pro')}
              className="mt-5 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{isPro ? 'Pro Active (Click to Re-activate)' : 'Upgrade to Pro (NPR 499)'}</span>
            </button>
          </div>
        </div>

        {/* Team Plan */}
        <div className="p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team & Organization</span>
            <div className="font-display text-4xl font-black text-white mt-3">
              NPR 1,499 <span className="text-xs font-normal text-slate-500 font-mono">/ mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-sans">For engineering teams, schools, and growing digital agencies.</p>

            <ul className="mt-7 space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Everything in Pro for up to 10 Seats</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Shared Team Snippets & Templates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>White-Label Branding on Invoices & Certificates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dedicated Web Inspection Proxy</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Team')}
            className="mt-8 w-full py-3 rounded-xl bg-[#181b22] border border-[#222631] hover:border-[#323846] text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {isPro ? 'Team Tier Active' : 'Activate Team Tier'}
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white text-center">
          Frequently Asked Questions
        </h3>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-2xl bg-[#13151b] border border-[#222631]">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
