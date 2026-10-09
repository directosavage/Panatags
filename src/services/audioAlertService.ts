/**
 * Emergency Web Audio Synthesizer
 * Generates rescue sirens, whistles, and Morse Code SOS tones offline without external audio files.
 */

class AudioAlertService {
  private ctx: AudioContext | null = null;
  private activeOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private sirenIntervalId: number | null = null;
  private isPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Start high-visibility high-decibel rescue siren (alternates 700Hz to 1200Hz)
   */
  public startSiren(): void {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    this.activeOscillator = osc;
    this.gainNode = gain;

    let high = false;
    this.sirenIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.activeOscillator) return;
      const targetFreq = high ? 700 : 1200;
      this.activeOscillator.frequency.exponentialRampToValueAtTime(
        targetFreq,
        this.ctx.currentTime + 0.4
      );
      high = !high;
    }, 450);
  }

  /**
   * Emergency rescue whistle chirp (2800 Hz shrill blast)
   */
  public blastWhistle(durationSeconds: number = 1.2): void {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2850, this.ctx.currentTime);
    // Slight vibrato for realistic whistle air turbulence
    osc.frequency.linearRampToValueAtTime(2900, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(2820, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSeconds);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + durationSeconds);

    setTimeout(() => {
      this.isPlaying = false;
    }, durationSeconds * 1000);
  }

  /**
   * Morse Code SOS: ... --- ... (Dot=120ms, Dash=360ms)
   */
  public playMorseSOS(): void {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, this.ctx.currentTime);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();

    this.activeOscillator = osc;
    this.gainNode = gain;

    // Pattern: 3 dots, 3 dashes, 3 dots
    const dotLen = 0.12;
    const dashLen = 0.36;
    const pause = 0.1;

    let time = this.ctx.currentTime + 0.05;

    const playDot = () => {
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.setValueAtTime(0, time + dotLen);
      time += dotLen + pause;
    };

    const playDash = () => {
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.setValueAtTime(0, time + dashLen);
      time += dashLen + pause;
    };

    // S: ...
    playDot(); playDot(); playDot();
    time += 0.2; // Letter space
    // O: ---
    playDash(); playDash(); playDash();
    time += 0.2; // Letter space
    // S: ...
    playDot(); playDot(); playDot();

    const totalDuration = (time - this.ctx.currentTime) * 1000;
    setTimeout(() => {
      this.stop();
    }, totalDuration);
  }

  public stop(): void {
    if (this.sirenIntervalId !== null) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }

    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
      } catch {
        // already stopped
      }
      this.activeOscillator = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }

    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioAlertService = new AudioAlertService();
