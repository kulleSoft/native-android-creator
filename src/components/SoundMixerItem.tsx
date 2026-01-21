import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useAppStore, Sound } from '@/store/appStore';

const iconMap: Record<string, string> = {
  rain: '💧',
  ocean: '🌊',
  forest: '🌲',
  fire: '🔥',
  wind: '💨',
  study: '📚',
  birds: '🐦',
};

interface SoundMixerItemProps {
  sound: Sound;
}

export const SoundMixerItem = ({ sound }: SoundMixerItemProps) => {
  const { setVolume, toggleSound } = useAppStore();

  return (
    <motion.div
      className="flex items-center gap-4 py-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => {
          console.log('🎵 MixerItem toggle:', sound.id, '| playing:', !sound.isPlaying);
          toggleSound(sound.id);
        }}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
          sound.isPlaying 
            ? 'bg-primary/20 ring-2 ring-primary' 
            : 'bg-secondary'
        }`}
      >
        {iconMap[sound.id] || sound.icon}
      </button>

      <div className="flex-1">
        <p className="text-sm font-medium text-foreground mb-2">{sound.name}</p>
        <Slider
          value={[sound.volume * 100]}
          onValueChange={(value) => setVolume(sound.id, value[0] / 100)}
          max={100}
          step={1}
          className="w-full"
          disabled={!sound.isPlaying}
        />
      </div>

      <button
        onClick={() => {
          console.log('🔇 MixerItem volume toggle:', sound.id);
          toggleSound(sound.id);
        }}
        className="p-2"
      >
        {sound.isPlaying && sound.volume > 0 ? (
          <Volume2 className="w-5 h-5 text-primary" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </motion.div>
  );
};
