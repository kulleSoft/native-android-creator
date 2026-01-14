import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';

// URLs de áudio gratuitos (loops ambientes)
const audioUrls: Record<string, string> = {
  rain: 'https://cdn.freesound.org/previews/531/531947_10537921-lq.mp3',
  ocean: 'https://cdn.freesound.org/previews/457/457677_9395857-lq.mp3',
  forest: 'https://cdn.freesound.org/previews/588/588302_7037-lq.mp3',
  fire: 'https://cdn.freesound.org/previews/499/499826_10779674-lq.mp3',
  wind: 'https://cdn.freesound.org/previews/406/406087_5121236-lq.mp3',
  whitenoise: 'https://cdn.freesound.org/previews/561/561401_8037758-lq.mp3',
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
