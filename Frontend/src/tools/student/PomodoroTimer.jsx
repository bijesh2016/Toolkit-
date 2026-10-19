import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { startAmbientNoise, stopAmbientNoise } from '../../utils/soundEffects';

const MODES = {
  work: { label: 'Focus Session', time: 25 * 60, color: 'text-indigo-400', bg: 'bg-indigo-600' },
  shortBreak: { label: 'Short Break', time: 5 * 60, color: 'text-emerald-400', bg: 'bg-emerald-600' },
  longBreak: { label: 'Long Break', time: 15 * 60, color: 'text-cyan-400', bg: 'bg-cyan-600' }
};

export default function PomodoroTimer({ onShowToast }) {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.time);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [ambientSound, setAmbientSound] = useState('none'); // 'none', 'rain', 'stream', 'whitenoise'

  // Synthesize soft pleasant bell chime with Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio fallback
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playChime();
      setIsActive(false);
      stopAmbientNoise();
      if (mode === 'work') {
        setCompletedCycles(c => c + 1);
        if (onShowToast) onShowToast('Focus session complete! Time for a break.');
        setMode('shortBreak');
        setTimeLeft(MODES.shortBreak.time);
      } else {
        if (onShowToast) onShowToast('Break finished! Ready to focus?');
        setMode('work');
        setTimeLeft(MODES.work.time);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onShowToast]);

  // Manage ambient sound state
  useEffect(() => {
    if (isActive && ambientSound !== 'none') {
      startAmbientNoise(ambientSound);
    } else {
      stopAmbientNoise();
    }
    return () => stopAmbientNoise();
  }, [isActive, ambientSound]);

  const switchMode = (m) => {
    setIsActive(false);
    stopAmbientNoise();
    setMode(m);
    setTimeLeft(MODES[m].time);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const total = MODES[mode].time;
  const progressPercent = Math.round(((total - timeLeft) / total) * 100);

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      {/* Mode Buttons */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
        {Object.entries(MODES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === key ? `${info.bg} text-white shadow-md` : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>

      {/* Timer Circle Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative flex flex-col items-center">
        <span className={`text-xs uppercase font-bold tracking-wider mb-2 ${MODES[mode].color}`}>
          {MODES[mode].label}
        </span>

        {/* Large Countdown Display */}
        <div className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tight my-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden my-4">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 ${MODES[mode].bg}`}
          ></div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center gap-2 transition-all transform active:scale-95 ${
              isActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={() => { setIsActive(false); stopAmbientNoise(); setTimeLeft(MODES[mode].time); }}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Study Sounds Selector */}
        <div className="mt-6 w-full pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Procedural Study Ambience:</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            {[
              { id: 'none', label: 'Off' },
              { id: 'rain', label: 'Rain' },
              { id: 'stream', label: 'Waves' },
              { id: 'whitenoise', label: 'White Noise' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setAmbientSound(item.id)}
                className={`py-1.5 rounded-lg border transition-all font-semibold ${
                  ambientSound === item.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Completed Cycles Badge */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Completed Focus Cycles: <strong className="text-white">{completedCycles}</strong></span>
        </div>
      </div>
    </div>
  );
}
