import { Flame } from 'lucide-react';
import { useStore } from '@/stores/useStore';

export function Header() {
  const { streak } = useStore();

  return (
    <header className="px-6 pt-4 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
          <Flame className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-text-primary">CalorieTracker</span>
      </div>
      <div className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-full">
        <Flame className="text-carbs" size={18} />
        <span className="font-semibold text-text-primary">{streak}</span>
      </div>
    </header>
  );
}
