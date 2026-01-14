import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { AudioGenerator } from '@/utils/audioGenerator';

export const useAudioPlayer = () => {
  const { sounds, timerEndTime, stopAllSounds } = useAppStore();
  const soundsRef = useRef(sounds);
  const audioGenerator = useRef<AudioGenerator | null>(null);
  const audioControls = useRef<
    Map<string, { start: () => void; stop: () => void; setVolume: (vol: number) => void }>
  >(new Map());

  // keep latest sounds for event handlers
  useEffect(() => {
    soundsRef.current = sounds;
  }, [sounds]);

  // Initialize audio generator
  useEffect(() => {
    audioGenerator.current = new AudioGenerator();

    soundsRef.current.forEach((sound) => {
      const controls = audioGenerator.current!.generateSound(sound.id);
      audioControls.current.set(sound.id, controls);
    });

    // Android/iOS: precisa de gesto do usuário para liberar áudio
    const unlockAudio = async () => {
      await audioGenerator.current?.resume();
      // re-aplica estado após "unlock"
      soundsRef.current.forEach((sound) => {
        const controls = audioControls.current.get(sound.id);
        if (!controls) return;
        if (sound.isPlaying) {
          controls.start();
          controls.setVolume(sound.volume);
        }
      });
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true } as any);
    window.addEventListener('touchstart', unlockAudio, { once: true } as any);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      audioControls.current.forEach((controls) => {
        controls.stop();
      });
      audioControls.current.clear();
    };
  }, []);

  // Sync play/pause and volume with store state
  useEffect(() => {
    sounds.forEach((sound) => {
      const controls = audioControls.current.get(sound.id);
      if (!controls) return;

      controls.setVolume(sound.isPlaying ? sound.volume : 0);
      
      if (sound.isPlaying) {
        controls.start();
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
