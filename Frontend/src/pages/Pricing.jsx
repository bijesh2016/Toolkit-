import React, { useState } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, HelpCircle, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/soundEffects';

export default function Pricing({ onShowToast }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleUpgrade = (tier) => {
    playSuccessSound();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 }
    });
    if (onShowToast) onShowToast(`Activated ${tier} simulation! Instant access granted.`);
  };

  const faqs = [
    { q: 'Is the core tools hub completely free?', a: 'Yes! Over 50+ developer, document, calculation, and Nepal localization utilities are 100% free forever without requiring any account registration.' },
    { q: 'Which payment methods are supported in Nepal?', a: 'We support instant local digital wallets including eSewa, Khalti, FonePay, and ConnectIPS, along with international debit/credit cards.' },
    { q: 'Where are my files and tokens processed?', a: 'All file compressions, QR code generations, text differences, and JWT token decodings are processed locally inside your browser sandbox for privacy.' },
    { q: 'Can I cancel my Pro subscription anytime?', a: 'Yes, subscriptions can be cancelled or paused at any time without any lock-in contracts or hidden fees.' }
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
          Start free forever. Upgrade when you need unlimited disposable email inboxes, high-speed batch processing, or programmatic Swagger API tokens.
        </p>
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
            onClick={() => handleUpgrade('Free Forever')}
            className="mt-8 w-full py-3 rounded-xl bg-[#181b22] border border-[#222631] hover:border-[#323846] text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Current Plan
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
                <span>Dedicated Custom API Key for Swagger Docs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Unlimited AI Assistant & Translator Tokens</span>
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
              className="mt-5 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer"
            >
              Upgrade to Pro (NPR 499)
            </button>
          </div>
        </div>

        {/* Team Plan */}
        <div className="p-8 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team & Agency</span>
            <div className="font-display text-4xl font-black text-white mt-3">
              NPR 1,499 <span className="text-xs font-normal text-slate-500 font-mono">/ mo ($14.99)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-sans">For startups, design agencies, and development teams.</p>

            <ul className="mt-7 space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Up to 10 Team Member Accounts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-Speed Dedicated Proxy Rate Limits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Team Branding on PDF & Invoices</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated Slack & WhatsApp SLA Channel</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Team Agency')}
            className="mt-8 w-full py-3 rounded-xl bg-[#181b22] border border-[#222631] hover:border-[#323846] text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Upgrade to Team
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-10 border-t border-[#222631] max-w-4xl mx-auto space-y-6">
        <h3 className="font-display text-2xl font-black text-white text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqs.map(faq => (
            <div key={faq.q} className="p-6 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <h4 className="font-display font-bold text-sm text-white">{faq.q}</h4>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed font-sans">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
