import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import bgNight from '@/assets/bg-night.jpg';

export const FavoritesPage = () => {
  const { favorites, setActiveTab, removeFavorite, loadFavorite } = useAppStore();

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
          className="flex items-center justify-between px-4 pt-6 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('home')}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Meus Favoritos</h1>
          </div>
          <span className="text-accent text-2xl">☾</span>
        </motion.div>

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-24">
          {favorites.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">Nenhum favorito salvo ainda.</p>
              <p className="text-muted-foreground text-sm mt-2">
                Crie combinações de sons e salve aqui!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  className="list-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => loadFavorite(favorite)}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 text-primary" />
                  </button>
                  
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{favorite.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {favorite.sounds.length} som{favorite.sounds.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
