import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';

// URLs de áudio gratuitos (archive.org - domínio público)
const audioUrls: Record<string, string> = {
  rain: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Rain.ogg',
  ocean: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Ocean_waves%2C_bofill.ogg',
  forest: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Forest_ambiance.ogg',
  fire: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Fireplace.ogg',
  wind: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Wind_sounds.ogg',
  whitenoise: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/White_noise.ogg',
};

export const useAudioPlayer = () => {
  const { sounds, timerEndTime, stopAllSounds } = useAppStore();
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Initialize audio elements
  useEffect(() => {
    sounds.forEach((sound) => {
      if (!audioRefs.current.has(sound.id)) {
        const audio = new Audio(audioUrls[sound.id]);
        audio.loop = true;
        audio.preload = 'auto';
        audioRefs.current.set(sound.id, audio);
      }
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, []);

  // Sync play/pause and volume with store state
  useEffect(() => {
    sounds.forEach((sound) => {
      const audio = audioRefs.current.get(sound.id);
      if (!audio) return;

      audio.volume = sound.volume;

      if (sound.isPlaying && audio.paused) {
        audio.play().catch((e) => console.log('Audio play error:', e));
      } else if (!sound.isPlaying && !audio.paused) {
        audio.pause();
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
