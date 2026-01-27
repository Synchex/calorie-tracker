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
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 safe-bottom z-50">
      <div className="max-w-lg mx-auto px-6 flex items-center justify-around h-[72px] relative">
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
        <div className="relative -top-7">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setAddMealOpen(true)}
            className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center fab-shadow touch-target"
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
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center justify-center gap-1.5 py-3 px-4 touch-target relative"
    >
      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -top-1 w-1 h-1 rounded-full bg-accent"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon
        size={24}
        strokeWidth={isActive ? 2.5 : 2}
        className={`transition-colors duration-200 ${
          isActive ? 'text-accent' : 'text-text-tertiary'
        }`}
      />
      <span
        className={`text-caption transition-colors duration-200 ${
          isActive ? 'text-accent font-semibold' : 'text-text-tertiary font-medium'
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
