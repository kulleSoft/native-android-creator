import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { AudioGenerator } from '@/utils/audioGenerator';
import rainSound from '@/assets/sounds/rain.mp3';

type AudioControls = {
  start: () => void;
  stop: () => void;
  setVolume: (vol: number) => void;
};

// Sounds that use real audio files
const audioFiles: Record<string, string> = {
  rain: rainSound,
};

export const useAudioPlayer = () => {
  const sounds = useAppStore((state) => state.sounds);
  const timerEndTime = useAppStore((state) => state.timerEndTime);
  const stopAllSounds = useAppStore((state) => state.stopAllSounds);
  
  const audioGenerator = useRef<AudioGenerator | null>(null);
  const audioControls = useRef<Map<string, AudioControls>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());
  const initialized = useRef(false);

  // Initialize audio generator once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    audioGenerator.current = new AudioGenerator();

    // Create controls for each sound
    ['rain', 'ocean', 'forest', 'fire', 'wind', 'study', 'birds'].forEach((id) => {
      // Check if this sound has a real audio file
      if (audioFiles[id]) {
        const audio = new Audio(audioFiles[id]);
        audio.loop = true;
        audio.volume = 0.5;
        audioElements.current.set(id, audio);
        
        audioControls.current.set(id, {
          start: () => audio.play().catch(console.error),
          stop: () => {
            audio.pause();
            audio.currentTime = 0;
          },
          setVolume: (vol: number) => { audio.volume = vol; },
        });
      } else {
        // Use synthetic sound
        const controls = audioGenerator.current!.generateSound(id);
        audioControls.current.set(id, controls);
      }
    });

    // Unlock audio on first user interaction (required for mobile)
    const unlockAudio = async () => {
      await audioGenerator.current?.resume();
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  // Sync play/pause and volume with store state
  useEffect(() => {
    sounds.forEach((sound) => {
      const controls = audioControls.current.get(sound.id);
      if (!controls) return;

      if (sound.isPlaying) {
        controls.start();
        controls.setVolume(sound.volume);
      } else {
        controls.stop();
      }
    });
  }, [sounds]);

  // Timer functionality
  useEffect(() => {
    if (!timerEndTime) return;

    const checkTimer = () => {
      if (Date.now() >= timerEndTime) {
        stopAllSounds();
      }
    };

    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [timerEndTime, stopAllSounds]);

  return null;
};
