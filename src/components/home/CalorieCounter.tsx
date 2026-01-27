import { ProgressRing } from '@/components/ui/ProgressRing';
import { useStore } from '@/stores/useStore';

export function CalorieCounter() {
  const { user, selectedDate, getDailyLog } = useStore();
  const dailyLog = getDailyLog(selectedDate);
  const goal = user?.goals.calories ?? 2500;
  const progress = Math.min((dailyLog.totalCalories / goal) * 100, 100);

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-text-primary">
              {dailyLog.totalCalories}
            </span>
            <span className="text-2xl font-medium text-text-tertiary">
              /{goal}
            </span>
          </div>
          <p className="text-text-secondary mt-1">Calories eaten</p>
        </div>
        <ProgressRing
          progress={progress}
          size={100}
          strokeWidth={8}
          color="#000000"
          backgroundColor="#E5E7EB"
        >
          <div className="text-center">
            <span className="text-lg font-bold text-text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </ProgressRing>
      </div>
    </div>
  );
}
