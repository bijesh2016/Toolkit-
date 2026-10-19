import React, { useState, useEffect, useRef } from 'react';
import { 
  Keyboard, Copy, Download, Trash2, Check, Sparkles, 
  ArrowRightLeft, BookOpen, HelpCircle, FileText, RefreshCw 
} from 'lucide-react';
import { 
  romanizedToNepali, 
  preetiToUnicode, 
  unicodeToPreeti, 
  transliterateWord 
} from '../../utils/nepaliTransliterate';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

export default function NepaliUnicodeTyping({ onShowToast }) {
  // Mode selection: 'romanized' | 'preetiToUni' | 'uniToPreeti' | 'keyboard'
  const [activeTab, setActiveTab] = useState('romanized');

  // Romanized Mode States
  const [romanInput, setRomanInput] = useState('');
  const [unicodeOutput, setUnicodeOutput] = useState('');
  const [inPlaceMode, setInPlaceMode] = useState(false);
  const [inPlaceText, setInPlaceText] = useState('');

  // Preeti to Unicode States
  const [preetiInput, setPreetiInput] = useState('');
  const [preetiOutput, setPreetiOutput] = useState('');

  // Unicode to Preeti States
  const [uniPreetiInput, setUniPreetiInput] = useState('');
  const [uniPreetiOutput, setUniPreetiOutput] = useState('');

  // UI States
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [copiedMode, setCopiedMode] = useState(null);

  // References
  const inPlaceRef = useRef(null);

  // Real-time Romanized conversion
  useEffect(() => {
    if (activeTab === 'romanized' && !inPlaceMode) {
      setUnicodeOutput(romanizedToNepali(romanInput));
    }
  }, [romanInput, activeTab, inPlaceMode]);

  // Real-time Preeti to Unicode conversion
  useEffect(() => {
    if (activeTab === 'preetiToUni') {
      setPreetiOutput(preetiToUnicode(preetiInput));
    }
  }, [preetiInput, activeTab]);

  // Real-time Unicode to Preeti conversion
  useEffect(() => {
    if (activeTab === 'uniToPreeti') {
      setUniPreetiOutput(unicodeToPreeti(uniPreetiInput));
    }
  }, [uniPreetiInput, activeTab]);

  // Handle in-place space-triggered typing
  const handleInPlaceKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === '.') {
      const textarea = inPlaceRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = inPlaceText.substring(0, cursorPos);
      const textAfterCursor = inPlaceText.substring(cursorPos);

      // Extract last word before cursor
      const match = textBeforeCursor.match(/([a-zA-Z0-9~_\\:]+)$/);
      if (match) {
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const newBefore = textBeforeCursor.substring(0, textBeforeCursor.length - lastWord.length) + converted;
        
        let delimiter = e.key;
        if (e.key === '.') delimiter = '।';

        e.preventDefault();
        const updated = newBefore + delimiter + textAfterCursor;
        setInPlaceText(updated);

        // Move cursor forward
        setTimeout(() => {
          if (textarea) {
            const nextPos = newBefore.length + delimiter.length;
            textarea.selectionStart = nextPos;
            textarea.selectionEnd = nextPos;
          }
        }, 0);
      } else if (e.key === '.') {
        // Replace '.' with '।'
        e.preventDefault();
        const updated = textBeforeCursor + '।' + textAfterCursor;
        setInPlaceText(updated);
        setTimeout(() => {
          if (textarea) {
            const nextPos = textBeforeCursor.length + 1;
            textarea.selectionStart = nextPos;
            textarea.selectionEnd = nextPos;
          }
        }, 0);
      }
    }
  };

  const handleCopy = (text, modeKey) => {
    if (!text) return;
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedMode(modeKey);
    setTimeout(() => setCopiedMode(null), 2000);
    if (onShowToast) onShowToast('Copied to clipboard successfully!');
  };

  const handleDownload = (text, filename) => {
    if (!text) return;
    playClickSound();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Downloaded as file!');
  };

  const insertSymbol = (char) => {
    playClickSound();
    if (activeTab === 'romanized') {
      if (inPlaceMode) {
        setInPlaceText(prev => prev + char);
      } else {
        setUnicodeOutput(prev => prev + char);
      }
    } else if (activeTab === 'preetiToUni') {
      setPreetiOutput(prev => prev + char);
    } else if (activeTab === 'uniToPreeti') {
      setUniPreetiInput(prev => prev + char);
    }
  };

  const loadSample = (sampleType) => {
    playClickSound();
    if (sampleType === 'romanized') {
      setRomanInput('namaste! mero desh nepal ho. kathmandu ra pokhara dherai ramro cha. aaja tapailai kasto cha?');
    } else if (sampleType === 'preeti') {
      setPreetiInput('g]kfn ;\'Gb/ b]z xf] . s7df8f}+ g]kfnsf] /fhwfgL xf] . zdf{ / >]i7 g]kfndf a:5g\\ .');
    } else if (sampleType === 'unicode') {
      setUniPreetiInput('नेपाल सुन्दर देश हो। काठमाडौँ नेपालको राजधानी हो। बिजेश शर्मा tools hub चलाउँदै छन्।');
    }
  };

  // Quick Devanagari Modifiers
  const quickModifiers = ['।', '॥', 'ं', 'ँ', 'ः', '्', 'ॐ', '‍'];

  // Virtual Keyboard Data
  const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
  const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ँ', 'ः', '्'];
  const consonants = [
    ['क', 'ख', 'ग', 'घ', 'ङ'],
    ['च', 'छ', 'ज', 'झ', 'ञ'],
    ['ट', 'ठ', 'ड', 'ढ', 'ण'],
    ['त', 'थ', 'द', 'ध', 'न'],
    ['प', 'फ', 'ब', 'भ', 'म'],
    ['य', 'र', 'ल', 'व'],
    ['श', 'ष', 'स', 'ह'],
    ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'द्य', 'द्व']
  ];
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Mode Selector */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0e1328]/95 via-[#0a0e20]/95 to-[#0e1328]/95 border border-white/[0.08] shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-base sm:text-lg font-black text-white flex items-center gap-2">
              Nepali Unicode & Preeti Suite
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                100% Accurate UTF-8
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Devanagari Romanized typing, Preeti & Kantipur font converters, and On-screen keyboard
            </p>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); setShowCheatSheet(!showCheatSheet); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative z-10 ${
            showCheatSheet 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'bg-[#181b22] border border-[#222631] text-slate-300 hover:text-white hover:border-[#323846]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showCheatSheet ? 'Hide Typing Guide' : 'Typing Guide (गाइड)'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#13151b] border border-[#222631] shadow-sm">
        <button
          onClick={() => { playClickSound(); setActiveTab('romanized'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'romanized'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#181b22]'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Romanized ➔ Unicode</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('preetiToUni'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'preetiToUni'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#181b22]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Preeti ➔ Unicode</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('uniToPreeti'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'uniToPreeti'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#181b22]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Unicode ➔ Preeti</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('keyboard'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'keyboard'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#181b22]'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          Virtual Keyboard
        </button>
      </div>

      {/* Typing Cheat Sheet (Collapsible) */}
      {showCheatSheet && (
        <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] space-y-3 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-indigo-400">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Nepali Romanized Typing Cheat Sheet (टाइपिङ नियमहरू)
            </span>
            <span className="text-slate-400">MPP / Google Input Tools Compliant</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ka = </span><strong className="text-white">क</strong>, 
              <span className="text-slate-400"> kaa = </span><strong className="text-white">का</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ki = </span><strong className="text-white">कि</strong>, 
              <span className="text-slate-400"> kee = </span><strong className="text-white">की</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ku = </span><strong className="text-white">कु</strong>, 
              <span className="text-slate-400"> koo = </span><strong className="text-white">कू</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ke = </span><strong className="text-white">के</strong>, 
              <span className="text-slate-400"> kai = </span><strong className="text-white">कै</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ko = </span><strong className="text-white">को</strong>, 
              <span className="text-slate-400"> kau = </span><strong className="text-white">कौ</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">ksha / x = </span><strong className="text-white">क्ष</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">tra = </span><strong className="text-white">त्र</strong>, 
              <span className="text-slate-400"> gyan = </span><strong className="text-white">ज्ञान</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">shra = </span><strong className="text-white">श्र</strong>, 
              <span className="text-slate-400"> dya = </span><strong className="text-white">द्य</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">. = </span><strong className="text-white">। (पूर्णविराम)</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">.. = </span><strong className="text-white">॥ (दीर्घ विराम)</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">~ = </span><strong className="text-white">ँ (चन्द्रविन्दु)</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400">om = </span><strong className="text-white">ॐ</strong>, 
              <span className="text-slate-400"> \ = </span><strong className="text-white">हलन्त (्)</strong>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: ROMANIZED TO UNICODE */}
      {/* ============================================================== */}
      {activeTab === 'romanized' && (
        <div className="space-y-4">
          {/* Sub-mode toggle: Dual Pane vs In-Place */}
          <div className="flex items-center justify-between text-xs px-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Typing Mode:</span>
              <button
                onClick={() => { playClickSound(); setInPlaceMode(false); }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  !inPlaceMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Dual Side-by-Side
              </button>
              <button
                onClick={() => { playClickSound(); setInPlaceMode(true); }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  inPlaceMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                In-Place Live (Space to Convert)
              </button>
            </div>

            <button
              onClick={() => loadSample('romanized')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Example
            </button>
          </div>

          {!inPlaceMode ? (
            /* Dual Side-by-Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Romanized Input */}
              <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-indigo-400" />
                    Romanized English Input
                  </span>
                  <span className="text-slate-500">e.g. namaste mero desh nepal ho</span>
                </div>
                <textarea
                  value={romanInput}
                  onChange={(e) => setRomanInput(e.target.value)}
                  placeholder="Type English phonetics here... (try: mero naam bijesh sharma ho. ma nepali hu.)"
                  className="flex-1 w-full bg-transparent text-slate-100 placeholder-slate-600 resize-none py-3 focus:outline-none text-sm leading-relaxed"
                />
                <div className="pt-2 border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
                  <span>{romanInput.length} characters</span>
                  <button
                    onClick={() => { playClickSound(); setRomanInput(''); setUnicodeOutput(''); }}
                    className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              </div>

              {/* Nepali Unicode Output */}
              <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm relative">
                <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                  <span className="font-semibold text-indigo-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Devanagari Unicode Output (नेपाली युनिकोड)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(unicodeOutput, 'romanized')}
                      disabled={!unicodeOutput}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs"
                    >
                      {copiedMode === 'romanized' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedMode === 'romanized' ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDownload(unicodeOutput, 'nepali-unicode.txt')}
                      disabled={!unicodeOutput}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
                      title="Download as .txt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={unicodeOutput}
                  onChange={(e) => setUnicodeOutput(e.target.value)}
                  placeholder="नेपाली युनिकोड यहाँ तुरुन्तै देखिनेछ..."
                  className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-base font-devanagari leading-relaxed"
                />
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>{unicodeOutput.length} नेपाली characters</span>
                  <span className="text-emerald-400 font-medium">Standard Unicode UTF-8</span>
                </div>
              </div>
            </div>
          ) : (
            /* In-Place Converter Box */
            <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 flex flex-col h-96 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-semibold text-indigo-400 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Live In-Place Typing (Space वा Fullstop थिच्दा तुरुन्तै परिवर्तन हुन्छ)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(inPlaceText, 'inplace')}
                    disabled={!inPlaceText}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs"
                  >
                    {copiedMode === 'inplace' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMode === 'inplace' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownload(inPlaceText, 'nepali-unicode.txt')}
                    disabled={!inPlaceText}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                ref={inPlaceRef}
                value={inPlaceText}
                onChange={(e) => setInPlaceText(e.target.value)}
                onKeyDown={handleInPlaceKeyDown}
                placeholder="यहाँ अङ्ग्रेजीमा टाइप गर्नुहोस् र Space थिच्नुहोस्... (जस्तै: mero desh nepal ho)"
                className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-base font-devanagari leading-relaxed"
              />
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{inPlaceText.length} characters</span>
                <button
                  onClick={() => { playClickSound(); setInPlaceText(''); }}
                  className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PREETI TO UNICODE */}
      {/* ============================================================== */}
      {activeTab === 'preetiToUni' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="text-slate-400">
              Paste traditional Preeti / Kantipur text to convert to universal Devanagari Unicode.
            </span>
            <button
              onClick={() => loadSample('preeti')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Preeti Example
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preeti Input */}
            <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Preeti Font Text (प्रिती फन्ट टेक्स्ट)
                </span>
                <span className="text-slate-500">e.g. g]kfn, {"zdf{"}</span>
              </div>
              <textarea
                value={preetiInput}
                onChange={(e) => setPreetiInput(e.target.value)}
                placeholder="Paste Preeti or Kantipur ASCII text here... (e.g. g]kfn ;'Gb/ b]z xf] .)"
                className="flex-1 w-full bg-transparent text-slate-100 placeholder-slate-600 resize-none py-3 focus:outline-none text-sm font-mono leading-relaxed"
              />
              <div className="pt-2 border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
                <span>{preetiInput.length} characters</span>
                <button
                  onClick={() => { playClickSound(); setPreetiInput(''); setPreetiOutput(''); }}
                  className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Unicode Output */}
            <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Clean Unicode Output (नेपाली युनिकोड)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(preetiOutput, 'preetiToUni')}
                    disabled={!preetiOutput}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs cursor-pointer"
                  >
                    {copiedMode === 'preetiToUni' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMode === 'preetiToUni' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownload(preetiOutput, 'unicode-converted.txt')}
                    disabled={!preetiOutput}
                    className="p-1 rounded-lg bg-[#181b22] hover:bg-[#222631] border border-[#222631] disabled:opacity-40 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={preetiOutput}
                readOnly
                placeholder="युनिकोड रूपान्तरण यहाँ देखिनेछ..."
                className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-base font-devanagari leading-relaxed"
              />
              <div className="pt-2 border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
                <span>{preetiOutput.length} Devanagari characters</span>
                <span className="text-emerald-400 font-medium">Ready for Web & Office</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: UNICODE TO PREETI */}
      {/* ============================================================== */}
      {activeTab === 'uniToPreeti' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="text-slate-400">
              Convert modern Devanagari Unicode back to legacy Preeti font text for older publishing software.
            </span>
            <button
              onClick={() => loadSample('unicode')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Unicode Example
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Unicode Input */}
            <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-400" />
                  Nepali Unicode Input (नेपाली युनिकोड)
                </span>
                <span className="text-slate-500">e.g. नेपाल, शर्मा</span>
              </div>
              <textarea
                value={uniPreetiInput}
                onChange={(e) => setUniPreetiInput(e.target.value)}
                placeholder="यहाँ नेपाली युनिकोड टाइप गर्नुहोस् वा पेस्ट गर्नुहोस्..."
                className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-base font-devanagari leading-relaxed"
              />
              <div className="pt-2 border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
                <span>{uniPreetiInput.length} characters</span>
                <button
                  onClick={() => { playClickSound(); setUniPreetiInput(''); setUniPreetiOutput(''); }}
                  className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Preeti Output */}
            <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-80 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
                <span className="font-semibold text-indigo-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Preeti Font Output (प्रिती फन्ट)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(uniPreetiOutput, 'uniToPreeti')}
                    disabled={!uniPreetiOutput}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs cursor-pointer"
                  >
                    {copiedMode === 'uniToPreeti' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMode === 'uniToPreeti' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownload(uniPreetiOutput, 'preeti-converted.txt')}
                    disabled={!uniPreetiOutput}
                    className="p-1 rounded-lg bg-[#181b22] hover:bg-[#222631] border border-[#222631] disabled:opacity-40 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={uniPreetiOutput}
                readOnly
                placeholder="Preeti formatted text will appear here..."
                className="flex-1 w-full bg-transparent text-slate-200 placeholder-slate-600 resize-none py-3 focus:outline-none text-sm font-mono leading-relaxed"
              />
              <div className="pt-2 border-t border-[#222631] flex items-center justify-between text-xs text-slate-500">
                <span>{uniPreetiOutput.length} ASCII characters</span>
                <span className="text-indigo-400 font-medium">Use with Preeti font</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: VIRTUAL NEPALI ON-SCREEN KEYBOARD */}
      {/* ============================================================== */}
      {activeTab === 'keyboard' && (
        <div className="space-y-5">
          {/* Target Output Area for Virtual Keyboard */}
          <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col h-64 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#222631] text-xs">
              <span className="font-semibold text-indigo-400 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Devanagari Typing Pad
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(unicodeOutput, 'virtual')}
                  disabled={!unicodeOutput}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-all text-xs"
                >
                  {copiedMode === 'virtual' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMode === 'virtual' ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => { playClickSound(); setUnicodeOutput(''); }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={unicodeOutput}
              onChange={(e) => setUnicodeOutput(e.target.value)}
              placeholder="तलको भर्चुअल किबोर्डबाट अक्षरहरू छानेर यहाँ लेख्नुहोस्..."
              className="flex-1 w-full bg-transparent text-white placeholder-slate-600 resize-none py-3 focus:outline-none text-lg font-devanagari leading-relaxed"
            />
          </div>

          {/* Virtual Keyboard Grid */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            {/* Vowels */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                स्वर वर्ण (Vowels)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vowels.map(v => (
                  <button
                    key={v}
                    onClick={() => { playClickSound(); setUnicodeOutput(prev => prev + v); }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 font-semibold text-base transition-colors flex items-center justify-center font-devanagari"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Matras & Modifiers */}
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                मात्रा तथा चिन्ह (Matras & Diacritics)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matras.map(m => (
                  <button
                    key={m}
                    onClick={() => { playClickSound(); setUnicodeOutput(prev => prev + m); }}
                    className="w-10 h-10 rounded-xl bg-slate-800/80 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold text-base transition-colors flex items-center justify-center font-devanagari"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Consonants */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                व्यञ्जन वर्ण (Consonants)
              </div>
              <div className="space-y-1.5">
                {consonants.map((row, idx) => (
                  <div key={idx} className="flex flex-wrap gap-1.5">
                    {row.map(c => (
                      <button
                        key={c}
                        onClick={() => { playClickSound(); setUnicodeOutput(prev => prev + c); }}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 font-semibold text-base transition-colors flex items-center justify-center font-devanagari"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Nepali Digits */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                नेपाली अङ्क (Devanagari Digits)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {nepaliDigits.map(d => (
                  <button
                    key={d}
                    onClick={() => { playClickSound(); setUnicodeOutput(prev => prev + d); }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-amber-300 font-semibold text-base transition-colors flex items-center justify-center font-devanagari"
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => { playClickSound(); setUnicodeOutput(prev => prev + ' '); }}
                  className="px-6 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center"
                >
                  Space Bar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Modifiers Ribbon (Available across all tabs) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Quick Symbols (क्लिक गरेर जोड्नुहोस्):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickModifiers.map((ch) => (
            <button
              key={ch}
              onClick={() => insertSymbol(ch)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 text-sm font-semibold transition-colors font-devanagari"
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
