// Web Audio API Sound Synthesizer for subtle, high-quality tactile audio feedback
// No external asset dependencies - completely zero latency, reliable, and offline-ready

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.35; // Subtle, pleasant default volume

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ugx_sound_enabled');
      this.enabled = saved !== null ? saved === 'true' : true;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ugx_sound_enabled', String(enabled));
    }
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    if (next) {
      // Play a soft test chime to confirm sound is active
      this.playChaChing();
    }
    return next;
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      return this.ctx;
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
      return null;
    }
  }

  /**
   * Signature 'Cha-Ching' Cash Register / Coin Drop Sound Effect.
   * Features:
   * 1. Soft mechanical drawer latch click
   * 2. Crisp, shimmering metallic bell resonance (tuned to cash register chimes)
   * 3. Sparkling secondary coin clink decay
   */
  public playChaChing(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume, now);
      master.connect(ctx.destination);

      // --- Part 1: "Cha" (Mechanical latch & subtle slide) ---
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(750, now);
      clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      clickGain.gain.setValueAtTime(0.28, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(master);
      clickOsc.start(now);
      clickOsc.stop(now + 0.045);

      // Drawer noise texture
      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1500, now);
      noiseFilter.Q.setValueAtTime(3.5, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);

      // --- Part 2: "CHING!" (Bright, ringing metallic bell & harmonics) ---
      const chingStart = now + 0.045;

      // Authentic register chime harmonic spectrum
      const frequencies = [1865, 2794, 3730, 5588];
      const amplitudes = [0.42, 0.32, 0.18, 0.1];
      const decays = [0.85, 0.7, 0.5, 0.3];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, chingStart);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.996, chingStart + decays[idx]);

        gain.gain.setValueAtTime(0.0001, chingStart);
        gain.gain.linearRampToValueAtTime(amplitudes[idx], chingStart + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, chingStart + decays[idx]);

        osc.connect(gain);
        gain.connect(master);

        osc.start(chingStart);
        osc.stop(chingStart + decays[idx] + 0.05);
      });

      // --- Part 3: Shimmering coin sparkle ---
      const sparkleStart = chingStart + 0.07;
      const coinFreqs = [2637, 3322, 4186];
      coinFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, sparkleStart);

        gain.gain.setValueAtTime(0.0001, sparkleStart);
        gain.gain.linearRampToValueAtTime(0.15 / (i + 1), sparkleStart + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, sparkleStart + 0.45);

        osc.connect(gain);
        gain.connect(master);

        osc.start(sparkleStart);
        osc.stop(sparkleStart + 0.5);
      });
    } catch (e) {
      console.warn('Error playing cha-ching sound:', e);
    }
  }

  /**
   * Modern, subtle AI task completion chime.
   * Clean 3-step ascending digital arpeggio with soft decay.
   */
  public playTaskComplete(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume * 0.75, now);
      master.connect(ctx.destination);

      // Ascending tech chime: G5 (784Hz) -> C6 (1046Hz) -> E6 (1318Hz) -> G6 (1568Hz)
      const notes = [783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, index) => {
        const startTime = now + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.24, startTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(master);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      console.warn('Error playing task complete sound:', e);
    }
  }

  /**
   * Celebratory Raffle Win Sound Effect.
   * Features:
   * 1. Multi-tone triumph arpeggio
   * 2. Instant transition into a rich, celebratory 'cha-ching' cash payout chime
   */
  public playRaffleWin(): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume * 0.9, now);
      master.connect(ctx.destination);

      // Celebratory major chords: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz), E6 (1318Hz)
      const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      fanfare.forEach((freq, i) => {
        const noteTime = now + i * 0.065;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === fanfare.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + (i === fanfare.length - 1 ? 0.65 : 0.35));

        osc.connect(gain);
        gain.connect(master);

        osc.start(noteTime);
        osc.stop(noteTime + 0.7);
      });

      // Synchronize with the 'cha-ching' sound at the crest of the fanfare
      setTimeout(() => {
        this.playChaChing();
      }, 260);
    } catch (e) {
      console.warn('Error playing raffle win sound:', e);
    }
  }

  /**
   * Subtle mechanical tick sound for the raffle wheel as it rotates.
   */
  public playSpinTick(pitchFactor: number = 1): void {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume * 0.22, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 950 * pitchFactor;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.02);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {
      // ignore
    }
  }
}

export const soundEffects = new SoundManager();
