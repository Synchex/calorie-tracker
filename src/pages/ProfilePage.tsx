import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Target,
  Activity,
  Bell,
  Moon,
  Download,
  LogOut,
  ChevronRight,
  Flame,
  Scale,
  Ruler,
  Edit2,
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

export function ProfilePage() {
  const { user, updateUserGoals } = useStore();
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [editedGoals, setEditedGoals] = useState(user?.goals ?? {
    calories: 2500,
    protein: 150,
    carbs: 275,
    fat: 70,
    water: 8,
  });

  const handleSaveGoals = () => {
    updateUserGoals(editedGoals);
    setShowGoalEditor(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
      </header>

      {/* User Info */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center">
            <User size={32} className="text-text-tertiary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
            <p className="text-text-secondary">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Flame size={16} className="text-carbs" />
              <span className="text-sm text-text-secondary">15 day streak</span>
            </div>
          </div>
          <button className="p-2 bg-surface rounded-full">
            <Edit2 size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-border text-center">
            <Scale size={20} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-lg font-bold text-text-primary">74.5</p>
            <p className="text-xs text-text-tertiary">Weight (kg)</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border text-center">
            <Ruler size={20} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-lg font-bold text-text-primary">175</p>
            <p className="text-xs text-text-tertiary">Height (cm)</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border text-center">
            <Activity size={20} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-lg font-bold text-text-primary">23.4</p>
            <p className="text-xs text-text-tertiary">BMI</p>
          </div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Daily Goals</h3>
          <button
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="text-sm text-accent font-medium"
          >
            {showGoalEditor ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {showGoalEditor ? (
          <div className="space-y-3">
            <GoalInput
              label="Calories"
              value={editedGoals.calories}
              onChange={(v) => setEditedGoals({ ...editedGoals, calories: v })}
              unit="kcal"
            />
            <GoalInput
              label="Protein"
              value={editedGoals.protein}
              onChange={(v) => setEditedGoals({ ...editedGoals, protein: v })}
              unit="g"
              color="protein"
            />
            <GoalInput
              label="Carbs"
              value={editedGoals.carbs}
              onChange={(v) => setEditedGoals({ ...editedGoals, carbs: v })}
              unit="g"
              color="carbs"
            />
            <GoalInput
              label="Fat"
              value={editedGoals.fat}
              onChange={(v) => setEditedGoals({ ...editedGoals, fat: v })}
              unit="g"
              color="fat"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveGoals}
              className="w-full py-3 bg-accent text-white rounded-xl font-semibold mt-4"
            >
              Save Goals
            </motion.button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            <GoalItem
              label="Calories"
              value={user?.goals.calories ?? 2500}
              unit="kcal"
            />
            <GoalItem
              label="Protein"
              value={user?.goals.protein ?? 150}
              unit="g"
              color="protein"
            />
            <GoalItem
              label="Carbs"
              value={user?.goals.carbs ?? 275}
              unit="g"
              color="carbs"
            />
            <GoalItem
              label="Fat"
              value={user?.goals.fat ?? 70}
              unit="g"
              color="fat"
            />
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="px-6 py-4">
        <h3 className="font-semibold text-text-primary mb-4">Settings</h3>
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          <SettingsItem icon={<Target size={20} />} label="Activity Level" value="Moderate" />
          <SettingsItem icon={<Bell size={20} />} label="Notifications" value="On" />
          <SettingsItem icon={<Moon size={20} />} label="Dark Mode" value="Off" />
          <SettingsItem icon={<Download size={20} />} label="Export Data" />
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 py-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-surface rounded-xl flex items-center justify-center gap-2 text-error font-semibold"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </motion.button>
      </div>
    </div>
  );
}

interface GoalItemProps {
  label: string;
  value: number;
  unit: string;
  color?: 'protein' | 'carbs' | 'fat';
}

function GoalItem({ label, value, unit, color }: GoalItemProps) {
  const colorClass = color ? `text-${color}` : 'text-text-primary';
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-text-secondary">{label}</span>
      <span className={`font-semibold ${colorClass}`}>
        {value} {unit}
      </span>
    </div>
  );
}

interface GoalInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  color?: 'protein' | 'carbs' | 'fat';
}

function GoalInput({ label, value, onChange, unit, color }: GoalInputProps) {
  const borderColor = color ? `focus:ring-${color}` : 'focus:ring-accent';
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary w-20">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={`flex-1 px-4 py-2 bg-surface rounded-xl text-text-primary focus:outline-none focus:ring-2 ${borderColor}`}
      />
      <span className="text-text-tertiary w-12">{unit}</span>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function SettingsItem({ icon, label, value }: SettingsItemProps) {
  return (
    <button className="w-full flex items-center gap-3 p-4 hover:bg-surface transition-colors">
      <span className="text-text-tertiary">{icon}</span>
      <span className="flex-1 text-left text-text-primary">{label}</span>
      {value && <span className="text-text-tertiary">{value}</span>}
      <ChevronRight size={18} className="text-text-tertiary" />
    </button>
  );
}
