import { motion } from 'framer-motion';

// Recipe Card Skeleton
export function RecipeCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            {/* Image skeleton */}
            <div className="h-48 skeleton" />
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                <div className="h-5 skeleton rounded-lg w-3/4" />
                <div className="flex gap-2">
                    <div className="h-4 skeleton rounded-full w-16" />
                    <div className="h-4 skeleton rounded-full w-20" />
                </div>
                <div className="flex gap-2">
                    <div className="h-6 skeleton rounded-full w-14" />
                    <div className="h-6 skeleton rounded-full w-14" />
                    <div className="h-6 skeleton rounded-full w-14" />
                </div>
            </div>
        </div>
    );
}

// Day Card Skeleton for Weekly Plan
export function DayCardSkeleton() {
    return (
        <div className="flex-shrink-0 w-72 h-44 rounded-3xl skeleton" />
    );
}

// Recipe List Skeleton (multiple cards)
export function RecipeListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <RecipeCardSkeleton />
                </motion.div>
            ))}
        </div>
    );
}

// Weekly Plan Skeleton
export function WeeklyPlanSkeleton() {
    return (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                >
                    <DayCardSkeleton />
                </motion.div>
            ))}
        </div>
    );
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-12 skeleton rounded-full" />
            <div className="flex gap-2">
                <div className="h-9 skeleton rounded-full w-24" />
                <div className="h-9 skeleton rounded-full w-28" />
                <div className="h-9 skeleton rounded-full w-20" />
            </div>
        </div>
    );
}

// Full Diet Page Skeleton
export function DietPageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen pb-24 animate-fade-in">
            {/* Header skeleton */}
            <div className="px-6 pt-8 pb-4 space-y-2">
                <div className="h-8 skeleton rounded-lg w-32" />
                <div className="h-5 skeleton rounded-lg w-48" />
            </div>

            {/* Mode selector skeleton */}
            <div className="px-6 py-4">
                <div className="h-14 skeleton rounded-2xl" />
            </div>

            {/* Search & filters skeleton */}
            <div className="px-6 py-4">
                <SearchBarSkeleton />
            </div>

            {/* Recipe grid skeleton */}
            <div className="px-6 py-4">
                <RecipeListSkeleton count={6} />
            </div>
        </div>
    );
}
