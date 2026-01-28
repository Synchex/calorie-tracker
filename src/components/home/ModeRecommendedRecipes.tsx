import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { getRecipesByMode, type Recipe } from '@/lib/recipes';
import type { DietMode } from '@/types';

// Score calculation based on diet mode
function calculateModeScore(recipe: Recipe, mode: DietMode, userGoals: { calories: number; protein: number }): number {
    const { kcal, protein, carbs, fat } = recipe.macrosPerServing;
    const caloriesPerMeal = userGoals.calories / 4;
    const proteinPerMeal = userGoals.protein / 4;

    let score = 50;

    switch (mode) {
        case 'bulk':
            if (kcal >= caloriesPerMeal) score += 20;
            if (kcal >= caloriesPerMeal + 100) score += 10;
            if (protein >= proteinPerMeal) score += 15;
            if (protein >= 40) score += 10;
            if (carbs >= 40) score += 5;
            break;
        case 'cut':
            if (kcal <= caloriesPerMeal) score += 20;
            if (kcal <= caloriesPerMeal - 100) score += 10;
            if (protein >= proteinPerMeal) score += 20;
            if (protein >= 30 && kcal < 400) score += 10;
            if (fat < 15) score += 5;
            break;
        case 'maintain':
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
const modeConfig: Record<DietMode, { title: string; subtitle: string }> = {
    bulk: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Bulking 💪',
    },
    cut: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Cutting ✂️',
    },
    maintain: {
        title: 'Recommended for your mode',
        subtitle: 'Perfect for Maintenance ⚖️',
    },
};

export function ModeRecommendedRecipes() {
    const { dietMode, setActiveTab, setSelectedRecipeId, user } = useStore();
    const [isLoading, setIsLoading] = useState(true);

    const userGoals = useMemo(() => ({
        calories: user?.goals.calories ?? 2500,
        protein: user?.goals.protein ?? 150,
    }), [user]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [dietMode]);

    const filteredRecipes = useMemo(() => {
        const modeRecipes = getRecipesByMode(dietMode);
        const withScores = modeRecipes.map(recipe => ({
            recipe,
            score: calculateModeScore(recipe, dietMode, userGoals),
        }));

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

    // Loading skeleton - compact size
    if (isLoading) {
        return (
            <div className="py-5">
                <div className="flex items-center justify-between px-5 mb-3">
                    <div className="space-y-1.5">
                        <div className="h-4 w-40 skeleton rounded-lg" />
                        <div className="h-3 w-28 skeleton rounded-lg" />
                    </div>
                    <div className="h-3 w-12 skeleton rounded-lg" />
                </div>
                <div className="flex gap-3 px-5 overflow-x-auto hide-scrollbar">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-[220px] h-[180px] skeleton rounded-3xl flex-shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredRecipes.length === 0) {
        return (
            <div className="py-5 px-5">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface/60 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20"
                >
                    <p className="text-sm text-text-secondary mb-3">No recipes found for your mode</p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSeeAll}
                        className="px-4 py-2 bg-accent text-white rounded-full text-xs font-medium"
                    >
                        Browse all recipes
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="py-5">
            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-3">
                <div>
                    <h2 className="text-base font-semibold text-text-primary">{config.title}</h2>
                    <p className="text-xs text-text-secondary mt-0.5">{config.subtitle}</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSeeAll}
                    className="flex items-center gap-0.5 text-xs font-medium text-accent"
                >
                    See all
                    <ChevronRight size={14} />
                </motion.button>
            </div>

            {/* Horizontal Scroll Container - tighter gaps */}
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-3 px-5 pb-2">
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <CompactRecipeCard
                                    recipe={recipe}
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

// Compact Recipe Card - Modern, Premium, Apple-style
interface CompactRecipeCardProps {
    recipe: Recipe & { modeScore: number };
    onClick: () => void;
}

function CompactRecipeCard({ recipe, onClick }: CompactRecipeCardProps) {
    const { kcal, protein } = recipe.macrosPerServing;
    const isHighProtein = protein > 30;

    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-[220px] h-[180px] flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden text-left border border-white/40 shadow-sm hover:shadow-md transition-all duration-200"
        >
            {/* Image Section - 60% */}
            <div className="relative h-[108px] overflow-hidden">
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

            {/* Content Section - 40% */}
            <div className="p-3">
                {/* Title */}
                <h3 className="text-sm font-semibold text-text-primary line-clamp-1 mb-1.5">
                    {recipe.title}
                </h3>

                {/* Meta row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[11px] text-text-tertiary">
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {recipe.timeMins}m
                        </span>
                        <span className="flex items-center gap-1">
                            <Flame size={10} />
                            {kcal}
                        </span>
                    </div>
                </div>

                {/* Slim score bar */}
                <div className="mt-2 w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${recipe.modeScore}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    />
                </div>
            </div>
        </motion.button>
    );
}
