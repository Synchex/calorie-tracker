import { motion } from 'framer-motion';
import { Flame, Beef, Wheat, Droplet, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import type { Meal } from '@/types';
import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { ClassificationBadge } from '@/components/food/MealClassificationCard';

interface FoodCardProps {
  meal: Meal;
  index: number;
}

export function FoodCard({ meal, index }: FoodCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteMeal, dietMode } = useStore();

  const handleDelete = () => {
    deleteMeal(meal.id);
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-border"
    >
      <div className="flex gap-4">
        {/* Food Photo */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface flex-shrink-0">
          {meal.photo_url ? (
            <img
              src={meal.photo_url}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              <Flame size={24} />
            </div>
          )}
        </div>

        {/* Food Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text-primary truncate">
              {meal.name}
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-surface rounded-full transition-colors"
              >
                <MoreVertical size={16} className="text-text-tertiary" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-10">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm text-error hover:bg-surface w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Classification badge */}
          {meal.classification && (
            <div className="mt-1">
              <ClassificationBadge
                score={meal.classification.score[dietMode]}
                mode={dietMode}
              />
            </div>
          )}

          {/* Calories with flame */}
          <div className="flex items-center gap-1 mt-1">
            <Flame size={14} className="text-carbs" />
            <span className="text-sm font-medium text-text-primary">
              {meal.calories} cal
            </span>
          </div>

          {/* Macros */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Beef size={12} className="text-protein" />
              <span className="text-xs text-text-secondary">{meal.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Wheat size={12} className="text-carbs" />
              <span className="text-xs text-text-secondary">{meal.carbs}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet size={12} className="text-fat" />
              <span className="text-xs text-text-secondary">{meal.fat}g</span>
            </div>
          </div>

          {/* Time */}
          <p className="text-xs text-text-tertiary mt-2">
            {format(new Date(meal.created_at), 'h:mma')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
