import { ArrowLeft, Heart, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { SoundMixerItem } from '@/components/SoundMixerItem';
import { TimerSelector } from '@/components/TimerSelector';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import bgNight from '@/assets/bg-night.jpg';

export const MixerPage = () => {
  const { sounds, setActiveTab, addFavorite, stopAllSounds } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const activeSounds = sounds.filter((s) => s.isPlaying);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      stopAllSounds();
    }
  };

  const handleSaveFavorite = () => {
    if (activeSounds.length === 0) {
      toast({
        title: 'Nenhum som ativo',
        description: 'Ative pelo menos um som para salvar como favorito.',
        variant: 'destructive',
      });
      return;
    }
    addFavorite(`Mix ${new Date().toLocaleDateString('pt-BR')}`);
    toast({
      title: 'Favorito salvo!',
      description: 'Sua combinação foi salva nos favoritos.',
    });
  };

  return (
    <div className="page-container relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgNight} 
          alt="Night sky"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 px-4 pt-6 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => setActiveTab('home')}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Misturar Sons</h1>
        </motion.div>

        {/* Sound List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4">
          <motion.div 
            className="glass-card p-4 space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {sounds.map((sound, index) => (
              <SoundMixerItem key={sound.id} sound={sound} />
            ))}
          </motion.div>

          {/* Timer */}
          <motion.div 
            className="glass-card p-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TimerSelector />
          </motion.div>

          {/* Save Favorite */}
          <motion.button
            onClick={handleSaveFavorite}
            className="w-full mt-4 py-3 rounded-xl bg-secondary/50 backdrop-blur-sm flex items-center justify-center gap-2 text-foreground font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5" />
            Salvar Favorito
          </motion.button>

          {/* Play Button */}
          <motion.div
            className="mt-6 pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handlePlay}
              className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
            >
              {activeSounds.length > 0 ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Parar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Tocar
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
