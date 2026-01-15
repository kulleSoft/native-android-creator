import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { HomePage } from '@/pages/HomePage';
import { MixerPage } from '@/pages/MixerPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal';
import { AnimatePresence, motion } from 'framer-motion';

const PRIVACY_ACCEPTED_KEY = 'calm_music_privacy_accepted';

const Index = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(PRIVACY_ACCEPTED_KEY);
    if (!hasAccepted) {
      setShowPrivacyModal(true);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
    setShowPrivacyModal(false);
  };

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
      <AudioPlayer />

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
      
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={handleAcceptPrivacy} 
      />
    </div>
  );
};

export default Index;

