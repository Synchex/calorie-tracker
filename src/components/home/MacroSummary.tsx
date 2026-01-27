import { MacroCircle } from '@/components/ui/MacroCircle';
import { useStore } from '@/stores/useStore';

export function MacroSummary() {
  const { user, selectedDate, getDailyLog } = useStore();
  const dailyLog = getDailyLog(selectedDate);
  const goals = user?.goals ?? { protein: 150, carbs: 275, fat: 70 };

  return (
    <div className="px-6 py-4">
      <div className="flex justify-around items-center">
        <MacroCircle
          type="protein"
          current={dailyLog.totalProtein}
          goal={goals.protein}
        />
        <MacroCircle
          type="carbs"
          current={dailyLog.totalCarbs}
          goal={goals.carbs}
        />
        <MacroCircle
          type="fat"
          current={dailyLog.totalFat}
          goal={goals.fat}
        />
      </div>
    </div>
  );
}
