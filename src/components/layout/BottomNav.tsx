import { motion } from 'framer-motion';
import { Home, TrendingUp, UtensilsCrossed, User, Plus } from 'lucide-react';
import { useStore } from '@/stores/useStore';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'progress', icon: TrendingUp, label: 'Progress' },
  { id: 'diet', icon: UtensilsCrossed, label: 'Diet' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export function BottomNav() {
  const { activeTab, setActiveTab, setAddMealOpen } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom">
      <div className="max-w-lg mx-auto px-4 flex items-center justify-around h-16 relative">
        {navItems.slice(0, 2).map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}

        {/* Center FAB Button */}
        <div className="relative -top-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAddMealOpen(true)}
            className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg"
          >
            <Plus className="text-white" size={28} strokeWidth={2.5} />
          </motion.button>
        </div>

        {navItems.slice(2).map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}

interface NavButtonProps {
  icon: typeof Home;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px]"
    >
      <Icon
        size={22}
        className={isActive ? 'text-accent' : 'text-text-tertiary'}
      />
      <span
        className={`text-xs font-medium ${
          isActive ? 'text-accent' : 'text-text-tertiary'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
