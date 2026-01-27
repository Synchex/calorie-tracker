import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Scale, Ruler, Camera, Check, AlertTriangle, X } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useStore } from '@/stores/useStore';

// Demo data for charts
const weightData = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(new Date(), 13 - i), 'MMM d'),
  weight: 75 + Math.random() * 2 - 1,
}));

const calorieData = Array.from({ length: 7 }, (_, i) => ({
  date: format(subDays(new Date(), 6 - i), 'EEE'),
  calories: Math.floor(1800 + Math.random() * 700),
  goal: 2500,
}));

export function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'weight' | 'photos'>('overview');
  const { meals, dietMode } = useStore();

  const macroData = [
    { name: 'Protein', value: 118, color: '#FF6B6B' },
    { name: 'Carbs', value: 195, color: '#FFA726' },
    { name: 'Fat', value: 52, color: '#42A5F5' },
  ];

  // Generate weekly meal score data from actual meals
  const weeklyScoreData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayMeals = meals.filter((m) => m.date === dateStr && m.classification);

    const avgScore =
      dayMeals.length > 0
        ? Math.round(
            dayMeals.reduce((sum, m) => sum + (m.classification?.score[dietMode] ?? 0), 0) /
              dayMeals.length
          )
        : 0;

    return {
      day: format(date, 'EEE'),
      score: avgScore,
      mealCount: dayMeals.length,
    };
  });

  // Calculate overall weekly average
  const mealsWithScores = weeklyScoreData.filter((d) => d.mealCount > 0);
  const weeklyAvgScore =
    mealsWithScores.length > 0
      ? Math.round(
          mealsWithScores.reduce((sum, d) => sum + d.score, 0) / mealsWithScores.length
        )
      : 0;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-text-primary">Progress</h1>
        <p className="text-text-secondary">Track your journey</p>
      </header>

      {/* Tabs */}
      <div className="px-6 py-3">
        <div className="flex gap-2 bg-surface rounded-xl p-1">
          {(['overview', 'weight', 'photos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-tertiary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="px-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Target size={20} />}
              label="Goal Streak"
              value="15 days"
              trend="up"
            />
            <StatCard
              icon={<Scale size={20} />}
              label="Current Weight"
              value="74.5 kg"
              trend="down"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Avg. Calories"
              value="2,150"
              trend="up"
            />
            <StatCard
              icon={<Ruler size={20} />}
              label="BMI"
              value="23.4"
              trend="same"
            />
          </div>

          {/* Calorie Trend Chart */}
          <div className="bg-white rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-4">Weekly Calories</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: '#000000' }}
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#E5E7EB"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Macro Distribution */}
          <div className="bg-white rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-4">Macro Distribution</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {macroData.map((macro) => (
                  <div key={macro.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-sm text-text-secondary flex-1">
                      {macro.name}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {macro.value}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Meal Scores Analytics */}
          <div className="bg-white rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Weekly Meal Scores</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary capitalize">{dietMode} mode</span>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    weeklyAvgScore >= 70
                      ? 'bg-success/10 text-success'
                      : weeklyAvgScore >= 50
                      ? 'bg-carbs/10 text-carbs'
                      : 'bg-protein/10 text-protein'
                  }`}
                >
                  {weeklyAvgScore >= 70 ? (
                    <Check size={12} />
                  ) : weeklyAvgScore >= 50 ? (
                    <AlertTriangle size={12} />
                  ) : (
                    <X size={12} />
                  )}
                  <span>Avg: {weeklyAvgScore}</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded-lg shadow-lg border border-border text-sm">
                          <p className="font-medium">{data.day}</p>
                          <p className="text-text-secondary">Score: {data.score}/100</p>
                          <p className="text-text-tertiary text-xs">{data.mealCount} meals logged</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="score"
                  radius={[4, 4, 0, 0]}
                  fill="#000000"
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Score Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-text-tertiary">Good (70+)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-carbs" />
                <span className="text-text-tertiary">Moderate (50-69)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-protein" />
                <span className="text-text-tertiary">Poor (&lt;50)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weight' && (
        <div className="px-6 space-y-6">
          {/* Current Weight */}
          <div className="bg-white rounded-xl p-6 border border-border text-center">
            <p className="text-text-secondary mb-2">Current Weight</p>
            <p className="text-4xl font-bold text-text-primary">74.5 kg</p>
            <p className="text-success text-sm mt-2">-1.5 kg from start</p>
          </div>

          {/* Weight Chart */}
          <div className="bg-white rounded-xl p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-4">Weight Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: '#000000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Log Weight Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-accent text-white rounded-xl font-semibold"
          >
            Log Today's Weight
          </motion.button>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="px-6 space-y-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-text-tertiary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              Track your transformation
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Take progress photos to visualize your journey
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-accent text-white rounded-xl font-semibold"
            >
              Add Progress Photo
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'same';
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 text-text-tertiary mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-text-primary">{value}</span>
        {trend === 'up' && <TrendingUp size={16} className="text-success" />}
        {trend === 'down' && <TrendingDown size={16} className="text-protein" />}
      </div>
    </div>
  );
}
