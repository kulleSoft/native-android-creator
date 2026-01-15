import { useAudioPlayer } from '@/hooks/useAudioPlayer';

/**
 * Mounted once to keep audio side-effects isolated from page transitions.
 */
export const AudioPlayer = () => {
  useAudioPlayer();
  return null;
};
