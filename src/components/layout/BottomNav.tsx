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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/30 safe-bottom z-50 shadow-lg shadow-black/5">
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

        {/* Center FAB Button - Slightly smaller */}
        <div className="relative -top-6">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setAddMealOpen(true)}
            className="w-14 h-14 gradient-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30 touch-target"
          >
            <Plus className="text-white" size={24} strokeWidth={2.5} />
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
      className="flex flex-col items-center justify-center gap-1 py-2 px-3 touch-target relative"
    >
      {/* Active glow background */}
      {isActive && (
        <motion.div
          layoutId="nav-glow"
          className="absolute inset-x-1 -inset-y-0.5 bg-accent/10 rounded-xl"
          initial={false}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          className="absolute -top-0.5 w-1 h-1 rounded-full bg-accent"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={isActive ? 2.5 : 2}
        className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-accent' : 'text-text-tertiary'
          }`}
      />
      <span
        className={`relative z-10 text-[10px] transition-colors duration-200 ${isActive ? 'text-accent font-semibold' : 'text-text-tertiary font-medium'
          }`}
      >
        {label}
      </span>
    </motion.button>
  );
}

