import React from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PricingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSimulateUpgrade = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert('Pro Plan Activated: You now have unlimited AI tokens and custom API Key access in your browser session.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#13151b] border border-[#222631] rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#181b22] border border-[#222631] text-slate-400 hover:text-white hover:border-[#323846] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tools Hub Pro Membership</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Level up your daily workflow
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Affordable pricing designed for creators, developers, students, and businesses in Nepal and worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-[#0a0b0f] border border-[#222631] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-400">Free Tier</div>
              <div className="text-3xl font-bold text-white mt-2">NPR 0 <span className="text-sm font-normal text-slate-500 font-mono">/ forever</span></div>
              <p className="text-xs text-slate-400 mt-2">Ideal for quick daily utilities, students, and everyday tasks.</p>
              
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>50+ Free Client-Side Tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% In-Browser Privacy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>20 Daily AI Mini-Tool Quota</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Nepal BS-AD & Typing Suite</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full py-2.5 rounded-xl border border-[#222631] bg-[#181b22] hover:border-[#323846] text-slate-300 text-sm font-medium transition-colors cursor-pointer"
            >
              Continue with Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-2xl bg-[#161922] border-2 border-indigo-500/60 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-indigo-600 text-[11px] font-bold text-white uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="text-sm font-semibold text-indigo-400">Pro Professional</div>
              <div className="text-3xl font-bold text-white mt-2">
                NPR 499 <span className="text-sm font-normal text-slate-400 font-mono">/ month ($4.99)</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For power developers, agencies, and businesses in Nepal.</p>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited AI Mini-Tool Invocations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom API Key for Swagger / API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Batch Image & PDF Processing (100MB+)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Branded IRD Nepal Invoices & PDF Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority Support & Verified Workspaces</span>
                </li>
              </ul>
            </div>

            <div>
              {/* Local Payment Badges */}
              <div className="mt-6 pt-4 border-t border-[#222631]">
                <div className="text-[11px] text-slate-400 font-medium mb-2">Supported Payment Gateways in Nepal:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold">eSewa</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/60 font-semibold">Khalti</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-semibold">FonePay</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60 font-semibold">ConnectIPS</span>
                  <span className="px-2 py-0.5 rounded bg-[#181b22] text-slate-300 font-semibold border border-[#222631]">Cards</span>
                </div>
              </div>

              <button
                onClick={handleSimulateUpgrade}
                className="mt-5 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all transform active:scale-95 cursor-pointer"
              >
                Upgrade to Pro (NPR 499/mo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
