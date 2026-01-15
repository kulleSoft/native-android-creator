import { create } from 'zustand';

export interface Sound {
  id: string;
  name: string;
  icon: string;
  image: string;
  volume: number;
  isPlaying: boolean;
}

export interface Favorite {
  id: string;
  name: string;
  sounds: { id: string; volume: number }[];
}

interface AppState {
  sounds: Sound[];
  favorites: Favorite[];
  timerMinutes: number | null;
  timerEndTime: number | null;
  activeTab: 'home' | 'mixer' | 'favorites' | 'settings';
  
  // Actions
  setActiveTab: (tab: 'home' | 'mixer' | 'favorites' | 'settings') => void;
  toggleSound: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  setTimer: (minutes: number | null) => void;
  addFavorite: (name: string) => void;
  removeFavorite: (id: string) => void;
  loadFavorite: (favorite: Favorite) => void;
  stopAllSounds: () => void;
}

const initialSounds: Sound[] = [
  { id: 'rain', name: 'Chuva', icon: '🌧️', image: 'rain', volume: 0.5, isPlaying: false },
  { id: 'ocean', name: 'Oceano', icon: '🌊', image: 'ocean', volume: 0.5, isPlaying: false },
  { id: 'forest', name: 'Floresta', icon: '🌲', image: 'forest', volume: 0.5, isPlaying: false },
  { id: 'fire', name: 'Fogueira', icon: '🔥', image: 'fire', volume: 0.5, isPlaying: false },
  { id: 'wind', name: 'Vento', icon: '💨', image: 'wind', volume: 0.5, isPlaying: false },
  { id: 'study', name: 'Estudo', icon: '📚', image: 'study', volume: 0.5, isPlaying: false },
  { id: 'birds', name: 'Pássaros', icon: '🐦', image: 'birds', volume: 0.5, isPlaying: false },
];

export const useAppStore = create<AppState>((set, get) => ({
  sounds: initialSounds,
  favorites: [
    { id: '1', name: 'Chuva & Trovão', sounds: [{ id: 'rain', volume: 0.8 }] },
    { id: '2', name: 'Praia Tranquila', sounds: [{ id: 'ocean', volume: 0.6 }] },
    { id: '3', name: 'Floresta Noturna', sounds: [{ id: 'forest', volume: 0.5 }, { id: 'wind', volume: 0.3 }] },
  ],
  timerMinutes: null,
  timerEndTime: null,
  activeTab: 'home',

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSound: (id) => set((state) => ({
    sounds: state.sounds.map((s) =>
      s.id === id ? { ...s, isPlaying: !s.isPlaying } : s
    ),
  })),

  setVolume: (id, volume) => set((state) => ({
    sounds: state.sounds.map((s) =>
      s.id === id ? { ...s, volume } : s
    ),
  })),

  setTimer: (minutes) => set({
    timerMinutes: minutes,
    timerEndTime: minutes ? Date.now() + minutes * 60 * 1000 : null,
  }),

  addFavorite: (name) => set((state) => {
    const activeSounds = state.sounds
      .filter((s) => s.isPlaying)
      .map((s) => ({ id: s.id, volume: s.volume }));
    
    if (activeSounds.length === 0) return state;

    return {
      favorites: [
        ...state.favorites,
        { id: Date.now().toString(), name, sounds: activeSounds },
      ],
    };
  }),

  removeFavorite: (id) => set((state) => ({
    favorites: state.favorites.filter((f) => f.id !== id),
  })),

  loadFavorite: (favorite) => set((state) => ({
    sounds: state.sounds.map((s) => {
      const savedSound = favorite.sounds.find((fs) => fs.id === s.id);
      return savedSound
        ? { ...s, isPlaying: true, volume: savedSound.volume }
        : { ...s, isPlaying: false };
    }),
    activeTab: 'mixer',
  })),

  stopAllSounds: () => set((state) => ({
    sounds: state.sounds.map((s) => ({ ...s, isPlaying: false })),
  })),
}));
