class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', slideTo?: number) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(600, 0.05, 'sine');
  }

  playMoveX() {
    this.playTone(550, 0.1, 'triangle', 660);
  }

  playMoveO() {
    this.playTone(330, 0.1, 'sine', 270);
  }

  playWin() {
    this.playTone(261.63, 0.15, 'triangle');
    setTimeout(() => this.playTone(329.63, 0.15, 'triangle'), 80);
    setTimeout(() => this.playTone(523.25, 0.45, 'sine'), 160);
  }

  playDraw() {
    this.playTone(293.66, 0.2, 'sine');
    setTimeout(() => this.playTone(220.00, 0.45, 'sine'), 150);
  }
}

export const sound = new SoundEngine();
