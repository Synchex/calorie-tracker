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
    const timer = setTimeout(() => setIsLoading(false), 600);
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
    <div className="flex flex-col min-h-screen pb-24">
      {/* Compact Header */}
      <header className="px-5 pt-6 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-text-primary"
        >
          Diet Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-sm text-text-secondary"
        >
          Plan your meals & reach your goals
        </motion.p>
      </header>

      {/* Slim Mode Selector */}
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

      {/* Weekly Meal Plan - Compact */}
      <WeeklyPlanSection
        plan={weeklyMealPlan}
        isLoading={isLoading}
      />

      {/* Shopping List Shortcut - Compact */}
      <ShoppingListCard itemCount={uncheckedItemsCount} topItems={shoppingList.filter((i) => !i.checked).slice(0, 3)} />

      {/* Recipe Recommendations */}
      <RecipeRecommendations recipes={recommendedRecipes} dietMode={dietMode} />

      {/* Generate Plan CTA - Compact */}
      <div className="px-5 py-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGeneratePlanModalOpen(true)}
          className="w-full py-3.5 gradient-accent text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-accent btn-press text-sm"
        >
          <Sparkles size={18} />
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

// Slim Mode Selector - 40px height segmented control
interface ModeSelectorProps {
  currentMode: DietMode;
  onModeChange: (mode: DietMode) => void;
}

function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="px-5 py-3">
      {/* Glassy segmented control */}
      <div className="bg-white/60 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/40 shadow-sm">
        {(Object.keys(modeConfig) as DietMode[]).map((mode) => {
          const config = modeConfig[mode];
          const isActive = currentMode === mode;

          return (
            <motion.button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`flex-1 relative h-10 rounded-full font-medium text-sm transition-all duration-200 ${isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mode-pill"
                  className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-full shadow-md`}
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <span className="text-base">{config.icon}</span>
                <span>{config.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
      {/* Muted description caption */}
      <motion.p
        key={currentMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs text-text-tertiary mt-2"
      >
        {modeConfig[currentMode].description}
      </motion.p>
    </div>
  );
}

// Compact Weekly Plan Section
interface WeeklyPlanSectionProps {
  plan: WeeklyMealPlan | null;
  isLoading: boolean;
}

function WeeklyPlanSection({ plan, isLoading }: WeeklyPlanSectionProps) {
  if (isLoading) {
    return (
      <div className="py-3">
        <div className="px-5 mb-2">
          <div className="h-4 skeleton rounded w-32" />
        </div>
        <WeeklyPlanSkeleton />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="px-5 py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent/5 to-white rounded-2xl p-5 text-center border border-accent/10"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Calendar size={24} className="text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">No plan yet</h3>
          <p className="text-xs text-text-secondary">
            Generate a personalized meal plan to get started
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-3">
      {/* Section header with divider */}
      <div className="flex items-center justify-between px-5 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">This Week's Plan</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <button className="p-1.5 hover:bg-surface rounded-lg transition-colors">
          <Edit3 size={14} className="text-text-tertiary" />
        </button>
      </div>

      {/* Horizontal scrolling carousel - compact */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-1 snap-x-mandatory">
        {plan.days.map((day, index) => (
          <CompactDayCard key={day.date} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

// Compact Day Card
interface DayCardProps {
  day: DayPlan;
  index: number;
}

function CompactDayCard({ day, index }: DayCardProps) {
  const gradient = dayGradients[index % dayGradients.length];
  const mealIcons = [
    { icon: Coffee, label: 'Breakfast' },
    { icon: Sun, label: 'Lunch' },
    { icon: Moon, label: 'Dinner' },
    { icon: Cookie, label: 'Snack' },
  ];

  const calorieProgress = day.totalCalories / 2500;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`flex-shrink-0 w-56 h-32 bg-gradient-to-br ${gradient} rounded-2xl p-3.5 text-white snap-start cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-white/70 text-[10px] uppercase tracking-wide font-medium">{format(parseISO(day.date), 'EEE')}</p>
          <p className="text-lg font-bold">{format(parseISO(day.date), 'MMM d')}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${day.status === 'completed' ? 'bg-white' : 'bg-white/40'}`} />
      </div>

      {/* Meal icons row - smaller */}
      <div className="flex gap-2 mb-2">
        {mealIcons.map(({ icon: Icon, label }) => {
          const hasMeal = day.meals.some(m => m.category === label.toLowerCase());
          return (
            <div
              key={label}
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasMeal ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Icon size={14} className={hasMeal ? 'text-white' : 'text-white/50'} />
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-[10px]">{day.meals.length} meals</p>
          <p className="text-sm font-semibold">{day.totalCalories} cal</p>
        </div>
        {/* Mini circular progress */}
        <div className="relative w-9 h-9">
          <svg className="w-9 h-9 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${calorieProgress * 88} 88`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold">
            {Math.round(calorieProgress * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Compact Shopping List Card
interface ShoppingListCardProps {
  itemCount: number;
  topItems: { id: string; name: string; quantity: string }[];
}

function ShoppingListCard({ itemCount, topItems }: ShoppingListCardProps) {
  return (
    <div className="px-5 py-2">
      <motion.button
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white rounded-2xl p-4 shadow-sm card-hover flex items-center gap-3 text-left border border-border/30"
      >
        <div className="w-11 h-11 gradient-carbs rounded-xl flex items-center justify-center shadow-sm">
          <ShoppingCart size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-text-primary">Shopping List</h3>
            <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {itemCount}
            </span>
          </div>
          <p className="text-xs text-text-tertiary truncate">
            {topItems.length > 0
              ? topItems.map((i) => i.name).join(', ')
              : 'No items yet'}
            {topItems.length < itemCount && '...'}
          </p>
        </div>
        <ChevronRight size={18} className="text-text-tertiary flex-shrink-0" />
      </motion.button>
    </div>
  );
}

// Browse Recipes Section - Compact
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
    <div className="py-2">
      {/* Section header with subtle divider */}
      <div className="px-5 mb-2 flex items-center gap-3">
        <h2 className="text-sm font-semibold text-text-primary">
          Browse {dietMode.charAt(0).toUpperCase() + dietMode.slice(1)} Recipes
        </h2>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Sticky Search & Filters - Compact */}
      <div className={`px-5 py-2 transition-all duration-200 ${isSticky ? 'sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border/30' : ''}`}>
        {/* Single-line search + filters */}
        <div className="flex gap-2 items-center">
          {/* Search input - rounded-full */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 bg-surface rounded-full text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-border rounded-full"
              >
                <X size={14} className="text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Filter chips - small pills */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            <FilterPill
              label={maxTime ? `≤${maxTime}m` : 'Time'}
              isActive={!!maxTime}
              icon={<Clock size={12} />}
            >
              <select
                value={maxTime ?? ''}
                onChange={(e) => setMaxTime(e.target.value ? Number(e.target.value) : null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="">Any</option>
                <option value="15">15m</option>
                <option value="25">25m</option>
                <option value="40">40m</option>
              </select>
            </FilterPill>

            <FilterPill
              label={minProtein ? `${minProtein}g+` : 'Protein'}
              isActive={!!minProtein}
              icon={<TrendingUp size={12} />}
            >
              <select
                value={minProtein ?? ''}
                onChange={(e) => setMinProtein(e.target.value ? Number(e.target.value) : null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="">Any</option>
                <option value="20">20g+</option>
                <option value="30">30g+</option>
                <option value="40">40g+</option>
              </select>
            </FilterPill>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setHasWheyFilter(!hasWheyFilter)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${hasWheyFilter
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-text-secondary border-border/50 hover:border-border'
                }`}
            >
              <Zap size={11} />
              Whey
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearAllFilters}
                className="flex items-center gap-0.5 px-2 py-1.5 rounded-full text-xs font-medium text-error hover:bg-error/10 transition-colors whitespace-nowrap"
              >
                <X size={12} />
                Clear
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Grid - Tight gaps, more columns */}
      <div className="px-5 mt-2">
        {isLoading ? (
          <RecipeListSkeleton count={6} />
        ) : recipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl p-6 text-center"
          >
            <div className="w-10 h-10 bg-border rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search size={18} className="text-text-tertiary" />
            </div>
            <p className="text-sm text-text-secondary">No recipes match your filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-2 text-accent font-medium text-xs hover:underline"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <CompactRecipeCard
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

// Filter Pill - Very small
function FilterPill({
  label,
  isActive,
  icon,
  children
}: {
  label: string;
  isActive: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${isActive
        ? 'bg-accent text-white border-accent'
        : 'bg-white text-text-secondary border-border/50 hover:border-border'
      }`}>
      {icon}
      <span>{label}</span>
      {children}
    </div>
  );
}

// Compact Recipe Card for Grid
function CompactRecipeCard({ recipe, onClick }: { recipe: LibRecipe; onClick: () => void }) {
  const isHighProtein = recipe.macrosPerServing.protein > 30;

  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden text-left border border-border/30 shadow-sm transition-all duration-200"
    >
      {/* Image - Compact */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Tiny badges */}
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          {isHighProtein && (
            <span className="bg-white/95 backdrop-blur-sm text-[8px] font-semibold text-emerald-600 px-1.5 py-0.5 rounded-full">
              High P
            </span>
          )}
          {recipe.hasWhey && (
            <span className="bg-accent/95 backdrop-blur-sm text-[8px] font-semibold text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Zap size={7} />
            </span>
          )}
        </div>
      </div>

      {/* Content - Compact */}
      <div className="p-2.5">
        <h3 className="text-xs font-semibold text-text-primary line-clamp-2 mb-1.5 leading-tight">
          {recipe.title}
        </h3>

        {/* Meta inline */}
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary mb-1.5">
          <span className="flex items-center gap-0.5">
            <Clock size={9} />
            {recipe.timeMins}m
          </span>
          <span className="flex items-center gap-0.5">
            <Flame size={9} />
            {recipe.macrosPerServing.kcal}
          </span>
        </div>

        {/* Macro pills - tiny */}
        <div className="flex gap-1">
          <span className="text-[8px] bg-protein/10 text-protein px-1.5 py-0.5 rounded-full font-semibold">
            P{recipe.macrosPerServing.protein}
          </span>
          <span className="text-[8px] bg-carbs/10 text-carbs px-1.5 py-0.5 rounded-full font-semibold">
            C{recipe.macrosPerServing.carbs}
          </span>
          <span className="text-[8px] bg-fat/10 text-fat px-1.5 py-0.5 rounded-full font-semibold">
            F{recipe.macrosPerServing.fat}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// Recipe Recommendations - Compact
interface RecipeRecommendationsProps {
  recipes: Recipe[];
  dietMode: DietMode;
}

function RecipeRecommendations({ recipes, dietMode }: RecipeRecommendationsProps) {
  const filteredRecipes = recipes.filter((r) => {
    if (r.classification) {
      return r.classification.score[dietMode] >= 70;
    }
    if (dietMode === 'bulk') return r.protein > 30;
    if (dietMode === 'cut') return r.calories < 400;
    return true;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const scoreA = a.classification?.score[dietMode] ?? 0;
    const scoreB = b.classification?.score[dietMode] ?? 0;
    return scoreB - scoreA;
  });

  return (
    <div className="py-3">
      <div className="flex items-center justify-between px-5 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">Recommended for You</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <button className="text-xs text-accent font-semibold hover:underline">See all</button>
      </div>
      {sortedRecipes.length === 0 ? (
        <div className="px-5">
          <div className="bg-surface rounded-xl p-4 text-center">
            <p className="text-xs text-text-secondary">
              No recipes match your {dietMode} goals with score 70+
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 hide-scrollbar snap-x-mandatory">
          {sortedRecipes.slice(0, 5).map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <HorizontalRecipeCard recipe={recipe} dietMode={dietMode} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Horizontal Recipe Card - For carousel
function HorizontalRecipeCard({ recipe, dietMode }: { recipe: Recipe; dietMode: DietMode }) {
  const [liked, setLiked] = useState(false);
  const score = recipe.classification?.score[dietMode] ?? 0;
  const isHighProtein = recipe.protein > 30;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-44 h-40 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden text-left border border-border/30 shadow-sm transition-all duration-200 snap-start"
    >
      {/* Image */}
      <div className="relative h-20 overflow-hidden">
        <img
          src={recipe.photo_url}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-sm rounded-full"
        >
          <Heart
            size={12}
            className={`transition-colors ${liked ? 'fill-protein text-protein' : 'text-text-tertiary'}`}
          />
        </button>

        {isHighProtein && (
          <span className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-sm text-[8px] font-semibold text-emerald-600 px-1.5 py-0.5 rounded-full">
            High P
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2">
        <h3 className="text-[11px] font-semibold text-text-primary line-clamp-1 mb-1">
          {recipe.name}
        </h3>

        <div className="flex items-center gap-2 text-[9px] text-text-tertiary mb-1.5">
          <span className="flex items-center gap-0.5">
            <Clock size={8} />
            {recipe.prepTime}m
          </span>
          <span className="flex items-center gap-0.5">
            <Flame size={8} />
            {recipe.calories}
          </span>
        </div>

        {/* Slim score bar */}
        {score > 0 && (
          <div className="w-full h-[2px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.4, delay: 0.1 }}
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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGeneratingPlan(false);
    setStep('preview');
  };

  const handleConfirm = () => {
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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-auto"
          >
            <div className="p-5">
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Generate Meal Plan</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    AI-powered plan for your {dietMode} goals
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-surface rounded-xl transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {step === 'preferences' && (
                <div className="space-y-5">
                  {/* Meals per day */}
                  <div>
                    <label className="text-xs font-semibold text-text-primary mb-2 block">
                      Meals per day
                    </label>
                    <div className="flex gap-2">
                      {[3, 4, 5, 6].map((num) => (
                        <motion.button
                          key={num}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, mealsPerDay: num })}
                          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${preferences.mealsPerDay === num
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
                    <label className="text-xs font-semibold text-text-primary mb-2 block">
                      Cuisine preferences
                    </label>
                    <div className="flex flex-wrap gap-1.5">
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
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${preferences.cuisine.includes(cuisine)
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
                    <label className="text-xs font-semibold text-text-primary mb-2 block">
                      Foods to avoid
                    </label>
                    <div className="flex flex-wrap gap-1.5">
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
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${preferences.avoid.includes(food)
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
                    <label className="text-xs font-semibold text-text-primary mb-2 block">
                      Budget level
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <motion.button
                          key={level}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, budget: level })}
                          className={`flex-1 py-2.5 rounded-xl font-semibold capitalize text-sm transition-all ${preferences.budget === level
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
                    <label className="text-xs font-semibold text-text-primary mb-2 block">
                      Cooking time preference
                    </label>
                    <div className="flex gap-2">
                      {['quick', 'moderate', 'extended'].map((time) => (
                        <motion.button
                          key={time}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPreferences({ ...preferences, cookingTime: time })}
                          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${preferences.cookingTime === time
                              ? 'gradient-accent text-white shadow-accent'
                              : 'bg-surface text-text-secondary hover:bg-border'
                            }`}
                        >
                          {time === 'quick' ? '< 15m' : time === 'moderate' ? '15-30m' : '30m+'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    className="w-full py-3.5 gradient-accent text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-accent mt-3 text-sm"
                  >
                    <Sparkles size={18} />
                    <span>Generate Plan</span>
                  </motion.button>
                </div>
              )}

              {step === 'generating' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 relative">
                    <div className="absolute inset-0 gradient-accent rounded-xl animate-pulse" />
                    <div className="absolute inset-1.5 bg-white rounded-lg flex items-center justify-center">
                      <Sparkles size={24} className="text-accent animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Creating your personalized plan...
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Our AI is designing meals that match your goals
                  </p>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="gradient-success rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Check size={22} className="text-white" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-semibold">Your plan is ready!</p>
                      <p className="text-xs opacity-90">7 days of balanced meals</p>
                    </div>
                  </motion.div>

                  <div className="bg-surface rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">Plan Summary</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary mb-0.5">Avg. Daily Calories</p>
                        <p className="text-sm font-semibold text-text-primary">2,450 cal</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary mb-0.5">Total Meals</p>
                        <p className="text-sm font-semibold text-text-primary">28 meals</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary mb-0.5">Prep Time</p>
                        <p className="text-sm font-semibold text-text-primary">~25 min avg</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary mb-0.5">Shopping Items</p>
                        <p className="text-sm font-semibold text-text-primary">32 items</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('preferences')}
                      className="flex-1 py-3 bg-surface rounded-xl font-semibold text-sm text-text-secondary hover:bg-border transition-colors"
                    >
                      Regenerate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="flex-1 py-3 gradient-accent rounded-xl font-semibold text-sm text-white shadow-accent"
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
