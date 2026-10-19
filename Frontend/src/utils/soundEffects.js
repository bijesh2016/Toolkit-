/**
 * Procedural Web Audio Sound Effects & Haptics Engine
 * Generates tactile micro-interactions without external audio files
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('toolshub_sound_enabled') !== 'false';
}

export function setSoundEnabled(enabled) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('toolshub_sound_enabled', enabled ? 'true' : 'false');
}

/**
 * Modern soft pop sound on copy or button click
 */
export function playPopSound() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * High-pitch pleasant success chord on document/PDF generation
 */
export function playSuccessChime() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = ctx.currentTime + idx * 0.06;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  } catch (e) {
    // Graceful fallback
  }
}

export const playClickSound = playPopSound;
export const playSuccessSound = playSuccessChime;

/**
 * Ambient Noise Generator (for study / focus in Pomodoro)
 * Generates continuous synthetic rain, white noise, or forest stream
 */
let ambientSource = null;
let ambientGain = null;

export function startAmbientNoise(type = 'rain') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopAmbientNoise();

    // Create 5-second buffer of noise
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        // Brown/Pink noise approximation for gentle rain
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      } else if (type === 'whitenoise') {
        data[i] = white * 0.2;
      } else {
        // Wave/Stream modulation
        const modulation = Math.sin(i / 15000) * 0.5 + 0.5;
        data[i] = (lastOut + (0.04 * white)) / 1.04 * modulation * 2.5;
        lastOut = data[i];
      }
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    // Filter to soften the sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'whitenoise' ? 2400 : 900;

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.15, ctx.currentTime);

    ambientSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientSource.start();
  } catch (e) {
    console.error('Ambient audio error:', e);
  }
}

export function stopAmbientNoise() {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch (e) {}
    ambientSource = null;
  }
}
