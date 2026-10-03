// Web Audio synthesizer for realistic preview playback

class ForensicAudioPlayer {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
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

  public play(scenario: 'synthetic' | 'genuine' | 'noisy', currentTime: number) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.linearRampToValueAtTime(0.12, now + 0.1);
    this.gainNode.connect(this.ctx.destination);

    // Primary vocal formant oscillator
    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();

    if (scenario === 'synthetic') {
      // Sawtooth with unnatural stepping and vocoder pitch
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(220, now);
      // Glitch at 2.4s
      if (currentTime >= 2.4 && currentTime <= 4.1) {
        this.osc1.frequency.setValueAtTime(340, now);
        this.osc2.type = 'square';
      } else {
        this.osc2.type = 'sine';
      }
      this.osc2.frequency.setValueAtTime(440, now);
    } else if (scenario === 'genuine') {
      // Warm smooth sine with harmonic fifth
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(180, now);
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(270, now);
    } else {
      // Bandlimited noisy carrier
      this.osc1.type = 'triangle';
      this.osc1.frequency.setValueAtTime(200, now);
      this.osc2.type = 'sawtooth';
      this.osc2.frequency.setValueAtTime(300, now);
    }

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.osc1.start(now);
    this.osc2.start(now);
  }

  public stop() {
    if (this.isPlaying) {
      try {
        if (this.gainNode && this.ctx) {
          const now = this.ctx.currentTime;
          this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.05);
        }
        setTimeout(() => {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.osc1 = null;
          this.osc2 = null;
        }, 60);
      } catch {
        // Safe tear down
      }
      this.isPlaying = false;
    }
  }
}

export const forensicAudio = new ForensicAudioPlayer();
