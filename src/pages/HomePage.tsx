import { Header } from '@/components/home/Header';
import { DateSelector } from '@/components/home/DateSelector';
import { CalorieCounter } from '@/components/home/CalorieCounter';
import { MacroSummary } from '@/components/home/MacroSummary';
import { BMIWidget } from '@/components/home/BMIWidget';
import { ModeRecommendedRecipes } from '@/components/home/ModeRecommendedRecipes';
import { RecentMeals } from '@/components/home/RecentMeals';
import { RecommendedRecipes } from '@/components/home/RecommendedRecipes';

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen pb-28">
      <Header />
      <DateSelector />
      <CalorieCounter />
      <MacroSummary />

      {/* NEW: Recommended for your mode - personalized recommendations */}
      <ModeRecommendedRecipes />

      <BMIWidget />
      <RecentMeals />
      <RecommendedRecipes />
    </div>
  );
}
