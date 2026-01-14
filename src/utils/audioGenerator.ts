// Generate synthetic ambient sounds using Web Audio API
export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode[]> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Em Android/Chrome, o AudioContext começa "suspended" até o primeiro toque.
   */
  async resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Generate rain sound (filtered white noise with randomness)
  generateRain(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    const bufferSize = 4096;
    const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
    
    whiteNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);

    return {
      start: () => gainNode.gain.value = 0.5,
      stop: () => gainNode.gain.value = 0,
      setVolume: (vol: number) => gainNode.gain.value = vol,
    };
  }

  // Generate ocean waves (filtered noise with slow swell)
  generateOcean(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const outGain = ctx.createGain();
    outGain.connect(ctx.destination);
    outGain.gain.value = 0;

    const bufferSize = 4096;
    const noise = ctx.createScriptProcessor(bufferSize, 1, 1);

    noise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.25;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;

    // Slow swell (LFO) modulates gain
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(outGain.gain);

    noise.connect(filter);
    filter.connect(outGain);

    lfo.start();

    return {
      start: () => (outGain.gain.value = 0.25),
      stop: () => (outGain.gain.value = 0),
      setVolume: (vol: number) => (outGain.gain.value = vol * 0.25),
    };
  }

  // Generate forest (birds chirping + rustling)
  generateForest(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    const createChirp = () => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 2000 + Math.random() * 1000;
      
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
      
      setTimeout(createChirp, 2000 + Math.random() * 3000);
    };

    let isRunning = false;

    return {
      start: () => {
        gainNode.gain.value = 0.2;
        if (!isRunning) {
          isRunning = true;
          createChirp();
        }
      },
      stop: () => {
        gainNode.gain.value = 0;
        isRunning = false;
      },
      setVolume: (vol: number) => gainNode.gain.value = vol * 0.2,
    };
  }

  // Generate fire crackling
  generateFire(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    const bufferSize = 4096;
    const crackle = ctx.createScriptProcessor(bufferSize, 1, 1);
    
    crackle.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.95 ? 1 : 0.1);
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    crackle.connect(filter);
    filter.connect(gainNode);

    return {
      start: () => gainNode.gain.value = 0.3,
      stop: () => gainNode.gain.value = 0,
      setVolume: (vol: number) => gainNode.gain.value = vol * 0.3,
    };
  }

  // Generate wind
  generateWind(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    const bufferSize = 4096;
    const noise = ctx.createScriptProcessor(bufferSize, 1, 1);
    
    noise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    
    noise.connect(filter);
    filter.connect(gainNode);

    return {
      start: () => gainNode.gain.value = 0.4,
      stop: () => gainNode.gain.value = 0,
      setVolume: (vol: number) => gainNode.gain.value = vol * 0.4,
    };
  }

  // Generate white noise
  generateWhiteNoise(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    const bufferSize = 4096;
    const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
    
    whiteNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };

    whiteNoise.connect(gainNode);

    return {
      start: () => gainNode.gain.value = 0.3,
      stop: () => gainNode.gain.value = 0,
      setVolume: (vol: number) => gainNode.gain.value = vol * 0.3,
    };
  }

  generateSound(type: string) {
    switch (type) {
      case 'rain': return this.generateRain();
      case 'ocean': return this.generateOcean();
      case 'forest': return this.generateForest();
      case 'fire': return this.generateFire();
      case 'wind': return this.generateWind();
      case 'whitenoise': return this.generateWhiteNoise();
      default: return this.generateWhiteNoise();
    }
  }
}
