import { motion } from 'framer-motion';
import { Clock, Flame, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { getRecipesByMode, type Recipe } from '@/lib/recipes';

export function RecommendedRecipes() {
  const { dietMode, setSelectedRecipeId, setActiveTab } = useStore();

  // Get recipes for current diet mode
  const recipes = getRecipesByMode(dietMode).slice(0, 5);

  const handleSeeAll = () => {
    setActiveTab('diet');
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-6 mb-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Recommended for You</h2>
          <p className="text-xs text-text-tertiary capitalize">{dietMode} mode recipes</p>
        </div>
        <button
          onClick={handleSeeAll}
          className="text-sm text-accent font-medium flex items-center gap-1"
        >
          See all
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-6 pb-2 hide-scrollbar">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelectedRecipeId(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-shrink-0 w-40 bg-white rounded-xl border border-border overflow-hidden text-left"
    >
      <div className="relative h-24">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {recipe.hasWhey && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Zap size={10} />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="font-medium text-text-primary text-sm line-clamp-1 mb-1">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span className="flex items-center gap-0.5">
            <Clock size={10} />
            {recipe.timeMins}m
          </span>
          <span className="flex items-center gap-0.5">
            <Flame size={10} />
            {recipe.macrosPerServing.kcal}
          </span>
        </div>
        <div className="mt-1.5">
          <span className="text-xs bg-protein/10 text-protein px-1.5 py-0.5 rounded">
            {recipe.macrosPerServing.protein}g P
          </span>
        </div>
      </div>
    </motion.button>
  );
}
