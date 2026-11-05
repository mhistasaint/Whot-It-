class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = false;
  private musicTimer: number | null = null;
  private musicStep = 0;

  constructor() {
    // Initialized on user interaction
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  public setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (val) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startMusic() {
    if (this.musicTimer !== null) return;
    this.initCtx();

    // Pentatonic scale frequencies for warm Afro-melodic vibe (F, G, Ab, C, Eb)
    const bassNotes = [87.31, 87.31, 103.83, 116.54, 87.31, 130.81, 116.54, 103.83];
    const leadNotes = [349.23, 392.00, 415.30, 523.25, 622.25, 523.25, 415.30, 392.00];

    const tempoMs = 280; // ~107 BPM

    this.musicTimer = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const step = this.musicStep % 8;

      // Soft bass groove
      const bassFreq = bassNotes[step];
      this.playTone(bassFreq, now, 0.22, 'triangle', 0.08);

      // Light percussion shakers on every 8th
      this.playShaker(now, step % 2 === 0 ? 0.03 : 0.015);

      // Occasional melodic pluck
      if (step === 0 || step === 3 || step === 5) {
        const leadFreq = leadNotes[(step + Math.floor(this.musicStep / 8)) % leadNotes.length];
        this.playTone(leadFreq, now + 0.05, 0.18, 'sine', 0.04);
      }

      this.musicStep++;
    }, tempoMs);
  }

  public stopMusic() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playShaker(startTime: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'highpass' as unknown as OscillatorType;
    // noise imitation via high frequency detune
    osc.frequency.setValueAtTime(3200 + Math.random() * 800, startTime);
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  public playCardPlay() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playCardDraw() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.09);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSpecialCard(type: string) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'HOLD_ON') {
      this.playTone(523.25, now, 0.1, 'sine', 0.2);
      this.playTone(659.25, now + 0.1, 0.18, 'sine', 0.25);
    } else if (type === 'PICK_TWO' || type === 'PICK_THREE') {
      this.playTone(400, now, 0.1, 'sawtooth', 0.15);
      this.playTone(280, now + 0.08, 0.2, 'sawtooth', 0.2);
    } else if (type === 'GENERAL_MARKET') {
      this.playTone(392.00, now, 0.1, 'triangle', 0.2);
      this.playTone(523.25, now + 0.09, 0.1, 'triangle', 0.22);
      this.playTone(659.25, now + 0.18, 0.25, 'triangle', 0.25);
    } else if (type === 'SUSPENSION' || type === 'STAR_SUSPENSION') {
      this.playTone(587.33, now, 0.08, 'square', 0.1);
      this.playTone(440.00, now + 0.08, 0.15, 'square', 0.08);
    } else if (type === 'WHOT') {
      this.playTone(440, now, 0.1, 'sine', 0.2);
      this.playTone(554.37, now + 0.1, 0.1, 'sine', 0.22);
      this.playTone(659.25, now + 0.2, 0.12, 'sine', 0.25);
      this.playTone(880, now + 0.32, 0.3, 'sine', 0.28);
    }
  }

  public playPeek() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.playTone(784, now, 0.08, 'sine', 0.18);
    this.playTone(987.77, now + 0.08, 0.15, 'sine', 0.2);
  }

  public playTimerWarning() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.playTone(880, now, 0.05, 'square', 0.08);
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      this.playTone(freq, now + idx * 0.12, 0.35, 'triangle', 0.25);
    });
  }

  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType, maxGain = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(maxGain, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const soundService = new SoundEffects();
