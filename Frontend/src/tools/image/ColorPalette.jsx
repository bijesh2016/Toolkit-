import React, { useState } from 'react';
import { Palette, Copy, Sparkles, RefreshCw } from 'lucide-react';

const PRESET_GRADIENTS = [
  { name: 'Nepal Sunset', colors: ['#DC143C', '#FF8C00', '#FFD700'], angle: 135 },
  { name: 'Indigo Nebula', colors: ['#4f46e5', '#7c3aed', '#06b6d4'], angle: 45 },
  { name: 'Cyberpunk Neon', colors: ['#ec4899', '#8b5cf6', '#3b82f6'], angle: 90 },
  { name: 'Emerald Forest', colors: ['#059669', '#10b981', '#34d399'], angle: 160 },
  { name: 'Midnight Aurora', colors: ['#0f172a', '#1e1b4b', '#312e81'], angle: 180 }
];

export default function ColorPalette({ onShowToast }) {
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#4f46e5');
  const [color2, setColor2] = useState('#06b6d4');
  const [color3, setColor3] = useState('#ec4899');

  const cssGradient = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;

  const handleCopyCss = () => {
    const code = `background: ${cssGradient};`;
    navigator.clipboard.writeText(code);
    if (onShowToast) onShowToast('Copied CSS gradient rule to clipboard!');
  };

  const applyPreset = (preset) => {
    setAngle(preset.angle);
    setColor1(preset.colors[0]);
    setColor2(preset.colors[1]);
    setColor3(preset.colors[2] || preset.colors[1]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Presets Row */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-400 font-semibold block mb-2">Curated Gradient Themes:</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_GRADIENTS.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Visual Canvas */}
      <div
        className="h-64 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 border border-slate-700"
        style={{ background: cssGradient }}
      >
        <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-center max-w-md">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300 block">Preview Studio</span>
          <p className="font-mono text-xs text-white mt-1 break-all select-all">
            {cssGradient}
          </p>
          <button
            onClick={handleCopyCss}
            className="mt-3 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 mx-auto shadow-lg hover:bg-slate-100 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy CSS Code
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Gradient Color Controls</h3>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-bold">{angle}° Angle</span>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Rotation Angle ({angle}°)</label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Color Stop 1</label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
              <input
                type="color"
                value={color1}
                onChange={e => setColor1(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-300">{color1}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Color Stop 2</label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
              <input
                type="color"
                value={color2}
                onChange={e => setColor2(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-300">{color2}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Color Stop 3</label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-xl">
              <input
                type="color"
                value={color3}
                onChange={e => setColor3(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-300">{color3}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
