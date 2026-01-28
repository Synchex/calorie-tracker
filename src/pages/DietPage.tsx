import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
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
  Search,
  Zap,
  Coffee,
  Sun,
  Moon,
  Cookie,
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { format, parseISO } from 'date-fns';
import type { DietMode, Recipe, DayPlan, WeeklyMealPlan } from '@/types';
import {
  getRecipesByMode,
  filterRecipes,
  type Recipe as LibRecipe,
} from '@/lib/recipes';
import { RecipeListSkeleton, WeeklyPlanSkeleton } from '@/components/ui/LoadingSkeleton';

// Mode configuration with icons and gradients
const modeConfig: Record<DietMode, {
  label: string;
  icon: string;
  description: string;
  gradient: string;
  color: string;
}> = {
  bulk: {
    label: 'Bulk',
    icon: '💪',
    description: 'Build muscle & gain strength',
    gradient: 'from-emerald-500 to-teal-400',
    color: 'text-emerald-600',
  },
  cut: {
    label: 'Cut',
    icon: '✂️',
    description: 'Burn fat & get lean',
    gradient: 'from-rose-500 to-pink-400',
    color: 'text-rose-600',
  },
  maintain: {
    label: 'Maintain',
    icon: '⚖️',
    description: 'Stay balanced & healthy',
    gradient: 'from-amber-500 to-orange-400',
    color: 'text-amber-600',
  },
};

// Day gradient colors for weekly plan
const dayGradients = [
  'from-violet-500 to-purple-400',
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-yellow-400',
  'from-rose-500 to-pink-400',
  'from-indigo-500 to-blue-400',
  'from-fuchsia-500 to-purple-400',
];

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

  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Browse recipes state
  const [searchQuery, setSearchQuery] = useState('');
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [minProtein, setMinProtein] = useState<number | null>(null);
  const [hasWheyFilter, setHasWheyFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const uncheckedItemsCount = shoppingList.filter((item) => !item.checked).length;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sticky search bar detection
  useEffect(() => {
    const handleScroll = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Check if any filters are active
  const hasActiveFilters = searchQuery || maxTime || minProtein || hasWheyFilter;

  const clearAllFilters = () => {
    setSearchQuery('');
    setMaxTime(null);
    setMinProtein(null);
    setHasWheyFilter(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-headline text-text-primary"
        >
          Diet Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-body text-text-secondary mt-1"
        >
          Plan your meals & reach your goals
        </motion.p>
      </header>

      {/* Mode Selector */}
      <ModeSelector currentMode={dietMode} onModeChange={setDietMode} />

      {/* Browse Recipes Section */}
      <div ref={searchRef}>
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
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
          onRecipeClick={(id) => setSelectedRecipeId(id)}
          isSticky={isSticky}
          isLoading={isLoading}
        />
      </div>

      {/* Weekly Meal Plan */}
      <WeeklyPlanSection
        plan={weeklyMealPlan}
        isLoading={isLoading}
      />

      {/* Shopping List Shortcut */}
      <ShoppingListCard itemCount={uncheckedItemsCount} topItems={shoppingList.filter((i) => !i.checked).slice(0, 3)} />

      {/* Recipe Recommendations */}
      <RecipeRecommendations recipes={recommendedRecipes} dietMode={dietMode} />

      {/* Generate Plan CTA */}
      <div className="px-6 py-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGeneratePlanModalOpen(true)}
          className="w-full py-4 gradient-accent text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-accent btn-press"
        >
          <Sparkles size={22} />
          <span className="text-title">{weeklyMealPlan ? 'Regenerate My Week' : 'Generate My Week'}</span>
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
    <div className="px-6 py-5">
      <div className="bg-surface rounded-2xl p-1.5 flex gap-1.5">
        {(Object.keys(modeConfig) as DietMode[]).map((mode) => {
          const config = modeConfig[mode];
          const isActive = currentMode === mode;

          return (
            <motion.button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`flex-1 relative py-4 px-3 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'
                }`}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl`}
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-xl">{config.icon}</span>
                <span className="text-label">{config.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      <motion.p
        key={currentMode}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center text-label mt-3 ${modeConfig[currentMode].color}`}
      >
        {modeConfig[currentMode].description}
      </motion.p>
    </div>
  );
}

// Weekly Plan Section - Horizontal Carousel
interface WeeklyPlanSectionProps {
  plan: WeeklyMealPlan | null;
  isLoading: boolean;
}

function WeeklyPlanSection({ plan, isLoading }: WeeklyPlanSectionProps) {
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="px-6 mb-4">
          <div className="h-6 skeleton rounded-lg w-40" />
        </div>
        <WeeklyPlanSkeleton />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent-surface to-white rounded-3xl p-8 text-center border border-accent/10"
        >
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-accent" />
          </div>
          <h3 className="text-title text-text-primary mb-2">No plan yet</h3>
          <p className="text-body text-text-secondary">
            Generate a personalized meal plan to get started
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-title text-text-primary">This Week's Plan</h2>
        <button className="p-2 hover:bg-surface rounded-xl transition-colors touch-target">
          <Edit3 size={18} className="text-text-tertiary" />
        </button>
      </div>

      {/* Horizontal scrolling carousel */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-2 snap-x-mandatory">
        {plan.days.map((day, index) => (
          <DayCard key={day.date} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

// Day Card - Modern horizontal card
interface DayCardProps {
  day: DayPlan;
  index: number;
}

function DayCard({ day, index }: DayCardProps) {
  const gradient = dayGradients[index % dayGradients.length];
  const mealIcons = [
    { icon: Coffee, label: 'Breakfast' },
    { icon: Sun, label: 'Lunch' },
    { icon: Moon, label: 'Dinner' },
    { icon: Cookie, label: 'Snack' },
  ];

  const calorieProgress = day.totalCalories / 2500; // Assuming 2500 target

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`flex-shrink-0 w-72 h-44 bg-gradient-to-br ${gradient} rounded-3xl p-5 text-white snap-start card-hover cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-white/70 text-caption uppercase tracking-wide">{format(parseISO(day.date), 'EEE')}</p>
          <p className="text-2xl font-bold">{format(parseISO(day.date), 'MMM d')}</p>
        </div>
        {/* Status indicator */}
        <div className={`w-3 h-3 rounded-full ${day.status === 'completed' ? 'bg-white' : 'bg-white/40'}`} />
      </div>

      {/* Meal icons row */}
      <div className="flex gap-3 mb-4">
        {mealIcons.map(({ icon: Icon, label }) => {
          const hasMeal = day.meals.some(m => m.category === label.toLowerCase());
          return (
            <div
              key={label}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${hasMeal ? 'bg-white/30' : 'bg-white/10'
                }`}
            >
              <Icon size={18} className={hasMeal ? 'text-white' : 'text-white/50'} />
            </div>
          );
        })}
      </div>

      {/* Calorie progress */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-caption">{day.meals.length} meals</p>
          <p className="text-lg font-semibold">{day.totalCalories} cal</p>
        </div>
        {/* Circular progress */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${calorieProgress * 125.6} 125.6`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-caption font-semibold">
            {Math.round(calorieProgress * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Shopping List Card
interface ShoppingListCardProps {
  itemCount: number;
  topItems: { id: string; name: string; quantity: string }[];
}

function ShoppingListCard({ itemCount, topItems }: ShoppingListCardProps) {
  return (
    <div className="px-6 py-3">
      <motion.button
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white rounded-2xl p-5 shadow-card card-hover flex items-center gap-4 text-left border border-border/50"
      >
        <div className="w-14 h-14 gradient-carbs rounded-2xl flex items-center justify-center shadow-md">
          <ShoppingCart size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-title text-text-primary">Shopping List</h3>
            <span className="bg-accent text-white text-caption px-2.5 py-0.5 rounded-full font-semibold">
              {itemCount}
            </span>
          </div>
          <p className="text-label text-text-tertiary truncate">
            {topItems.length > 0
              ? topItems.map((i) => i.name).join(', ')
              : 'No items yet'}
            {topItems.length < itemCount && '...'}
          </p>
        </div>
        <ChevronRight size={22} className="text-text-tertiary flex-shrink-0" />
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
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  onRecipeClick: (id: string) => void;
  isSticky: boolean;
  isLoading: boolean;
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
  hasActiveFilters,
  clearAllFilters,
  onRecipeClick,
  isSticky,
  isLoading,
}: BrowseRecipesSectionProps) {
  return (
    <div className="py-4">
      <div className="px-6 mb-4">
        <h2 className="text-title text-text-primary">
          Browse {dietMode.charAt(0).toUpperCase() + dietMode.slice(1)} Recipes
        </h2>
      </div>

      {/* Sticky Search & Filters */}
      <div className={`px-6 py-3 transition-all duration-200 ${isSticky ? 'sticky top-0 z-30 glass' : ''
        }`}>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-full text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-border rounded-full"
            >
              <X size={16} className="text-text-tertiary" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {/* Max Time Filter */}
          <FilterChip
            label={maxTime ? `≤${maxTime} min` : 'Any time'}
            isActive={!!maxTime}
            onClear={maxTime ? () => setMaxTime(null) : undefined}
            icon={<Clock size={14} />}
          >
            <select
              value={maxTime ?? ''}
              onChange={(e) => setMaxTime(e.target.value ? Number(e.target.value) : null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value="">Any time</option>
              <option value="15">15 min</option>
              <option value="25">25 min</option>
              <option value="40">40 min</option>
            </select>
          </FilterChip>

          {/* Min Protein Filter */}
          <FilterChip
            label={minProtein ? `${minProtein}g+ protein` : 'Any protein'}
            isActive={!!minProtein}
            onClear={minProtein ? () => setMinProtein(null) : undefined}
            icon={<TrendingUp size={14} />}
          >
            <select
              value={minProtein ?? ''}
              onChange={(e) => setMinProtein(e.target.value ? Number(e.target.value) : null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value="">Any protein</option>
              <option value="20">20g+</option>
              <option value="30">30g+</option>
              <option value="40">40g+</option>
            </select>
          </FilterChip>

          {/* Has Whey Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setHasWheyFilter(!hasWheyFilter)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-label font-medium whitespace-nowrap transition-all ${hasWheyFilter
              ? 'bg-accent text-white shadow-sm'
              : 'bg-surface text-text-secondary hover:bg-border'
              }`}
          >
            <Zap size={14} />
            Has Whey
            {hasWheyFilter && (
              <X size={14} className="ml-1" onClick={(e) => {
                e.stopPropagation();
                setHasWheyFilter(false);
              }} />
            )}
          </motion.button>

          {/* Clear all */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-full text-label font-medium text-error hover:bg-error/10 transition-colors whitespace-nowrap"
            >
              <X size={14} />
              Clear all
            </motion.button>
          )}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="px-6 mt-4">
        {isLoading ? (
          <RecipeListSkeleton count={6} />
        ) : recipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-text-tertiary" />
            </div>
            <p className="text-body text-text-secondary">No recipes match your filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-3 text-accent font-medium text-label hover:underline"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LibRecipeCard
                  recipe={recipe}
                  onClick={() => onRecipeClick(recipe.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Chip Component
function FilterChip({
  label,
  isActive,
  onClear,
  icon,
  children
}: {
  label: string;
  isActive: boolean;
  onClear?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-label font-medium whitespace-nowrap transition-all cursor-pointer ${isActive
      ? 'bg-accent text-white shadow-sm'
      : 'bg-surface text-text-secondary hover:bg-border'
      }`}>
      {icon}
      <span>{label}</span>
      {isActive && onClear && (
        <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="ml-1">
          <X size={14} />
        </button>
      )}
      {children}
    </div>
  );
}

// Library Recipe Card - Compact Premium Design
function LibRecipeCard({ recipe, onClick }: { recipe: LibRecipe; onClick: () => void }) {
  const isHighProtein = recipe.macrosPerServing.protein > 30;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden text-left border border-white/40 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Image section - 60% */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Tiny pill badges - top right */}
        <div className="absolute top-2 right-2 flex gap-1">
          {isHighProtein && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-medium text-emerald-600 px-2 py-0.5 rounded-full">
              High Protein
            </span>
          )}
          {recipe.hasWhey && (
            <span className="bg-accent/90 backdrop-blur-sm text-[10px] font-medium text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Zap size={8} />
              Whey
            </span>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-2">
          {recipe.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-text-tertiary mb-2">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {recipe.timeMins}m
          </span>
          <span className="flex items-center gap-1">
            <Flame size={11} />
            {recipe.macrosPerServing.kcal}
          </span>
        </div>

        {/* Macro pills - tiny */}
        <div className="flex gap-1.5">
          <span className="text-[9px] bg-protein/10 text-protein px-2 py-0.5 rounded-full font-medium">
            P {recipe.macrosPerServing.protein}g
          </span>
          <span className="text-[9px] bg-carbs/10 text-carbs px-2 py-0.5 rounded-full font-medium">
            C {recipe.macrosPerServing.carbs}g
          </span>
          <span className="text-[9px] bg-fat/10 text-fat px-2 py-0.5 rounded-full font-medium">
            F {recipe.macrosPerServing.fat}g
          </span>
        </div>
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
    <div className="py-6">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-title text-text-primary">Recommended for You</h2>
        <button className="text-label text-accent font-semibold hover:underline">See all</button>
      </div>
      {sortedRecipes.length === 0 ? (
        <div className="px-6">
          <div className="bg-surface rounded-2xl p-6 text-center">
            <p className="text-body text-text-secondary">
              No recipes match your {dietMode} goals with score 70+
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 hide-scrollbar snap-x-mandatory">
          {sortedRecipes.slice(0, 5).map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <RecipeCard recipe={recipe} dietMode={dietMode} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Recipe Card - Compact Horizontal Scroll Card
function RecipeCard({ recipe, dietMode }: { recipe: Recipe; dietMode: DietMode }) {
  const [liked, setLiked] = useState(false);
  const score = recipe.classification?.score[dietMode] ?? 0;
  const isHighProtein = recipe.protein > 30;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-[220px] h-[180px] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden text-left border border-white/40 shadow-sm hover:shadow-md transition-all duration-200 snap-start"
    >
      {/* Image Section - 60% */}
      <div className="relative h-[108px] overflow-hidden">
        <img
          src={recipe.photo_url}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full"
        >
          <Heart
            size={14}
            className={`transition-colors ${liked ? 'fill-protein text-protein' : 'text-text-tertiary'}`}
          />
        </button>

        {/* Tiny badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isHighProtein && (
            <span className="bg-white/90 backdrop-blur-sm text-[9px] font-medium text-emerald-600 px-1.5 py-0.5 rounded-full">
              High Protein
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary line-clamp-1 mb-1.5">
          {recipe.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {recipe.prepTime}m
            </span>
            <span className="flex items-center gap-1">
              <Flame size={10} />
              {recipe.calories}
            </span>
          </div>
        </div>

        {/* Slim score bar */}
        {score > 0 && (
          <div className="mt-2 w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            />
          </div>
        )}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              {/* Handle bar */}
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-headline text-text-primary">Generate Meal Plan</h2>
                  <p className="text-label text-text-secondary mt-1">
                    AI-powered plan for your {dietMode} goals
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2.5 hover:bg-surface rounded-xl transition-colors touch-target"
                >
                  <X size={24} className="text-text-secondary" />
                </button>
              </div>

              {step === 'preferences' && (
                <div className="space-y-6">
                  {/* Meals per day */}
                  <div>
                    <label className="text-label font-semibold text-text-primary mb-3 block">
                      Meals per day
                    </label>
                    <div className="flex gap-2">
                      {[3, 4, 5, 6].map((num) => (
                        <motion.button
                          key={num}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, mealsPerDay: num })}
                          className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${preferences.mealsPerDay === num
                            ? 'gradient-accent text-white shadow-accent'
                            : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {num}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine preferences */}
                  <div>
                    <label className="text-label font-semibold text-text-primary mb-3 block">
                      Cuisine preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <motion.button
                          key={cuisine}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const selected = preferences.cuisine.includes(cuisine)
                              ? preferences.cuisine.filter((c) => c !== cuisine)
                              : [...preferences.cuisine, cuisine];
                            setPreferences({ ...preferences, cuisine: selected });
                          }}
                          className={`px-4 py-2.5 rounded-full text-label font-medium transition-all ${preferences.cuisine.includes(cuisine)
                            ? 'gradient-accent text-white shadow-sm'
                            : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {cuisine}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Foods to avoid */}
                  <div>
                    <label className="text-label font-semibold text-text-primary mb-3 block">
                      Foods to avoid
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {avoidOptions.map((food) => (
                        <motion.button
                          key={food}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const selected = preferences.avoid.includes(food)
                              ? preferences.avoid.filter((f) => f !== food)
                              : [...preferences.avoid, food];
                            setPreferences({ ...preferences, avoid: selected });
                          }}
                          className={`px-4 py-2.5 rounded-full text-label font-medium transition-all ${preferences.avoid.includes(food)
                            ? 'gradient-protein text-white shadow-sm'
                            : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {food}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-label font-semibold text-text-primary mb-3 block">
                      Budget level
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <motion.button
                          key={level}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, budget: level })}
                          className={`flex-1 py-3.5 rounded-xl font-semibold capitalize transition-all ${preferences.budget === level
                            ? 'gradient-accent text-white shadow-accent'
                            : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {level}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Cooking time */}
                  <div>
                    <label className="text-label font-semibold text-text-primary mb-3 block">
                      Cooking time preference
                    </label>
                    <div className="flex gap-2">
                      {['quick', 'moderate', 'extended'].map((time) => (
                        <motion.button
                          key={time}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, cookingTime: time })}
                          className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${preferences.cookingTime === time
                            ? 'gradient-accent text-white shadow-accent'
                            : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {time === 'quick' ? '< 15 min' : time === 'moderate' ? '15-30 min' : '30+ min'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    className="w-full py-4 gradient-accent text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-accent mt-4"
                  >
                    <Sparkles size={22} />
                    <span className="text-title">Generate Plan</span>
                  </motion.button>
                </div>
              )}

              {step === 'generating' && (
                <div className="py-16 text-center">
                  {/* Animated loading skeleton */}
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 gradient-accent rounded-2xl animate-pulse" />
                    <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                      <Sparkles size={32} className="text-accent animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-title text-text-primary mb-2">
                    Creating your personalized plan...
                  </h3>
                  <p className="text-body text-text-secondary">
                    Our AI is designing meals that match your goals
                  </p>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gradient-success rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Check size={28} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-title font-semibold">Your plan is ready!</p>
                      <p className="text-label opacity-90">7 days of balanced meals</p>
                    </div>
                  </motion.div>

                  <div className="bg-surface rounded-2xl p-5">
                    <h4 className="text-title text-text-primary mb-4">Plan Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-caption text-text-tertiary mb-1">Avg. Daily Calories</p>
                        <p className="text-title text-text-primary">2,450 cal</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-caption text-text-tertiary mb-1">Total Meals</p>
                        <p className="text-title text-text-primary">28 meals</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-caption text-text-tertiary mb-1">Prep Time</p>
                        <p className="text-title text-text-primary">~25 min avg</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-caption text-text-tertiary mb-1">Shopping Items</p>
                        <p className="text-title text-text-primary">32 items</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('preferences')}
                      className="flex-1 py-4 bg-surface rounded-2xl font-semibold text-text-secondary hover:bg-border transition-colors"
                    >
                      Regenerate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="flex-1 py-4 gradient-accent rounded-2xl font-semibold text-white shadow-accent"
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
