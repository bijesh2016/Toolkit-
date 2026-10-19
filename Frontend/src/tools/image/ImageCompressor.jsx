import React, { useState, useRef } from 'react';
import { Minimize2, Download, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react';

export default function ImageCompressor({ onShowToast }) {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalDataUrl, setOriginalDataUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);

  const [compressedDataUrl, setCompressedDataUrl] = useState('');
  const [compressedSize, setCompressedSize] = useState(0);

  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isCompressing, setIsCompressing] = useState(false);

  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalDataUrl(event.target.result);
      compressImage(event.target.result, quality, maxWidth);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (dataUrl, qual, maxW) => {
    setIsCompressing(true);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxW) {
        height = Math.round((height * maxW) / width);
        width = maxW;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = 'image/jpeg';
      const compressed = canvas.toDataURL(mimeType, qual / 100);
      setCompressedDataUrl(compressed);

      // Estimate byte length
      const head = `data:${mimeType};base64,`;
      const sizeBytes = Math.round((compressed.length - head.length) * 0.75);
      setCompressedSize(sizeBytes);
      setIsCompressing(false);
    };
  };

  const handleQualityChange = (newQual) => {
    setQuality(newQual);
    if (originalDataUrl) {
      compressImage(originalDataUrl, newQual, maxWidth);
    }
  };

  const handleDownload = () => {
    if (!compressedDataUrl) return;
    const link = document.createElement('a');
    link.href = compressedDataUrl;
    link.download = `compressed_${originalFile ? originalFile.name.replace(/\.[^/.]+$/, '') : 'image'}.jpg`;
    link.click();
    if (onShowToast) onShowToast('Downloaded compressed image!');
  };

  const savedPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upload & Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Minimize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Client-Side Image Compressor & Resizer</h3>
              <p className="text-xs text-slate-400">Reduce file size directly in your browser with zero server uploads</p>
            </div>
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Choose Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {originalDataUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Compression Quality</span>
                <span className="font-mono text-indigo-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={e => handleQualityChange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Max Width Constraint</span>
                <span className="font-mono text-indigo-400 font-bold">{maxWidth}px</span>
              </div>
              <input
                type="range"
                min="480"
                max="3840"
                step="100"
                value={maxWidth}
                onChange={e => {
                  setMaxWidth(Number(e.target.value));
                  compressImage(originalDataUrl, quality, Number(e.target.value));
                }}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Comparison Preview */}
      {originalDataUrl && compressedDataUrl && (
        <div className="space-y-4 animate-fade-in">
          {/* Savings Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">File Size Reduction:</span>
              <span className="text-base font-bold text-white">
                {(originalSize / 1024).toFixed(1)} KB ➔ {(compressedSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                {savedPercent > 0 ? `-${savedPercent}% Saved` : 'Original Size'}
              </span>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Side by side image preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Original Image ({(originalSize / 1024).toFixed(1)} KB)</span>
              <img src={originalDataUrl} alt="Original" className="max-h-72 mx-auto rounded-xl object-contain" />
            </div>

            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-emerald-400 block mb-2">Compressed Result ({(compressedSize / 1024).toFixed(1)} KB)</span>
              <img src={compressedDataUrl} alt="Compressed" className="max-h-72 mx-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
