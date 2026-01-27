import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  ShoppingCart,
  ChevronRight,
  Clock,
  Sparkles,
  Heart,
  Check,
  Calendar,
  Edit3,
  Flame,
  X,
  Loader2,
  Search,
  Zap,
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { format, parseISO } from 'date-fns';
import type { DietMode, Recipe, DayPlan, WeeklyMealPlan } from '@/types';
import {
  getRecipesByMode,
  filterRecipes,
  type Recipe as LibRecipe,
} from '@/lib/recipes';

const modeConfig: Record<DietMode, { label: string; icon: React.ReactNode; description: string; color: string }> = {
  bulk: {
    label: 'Bulk',
    icon: <TrendingUp size={18} />,
    description: 'Muscle gain & weight gain',
    color: 'text-success',
  },
  cut: {
    label: 'Cut',
    icon: <TrendingDown size={18} />,
    description: 'Fat loss & weight loss',
    color: 'text-protein',
  },
  maintain: {
    label: 'Maintain',
    icon: <Target size={18} />,
    description: 'Weight maintenance',
    color: 'text-fat',
  },
};

export function DietPage() {
  const {
    dietMode,
    setDietMode,
    weeklyMealPlan,
    shoppingList,
    recommendedRecipes,
    isGeneratePlanModalOpen,
    setGeneratePlanModalOpen,
    setSelectedRecipeId,
  } = useStore();

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Browse recipes state
  const [searchQuery, setSearchQuery] = useState('');
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [minProtein, setMinProtein] = useState<number | null>(null);
  const [hasWheyFilter, setHasWheyFilter] = useState(false);

  const uncheckedItemsCount = shoppingList.filter((item) => !item.checked).length;

  // Filter recipes from our local dataset
  const filteredLibRecipes = useMemo(() => {
    const modeRecipes = getRecipesByMode(dietMode);
    return filterRecipes(modeRecipes, {
      query: searchQuery || undefined,
      maxTime: maxTime || undefined,
      minProtein: minProtein || undefined,
      hasWhey: hasWheyFilter || undefined,
    });
  }, [dietMode, searchQuery, maxTime, minProtein, hasWheyFilter]);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-text-primary">Diet Plan</h1>
        <p className="text-text-secondary">Plan your meals & reach your goals</p>
      </header>

      {/* Mode Selector */}
      <ModeSelector currentMode={dietMode} onModeChange={setDietMode} />

      {/* Browse Recipes Section */}
      <BrowseRecipesSection
        recipes={filteredLibRecipes}
        dietMode={dietMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        maxTime={maxTime}
        setMaxTime={setMaxTime}
        minProtein={minProtein}
        setMinProtein={setMinProtein}
        hasWheyFilter={hasWheyFilter}
        setHasWheyFilter={setHasWheyFilter}
        onRecipeClick={(id) => setSelectedRecipeId(id)}
      />

      {/* Weekly Meal Plan */}
      <WeeklyPlanSection
        plan={weeklyMealPlan}
        expandedDay={expandedDay}
        onToggleDay={(date) => setExpandedDay(expandedDay === date ? null : date)}
      />

      {/* Shopping List Shortcut */}
      <ShoppingListCard itemCount={uncheckedItemsCount} topItems={shoppingList.filter((i) => !i.checked).slice(0, 3)} />

      {/* Recipe Recommendations */}
      <RecipeRecommendations recipes={recommendedRecipes} dietMode={dietMode} />

      {/* Generate Plan CTA */}
      <div className="px-6 py-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGeneratePlanModalOpen(true)}
          className="w-full py-4 bg-accent text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles size={20} />
          <span>{weeklyMealPlan ? 'Regenerate My Week' : 'Generate My Week'}</span>
        </motion.button>
      </div>

      {/* Generate Plan Modal */}
      <GeneratePlanModal
        isOpen={isGeneratePlanModalOpen}
        onClose={() => setGeneratePlanModalOpen(false)}
      />
    </div>
  );
}

// Mode Selector Component
interface ModeSelectorProps {
  currentMode: DietMode;
  onModeChange: (mode: DietMode) => void;
}

function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="px-6 py-4">
      <div className="bg-surface rounded-xl p-1 flex gap-1">
        {(Object.keys(modeConfig) as DietMode[]).map((mode) => {
          const config = modeConfig[mode];
          const isActive = currentMode === mode;

          return (
            <motion.button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`flex-1 relative py-3 px-2 rounded-lg font-medium transition-colors ${
                isActive ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute inset-0 bg-accent rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {config.icon}
                {config.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-center text-text-tertiary text-sm mt-2">
        {modeConfig[currentMode].description}
      </p>
    </div>
  );
}

// Weekly Plan Section
interface WeeklyPlanSectionProps {
  plan: WeeklyMealPlan | null;
  expandedDay: string | null;
  onToggleDay: (date: string) => void;
}

function WeeklyPlanSection({ plan, expandedDay, onToggleDay }: WeeklyPlanSectionProps) {
  if (!plan) {
    return (
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl p-6 border border-border text-center">
          <Calendar size={48} className="mx-auto text-text-tertiary mb-3" />
          <h3 className="font-semibold text-text-primary mb-1">No plan yet</h3>
          <p className="text-text-tertiary text-sm">Generate a personalized meal plan to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">This Week's Plan</h2>
        <button className="p-2 hover:bg-surface rounded-full transition-colors">
          <Edit3 size={18} className="text-text-tertiary" />
        </button>
      </div>
      <div className="space-y-2">
        {plan.days.map((day) => (
          <DayCard
            key={day.date}
            day={day}
            isExpanded={expandedDay === day.date}
            onToggle={() => onToggleDay(day.date)}
          />
        ))}
      </div>
    </div>
  );
}

// Day Card
interface DayCardProps {
  day: DayPlan;
  isExpanded: boolean;
  onToggle: () => void;
}

function DayCard({ day, isExpanded, onToggle }: DayCardProps) {
  const statusColors = {
    planned: 'bg-fat/20 text-fat',
    completed: 'bg-success/20 text-success',
    empty: 'bg-surface text-text-tertiary',
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-4">
        <div className="text-center min-w-[50px]">
          <p className="text-xs text-text-tertiary uppercase">{day.dayName}</p>
          <p className="text-lg font-bold text-text-primary">
            {format(parseISO(day.date), 'd')}
          </p>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[day.status]}`}>
              {day.status === 'empty' ? 'No plan' : `${day.meals.length} meals`}
            </span>
          </div>
          {day.status !== 'empty' && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-primary font-medium">{day.totalCalories} cal</span>
              <span className="text-protein">P: {day.totalProtein}g</span>
              <span className="text-carbs">C: {day.totalCarbs}g</span>
              <span className="text-fat">F: {day.totalFat}g</span>
            </div>
          )}
        </div>
        <ChevronRight
          size={20}
          className={`text-text-tertiary transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && day.meals.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-3">
              {day.meals.map((meal) => (
                <div key={meal.id} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      meal.category === 'breakfast'
                        ? 'bg-carbs'
                        : meal.category === 'lunch'
                        ? 'bg-success'
                        : meal.category === 'dinner'
                        ? 'bg-fat'
                        : 'bg-protein'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{meal.name}</p>
                    <p className="text-xs text-text-tertiary capitalize">{meal.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">{meal.calories} cal</p>
                    <p className="text-xs text-text-tertiary flex items-center gap-1">
                      <Clock size={10} />
                      {meal.prepTime} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Shopping List Card
interface ShoppingListCardProps {
  itemCount: number;
  topItems: { id: string; name: string; quantity: string }[];
}

function ShoppingListCard({ itemCount, topItems }: ShoppingListCardProps) {
  return (
    <div className="px-6 py-2">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white rounded-xl p-4 border border-border flex items-center gap-4 text-left"
      >
        <div className="w-12 h-12 bg-carbs/10 rounded-xl flex items-center justify-center">
          <ShoppingCart size={24} className="text-carbs" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-primary">Shopping List</h3>
            <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {itemCount} items
            </span>
          </div>
          <p className="text-sm text-text-tertiary">
            {topItems.length > 0
              ? topItems.map((i) => i.name).join(', ')
              : 'No items yet'}
            {topItems.length < itemCount && '...'}
          </p>
        </div>
        <ChevronRight size={20} className="text-text-tertiary" />
      </motion.button>
    </div>
  );
}

// Browse Recipes Section
interface BrowseRecipesSectionProps {
  recipes: LibRecipe[];
  dietMode: DietMode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  maxTime: number | null;
  setMaxTime: (time: number | null) => void;
  minProtein: number | null;
  setMinProtein: (protein: number | null) => void;
  hasWheyFilter: boolean;
  setHasWheyFilter: (hasWhey: boolean) => void;
  onRecipeClick: (id: string) => void;
}

function BrowseRecipesSection({
  recipes,
  dietMode,
  searchQuery,
  setSearchQuery,
  maxTime,
  setMaxTime,
  minProtein,
  setMinProtein,
  hasWheyFilter,
  setHasWheyFilter,
  onRecipeClick,
}: BrowseRecipesSectionProps) {
  return (
    <div className="px-6 py-4">
      <h2 className="text-lg font-semibold text-text-primary mb-3">Browse {dietMode.charAt(0).toUpperCase() + dietMode.slice(1)} Recipes</h2>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {/* Filters Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {/* Max Time Filter */}
        <select
          value={maxTime ?? ''}
          onChange={(e) => setMaxTime(e.target.value ? Number(e.target.value) : null)}
          className="px-3 py-2 bg-surface rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer"
        >
          <option value="">Any time</option>
          <option value="15">15 min</option>
          <option value="25">25 min</option>
          <option value="40">40 min</option>
        </select>

        {/* Min Protein Filter */}
        <select
          value={minProtein ?? ''}
          onChange={(e) => setMinProtein(e.target.value ? Number(e.target.value) : null)}
          className="px-3 py-2 bg-surface rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer"
        >
          <option value="">Any protein</option>
          <option value="20">20g+ protein</option>
          <option value="30">30g+ protein</option>
          <option value="40">40g+ protein</option>
        </select>

        {/* Has Whey Toggle */}
        <button
          onClick={() => setHasWheyFilter(!hasWheyFilter)}
          className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            hasWheyFilter
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary'
          }`}
        >
          <Zap size={14} />
          Has Whey
        </button>
      </div>

      {/* Recipe Grid */}
      <div className="mt-4 space-y-3">
        {recipes.length === 0 ? (
          <div className="bg-surface rounded-xl p-6 text-center">
            <p className="text-text-tertiary">No recipes match your filters</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <LibRecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => onRecipeClick(recipe.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Library Recipe Card (for new recipes from lib)
function LibRecipeCard({ recipe, onClick }: { recipe: LibRecipe; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-border overflow-hidden flex text-left"
    >
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-text-primary text-sm line-clamp-1">{recipe.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {recipe.timeMins} min
            </span>
            <span className="flex items-center gap-1">
              <Flame size={12} />
              {recipe.macrosPerServing.kcal} kcal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-protein/10 text-protein px-2 py-0.5 rounded font-medium">
            {recipe.macrosPerServing.protein}g protein
          </span>
          {recipe.hasWhey && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded font-medium flex items-center gap-1">
              <Zap size={10} />
              Whey
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center px-3">
        <ChevronRight size={18} className="text-text-tertiary" />
      </div>
    </motion.button>
  );
}

// Recipe Recommendations
interface RecipeRecommendationsProps {
  recipes: Recipe[];
  dietMode: DietMode;
}

function RecipeRecommendations({ recipes, dietMode }: RecipeRecommendationsProps) {
  // Filter recipes by classification score >= 70 for current mode
  const filteredRecipes = recipes.filter((r) => {
    if (r.classification) {
      return r.classification.score[dietMode] >= 70;
    }
    // Fallback to old logic if no classification
    if (dietMode === 'bulk') return r.protein > 30;
    if (dietMode === 'cut') return r.calories < 400;
    return true;
  });

  // Sort by score (highest first)
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const scoreA = a.classification?.score[dietMode] ?? 0;
    const scoreB = b.classification?.score[dietMode] ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-6 mb-3">
        <h2 className="text-lg font-semibold text-text-primary">Recommended for You</h2>
        <button className="text-sm text-accent font-medium">See all</button>
      </div>
      {sortedRecipes.length === 0 ? (
        <div className="px-6">
          <div className="bg-surface rounded-xl p-4 text-center text-text-tertiary">
            No recipes match your {dietMode} goals with score 70+
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-6 pb-2 hide-scrollbar">
          {sortedRecipes.slice(0, 5).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} dietMode={dietMode} />
          ))}
        </div>
      )}
    </div>
  );
}

// Recipe Card
function RecipeCard({ recipe, dietMode }: { recipe: Recipe; dietMode: DietMode }) {
  const [liked, setLiked] = useState(false);
  const score = recipe.classification?.score[dietMode] ?? 0;

  const getScoreColor = (s: number) => {
    if (s >= 70) return 'bg-success text-white';
    if (s >= 50) return 'bg-carbs text-white';
    return 'bg-protein text-white';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex-shrink-0 w-64 bg-white rounded-xl border border-border overflow-hidden"
    >
      <div className="relative h-36">
        <img
          src={recipe.photo_url}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full"
        >
          <Heart
            size={18}
            className={liked ? 'fill-protein text-protein' : 'text-text-tertiary'}
          />
        </button>
        {recipe.classification && (
          <div className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getScoreColor(score)}`}>
            <Check size={12} />
            {score}/100 for {dietMode}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-text-primary mb-1 truncate">{recipe.name}</h3>
        <div className="flex items-center gap-2 text-xs text-text-tertiary mb-2">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1">
            <Flame size={12} />
            {recipe.calories} cal
          </span>
        </div>
        {/* Classification badges */}
        {recipe.classification && recipe.classification.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.classification.badges.slice(0, 2).map((badge, i) => (
              <span key={i} className="text-xs bg-surface text-text-secondary px-1.5 py-0.5 rounded">
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-xs bg-protein/10 text-protein px-2 py-0.5 rounded">P: {recipe.protein}g</span>
          <span className="text-xs bg-carbs/10 text-carbs px-2 py-0.5 rounded">C: {recipe.carbs}g</span>
          <span className="text-xs bg-fat/10 text-fat px-2 py-0.5 rounded">F: {recipe.fat}g</span>
        </div>
      </div>
    </motion.div>
  );
}

// Generate Plan Modal
interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GeneratePlanModal({ isOpen, onClose }: GeneratePlanModalProps) {
  const { setIsGeneratingPlan, dietMode } = useStore();
  const [step, setStep] = useState<'preferences' | 'generating' | 'preview'>('preferences');
  const [preferences, setPreferences] = useState({
    mealsPerDay: 4,
    cuisine: [] as string[],
    avoid: [] as string[],
    budget: 'medium',
    cookingTime: 'moderate',
  });

  const cuisineOptions = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'Indian'];
  const avoidOptions = ['Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy', 'Eggs'];

  const handleGenerate = async () => {
    setStep('generating');
    setIsGeneratingPlan(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGeneratingPlan(false);
    setStep('preview');
  };

  const handleConfirm = () => {
    // In production, this would save the generated plan
    onClose();
    setStep('preferences');
  };

  const handleClose = () => {
    onClose();
    setStep('preferences');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Generate Meal Plan</h2>
                  <p className="text-text-tertiary text-sm">
                    AI-powered plan for your {dietMode} goals
                  </p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-surface rounded-full">
                  <X size={24} className="text-text-secondary" />
                </button>
              </div>

              {step === 'preferences' && (
                <div className="space-y-6">
                  {/* Meals per day */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Meals per day
                    </label>
                    <div className="flex gap-2">
                      {[3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setPreferences({ ...preferences, mealsPerDay: num })}
                          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                            preferences.mealsPerDay === num
                              ? 'bg-accent text-white'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine preferences */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Cuisine preferences (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => {
                            const selected = preferences.cuisine.includes(cuisine)
                              ? preferences.cuisine.filter((c) => c !== cuisine)
                              : [...preferences.cuisine, cuisine];
                            setPreferences({ ...preferences, cuisine: selected });
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            preferences.cuisine.includes(cuisine)
                              ? 'bg-accent text-white'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foods to avoid */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Foods to avoid
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {avoidOptions.map((food) => (
                        <button
                          key={food}
                          onClick={() => {
                            const selected = preferences.avoid.includes(food)
                              ? preferences.avoid.filter((f) => f !== food)
                              : [...preferences.avoid, food];
                            setPreferences({ ...preferences, avoid: selected });
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            preferences.avoid.includes(food)
                              ? 'bg-protein text-white'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Budget level
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setPreferences({ ...preferences, budget: level })}
                          className={`flex-1 py-3 rounded-xl font-medium capitalize transition-colors ${
                            preferences.budget === level
                              ? 'bg-accent text-white'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cooking time */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Cooking time preference
                    </label>
                    <div className="flex gap-2">
                      {['quick', 'moderate', 'extended'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setPreferences({ ...preferences, cookingTime: time })}
                          className={`flex-1 py-3 rounded-xl font-medium capitalize transition-colors ${
                            preferences.cookingTime === time
                              ? 'bg-accent text-white'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          {time === 'quick' ? '< 15 min' : time === 'moderate' ? '15-30 min' : '30+ min'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    className="w-full py-4 bg-accent text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} />
                    Generate Plan
                  </motion.button>
                </div>
              )}

              {step === 'generating' && (
                <div className="py-12 text-center">
                  <Loader2 size={48} className="text-accent animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Creating your personalized plan...
                  </h3>
                  <p className="text-text-tertiary">
                    Our AI is designing meals that match your goals and preferences
                  </p>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="bg-success/10 text-success rounded-xl p-4 flex items-center gap-3">
                    <Check size={24} />
                    <div>
                      <p className="font-semibold">Your plan is ready!</p>
                      <p className="text-sm opacity-80">7 days of balanced meals</p>
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Plan Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-text-tertiary">Avg. Daily Calories</p>
                        <p className="font-semibold text-text-primary">2,450 cal</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary">Total Meals</p>
                        <p className="font-semibold text-text-primary">28 meals</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary">Prep Time</p>
                        <p className="font-semibold text-text-primary">~25 min avg</p>
                      </div>
                      <div>
                        <p className="text-text-tertiary">Shopping Items</p>
                        <p className="font-semibold text-text-primary">32 items</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('preferences')}
                      className="flex-1 py-3 bg-surface rounded-xl font-semibold text-text-secondary"
                    >
                      Regenerate
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="flex-1 py-3 bg-accent rounded-xl font-semibold text-white"
                    >
                      Confirm Plan
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
