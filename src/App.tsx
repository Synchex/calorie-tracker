import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { HomePage, ProgressPage, DietPage, ProfilePage } from '@/pages';
import { BottomNav } from '@/components/layout/BottomNav';
import { AddMealModal } from '@/components/food/AddMealModal';
import { CameraView } from '@/components/food/CameraView';
import { RecipeDetailModal } from '@/components/recipes/RecipeDetailModal';

const pageVariants = {
  initial: { opacity: 0, x: 10 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -10 },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function App() {
  const { activeTab } = useStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'progress':
        return <ProgressPage />;
      case 'diet':
        return <DietPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      <BottomNav />
      <AddMealModal />
      <CameraView />
      <RecipeDetailModal />
    </div>
  );
}

export default App;
