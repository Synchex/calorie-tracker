import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Users,
  Flame,
  Plus,
  Minus,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { getRecipeById } from '@/lib/recipes';

// Protein scoop adds these macros
const PROTEIN_SCOOP = {
  kcal: 120,
  protein: 24,
  carbs: 2,
  fat: 1.5,
};

export function RecipeDetailModal() {
  const { selectedRecipeId, setSelectedRecipeId, dietMode } = useStore();
  const [servings, setServings] = useState(1);
  const [addProtein, setAddProtein] = useState(false);

  const recipe = selectedRecipeId ? getRecipeById(selectedRecipeId) : null;

  // Calculate adjusted macros based on servings and protein boost
  const adjustedMacros = useMemo(() => {
    if (!recipe) return null;

    const base = recipe.macrosPerServing;
    const multiplier = servings;

    let kcal = base.kcal * multiplier;
    let protein = base.protein * multiplier;
    let carbs = base.carbs * multiplier;
    let fat = base.fat * multiplier;

    if (addProtein) {
      kcal += PROTEIN_SCOOP.kcal;
      protein += PROTEIN_SCOOP.protein;
      carbs += PROTEIN_SCOOP.carbs;
      fat += PROTEIN_SCOOP.fat;
    }

    return {
      kcal: Math.round(kcal),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  }, [recipe, servings, addProtein]);

  const handleClose = () => {
    setSelectedRecipeId(null);
    setServings(1);
    setAddProtein(false);
  };

  const handleAddToToday = () => {
    // TODO: Implement adding recipe as a meal to today
    console.log('Adding recipe to today:', recipe?.title, 'with macros:', adjustedMacros);
    handleClose();
  };

  if (!recipe) return null;

  return (
    <AnimatePresence>
      {selectedRecipeId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[95vh] overflow-auto"
          >
            {/* Header Image */}
            <div className="relative h-56">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Back Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 p-2 bg-white/90 rounded-full"
              >
                <ChevronLeft size={24} className="text-text-primary" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full"
              >
                <X size={24} className="text-text-primary" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-1">{recipe.title}</h1>
                <p className="text-white/80 text-sm">{recipe.description}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={18} />
                  <span className="text-sm">{recipe.timeMins} min</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users size={18} />
                  <span className="text-sm">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                </div>
                {recipe.hasWhey && (
                  <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full">
                    <Zap size={14} />
                    <span className="text-xs font-medium">Has Whey</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      tag === dietMode
                        ? 'bg-accent text-white'
                        : 'bg-surface text-text-secondary'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Servings Control */}
              <div className="bg-surface rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">Servings</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      disabled={servings <= 1}
                      className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus size={18} className="text-text-primary" />
                    </button>
                    <span className="text-xl font-bold text-text-primary w-8 text-center">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(Math.min(6, servings + 1))}
                      disabled={servings >= 6}
                      className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus size={18} className="text-text-primary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Protein Boost Toggle */}
              <div className="bg-surface rounded-xl p-4">
                <button
                  onClick={() => setAddProtein(!addProtein)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      addProtein ? 'bg-accent' : 'bg-white border border-border'
                    }`}>
                      <Zap size={18} className={addProtein ? 'text-white' : 'text-text-tertiary'} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-text-primary">+1 Scoop Protein</p>
                      <p className="text-xs text-text-tertiary">
                        +{PROTEIN_SCOOP.kcal} kcal, +{PROTEIN_SCOOP.protein}g protein
                      </p>
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors ${
                    addProtein ? 'bg-accent' : 'bg-gray-300'
                  }`}>
                    <motion.div
                      animate={{ x: addProtein ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 bg-white rounded-full mt-1 shadow-sm"
                    />
                  </div>
                </button>
              </div>

              {/* Macros Display */}
              {adjustedMacros && (
                <div className="bg-white rounded-xl border border-border p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    Nutrition ({servings} serving{servings > 1 ? 's' : ''}{addProtein ? ' + protein' : ''})
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-carbs/10 rounded-full flex items-center justify-center mb-1">
                        <Flame size={20} className="text-carbs" />
                      </div>
                      <p className="text-lg font-bold text-text-primary">{adjustedMacros.kcal}</p>
                      <p className="text-xs text-text-tertiary">kcal</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-protein/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-protein font-bold text-sm">P</span>
                      </div>
                      <p className="text-lg font-bold text-text-primary">{adjustedMacros.protein}g</p>
                      <p className="text-xs text-text-tertiary">protein</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-carbs/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-carbs font-bold text-sm">C</span>
                      </div>
                      <p className="text-lg font-bold text-text-primary">{adjustedMacros.carbs}g</p>
                      <p className="text-xs text-text-tertiary">carbs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-fat/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-fat font-bold text-sm">F</span>
                      </div>
                      <p className="text-lg font-bold text-text-primary">{adjustedMacros.fat}g</p>
                      <p className="text-xs text-text-tertiary">fat</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                      <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                        <span className="text-xs text-text-tertiary">{i + 1}</span>
                      </div>
                      <span className="text-text-primary">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Instructions</h3>
                <div className="space-y-3">
                  {recipe.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-text-secondary pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Today Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToToday}
                className="w-full py-4 bg-accent text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={20} />
                Add to Today
              </motion.button>

              {/* Spacer for safe area */}
              <div className="h-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
