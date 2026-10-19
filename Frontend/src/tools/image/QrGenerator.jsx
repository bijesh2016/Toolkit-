import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Download, Copy, Check, Sparkles, Globe, Wifi, 
  MessageSquare, User, Mail, Phone, FileText, Palette, 
  Upload, X, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

const COLOR_PRESETS = [
  { name: 'Classic Slate', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Royal Indigo', fg: '#4338ca', bg: '#ffffff' },
  { name: 'Emerald Green', fg: '#047857', bg: '#ffffff' },
  { name: 'Crimson Rose', fg: '#be123c', bg: '#ffffff' },
  { name: 'Sapphire Blue', fg: '#0284c7', bg: '#ffffff' },
  { name: 'Amber Sunset', fg: '#b45309', bg: '#fffbeb' },
  { name: 'Cyber Dark', fg: '#38bdf8', bg: '#0b1329' }
];

const PRESET_ICONS = [
  { id: 'none', label: 'No Logo' },
  { id: 'globe', label: 'Web [W]' },
  { id: 'wifi', label: 'WiFi [WF]' },
  { id: 'whatsapp', label: 'WhatsApp [WA]' },
  { id: 'user', label: 'Contact [ID]' },
  { id: 'mail', label: 'Mail [@]' },
  { id: 'star', label: 'Star [★]' },
  { id: 'nepal', label: 'Nepal [NP]' }
];

export default function QrGenerator({ onShowToast }) {
  // Content Type: 'url' | 'wifi' | 'whatsapp' | 'vcard' | 'email' | 'sms' | 'text'
  const [contentType, setContentType] = useState('url');

  // Form States
  const [url, setUrl] = useState('https://bijeshsharam.com.np');
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState('Nepal_Fiber_WiFi');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // WhatsApp
  const [waPhone, setWaPhone] = useState('9779800000000');
  const [waMessage, setWaMessage] = useState('Hello! I would like to get in touch.');

  // vCard Contact
  const [vcardName, setVcardName] = useState('Bijesh Sharma');
  const [vcardPhone, setVcardPhone] = useState('+977 9800000000');
  const [vcardEmail, setVcardEmail] = useState('contact@bijeshsharam.com.np');
  const [vcardOrg, setVcardOrg] = useState('Tools Hub Nepal');
  const [vcardTitle, setVcardTitle] = useState('Lead Engineer');
  const [vcardSite, setVcardSite] = useState('https://bijeshsharam.com.np');

  // Email
  const [emailTo, setEmailTo] = useState('bijesh@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry from Tools Hub');
  const [emailBody, setEmailBody] = useState('Hello Bijesh,');

  // SMS
  const [smsPhone, setSmsPhone] = useState('9800000000');
  const [smsMessage, setSmsMessage] = useState('Hello from Nepal Tools Hub!');

  // Plain Text
  const [plainText, setPlainText] = useState('Bijesh Sharma - Free Developer & Nepal Tools Hub');

  // Styling States
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(400);
  const [errorLevel, setErrorLevel] = useState('H'); // High error correction for logo safety
  const [frameText, setFrameText] = useState('SCAN ME');
  const [showFrame, setShowFrame] = useState(false);
  const [frameColor, setFrameColor] = useState('#4338ca');

  // Logo States
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('none');
  const [customLogoUrl, setCustomLogoUrl] = useState(null);

  // Output States
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef(null);

  // Compute Raw String to Encode based on Content Type
  const getEncodedPayload = () => {
    switch (contentType) {
      case 'url':
        return url.trim() || 'https://bijeshsharam.com.np';
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'whatsapp':
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nORG:${vcardOrg}\nTITLE:${vcardTitle}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nURL:${vcardSite}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'sms':
        return `smsto:${smsPhone}:${smsMessage}`;
      case 'text':
      default:
        return plainText || 'Bijesh Tools Hub';
    }
  };

  // Generate QR Code with custom Canvas composition (Logo + Frame)
  const generateQrCode = async () => {
    const payload = getEncodedPayload();
    if (!payload.trim()) return;

    try {
      // 1. Generate Base QR Code on an off-screen canvas
      const baseCanvas = document.createElement('canvas');
      await QRCode.toCanvas(baseCanvas, payload, {
        width: size,
        margin: showFrame ? 3 : 2,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: (selectedPresetIcon !== 'none' || customLogoUrl) ? 'H' : errorLevel
      });

      // 2. Final Canvas with Frame / Banner (if enabled)
      const finalCanvas = document.createElement('canvas');
      const extraHeight = showFrame ? 70 : 0;
      finalCanvas.width = size;
      finalCanvas.height = size + extraHeight;
      const ctx = finalCanvas.getContext('2d');

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw base QR
      ctx.drawImage(baseCanvas, 0, 0);

      // Draw Frame / Banner text at bottom
      if (showFrame && frameText) {
        ctx.fillStyle = frameColor;
        ctx.beginPath();
        // Rounded bottom banner
        const bannerY = size - 10;
        const bannerH = 65;
        ctx.roundRect(16, bannerY, size - 32, bannerH, 16);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(14, Math.floor(size * 0.05))}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText.toUpperCase(), size / 2, bannerY + bannerH / 2);
      }

      // 3. Draw Center Icon / Logo if chosen
      const drawCenterOverlay = () => {
        const logoSize = Math.floor(size * 0.22);
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Draw protective white circular/rounded shield behind logo
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12, 12);
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = fgColor;
        ctx.stroke();

        if (customLogoUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(logoX, logoY, logoSize, logoSize, 8);
            ctx.clip();
            ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            ctx.restore();
            setQrDataUrl(finalCanvas.toDataURL('image/png'));
          };
          img.src = customLogoUrl;
          return;
        }

        // Draw preset clean typographic monogram / symbol badges
        if (selectedPresetIcon !== 'none') {
          const symbolMap = {
            globe: 'W',
            wifi: 'WF',
            whatsapp: 'WA',
            user: 'ID',
            mail: '@',
            star: '★',
            nepal: 'NP'
          };
          const sym = symbolMap[selectedPresetIcon] || '★';

          ctx.fillStyle = '#4f46e5';
          ctx.font = `bold ${Math.floor(logoSize * (sym.length > 1 ? 0.42 : 0.6))}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sym, size / 2, size / 2);
          setQrDataUrl(finalCanvas.toDataURL('image/png'));
          return;
        }

        setQrDataUrl(finalCanvas.toDataURL('image/png'));
      };

      if (selectedPresetIcon !== 'none' || customLogoUrl) {
        drawCenterOverlay();
      } else {
        setQrDataUrl(finalCanvas.toDataURL('image/png'));
      }
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  };

  useEffect(() => {
    generateQrCode();
  }, [
    contentType, url, wifiSsid, wifiPassword, wifiEncryption, wifiHidden,
    waPhone, waMessage, vcardName, vcardPhone, vcardEmail, vcardOrg, vcardTitle, vcardSite,
    emailTo, emailSubject, emailBody, smsPhone, smsMessage, plainText,
    fgColor, bgColor, size, errorLevel, frameText, showFrame, frameColor,
    selectedPresetIcon, customLogoUrl
  ]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      playClickSound();
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogoUrl(event.target.result);
        setSelectedPresetIcon('none');
      };
      reader.readAsDataURL(file);
    }
  };

  // Download PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    playClickSound();
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-${contentType}-${Date.now()}.png`;
    link.click();
    if (onShowToast) onShowToast('Downloaded high-resolution QR PNG!');
  };

  // Download SVG
  const handleDownloadSvg = async () => {
    playClickSound();
    try {
      const payload = getEncodedPayload();
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${contentType}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      if (onShowToast) onShowToast('Downloaded crisp vector SVG!');
    } catch (e) {
      if (onShowToast) onShowToast('Error generating SVG.');
    }
  };

  // Copy QR Image to Clipboard
  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    playClickSound();
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      if (onShowToast) onShowToast('QR code image copied to clipboard!');
    } catch (e) {
      if (onShowToast) onShowToast('Direct image copy not supported in this browser.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Pro QR Code Studio & Designer
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Print & Vector Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Create custom branded QR codes for Websites, WiFi auto-connect, WhatsApp direct chat, and digital vCards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Resolution:</span>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value={300}>Standard (300px)</option>
            <option value={500}>High-Res (500px)</option>
            <option value={800}>Ultra Print (800px)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Settings on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Content & Style Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Content Type Tabs */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1. Select QR Data Type
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                onClick={() => { playClickSound(); setContentType('url'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'url' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> URL Link
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('wifi'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'wifi' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" /> WiFi Login
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('whatsapp'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'whatsapp' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('vcard'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'vcard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5" /> vCard Contact
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('email'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('sms'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'sms' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> SMS Text
              </button>
              <button
                onClick={() => { playClickSound(); setContentType('text'); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contentType === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Plain Text
              </button>
            </div>
          </div>

          {/* Dynamic Inputs according to content type */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              2. Enter Information
            </span>

            {contentType === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website URL / Destination Link</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {contentType === 'wifi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={e => setWifiSsid(e.target.value)}
                      placeholder="My_Home_WiFi"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">WiFi Password</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={e => setWifiPassword(e.target.value)}
                      placeholder="Leave empty if open"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Security Type</label>
                    <select
                      value={wifiEncryption}
                      onChange={e => setWifiEncryption(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-4 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={e => setWifiHidden(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    Hidden Network (SSID)
                  </label>
                </div>
              </div>
            )}

            {contentType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    WhatsApp Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={e => setWaPhone(e.target.value)}
                    placeholder="9779800000000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">For Nepal: 97798XXXXXXXX (no spaces or '+' sign)</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pre-filled Chat Message</label>
                  <textarea
                    value={waMessage}
                    onChange={e => setWaMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {contentType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={e => setVcardName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={vcardPhone}
                    onChange={e => setVcardPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={e => setVcardEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={e => setVcardOrg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={vcardTitle}
                    onChange={e => setVcardTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={vcardSite}
                    onChange={e => setVcardSite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {contentType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Message Body</label>
                  <textarea
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {contentType === 'sms' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Recipient Phone Number</label>
                  <input
                    type="text"
                    value={smsPhone}
                    onChange={e => setSmsPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">SMS Message</label>
                  <textarea
                    value={smsMessage}
                    onChange={e => setSmsMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {contentType === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Plain Text or Note</label>
                <textarea
                  value={plainText}
                  onChange={e => setPlainText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Color & Branding Palette */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              3. Colors & Presets
            </span>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    setFgColor(preset.fg);
                    setBgColor(preset.bg);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-2 border border-slate-700/50"
                >
                  <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: preset.fg }} />
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Foreground Color</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Background Color</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Logo & Banner Frame */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              4. Center Logo & "Scan Me" Banner
            </span>

            {/* Preset Logos */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Center Brand Icon</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedPresetIcon(icon.id);
                      setCustomLogoUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedPresetIcon === icon.id && !customLogoUrl
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {icon.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Custom Logo */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Or Upload Custom Logo / Picture</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  Choose File (PNG/JPEG)
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {customLogoUrl && (
                  <button
                    onClick={() => setCustomLogoUrl(null)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Remove Logo
                  </button>
                )}
              </div>
            </div>

            {/* Scan Me Frame Banner */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={showFrame}
                  onChange={e => setShowFrame(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span className="font-semibold text-white">Add "SCAN ME" Call-To-Action Banner at Bottom</span>
              </label>

              {showFrame && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Banner Text</label>
                    <input
                      type="text"
                      value={frameText}
                      onChange={e => setFrameText(e.target.value)}
                      placeholder="SCAN ME"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Banner Background Color</label>
                    <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-700 rounded-xl">
                      <input
                        type="color"
                        value={frameColor}
                        onChange={e => setFrameColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[11px] font-mono text-slate-300">{frameColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview & Export Box (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/20 shadow-2xl flex flex-col items-center justify-between sticky top-6">
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <span className="font-semibold text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Live High-Res QR Preview
              </span>
              <span className="text-slate-500">{size}x{size}px • Error H (30%)</span>
            </div>

            {/* Rendered QR Card */}
            <div className="my-6 p-5 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center max-w-[320px] transition-transform hover:scale-[1.02]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-full object-contain drop-shadow-sm rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR Code...
                </div>
              )}
            </div>

            {/* Quick Test Payload Display */}
            <div className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 break-all mb-4 max-h-20 overflow-y-auto">
              <span className="text-slate-500 block mb-0.5">Payload Content:</span>
              {getEncodedPayload()}
            </div>

            {/* Export Buttons */}
            <div className="w-full space-y-2.5">
              <button
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Download className="w-4 h-4" /> Download High-Res PNG ({size}px)
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadSvg}
                  disabled={!qrDataUrl}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Vector SVG
                </button>

                <button
                  onClick={handleCopyImage}
                  disabled={!qrDataUrl}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied!' : 'Copy Image'}
                </button>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="mt-4 pt-4 border-t border-slate-800 w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side generation • Never sent to any server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
