export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  goals: UserGoals;
  preferences: UserPreferences;
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  units: 'metric' | 'imperial';
  startOfWeek: 0 | 1;
}

export interface MealClassificationData {
  suitableFor: ('bulk' | 'cut' | 'maintain')[];
  score: {
    bulk: number;
    cut: number;
    maintain: number;
  };
  reasons: string[];
  warnings?: string[];
  badges: string[];
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  photo_url?: string;
  category: MealCategory;
  foods: FoodItem[];
  created_at: string;
  date: string;
  classification?: MealClassificationData;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string;
  quantity: number;
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  water: number;
}

export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  date: string;
  created_at: string;
}

export interface AIFoodAnalysis {
  foods: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving_size: string;
    confidence: number;
  }[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DateInfo {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
}

// Diet Types
export type DietMode = 'bulk' | 'cut' | 'maintain';

export interface PlannedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photo_url?: string;
  category: MealCategory;
  prepTime: number;
  recipe?: string;
}

export interface DayPlan {
  date: string;
  dayName: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  status: 'planned' | 'completed' | 'empty';
}

export interface WeeklyMealPlan {
  id: string;
  weekStartDate: string;
  days: DayPlan[];
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'other';
  checked: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  prepTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  fitsCurrentMacros?: boolean;
  classification?: MealClassificationData;
}
