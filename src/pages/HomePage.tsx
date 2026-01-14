import { Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import bgNight from '@/assets/bg-night.jpg';
import { SoundGrid } from '@/components/SoundCard';
import { useAppStore } from '@/store/appStore';

export const HomePage = () => {
  const { setActiveTab } = useAppStore();

  return (
    <div className="page-container relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgNight} 
          alt="Night sky"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 content-area pt-6">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-start mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <motion.div 
              className="flex items-center gap-2 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-accent text-2xl">☾</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Sons para<br />Dormir
            </h1>
            <p className="text-muted-foreground mt-1">Relaxamento</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('favorites')}
              className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm"
            >
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-full bg-secondary/50 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Sound Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SoundGrid />
        </motion.div>
      </div>
    </div>
  );
};
