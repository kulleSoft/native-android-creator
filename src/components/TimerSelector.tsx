import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const timerOptions = [
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '60m' },
  { minutes: null, label: '∞' },
];

export const TimerSelector = () => {
  const { timerMinutes, setTimer } = useAppStore();
  const [selected, setSelected] = useState<number | null>(timerMinutes);

  const handleSelect = (minutes: number | null) => {
    setSelected(minutes);
    setTimer(minutes);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Moon className="w-4 h-4" />
        <span className="text-sm font-medium">Timer: {selected ? `${selected} Minutos` : 'Sem limite'}</span>
      </div>
      
      <div className="flex gap-2">
        {timerOptions.map((option, index) => (
          <motion.button
            key={option.label}
            onClick={() => handleSelect(option.minutes)}
            className={`timer-chip flex-1 ${selected === option.minutes ? 'active' : ''}`}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
