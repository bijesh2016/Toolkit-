import React, { useState } from 'react';
import { FileUp, Trash2, Download, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export default function ImageToPdf({ onShowToast }) {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('p'); // 'p' for portrait, 'l' for landscape
  const [pageSize, setPageSize] = useState('a4');
  const [margin, setMargin] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
            dataUrl: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (onShowToast) onShowToast(`Added ${files.length} image(s)!`);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();

        const img = images[i];
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const printableWidth = pageWidth - (margin * 2);
        const printableHeight = pageHeight - (margin * 2);

        // Add image centered
        doc.addImage(img.dataUrl, 'JPEG', margin, margin, printableWidth, printableHeight, undefined, 'FAST');
      }

      doc.save('converted-documents.pdf');

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });

      if (onShowToast) onShowToast('PDF generated and downloaded successfully!');
    } catch (err) {
      alert(`PDF generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Upload Zone */}
      <div className="p-8 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 transition-all text-center">
        <input
          type="file"
          id="image-upload-input"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="image-upload-input"
          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileUp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Select JPG, PNG or WebP Images</h3>
            <p className="text-xs text-slate-400 mt-1">Files are converted securely in your browser without uploading to any server.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20">
            Browse Image Files
          </span>
        </label>
      </div>

      {/* PDF Settings */}
      {images.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Selected Images ({images.length})
            </span>

            <div className="flex items-center gap-3 text-xs">
              <select
                value={orientation}
                onChange={e => setOrientation(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              >
                <option value="p">Portrait (A4)</option>
                <option value="l">Landscape (A4)</option>
              </select>

              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Creating PDF...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img src={img.dataUrl} alt={img.name} className="w-full h-32 object-cover" />
                <div className="p-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[100px]">{img.name}</span>
                  <span>{img.sizeKb} KB</span>
                </div>
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
