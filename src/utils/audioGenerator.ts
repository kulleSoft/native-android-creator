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

  // Generate study lofi ambience (soft pink noise + gentle tone)
  generateStudy(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    // Soft pink noise for cozy ambience
    const bufferSize = 4096;
    const noise = ctx.createScriptProcessor(bufferSize, 1, 1);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    noise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    
    noise.connect(filter);
    filter.connect(gainNode);

    return {
      start: () => gainNode.gain.value = 0.25,
      stop: () => gainNode.gain.value = 0,
      setVolume: (vol: number) => gainNode.gain.value = vol * 0.25,
    };
  }

  // Generate birds chirping
  generateBirds(): { start: () => void; stop: () => void; setVolume: (vol: number) => void } {
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0;

    let isRunning = false;
    let timeoutId: number | null = null;

    const createChirp = () => {
      if (!isRunning) return;
      
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      const baseFreq = 2500 + Math.random() * 1500;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 500, ctx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(baseFreq - 200, ctx.currentTime + 0.15);
      
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.03);
      oscGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
      
      // Random interval between chirps
      timeoutId = window.setTimeout(createChirp, 800 + Math.random() * 2000);
    };

    return {
      start: () => {
        gainNode.gain.value = 0.3;
        if (!isRunning) {
          isRunning = true;
          createChirp();
        }
      },
      stop: () => {
        gainNode.gain.value = 0;
        isRunning = false;
        if (timeoutId) clearTimeout(timeoutId);
      },
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
      case 'study': return this.generateStudy();
      case 'birds': return this.generateBirds();
      default: return this.generateStudy();
    }
  }
}
