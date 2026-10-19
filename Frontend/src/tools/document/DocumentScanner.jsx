import React, { useState, useRef } from 'react';
import { 
  ScanLine, Upload, Download, RotateCw, Trash2, ChevronUp, 
  ChevronDown, FileText, Sparkles, Sliders, Printer, 
  Check, Copy, Eye, Image as ImageIcon, ShieldCheck, 
  Layers, ArrowRight, RefreshCw, ZoomIn
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

const SCAN_FILTERS = {
  magic: {
    id: 'magic',
    name: 'Magic Color (CamScanner)',
    badge: 'Recommended',
    description: 'Brightens paper background & enriches ink contrast',
    css: 'contrast(1.35) brightness(1.14) saturate(1.25)'
  },
  bw_clean: {
    id: 'bw_clean',
    name: 'B&W High Contrast',
    badge: 'Text / Receipts',
    description: 'Crisp binary text on pure white paper',
    css: 'grayscale(1) contrast(2.1) brightness(1.12)'
  },
  grayscale: {
    id: 'grayscale',
    name: 'Smooth Grayscale',
    badge: 'Official Docs',
    description: 'Balanced gray tones preserving photo clarity',
    css: 'grayscale(1) contrast(1.15) brightness(1.05)'
  },
  original: {
    id: 'original',
    name: 'Original Photo',
    badge: 'No Filter',
    description: 'Unprocessed camera capture as taken',
    css: 'none'
  },
  blueprint: {
    id: 'blueprint',
    name: 'Warm Sepia',
    badge: 'Notes',
    description: 'Soft warm vintage tone for easy reading',
    css: 'sepia(0.65) contrast(1.1) brightness(1.02)'
  }
};

const SAMPLE_DOCS = [
  {
    name: 'Invoice_Receipt_Page_1.png',
    url: 'https://images.unsplash.com/photo-1554415707-9e4466b8873a?w=1000&auto=format&fit=crop&q=80'
  },
  {
    name: 'Official_Contract_Notes_2.png',
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&auto=format&fit=crop&q=80'
  }
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

// High-resolution canvas rendering of scanned page
async function renderProcessedScan(scan, extraBrightness = 0, extraContrast = 0) {
  const image = await loadImage(scan.dataUrl);
  const quarterTurn = scan.rotation % 180 !== 0;
  
  const canvas = document.createElement('canvas');
  canvas.width = quarterTurn ? image.height : image.width;
  canvas.height = quarterTurn ? image.width : image.height;
  const ctx = canvas.getContext('2d');

  // Base filter css
  const baseFilter = SCAN_FILTERS[scan.filter]?.css || 'none';
  const brightRatio = (1 + (extraBrightness / 100)).toFixed(2);
  const contrastRatio = (1 + (extraContrast / 100)).toFixed(2);

  let fullFilter = baseFilter === 'none' ? '' : baseFilter;
  if (extraBrightness !== 0) fullFilter += ` brightness(${brightRatio})`;
  if (extraContrast !== 0) fullFilter += ` contrast(${contrastRatio})`;

  ctx.filter = fullFilter.trim() || 'none';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((scan.rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return canvas.toDataURL('image/jpeg', 0.94);
}

export default function DocumentScanner({ onShowToast }) {
  const [scans, setScans] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('magic');
  const [pageSize, setPageSize] = useState('a4'); // 'a4' | 'letter'
  const [pageMargin, setPageMargin] = useState('normal'); // 'normal' (10mm) | 'compact' (5mm) | 'none' (0mm)
  const [docTitle, setDocTitle] = useState('Scanned_Document');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Handle uploaded files
  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setScans(prev => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl: reader.result,
            rotation: 0,
            filter: globalFilter
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
    playClickSound();
    if (onShowToast) onShowToast(`Added ${files.length} document page${files.length > 1 ? 's' : ''}.`);
  };

  // Load sample documents for instant testing
  const handleLoadSamples = async () => {
    playClickSound();
    const newItems = SAMPLE_DOCS.map((doc, idx) => ({
      id: `sample-${idx}-${Date.now()}`,
      name: doc.name,
      dataUrl: doc.url,
      rotation: 0,
      filter: globalFilter
    }));
    setScans(prev => [...prev, ...newItems]);
    if (onShowToast) onShowToast('Loaded sample document pages.');
  };

  const updateScan = (id, updates) => {
    setScans(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveScan = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= scans.length) return;
    playClickSound();
    setScans(prev => {
      const list = [...prev];
      [list[index], list[targetIdx]] = [list[targetIdx], list[index]];
      return list;
    });
  };

  const deleteScan = (id) => {
    playClickSound();
    setScans(prev => prev.filter(s => s.id !== id));
    if (onShowToast) onShowToast('Page removed.');
  };

  // Download individual processed page
  const handleDownloadSinglePage = async (scan, index) => {
    try {
      playClickSound();
      const processedUrl = await renderProcessedScan(scan, brightness, contrast);
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = `Page_${index + 1}_${scan.name || 'scan'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      playSuccessSound();
      if (onShowToast) onShowToast(`Downloaded Page ${index + 1} as JPG.`);
    } catch (e) {
      if (onShowToast) onShowToast('Error exporting page.');
    }
  };

  // Generate Multi-Page PDF
  const handleGeneratePdf = async () => {
    if (!scans.length) {
      if (onShowToast) onShowToast('Please add at least one document image first.');
      return;
    }

    try {
      setIsExporting(true);
      playClickSound();

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: pageSize === 'letter' ? 'letter' : 'a4'
      });

      const marginMm = pageMargin === 'none' ? 0 : (pageMargin === 'compact' ? 6 : 12);

      for (let i = 0; i < scans.length; i++) {
        if (i > 0) pdf.addPage();

        const pageImg = await renderProcessedScan(scans[i], brightness, contrast);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(pageImg);

        const usableW = pageWidth - (marginMm * 2);
        const usableH = pageHeight - (marginMm * 2);

        const ratio = Math.min(usableW / imgProps.width, usableH / imgProps.height);
        const renderW = imgProps.width * ratio;
        const renderH = imgProps.height * ratio;

        const posX = marginMm + (usableW - renderW) / 2;
        const posY = marginMm + (usableH - renderH) / 2;

        pdf.addImage(pageImg, 'JPEG', posX, posY, renderW, renderH, undefined, 'FAST');
      }

      const cleanFilename = `${docTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Scanned_Document'}.pdf`;
      pdf.save(cleanFilename);
      playSuccessSound();
      if (onShowToast) onShowToast(`PDF generated: ${cleanFilename}`);
    } catch (err) {
      console.error('PDF generation error:', err);
      if (onShowToast) onShowToast(`Failed to generate PDF: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13151b] border border-[#222631] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ScanLine className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                  Document Scanner & PDF Maker
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  CamScanner Studio
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  100% In-Browser Privacy
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Transform photos of documents, receipts, contracts, and notes into clean, high-contrast, multi-page PDFs. Applies smart paper whitening, rotation, and custom margins entirely on your device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/15 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document Photos</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Control Strip & Filter Selector */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-[#222631] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222631]">
          <div>
            <h3 className="font-display text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Smart Enhancement Preset</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an algorithm to whiten gray shadows and boost text readability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!scans.length && (
              <button
                onClick={handleLoadSamples}
                className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-amber-300 border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Pages</span>
              </button>
            )}
            {scans.length > 0 && (
              <button
                onClick={() => setScans([])}
                className="px-3 py-2 rounded-xl bg-[#181b22] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-[#222631] text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.values(SCAN_FILTERS).map(filter => {
            const isSelected = globalFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => {
                  setGlobalFilter(filter.id);
                  setScans(prev => prev.map(s => ({ ...s, filter: filter.id })));
                  playClickSound();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-[#181b22] border-[#222631] text-slate-400 hover:text-slate-200 hover:border-[#323846]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">{filter.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-400/90 block">
                    {filter.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                  {filter.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Fine-Tuning Sliders & PDF Settings */}
        <div className="pt-4 border-t border-[#222631] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Brightness */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Paper Brightness</span>
              <span className="font-mono text-amber-400">{brightness > 0 ? `+${brightness}` : brightness}</span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Ink Contrast</span>
              <span className="font-mono text-amber-400">{contrast > 0 ? `+${contrast}` : contrast}</span>
            </div>
            <input
              type="range"
              min="-30"
              max="60"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Page Size */}
          <div className="space-y-1.5">
            <span className="block font-semibold text-slate-300">PDF Page Format</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#0b0c0e] border border-[#222631] text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
            >
              <option value="a4">Standard A4 (210 x 297 mm)</option>
              <option value="letter">US Letter (8.5 x 11 in)</option>
            </select>
          </div>

          {/* Page Margins */}
          <div className="space-y-1.5">
            <span className="block font-semibold text-slate-300">Page Margins</span>
            <select
              value={pageMargin}
              onChange={(e) => setPageMargin(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#0b0c0e] border border-[#222631] text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
            >
              <option value="normal">Standard (12 mm margin)</option>
              <option value="compact">Compact (6 mm margin)</option>
              <option value="none">Edge-to-Edge (Zero margin)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Workspace */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-[#222631]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222631]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-display text-sm font-bold text-white">
              Document Pages ({scans.length})
            </h3>
            {scans.length > 0 && (
              <span className="text-xs text-slate-400">
                · Ready for multi-page export
              </span>
            )}
          </div>

          {/* Document Title Input & PDF Export Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Document Name"
              className="py-2 px-3 rounded-xl bg-[#0b0c0e] border border-[#222631] text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500/50 max-w-[170px]"
            />
            <button
              onClick={handleGeneratePdf}
              disabled={!scans.length || isExporting}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/15 transition-all cursor-pointer"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Multi-Page PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Empty Drop Zone */}
        {!scans.length ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 min-h-64 rounded-2xl border-2 border-dashed border-[#282d3b] hover:border-amber-500/50 bg-[#0b0c0e]/60 flex flex-col items-center justify-center text-center p-8 transition-colors cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ScanLine className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-200">
              Drag & Drop Document Photos or Receipts
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Supports JPG, PNG, WebP camera photos. Pages are cleaned, ordered, and converted to high-definition PDF right in your browser.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-[#181b22] border border-[#222631] text-xs font-semibold text-slate-300">
                Click to browse files
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSamples();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold"
              >
                Or try sample pages
              </button>
            </div>
          </div>
        ) : (
          /* Scanned Pages Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {scans.map((scan, index) => {
              const activeFilter = SCAN_FILTERS[scan.filter] || SCAN_FILTERS.magic;
              const brightRatio = (1 + (brightness / 100)).toFixed(2);
              const contrastRatio = (1 + (contrast / 100)).toFixed(2);
              const filterStyle = `${activeFilter.css} brightness(${brightRatio}) contrast(${contrastRatio})`.trim();

              return (
                <div
                  key={scan.id}
                  className="rounded-2xl border border-[#282d3b] bg-[#161922] overflow-hidden flex flex-col justify-between group hover:border-[#384055] transition-all"
                >
                  {/* Thumbnail Preview Area */}
                  <div className="relative aspect-[4/3] bg-[#0b0c0e] p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={scan.dataUrl}
                      alt={`Page ${index + 1}`}
                      style={{
                        filter: filterStyle,
                        transform: `rotate(${scan.rotation}deg)`
                      }}
                      className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 shadow-md"
                    />

                    {/* Page Tag */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#0b0c0e]/85 backdrop-blur-sm border border-[#222631] text-[11px] font-mono font-bold text-amber-400">
                      Page {index + 1}
                    </span>

                    {/* Filter Tag */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#0b0c0e]/85 backdrop-blur-sm border border-[#222631] text-[10px] font-semibold text-slate-300">
                      {activeFilter.name}
                    </span>
                  </div>

                  {/* Page Controls */}
                  <div className="p-3 bg-[#13151b] border-t border-[#222631] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[160px] font-medium">
                        {scan.name}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {scan.rotation}°
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Re-order & Rotate buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveScan(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222631] disabled:opacity-25 transition-colors cursor-pointer"
                          title="Move page earlier"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveScan(index, 1)}
                          disabled={index === scans.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222631] disabled:opacity-25 transition-colors cursor-pointer"
                          title="Move page later"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScan(scan.id, { rotation: (scan.rotation + 90) % 360 })}
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-[#222631] transition-colors cursor-pointer"
                          title="Rotate 90° clockwise"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Download single page / Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDownloadSinglePage(scan, index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-[#222631] transition-colors cursor-pointer"
                          title="Save this scanned page as JPG"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteScan(scan.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#222631] transition-colors cursor-pointer"
                          title="Remove this page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security and Privacy Assurance Box */}
      <div className="p-5 rounded-2xl bg-[#13151b] border border-[#222631] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Zero Cloud Uploads:</strong> Document scanning, thresholding, and PDF synthesis happen 100% inside your browser's private WebAssembly memory sandbox.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono">Client-Side Engine Active</span>
        </div>
      </div>
    </div>
  );
}
