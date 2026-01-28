import { motion } from 'framer-motion';
import { Clock, Flame, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { getRecipesByMode, type Recipe } from '@/lib/recipes';

export function RecommendedRecipes() {
  const { dietMode, setSelectedRecipeId, setActiveTab } = useStore();

  // Get recipes for current diet mode
  const recipes = getRecipesByMode(dietMode).slice(0, 6);

  const handleSeeAll = () => {
    setActiveTab('diet');
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-5 mb-3">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Recommended for You</h2>
          <p className="text-xs text-text-tertiary capitalize">{dietMode} mode recipes</p>
        </div>
        <button
          onClick={handleSeeAll}
          className="text-xs text-accent font-medium flex items-center gap-0.5"
        >
          See all
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-2 hide-scrollbar">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <CompactRecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipeId(recipe.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Compact Recipe Card - Modern, Premium, Apple-style
function CompactRecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const isHighProtein = recipe.macrosPerServing.protein > 30;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-shrink-0 w-[180px] h-[160px] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden text-left border border-white/40 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Image Section */}
      <div className="relative h-[96px] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Whey badge */}
        {recipe.hasWhey && (
          <div className="absolute top-2 right-2 bg-accent/90 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Zap size={8} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-2.5">
        {/* Title */}
        <h3 className="font-medium text-text-primary text-xs line-clamp-1 mb-1">
          {recipe.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
          <span className="flex items-center gap-0.5">
            <Clock size={9} />
            {recipe.timeMins}m
          </span>
          <span className="flex items-center gap-0.5">
            <Flame size={9} />
            {recipe.macrosPerServing.kcal}
          </span>
        </div>

        {/* Protein chip */}
        {isHighProtein && (
          <div className="mt-1.5">
            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
              High Protein
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
