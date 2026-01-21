import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import soundRain from '@/assets/sound-rain.jpg';
import soundOcean from '@/assets/sound-ocean.jpg';
import soundForest from '@/assets/sound-forest.jpg';
import soundFire from '@/assets/sound-fire.jpg';
import soundWind from '@/assets/sound-wind.jpg';
import soundStudy from '@/assets/sound-study.jpg';
import soundBirds from '@/assets/sound-birds.jpg';

const imageMap: Record<string, string> = {
  rain: soundRain,
  ocean: soundOcean,
  forest: soundForest,
  fire: soundFire,
  wind: soundWind,
  study: soundStudy,
  birds: soundBirds,
};

interface SoundCardProps {
  id: string;
  name: string;
  icon: string;
  image: string;
  isPlaying: boolean;
  onToggle: () => void;
}

export const SoundCard = ({ id, name, icon, image, isPlaying, onToggle }: SoundCardProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="sound-card w-full relative group"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageMap[image]}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'bg-primary/30' : 'bg-black/30'}`} />
      
      {/* Playing indicator */}
      {isPlaying && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary z-20"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-foreground font-semibold text-sm">{name}</p>
      </div>
    </motion.button>
  );
};

export const SoundGrid = () => {
  const { sounds, toggleSound, setActiveTab } = useAppStore();

  const handleToggle = (id: string) => {
    console.log('🔊 SoundCard toggle:', id);
    toggleSound(id);
  };

  return (
    <div className="grid grid-cols-2 gap-3 pb-4">
      {sounds.map((sound) => (
        <SoundCard
          key={sound.id}
          {...sound}
          onToggle={() => handleToggle(sound.id)}
        />
      ))}
    </div>
  );
};
