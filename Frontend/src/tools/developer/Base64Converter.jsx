import React, { useState, useRef } from 'react';
import { Binary, ArrowRightLeft, Copy, Trash2, Check, Image, Upload } from 'lucide-react';

export default function Base64Converter({ onShowToast }) {
  const [conversionType, setConversionType] = useState('base64'); // 'base64', 'url', 'hex', 'html'
  const [direction, setDirection] = useState('encode'); // 'encode' or 'decode'
  const [inputVal, setInputVal] = useState('Hello from Bijesh Tools Hub (नेपाल)!');
  const [outputVal, setOutputVal] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewSrc, setImagePreviewSrc] = useState(''); // base64 image to preview
  const fileInputRef = useRef(null);

  const processConversion = (text, type, dir) => {
    setError('');
    if (!text) {
      setOutputVal('');
      return;
    }

    try {
      if (type === 'base64') {
        if (dir === 'encode') {
          // UTF-8 safe base64 encoding
          const encoded = window.btoa(unescape(encodeURIComponent(text)));
          setOutputVal(encoded);
        } else {
          // UTF-8 safe base64 decoding
          const decoded = decodeURIComponent(escape(window.atob(text.trim())));
          setOutputVal(decoded);
          // Check if the base64 is an image data URL
          if (text.trim().startsWith('data:image')) {
            setImagePreviewSrc(text.trim());
          } else {
            // Try to auto-detect image base64 (no data URL prefix)
            try {
              const cleanB64 = text.trim().replace(/\s/g, '');
              // If it looks like valid base64 and starts with common image magic bytes
              const decoded2 = atob(cleanB64.split(',').pop());
              if (decoded2.startsWith('\xFF\xD8') || decoded2.startsWith('\x89PNG') || decoded2.startsWith('GIF8')) {
                setImagePreviewSrc('data:image/jpeg;base64,' + cleanB64);
              } else {
                setImagePreviewSrc('');
              }
            } catch {
              setImagePreviewSrc('');
            }
          }
        }
      } else if (type === 'url') {
        if (dir === 'encode') {
          setOutputVal(encodeURIComponent(text));
        } else {
          setOutputVal(decodeURIComponent(text));
        }
      } else if (type === 'hex') {
        if (dir === 'encode') {
          let hex = '';
          for (let i = 0; i < text.length; i++) {
            hex += text.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
          }
          setOutputVal(hex.trim());
        } else {
          const cleanHex = text.replace(/\s+/g, '');
          let str = '';
          for (let i = 0; i < cleanHex.length; i += 2) {
            str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
          }
          setOutputVal(str);
        }
      } else if (type === 'html') {
        if (dir === 'encode') {
          const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
          setOutputVal(text.replace(/[&<>"']/g, m => map[m]));
        } else {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          setOutputVal(doc.documentElement.textContent || '');
        }
      }
    } catch (err) {
      setError(err.message || 'Conversion failed. Please verify input data.');
      setOutputVal('');
    }
  };

  React.useEffect(() => {
    processConversion(inputVal, conversionType, direction);
  }, [inputVal, conversionType, direction]);

  const handleSwap = () => {
    setInputVal(outputVal);
    setDirection(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    if (onShowToast) onShowToast('Copied to clipboard!');
  };

  // Handle image file → base64
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please drop an image file (PNG, JPG, GIF, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setConversionType('base64');
      setDirection('decode');
      setInputVal(dataUrl);
      setImagePreviewSrc(dataUrl);
      setOutputVal(dataUrl.split(',')[1] || '');
      if (onShowToast) onShowToast(`Image converted: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Type Switcher & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {[
            { id: 'base64', label: 'Base64' },
            { id: 'url', label: 'URL Encoding' },
            { id: 'hex', label: 'Hexadecimal' },
            { id: 'html', label: 'HTML Entities' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setConversionType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                conversionType === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection('encode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              direction === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setDirection('decode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              direction === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Decode
          </button>
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Image Drag-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-xs ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
        }`}
      >
        <Upload className="w-6 h-6" />
        <span className="font-semibold">Drop an image here to convert to Base64</span>
        <span className="text-slate-500">PNG, JPG, GIF, WebP — click to browse</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files[0]) handleImageFile(e.target.files[0]); }}
        />
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Input ({direction.toUpperCase()})</span>
            <button onClick={() => { setInputVal(''); setImagePreviewSrc(''); }} className="hover:text-rose-400 text-slate-500">Clear</button>
          </div>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Enter text to convert..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none"
          />
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">Converted Output</span>
            <button
              onClick={handleCopy}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            readOnly
            value={outputVal}
            placeholder="Result will appear here..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Base64 → Image Preview Panel */}
      {imagePreviewSrc && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <Image className="w-4 h-4 text-indigo-400" /> Image Preview
            </span>
            <button
              onClick={() => setImagePreviewSrc('')}
              className="text-slate-500 hover:text-rose-400 text-xs"
            >
              Dismiss
            </button>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 p-3 overflow-hidden">
            <img
              src={imagePreviewSrc}
              alt="Base64 decoded"
              className="max-w-full max-h-64 object-contain rounded-xl"
              onError={() => setImagePreviewSrc('')}
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Decoded image preview · Right-click to save
          </p>
        </div>
      )}
    </div>
  );
}
