import { useAppStore } from '@/store/appStore';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { MixerPage } from '@/pages/MixerPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const Index = () => {
  const { activeTab } = useAppStore();
  
  // Initialize audio player
  useAudioPlayer();

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'mixer':
        return <MixerPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default Index;
