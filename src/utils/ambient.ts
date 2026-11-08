/**
 * Ambient sound, generated in the browser: filtered noise like an empty room, and two low tones
 * a fraction of a hertz apart, so they slowly beat. No audio files, nothing loud.
 * Browsers only allow audio after a user gesture, so start() must be called from one.
 */

const VOLUME = 0.05;
const FADE_SECONDS = 2.5;

let context: AudioContext | null = null;
let master: GainNode | null = null;

function build(audio: AudioContext) {
  const out = audio.createGain();
  out.gain.value = 0;
  out.connect(audio.destination);

  // Room noise: two seconds of looped noise through a low-pass filter that drifts slowly.
  const buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let index = 0; index < data.length; index += 1) {
    // Brown-ish noise: each sample leans on the last, so it rumbles rather than hisses.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[index] = last * 3.5;
  }
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;

  const drift = audio.createOscillator();
  drift.frequency.value = 0.04;
  const driftDepth = audio.createGain();
  driftDepth.gain.value = 120;
  drift.connect(driftDepth).connect(filter.frequency);

  const noiseLevel = audio.createGain();
  noiseLevel.gain.value = 0.7;
  noise.connect(filter).connect(noiseLevel).connect(out);

  // The hum: 55 Hz and 55.35 Hz, beating about once every three seconds.
  const humLevel = audio.createGain();
  humLevel.gain.value = 0.18;
  humLevel.connect(out);
  [55, 55.35].forEach((frequency) => {
    const tone = audio.createOscillator();
    tone.type = 'sine';
    tone.frequency.value = frequency;
    tone.connect(humLevel);
    tone.start();
  });

  noise.start();
  drift.start();
  return out;
}

export function startAmbient() {
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!context) {
    context = new AudioContextClass();
    master = build(context);
  }
  void context.resume();
  const now = context.currentTime;
  master!.gain.cancelScheduledValues(now);
  master!.gain.setValueAtTime(master!.gain.value, now);
  master!.gain.linearRampToValueAtTime(VOLUME, now + FADE_SECONDS);
}

export function stopAmbient() {
  if (!context || !master) return;
  const audio = context;
  const now = audio.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 0.6);
  window.setTimeout(() => {
    if (master && master.gain.value < 0.001) void audio.suspend();
  }, 700);
}

export function isAmbientRunning() {
  return context?.state === 'running' && (master?.gain.value ?? 0) > 0;
}
