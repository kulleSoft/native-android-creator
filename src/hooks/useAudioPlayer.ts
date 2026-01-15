import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { AudioGenerator } from '@/utils/audioGenerator';

type AudioControls = {
  start: () => void;
  stop: () => void;
  setVolume: (vol: number) => void;
};

export const useAudioPlayer = () => {
  const sounds = useAppStore((state) => state.sounds);
  const timerEndTime = useAppStore((state) => state.timerEndTime);
  const stopAllSounds = useAppStore((state) => state.stopAllSounds);
  
  const audioGenerator = useRef<AudioGenerator | null>(null);
  const audioControls = useRef<Map<string, AudioControls>>(new Map());
  const initialized = useRef(false);

  // Initialize audio generator once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    audioGenerator.current = new AudioGenerator();

    // Create controls for each sound
    ['rain', 'ocean', 'forest', 'fire', 'wind', 'study', 'birds'].forEach((id) => {
      const controls = audioGenerator.current!.generateSound(id);
      audioControls.current.set(id, controls);
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
