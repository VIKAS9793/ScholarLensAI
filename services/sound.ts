
// Synthesized Sound Service using Web Audio API
// This avoids the need for external assets and ensures sounds play immediately.

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialization on first user interaction to comply with browser policies
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
  }

  // --- Sound Generators ---

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // High pitched short "pop"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Very subtle "tick"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Major Triad Arpeggio (C Majorish)
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((note, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.type = 'sine';
      osc.frequency.value = note;

      const startTime = now + i * 0.1;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playAchievement() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Magical Fanfare
    const now = this.ctx.currentTime;
    
    // Sparkle effect (High random notes)
    for(let i=0; i<10; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = 1000 + Math.random() * 1000;
        
        const startTime = now + Math.random() * 0.5;
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        
        osc.start(startTime);
        osc.stop(startTime + 0.2);
    }

    // Bass swell
    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    
    bass.type = 'triangle';
    bass.frequency.setValueAtTime(130.81, now); // C3
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    bassGain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    bass.start(now);
    bass.stop(now + 1.5);
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Slide up effect
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

export const sounds = new SoundService();
