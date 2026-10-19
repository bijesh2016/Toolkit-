import React, { useState } from 'react';
import { Layers, Copy, Sparkles, Check } from 'lucide-react';

export default function CssGenerators({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('glass'); // 'glass' or 'shadow'

  // Glassmorphism state
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.2);
  const [borderOpacity, setBorderOpacity] = useState(0.15);
  const [borderRadius, setBorderRadius] = useState(24);

  // Box Shadow state
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(20);
  const [shadowBlur, setShadowBlur] = useState(40);
  const [shadowSpread, setShadowSpread] = useState(-10);
  const [shadowColor, setShadowColor] = useState('rgba(99, 102, 241, 0.35)');

  // Generated CSS
  const glassCss = `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
border-radius: ${borderRadius}px;`;

  const shadowCss = `box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};
border-radius: ${borderRadius}px;`;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    if (onShowToast) onShowToast('Copied CSS rules to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('glass')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'glass' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Glassmorphism
        </button>
        <button
          onClick={() => setActiveTab('shadow')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'shadow' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Modern Box Shadow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">
              {activeTab === 'glass' ? 'Glassmorphism Parameters' : 'Box-Shadow Parameters'}
            </h3>
          </div>

          {activeTab === 'glass' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Backdrop Blur</span>
                  <span className="font-mono text-indigo-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blur}
                  onChange={e => setBlur(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Surface Opacity</span>
                  <span className="font-mono text-indigo-400">{opacity}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Border Opacity</span>
                  <span className="font-mono text-indigo-400">{borderOpacity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={borderOpacity}
                  onChange={e => setBorderOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Border Radius</span>
                  <span className="font-mono text-indigo-400">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={borderRadius}
                  onChange={e => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Horizontal Offset (X)</span>
                  <span className="font-mono text-indigo-400">{shadowX}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowX}
                  onChange={e => setShadowX(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Vertical Offset (Y)</span>
                  <span className="font-mono text-indigo-400">{shadowY}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={shadowY}
                  onChange={e => setShadowY(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Blur Radius</span>
                  <span className="font-mono text-indigo-400">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowBlur}
                  onChange={e => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Spread</span>
                  <span className="font-mono text-indigo-400">{shadowSpread}px</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={shadowSpread}
                  onChange={e => setShadowSpread(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Visual Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-900/40 via-purple-900/30 to-pink-900/40 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className="w-full max-w-xs p-6 text-white text-center transition-all duration-200"
            style={activeTab === 'glass' ? {
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              borderRadius: `${borderRadius}px`
            } : {
              background: '#0f172a',
              boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
              borderRadius: `${borderRadius}px`
            }}
          >
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-300" />
            <h4 className="font-bold text-sm">Glassmorphic Card</h4>
            <p className="text-xs text-slate-300 mt-1">Sleek modern UI elements for web applications</p>
          </div>

          <div className="w-full mt-6">
            <button
              onClick={() => handleCopy(activeTab === 'glass' ? glassCss : shadowCss)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy CSS Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
