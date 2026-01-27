import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Search, Mic, Barcode, Utensils } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { MealCategory } from '@/types';

const mealCategories: { id: MealCategory; label: string; icon: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
  { id: 'snack', label: 'Snack', icon: '🍿' },
];

export function AddMealModal() {
  const { isAddMealOpen, setAddMealOpen, addMeal, selectedDate, setCameraOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualData, setManualData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setAddMealOpen(false);
    setShowManualEntry(false);
    setSearchQuery('');
    setManualData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const handleCameraClick = () => {
    setAddMealOpen(false);
    setCameraOpen(true);
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo, create a placeholder meal
      const meal = {
        id: uuidv4(),
        user_id: 'demo-user',
        name: 'Uploaded Meal',
        calories: Math.floor(Math.random() * 300) + 200,
        protein: Math.floor(Math.random() * 20) + 10,
        carbs: Math.floor(Math.random() * 30) + 10,
        fat: Math.floor(Math.random() * 15) + 5,
        photo_url: URL.createObjectURL(file),
        category: selectedCategory,
        foods: [],
        created_at: new Date().toISOString(),
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      addMeal(meal);
      handleClose();
    }
  };

  const handleManualSubmit = () => {
    if (!manualData.name || !manualData.calories) return;

    const meal = {
      id: uuidv4(),
      user_id: 'demo-user',
      name: manualData.name,
      calories: parseInt(manualData.calories) || 0,
      protein: parseInt(manualData.protein) || 0,
      carbs: parseInt(manualData.carbs) || 0,
      fat: parseInt(manualData.fat) || 0,
      category: selectedCategory,
      foods: [],
      created_at: new Date().toISOString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
    };
    addMeal(meal);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isAddMealOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">Add Meal</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-surface rounded-full transition-colors"
                >
                  <X size={24} className="text-text-secondary" />
                </button>
              </div>

              {/* Meal Categories */}
              <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
                {mealCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-accent text-white'
                        : 'bg-surface text-text-secondary'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>

              {!showManualEntry ? (
                <>
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <QuickAction
                      icon={<Camera size={24} />}
                      label="Take Photo"
                      description="AI analyzes your meal"
                      onClick={handleCameraClick}
                    />
                    <QuickAction
                      icon={<Search size={24} />}
                      label="Search Food"
                      description="Search database"
                      onClick={() => setShowManualEntry(true)}
                    />
                    <QuickAction
                      icon={<Barcode size={24} />}
                      label="Scan Barcode"
                      description="Packaged foods"
                      onClick={handlePhotoUpload}
                    />
                    <QuickAction
                      icon={<Utensils size={24} />}
                      label="Manual Entry"
                      description="Enter details"
                      onClick={() => setShowManualEntry(true)}
                    />
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                    />
                    <input
                      type="text"
                      placeholder="Search for food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Mic size={20} className="text-text-tertiary" />
                    </button>
                  </div>

                  {/* Recent/Favorites placeholder */}
                  <div className="text-center py-8 text-text-tertiary">
                    <p>Your recent foods will appear here</p>
                  </div>
                </>
              ) : (
                /* Manual Entry Form */
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={manualData.name}
                    onChange={(e) =>
                      setManualData({ ...manualData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Calories"
                      value={manualData.calories}
                      onChange={(e) =>
                        setManualData({ ...manualData, calories: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={manualData.protein}
                      onChange={(e) =>
                        setManualData({ ...manualData, protein: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      value={manualData.carbs}
                      onChange={(e) =>
                        setManualData({ ...manualData, carbs: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      value={manualData.fat}
                      onChange={(e) =>
                        setManualData({ ...manualData, fat: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowManualEntry(false)}
                      className="flex-1 py-3 bg-surface rounded-xl font-semibold text-text-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleManualSubmit}
                      className="flex-1 py-3 bg-accent rounded-xl font-semibold text-white"
                    >
                      Add Meal
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function QuickAction({ icon, label, description, onClick }: QuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl text-center"
    >
      <div className="text-accent">{icon}</div>
      <div>
        <p className="font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary">{description}</p>
      </div>
    </motion.button>
  );
}
