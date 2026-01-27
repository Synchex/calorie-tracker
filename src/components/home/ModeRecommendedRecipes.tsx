import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChevronRight, Check, Zap } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { getRecipesByMode, type Recipe } from '@/lib/recipes';
import type { DietMode } from '@/types';

// Score calculation based on diet mode
function calculateModeScore(recipe: Recipe, mode: DietMode, userGoals: { calories: number; protein: number }): number {
    const { kcal, protein, carbs, fat } = recipe.macrosPerServing;
    const caloriesPerMeal = userGoals.calories / 4;
    const proteinPerMeal = userGoals.protein / 4;

    let score = 50; // Base score

    switch (mode) {
        case 'bulk':
            // Favor high calories and high protein
            if (kcal >= caloriesPerMeal) score += 20;
            if (kcal >= caloriesPerMeal + 100) score += 10;
            if (protein >= proteinPerMeal) score += 15;
            if (protein >= 40) score += 10;
            if (carbs >= 40) score += 5;
            break;
        case 'cut':
            // Favor low calories and high protein
            if (kcal <= caloriesPerMeal) score += 20;
            if (kcal <= caloriesPerMeal - 100) score += 10;
            if (protein >= proteinPerMeal) score += 20;
            if (protein >= 30 && kcal < 400) score += 10;
            if (fat < 15) score += 5;
            break;
        case 'maintain':
            // Favor balanced macros
            const proteinRatio = protein / (protein + carbs + fat);
            const carbRatio = carbs / (protein + carbs + fat);
            const fatRatio = fat / (protein + carbs + fat);
            if (proteinRatio >= 0.25 && proteinRatio <= 0.35) score += 15;
            if (carbRatio >= 0.35 && carbRatio <= 0.50) score += 15;
            if (fatRatio >= 0.20 && fatRatio <= 0.35) score += 10;
            if (kcal >= caloriesPerMeal - 100 && kcal <= caloriesPerMeal + 100) score += 15;
            break;
    }

    return Math.min(100, score);
}

// Mode configuration
const modeConfig: Record<DietMode, { title: string; subtitle: string; gradient: string }> = {
    bulk: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Bulking 💪',
        gradient: 'from-emerald-500 to-teal-400',
    },
    cut: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Cutting ✂️',
        gradient: 'from-rose-500 to-pink-400',
    },
    maintain: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Maintenance ⚖️',
        gradient: 'from-amber-500 to-orange-400',
    },
};

export function ModeRecommendedRecipes() {
    const { dietMode, setActiveTab, setSelectedRecipeId, user } = useStore();
    const [isLoading, setIsLoading] = useState(true);

    // User goals from store
    const userGoals = useMemo(() => ({
        calories: user?.goals.calories ?? 2500,
        protein: user?.goals.protein ?? 150,
    }), [user]);

    // Simulate initial loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [dietMode]);

    // Get and filter recipes with high scores for current mode
    const filteredRecipes = useMemo(() => {
        const modeRecipes = getRecipesByMode(dietMode);

        // Calculate scores and filter
        const withScores = modeRecipes.map(recipe => ({
            recipe,
            score: calculateModeScore(recipe, dietMode, userGoals),
        }));

        // Filter recipes with score >= 70 and sort by score
        return withScores
            .filter(item => item.score >= 70)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(item => ({ ...item.recipe, modeScore: item.score }));
    }, [dietMode, userGoals]);

    const config = modeConfig[dietMode];

    const handleSeeAll = () => {
        setActiveTab('diet');
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="py-6">
                <div className="flex items-center justify-between px-6 mb-4">
                    <div className="space-y-2">
                        <div className="h-5 w-48 skeleton rounded-lg" />
                        <div className="h-4 w-32 skeleton rounded-lg" />
                    </div>
                    <div className="h-4 w-16 skeleton rounded-lg" />
                </div>
                <div className="flex gap-4 px-6 overflow-x-auto hide-scrollbar">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-[280px] h-[320px] skeleton rounded-2xl flex-shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredRecipes.length === 0) {
        return (
            <div className="py-6 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-2xl p-8 text-center"
                >
                    <p className="text-body text-text-secondary mb-4">No recipes found for your mode</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSeeAll}
                        className="px-5 py-2.5 gradient-accent text-white rounded-xl text-label font-semibold shadow-accent"
                    >
                        Browse all recipes
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 mb-4">
                <div>
                    <h2 className="text-title text-text-primary">{config.title}</h2>
                    <p className="text-label text-text-secondary mt-0.5">{config.subtitle}</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSeeAll}
                    className="flex items-center gap-1 text-label font-semibold text-accent hover:underline"
                >
                    See all
                    <ChevronRight size={16} />
                </motion.button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-4 px-6 pb-2 snap-x-mandatory">
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ModeRecipeCard
                                    recipe={recipe}
                                    dietMode={dietMode}
                                    userGoals={userGoals}
                                    onClick={() => setSelectedRecipeId(recipe.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Enhanced Recipe Card matching specifications
interface ModeRecipeCardProps {
    recipe: Recipe & { modeScore: number };
    dietMode: DietMode;
    userGoals: { calories: number; protein: number };
    onClick: () => void;
}

function ModeRecipeCard({ recipe, dietMode, userGoals, onClick }: ModeRecipeCardProps) {
    const { kcal, protein, carbs, fat } = recipe.macrosPerServing;
    const isHighProtein = protein > 30;
    const proteinPerMeal = userGoals.protein / 4;
    const fitsTarget = protein >= proteinPerMeal * 0.8;

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'bg-emerald-500';
        if (score >= 75) return 'bg-emerald-400';
        return 'bg-amber-400';
    };

    const getModeLabel = (mode: DietMode) => {
        const labels = { bulk: 'Bulk', cut: 'Cut', maintain: 'Maintain' };
        return labels[mode];
    };

    return (
        <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-[280px] min-h-[320px] flex-shrink-0 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow text-left snap-start overflow-hidden flex flex-col"
        >
            {/* Image Section - 60% */}
            <div className="relative h-[192px] overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* High Protein Badge */}
                {isHighProtein && (
                    <div className="absolute top-3 right-3 bg-protein text-white text-caption font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        💪 High Protein
                    </div>
                )}

                {/* Whey badge */}
                {recipe.hasWhey && (
                    <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white text-caption font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Zap size={12} />
                        Whey
                    </div>
                )}

                {/* Title on image */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-title text-white line-clamp-2 drop-shadow-lg">
                        {recipe.title}
                    </h3>
                </div>
            </div>

            {/* Content Section - 40% */}
            <div className="p-4 flex-grow flex flex-col justify-between">
                {/* Metadata row with icons */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-label text-text-secondary">
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-text-tertiary" />
                        {recipe.timeMins} min
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Flame size={14} className="text-carbs" />
                        {kcal} cal
                    </span>
                    {fitsTarget && (
                        <span className="flex items-center gap-1 text-success font-medium">
                            <Check size={14} />
                            Fits your macros
                        </span>
                    )}
                </div>

                {/* Score indicator */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-caption">
                        <span className="text-text-secondary">
                            {getModeLabel(dietMode)} score
                        </span>
                        <span className="font-bold text-text-primary">{recipe.modeScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${recipe.modeScore}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`h-full ${getScoreColor(recipe.modeScore)} rounded-full`}
                        />
                    </div>
                </div>
            </div>
        </motion.button>
    );
}
