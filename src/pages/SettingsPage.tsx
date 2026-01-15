import { ArrowLeft, Clock, Bell, Star, FileText, Video, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import bgNight from '@/assets/bg-night.jpg';

export const SettingsPage = () => {
  const { setActiveTab, timerMinutes } = useAppStore();

  const settingsItems = [
    {
      icon: Clock,
      label: 'Timer Padrão',
      value: timerMinutes ? `${timerMinutes} Minutos` : '30 Minutos',
      action: () => {},
    },
    {
      icon: Bell,
      label: 'Notificações',
      value: 'Ativadas',
      action: () => {},
    },
    {
      icon: Star,
      label: 'Avalie o App',
      value: 'Deixe sua avaliação!',
      action: () => window.open('https://play.google.com/store/apps/details?id=com.dreschdevapps.calmmusicnight', '_blank'),
    },
    {
      icon: FileText,
      label: 'Política de Privacidade',
      value: '',
      action: () => {},
    },
  ];

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
          <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        </motion.div>

        {/* Settings List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-24">
          <motion.div 
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  className="settings-item w-full text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-foreground font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-muted-foreground text-sm">{item.value}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Offline Mode */}
          <motion.div 
            className="glass-card p-4 mt-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">Modo Offline</p>
                <p className="text-muted-foreground text-sm">Assista vídeo para ativar</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
