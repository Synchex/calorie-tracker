import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Meal, DailyLog, UserGoals, DietMode, WeeklyMealPlan, ShoppingItem, Recipe, DayPlan, MealClassificationData } from '@/types';
import { format, startOfDay, addDays } from 'date-fns';
import { MealClassifier, type UserGoals as ClassifierGoals } from '@/services/MealClassifier';

// Helper to convert store goals to classifier goals
const toClassifierGoals = (goals: UserGoals, mode: DietMode): ClassifierGoals => ({
  mode,
  dailyCalories: goals.calories,
  dailyProtein: goals.protein,
  dailyCarbs: goals.carbs,
  dailyFat: goals.fat,
});

// Helper to classify a meal
const classifyMeal = (
  meal: { calories: number; protein: number; carbs: number; fat: number; fiber?: number },
  goals: UserGoals,
  mode: DietMode
): MealClassificationData => {
  const classification = MealClassifier.classify(
    { calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat, fiber: meal.fiber },
    toClassifierGoals(goals, mode)
  );
  return classification;
};

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUserGoals: (goals: Partial<UserGoals>) => void;

  // Selected Date
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Meals
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  getMealsByDate: (date: Date) => Meal[];

  // Daily totals
  getDailyLog: (date: Date) => DailyLog;

  // Streak
  streak: number;
  updateStreak: () => void;

  // Diet Mode & Meal Planning
  dietMode: DietMode;
  setDietMode: (mode: DietMode) => void;
  weeklyMealPlan: WeeklyMealPlan | null;
  setWeeklyMealPlan: (plan: WeeklyMealPlan | null) => void;
  shoppingList: ShoppingItem[];
  setShoppingList: (items: ShoppingItem[]) => void;
  toggleShoppingItem: (id: string) => void;
  recommendedRecipes: Recipe[];
  setRecommendedRecipes: (recipes: Recipe[]) => void;
  isGeneratingPlan: boolean;
  setIsGeneratingPlan: (generating: boolean) => void;

  // UI State
  activeTab: 'home' | 'progress' | 'diet' | 'profile';
  setActiveTab: (tab: 'home' | 'progress' | 'diet' | 'profile') => void;
  isAddMealOpen: boolean;
  setAddMealOpen: (open: boolean) => void;
  isCameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
  isGeneratePlanModalOpen: boolean;
  setGeneratePlanModalOpen: (open: boolean) => void;

  // Recipe Detail
  selectedRecipeId: string | null;
  setSelectedRecipeId: (id: string | null) => void;
}

const defaultGoals: UserGoals = {
  calories: 2500,
  protein: 150,
  carbs: 275,
  fat: 70,
  water: 8,
};

const defaultUser: User = {
  id: 'demo-user',
  email: 'demo@example.com',
  name: 'Demo User',
  created_at: new Date().toISOString(),
  goals: defaultGoals,
  preferences: {
    theme: 'light',
    notifications: true,
    units: 'metric',
    startOfWeek: 1,
  },
};

// Demo meals data with pre-computed classifications
const demoMeals: Meal[] = [
  {
    id: '1',
    user_id: 'demo-user',
    name: 'Grilled Salmon',
    calories: 350,
    protein: 35,
    carbs: 2,
    fat: 22,
    fiber: 0,
    photo_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    category: 'lunch',
    foods: [],
    created_at: new Date().toISOString(),
    date: format(new Date(), 'yyyy-MM-dd'),
    classification: {
      suitableFor: ['cut', 'maintain'],
      score: { bulk: 55, cut: 85, maintain: 68 },
      reasons: ['High protein preserves muscle during cut', 'Low calorie helps create deficit'],
      warnings: [],
      badges: ['High Protein', 'Low Carb'],
    },
  },
  {
    id: '2',
    user_id: 'demo-user',
    name: 'Greek Yogurt Bowl',
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 8,
    fiber: 3,
    photo_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    category: 'breakfast',
    foods: [],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    date: format(new Date(), 'yyyy-MM-dd'),
    classification: {
      suitableFor: ['cut', 'maintain'],
      score: { bulk: 45, cut: 72, maintain: 65 },
      reasons: ['Protein content supports fat loss', 'Well-balanced macro distribution'],
      warnings: [],
      badges: ['Balanced', 'Low Fat'],
    },
  },
  {
    id: '3',
    user_id: 'demo-user',
    name: 'Chicken Salad',
    calories: 420,
    protein: 38,
    carbs: 15,
    fat: 24,
    fiber: 5,
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    category: 'dinner',
    foods: [],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    date: format(new Date(), 'yyyy-MM-dd'),
    classification: {
      suitableFor: ['cut', 'maintain'],
      score: { bulk: 58, cut: 78, maintain: 70 },
      reasons: ['High protein preserves muscle during cut', 'High fiber increases satiety'],
      warnings: [],
      badges: ['High Protein', 'Low Carb'],
    },
  },
  {
    id: '4',
    user_id: 'demo-user',
    name: 'Protein Smoothie',
    calories: 200,
    protein: 25,
    carbs: 20,
    fat: 3,
    fiber: 2,
    photo_url: 'https://images.unsplash.com/photo-1553530666-ba11a90a0868?w=200&h=200&fit=crop',
    category: 'snack',
    foods: [],
    created_at: new Date(Date.now() - 10800000).toISOString(),
    date: format(new Date(), 'yyyy-MM-dd'),
    classification: {
      suitableFor: ['cut'],
      score: { bulk: 35, cut: 88, maintain: 55 },
      reasons: ['Low calorie helps create deficit', 'High protein preserves muscle during cut'],
      warnings: [],
      badges: ['Very High Protein', 'Low Calorie', 'Low Fat'],
    },
  },
];

// Demo shopping list
const demoShoppingList: ShoppingItem[] = [
  { id: '1', name: 'Chicken breast', quantity: '2 lbs', category: 'protein', checked: false },
  { id: '2', name: 'Salmon fillets', quantity: '4 pieces', category: 'protein', checked: false },
  { id: '3', name: 'Greek yogurt', quantity: '32 oz', category: 'dairy', checked: true },
  { id: '4', name: 'Eggs', quantity: '1 dozen', category: 'protein', checked: false },
  { id: '5', name: 'Spinach', quantity: '2 bags', category: 'produce', checked: false },
  { id: '6', name: 'Avocados', quantity: '4', category: 'produce', checked: false },
  { id: '7', name: 'Brown rice', quantity: '2 lbs', category: 'grains', checked: true },
  { id: '8', name: 'Sweet potatoes', quantity: '3 lbs', category: 'produce', checked: false },
  { id: '9', name: 'Olive oil', quantity: '1 bottle', category: 'other', checked: true },
  { id: '10', name: 'Almonds', quantity: '1 lb', category: 'other', checked: false },
  { id: '11', name: 'Broccoli', quantity: '2 heads', category: 'produce', checked: false },
  { id: '12', name: 'Cottage cheese', quantity: '16 oz', category: 'dairy', checked: false },
];

// Demo recipes with classifications
const demoRecipes: Recipe[] = [
  {
    id: '1',
    name: 'High-Protein Chicken Bowl',
    description: 'Grilled chicken with quinoa and roasted vegetables',
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    calories: 520,
    protein: 45,
    carbs: 42,
    fat: 18,
    fiber: 6,
    prepTime: 25,
    servings: 1,
    ingredients: ['Chicken breast', 'Quinoa', 'Broccoli', 'Bell peppers'],
    instructions: ['Cook quinoa', 'Grill chicken', 'Roast vegetables', 'Combine and serve'],
    tags: ['high-protein', 'meal-prep', 'bulk'],
    fitsCurrentMacros: true,
    classification: {
      suitableFor: ['bulk', 'maintain'],
      score: { bulk: 82, cut: 58, maintain: 75 },
      reasons: ['High calorie content supports muscle growth', 'Excellent protein for muscle building', 'Good carbs for workout energy'],
      warnings: [],
      badges: ['High Protein', 'Balanced'],
    },
  },
  {
    id: '2',
    name: 'Salmon & Asparagus',
    description: 'Pan-seared salmon with lemon garlic asparagus',
    photo_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    calories: 380,
    protein: 38,
    carbs: 8,
    fat: 22,
    fiber: 4,
    prepTime: 20,
    servings: 1,
    ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Garlic', 'Olive oil'],
    instructions: ['Season salmon', 'Pan sear', 'Roast asparagus', 'Serve with lemon'],
    tags: ['keto', 'low-carb', 'omega-3'],
    fitsCurrentMacros: true,
    classification: {
      suitableFor: ['cut', 'maintain'],
      score: { bulk: 52, cut: 82, maintain: 70 },
      reasons: ['High protein preserves muscle during cut', 'Low calorie helps create deficit'],
      warnings: [],
      badges: ['High Protein', 'Low Carb'],
    },
  },
  {
    id: '3',
    name: 'Greek Protein Bowl',
    description: 'Mediterranean-style bowl with grilled chicken and tzatziki',
    photo_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    calories: 450,
    protein: 42,
    carbs: 35,
    fat: 16,
    fiber: 5,
    prepTime: 30,
    servings: 1,
    ingredients: ['Chicken', 'Cucumber', 'Tomatoes', 'Feta', 'Hummus'],
    instructions: ['Grill chicken', 'Chop vegetables', 'Make tzatziki', 'Assemble bowl'],
    tags: ['mediterranean', 'fresh', 'balanced'],
    fitsCurrentMacros: false,
    classification: {
      suitableFor: ['bulk', 'cut', 'maintain'],
      score: { bulk: 72, cut: 70, maintain: 85 },
      reasons: ['Well-balanced macro distribution', 'Excellent protein for muscle building', 'High fiber increases satiety'],
      warnings: [],
      badges: ['High Protein', 'Balanced'],
    },
  },
  {
    id: '4',
    name: 'Protein Oatmeal',
    description: 'Overnight oats with protein powder and berries',
    photo_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    calories: 380,
    protein: 32,
    carbs: 45,
    fat: 8,
    fiber: 6,
    prepTime: 5,
    servings: 1,
    ingredients: ['Oats', 'Protein powder', 'Almond milk', 'Berries', 'Honey'],
    instructions: ['Mix oats with milk and protein', 'Refrigerate overnight', 'Top with berries'],
    tags: ['breakfast', 'meal-prep', 'quick'],
    fitsCurrentMacros: true,
    classification: {
      suitableFor: ['bulk', 'maintain'],
      score: { bulk: 75, cut: 55, maintain: 72 },
      reasons: ['Good carbs for workout energy', 'Excellent protein for muscle building', 'High fiber increases satiety'],
      warnings: [],
      badges: ['High Protein', 'High Carb', 'Low Fat'],
    },
  },
  {
    id: '5',
    name: 'Turkey Lettuce Wraps',
    description: 'Asian-inspired ground turkey in crispy lettuce cups',
    photo_url: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&h=300&fit=crop',
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 15,
    fiber: 3,
    prepTime: 15,
    servings: 2,
    ingredients: ['Ground turkey', 'Lettuce', 'Soy sauce', 'Ginger', 'Garlic'],
    instructions: ['Cook turkey with seasonings', 'Wash lettuce cups', 'Fill and serve'],
    tags: ['low-carb', 'quick', 'cut'],
    fitsCurrentMacros: true,
    classification: {
      suitableFor: ['cut'],
      score: { bulk: 48, cut: 85, maintain: 62 },
      reasons: ['Low calorie helps create deficit', 'High protein preserves muscle during cut'],
      warnings: [],
      badges: ['Very High Protein', 'Low Calorie', 'Low Carb'],
    },
  },
];

// Generate demo weekly meal plan
const generateDemoWeeklyPlan = (): WeeklyMealPlan => {
  const today = startOfDay(new Date());
  const days: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    const isPlanned = i < 5;
    return {
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE'),
      meals: isPlanned ? [
        {
          id: `meal-${i}-1`,
          name: 'Protein Oatmeal',
          calories: 380,
          protein: 32,
          carbs: 45,
          fat: 8,
          category: 'breakfast' as const,
          prepTime: 5,
        },
        {
          id: `meal-${i}-2`,
          name: 'Chicken Salad Bowl',
          calories: 520,
          protein: 45,
          carbs: 30,
          fat: 22,
          category: 'lunch' as const,
          prepTime: 15,
        },
        {
          id: `meal-${i}-3`,
          name: 'Grilled Salmon',
          calories: 450,
          protein: 40,
          carbs: 20,
          fat: 24,
          category: 'dinner' as const,
          prepTime: 25,
        },
        {
          id: `meal-${i}-4`,
          name: 'Protein Shake',
          calories: 200,
          protein: 30,
          carbs: 10,
          fat: 5,
          category: 'snack' as const,
          prepTime: 2,
        },
      ] : [],
      totalCalories: isPlanned ? 1550 : 0,
      totalProtein: isPlanned ? 147 : 0,
      totalCarbs: isPlanned ? 105 : 0,
      totalFat: isPlanned ? 59 : 0,
      status: isPlanned ? 'planned' : 'empty',
    };
  });

  return {
    id: 'demo-plan',
    weekStartDate: format(today, 'yyyy-MM-dd'),
    days,
    createdAt: new Date().toISOString(),
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: defaultUser,
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUserGoals: (goals) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, goals: { ...state.user.goals, ...goals } }
            : null,
        })),

      // Selected Date
      selectedDate: startOfDay(new Date()),
      setSelectedDate: (date) => set({ selectedDate: startOfDay(date) }),

      // Meals
      meals: demoMeals,
      addMeal: (meal) => set((state) => {
        const user = state.user;
        if (user && !meal.classification) {
          const classification = classifyMeal(meal, user.goals, state.dietMode);
          return { meals: [{ ...meal, classification }, ...state.meals] };
        }
        return { meals: [meal, ...state.meals] };
      }),
      updateMeal: (id, updates) =>
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        })),
      getMealsByDate: (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return get().meals.filter((m) => m.date === dateStr);
      },

      // Daily totals
      getDailyLog: (date) => {
        const meals = get().getMealsByDate(date);
        return {
          date: format(date, 'yyyy-MM-dd'),
          meals,
          totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
          totalProtein: meals.reduce((sum, m) => sum + m.protein, 0),
          totalCarbs: meals.reduce((sum, m) => sum + m.carbs, 0),
          totalFat: meals.reduce((sum, m) => sum + m.fat, 0),
          water: 0,
        };
      },

      // Streak
      streak: 15,
      updateStreak: () => {
        set((state) => ({ streak: state.streak + 1 }));
      },

      // Diet Mode & Meal Planning
      dietMode: 'maintain',
      setDietMode: (mode) => set({ dietMode: mode }),
      weeklyMealPlan: generateDemoWeeklyPlan(),
      setWeeklyMealPlan: (plan) => set({ weeklyMealPlan: plan }),
      shoppingList: demoShoppingList,
      setShoppingList: (items) => set({ shoppingList: items }),
      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      recommendedRecipes: demoRecipes,
      setRecommendedRecipes: (recipes) => set({ recommendedRecipes: recipes }),
      isGeneratingPlan: false,
      setIsGeneratingPlan: (generating) => set({ isGeneratingPlan: generating }),

      // UI State
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      isAddMealOpen: false,
      setAddMealOpen: (open) => set({ isAddMealOpen: open }),
      isCameraOpen: false,
      setCameraOpen: (open) => set({ isCameraOpen: open }),
      isGeneratePlanModalOpen: false,
      setGeneratePlanModalOpen: (open) => set({ isGeneratePlanModalOpen: open }),

      // Recipe Detail
      selectedRecipeId: null,
      setSelectedRecipeId: (id) => set({ selectedRecipeId: id }),
    }),
    {
      name: 'calorie-tracker-storage',
      partialize: (state) => ({
        user: state.user,
        meals: state.meals,
        streak: state.streak,
        dietMode: state.dietMode,
        weeklyMealPlan: state.weeklyMealPlan,
        shoppingList: state.shoppingList,
      }),
    }
  )
);
