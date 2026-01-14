import { Home, Sliders, Heart, Settings } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Início' },
    { id: 'mixer' as const, icon: Sliders, label: 'Mixer' },
    { id: 'favorites' as const, icon: Heart, label: 'Favoritos' },
    { id: 'settings' as const, icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border/50 safe-area-pb">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="nav-item relative flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
              />
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
