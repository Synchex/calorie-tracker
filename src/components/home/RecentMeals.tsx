import { FoodCard } from './FoodCard';
import { useStore } from '@/stores/useStore';

export function RecentMeals() {
  const { selectedDate, getMealsByDate } = useStore();
  const meals = getMealsByDate(selectedDate);

  return (
    <div className="px-4 py-4 flex-1">
      <h2 className="text-lg font-semibold text-text-primary mb-4 px-2">
        Recently uploaded
      </h2>
      <div className="space-y-3">
        {meals.length === 0 ? (
          <div className="text-center py-12 text-text-tertiary">
            <p>No meals logged yet today.</p>
            <p className="text-sm mt-1">Tap + to add your first meal!</p>
          </div>
        ) : (
          meals.map((meal, index) => (
            <FoodCard key={meal.id} meal={meal} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
