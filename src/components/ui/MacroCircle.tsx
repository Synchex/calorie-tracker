import { ProgressRing } from './ProgressRing';
import { Beef, Wheat, Droplet } from 'lucide-react';

interface MacroCircleProps {
  type: 'protein' | 'carbs' | 'fat';
  current: number;
  goal: number;
}

const macroConfig = {
  protein: {
    color: '#FF6B6B',
    bgColor: '#FFE5E5',
    icon: Beef,
    label: 'Protein',
  },
  carbs: {
    color: '#FFA726',
    bgColor: '#FFF3E0',
    icon: Wheat,
    label: 'Carbs',
  },
  fat: {
    color: '#42A5F5',
    bgColor: '#E3F2FD',
    icon: Droplet,
    label: 'Fat',
  },
};

export function MacroCircle({ type, current, goal }: MacroCircleProps) {
  const config = macroConfig[type];
  const Icon = config.icon;
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing
        progress={progress}
        size={80}
        strokeWidth={6}
        color={config.color}
        backgroundColor={config.bgColor}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon size={20} style={{ color: config.color }} />
        </div>
      </ProgressRing>
      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">
          {current}<span className="text-text-tertiary font-normal">/{goal}g</span>
        </p>
        <p className="text-xs text-text-tertiary">{config.label}</p>
      </div>
    </div>
  );
}
