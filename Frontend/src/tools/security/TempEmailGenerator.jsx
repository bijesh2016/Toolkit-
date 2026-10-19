import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Inbox, Copy, Check, RefreshCw, Trash2, QrCode as QrIcon, 
  Sparkles, ShieldCheck, Clock, Send, Key, Lock, Crown, 
  ExternalLink, ChevronRight, AlertCircle, X, Flame, Eye,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  isProMember, 
  setProMember, 
  getEmailGenerationCount, 
  incrementEmailGenerationCount, 
  canGenerateEmail 
} from '../../utils/storage';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

const DOMAINS = ['bijeshmail.com', 'inboxnepal.com', 'devverify.net', 'tempmail.bijeshsharam.com'];

export default function TempEmailGenerator({ onShowToast, onOpenPricing }) {
  // Active Mailbox States
  const [activeAddress, setActiveAddress] = useState('');
  const [activeDomain, setActiveDomain] = useState('bijeshmail.com');
  const [customPrefix, setCustomPrefix] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiresInMinutes, setExpiresInMinutes] = useState(60);

  // Inbox & Messages States
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshCount, setAutoRefreshCount] = useState(5);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // UI & Pro States
  const [isCopiedAddress, setIsCopiedAddress] = useState(false);
  const [isCopiedOtp, setIsCopiedOtp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showProModal, setShowProModal] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [viewMode, setViewMode] = useState('html'); // 'html' | 'text'

  const autoRefreshTimerRef = useRef(null);

  // Sync Pro status and load initial mailbox
  useEffect(() => {
    setIsPro(isProMember());
    
    // Check if there is an existing mailbox stored in session
    const savedMailbox = sessionStorage.getItem('toolshub_active_mailbox');
    if (savedMailbox) {
      setActiveAddress(savedMailbox);
      fetchInbox(savedMailbox);
    } else {
      createNewMailbox(false);
    }
  }, []);

  // Countdown timer for auto-refresh
  useEffect(() => {
    if (!activeAddress) return;

    const interval = setInterval(() => {
      setAutoRefreshCount(prev => {
        if (prev <= 1) {
          fetchInbox(activeAddress, true);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAddress]);

  // Generate QR code for active email address
  useEffect(() => {
    if (activeAddress && showQrModal) {
      QRCode.toDataURL(activeAddress, { width: 260, margin: 2 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [activeAddress, showQrModal]);

  // Fetch emails for the active mailbox
  const fetchInbox = async (address, silent = false) => {
    if (!address) return;
    if (!silent) setIsRefreshing(true);

    try {
      const res = await fetch(`/api/tools/temp-mail/inbox/${encodeURIComponent(address)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setEmails(json.data.emails || []);
        // Auto-select latest message if none is selected
        if (!selectedEmail && json.data.emails?.length > 0) {
          setSelectedEmail(json.data.emails[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching inbox:', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Create new disposable mailbox
  const createNewMailbox = async (userTriggered = true) => {
    // Check Pro Quota Limitation (Max 2 free inboxes)
    if (userTriggered && !canGenerateEmail()) {
      setShowProModal(true);
      return;
    }

    playClickSound();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/tools/temp-mail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: activeDomain,
          customPrefix: customPrefix.trim() || undefined
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const newAddress = json.data.address;
        setActiveAddress(newAddress);
        sessionStorage.setItem('toolshub_active_mailbox', newAddress);
        setEmails([]);
        setSelectedEmail(null);
        setExpiresInMinutes(60);

        if (userTriggered) {
          incrementEmailGenerationCount();
        }

        // Fetch welcome email
        await fetchInbox(newAddress);

        if (onShowToast) {
          onShowToast(`New disposable email created: ${newAddress}`);
        }
      }
    } catch (err) {
      console.error('Failed to create mailbox:', err);
      if (onShowToast) onShowToast('Error generating email. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Send test OTP verification email
  const handleSendTestEmail = async (serviceType = 'github') => {
    if (!activeAddress) return;
    playClickSound();
    setIsSendingTest(true);

    try {
      const res = await fetch('/api/tools/temp-mail/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: activeAddress,
          service: serviceType
        })
      });

      const json = await res.json();
      if (json.success && json.data?.email) {
        playSuccessSound();
        setEmails(prev => [json.data.email, ...prev]);
        setSelectedEmail(json.data.email);
        if (onShowToast) {
          onShowToast(`Verification email received with OTP: ${json.data.otp}`);
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to deliver test email.');
    } finally {
      setIsSendingTest(false);
    }
  };

  // Copy Email Address
  const handleCopyAddress = () => {
    if (!activeAddress) return;
    playClickSound();
    navigator.clipboard.writeText(activeAddress);
    setIsCopiedAddress(true);
    setTimeout(() => setIsCopiedAddress(false), 2000);
    if (onShowToast) onShowToast('Email address copied to clipboard!');
  };

  // Copy OTP Code
  const handleCopyOtp = (code) => {
    if (!code) return;
    playClickSound();
    navigator.clipboard.writeText(code);
    setIsCopiedOtp(true);
    setTimeout(() => setIsCopiedOtp(false), 2000);
    if (onShowToast) onShowToast(`OTP Code ${code} copied to clipboard!`);
  };

  // Delete / Burn current mailbox
  const handleBurnMailbox = async () => {
    if (!activeAddress) return;
    playClickSound();

    try {
      await fetch(`/api/tools/temp-mail/inbox/${encodeURIComponent(activeAddress)}`, {
        method: 'DELETE'
      });
      sessionStorage.removeItem('toolshub_active_mailbox');
      setActiveAddress('');
      setEmails([]);
      setSelectedEmail(null);
      if (onShowToast) onShowToast('Mailbox burned and deleted successfully.');
      createNewMailbox(false);
    } catch (e) {}
  };

  // Activate Pro Simulator
  const handleActivatePro = () => {
    setProMember(true);
    setIsPro(true);
    setShowProModal(false);
    playSuccessSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (onShowToast) {
      onShowToast('Pro Membership activated: Enjoy unlimited disposable inboxes.');
    }
  };

  const emailCount = getEmailGenerationCount();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Quota Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Free Disposable Email & OTP Inbox
              {isPro ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Pro Member (Unlimited)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Free Tier: {Math.min(2, emailCount)} / 2 Inboxes Used
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Disposable temporary inboxes to sign up anywhere, bypass spam, and auto-detect OTP verification codes
            </p>
          </div>
        </div>

        {!isPro && (
          <button
            onClick={() => { playClickSound(); setShowProModal(true); }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            Upgrade to Pro (NPR 499)
          </button>
        )}
      </div>

      {/* Main Mailbox Control Card */}
      <div className="p-6 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Your Active Temporary Email Address
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight break-all">
                {activeAddress || 'Generating temporary mailbox...'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyAddress}
              disabled={!activeAddress}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
            >
              {isCopiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopiedAddress ? 'Copied' : 'Copy Address'}
            </button>

            <button
              onClick={() => { playClickSound(); setShowQrModal(true); }}
              disabled={!activeAddress}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Show QR Code of Email Address"
            >
              <QrIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleBurnMailbox}
              disabled={!activeAddress}
              className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Burn and delete this mailbox immediately"
            >
              <Flame className="w-3.5 h-3.5" /> Burn Mailbox
            </button>
          </div>
        </div>

        {/* Generator Controls & Expiry */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-slate-400">Domain:</span>
            <select
              value={activeDomain}
              onChange={(e) => setActiveDomain(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              {DOMAINS.map(d => (
                <option key={d} value={d}>@{d}</option>
              ))}
            </select>

            <button
              onClick={() => createNewMailbox(true)}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate New Email
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Expires in: <strong className="text-white">{expiresInMinutes}:00 mins</strong>
            </span>
            <button
              onClick={() => { playClickSound(); setExpiresInMinutes(60); if (onShowToast) onShowToast('Lifespan extended by +60 minutes'); }}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Extend +60m
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEPARATE DEDICATED INBOX SECTION (अलग इनबक्स खण्ड) */}
      {/* ============================================================== */}
      <div className="p-6 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm space-y-4">
        {/* Inbox Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222631]">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">
              Mailbox Inbox ({emails.length} {emails.length === 1 ? 'Message' : 'Messages'})
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#181b22] px-2.5 py-1 rounded-full border border-[#222631]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Auto-checking in {autoRefreshCount}s
            </span>
          </div>

          {/* Test OTP Simulator & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400 pl-2">Test OTP:</span>
              <button
                onClick={() => handleSendTestEmail('github')}
                disabled={isSendingTest}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-200 text-xs font-medium transition-colors"
              >
                GitHub
              </button>
              <button
                onClick={() => handleSendTestEmail('google')}
                disabled={isSendingTest}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-200 text-xs font-medium transition-colors"
              >
                Google
              </button>
              <button
                onClick={() => handleSendTestEmail('esewa')}
                disabled={isSendingTest}
                className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-medium transition-colors"
              >
                eSewa 🇳🇵
              </button>
            </div>

            <button
              onClick={() => { playClickSound(); fetchInbox(activeAddress); }}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Check for new messages now"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dual Inbox Workspace: List on Left (5 cols), Reader on Right (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[460px]">
          {/* Email List Column */}
          <div className="lg:col-span-5 flex flex-col space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {emails.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 my-auto">
                <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">Your Inbox is Empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Use this email address to register or click one of the <strong>Test OTP</strong> buttons above to see live reception.
                </p>
              </div>
            ) : (
              emails.map((mail) => {
                const isSelected = selectedEmail?.id === mail.id;
                return (
                  <div
                    key={mail.id}
                    onClick={() => { playClickSound(); setSelectedEmail(mail); }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                        {mail.from.split('<')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-white truncate mb-1">
                      {mail.subject}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {mail.text}
                    </p>

                    {/* Prominent OTP Extracted Badge in list */}
                    {mail.otp && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        <Key className="w-3 h-3" />
                        <span>OTP: {mail.otp}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Email Reader Pane */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Header Information */}
                <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {selectedEmail.subject}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span><strong>From:</strong> {selectedEmail.from}</span>
                      <span>•</span>
                      <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'html' ? 'text' : 'html')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      {viewMode === 'html' ? 'View Plain Text' : 'View HTML'}
                    </button>
                  </div>
                </div>

                {/* HERO PROMINENT OTP CALLOUT CARD */}
                {selectedEmail.otp && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                          Detected Verification Code (OTP)
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-white tracking-widest">
                          {selectedEmail.otp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyOtp(selectedEmail.otp)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all shrink-0"
                    >
                      {isCopiedOtp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {isCopiedOtp ? 'Code Copied' : `Copy OTP (${selectedEmail.otp})`}
                    </button>
                  </div>
                )}

                {/* Email Content Body */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 max-h-[340px] overflow-y-auto">
                  {viewMode === 'html' ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedEmail.html }} 
                      className="text-sm text-slate-200 leading-relaxed font-sans"
                    />
                  ) : (
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                      {selectedEmail.text}
                    </pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 text-slate-500 space-y-2">
                <Inbox className="w-12 h-12 mx-auto text-slate-700" />
                <p className="text-sm font-medium text-slate-400">
                  Select a message from the left to read its contents
                </p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Any OTP or verification code sent to {activeAddress} will automatically be highlighted above for fast 1-click copying.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRO PAYWALL MODAL (Triggered when exceeding 2 inboxes) */}
      {/* ============================================================== */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Free Inboxes Quota Limit Reached
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have generated <strong>2/2 free disposable inboxes</strong>. To create additional simultaneous inboxes, upgrade to Tools Hub Pro.
              </p>
            </div>

            {/* Pro Features Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited simultaneous disposable inboxes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom mailbox usernames (e.g. yourname@bijeshmail.com)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Permanent email storage & webhook forwarding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited AI tokens and priority API access</span>
              </div>
            </div>

            {/* Pricing Offer */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Membership Fee</span>
                <span className="text-xl font-extrabold text-white">NPR 499 <span className="text-xs font-normal text-slate-400">/ month</span></span>
              </div>
              <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Cancel Anytime
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleActivatePro}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Activate Pro Membership (Instant Demo)
              </button>

              <button
                onClick={() => { setShowProModal(false); if (onOpenPricing) onOpenPricing(); }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                View Full Pricing Page <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Email Address */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white">
              Scan to Copy Email Address
            </h3>

            <div className="p-4 bg-white rounded-2xl mx-auto inline-block shadow-lg">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />}
            </div>

            <p className="text-xs font-mono text-slate-400 break-all">
              {activeAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
