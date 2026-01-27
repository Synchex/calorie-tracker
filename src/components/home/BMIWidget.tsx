import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, Ruler } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

interface BMICategory {
  label: string;
  color: string;
  bgColor: string;
  hint: string;
}

const categories: Record<string, BMICategory> = {
  underweight: {
    label: 'Underweight',
    color: 'text-fat',
    bgColor: 'bg-fat/10',
    hint: 'Focus on calorie-dense, nutrient-rich meals to build healthy mass.',
  },
  normal: {
    label: 'Normal',
    color: 'text-success',
    bgColor: 'bg-success/10',
    hint: 'Maintain your balanced diet and stay consistent with your goals.',
  },
  overweight: {
    label: 'Overweight',
    color: 'text-carbs',
    bgColor: 'bg-carbs/10',
    hint: 'For cutting, prioritize high-protein low-calorie meals.',
  },
  obese: {
    label: 'Obese',
    color: 'text-protein',
    bgColor: 'bg-protein/10',
    hint: 'Consider a structured cut plan with protein-rich, fiber-dense foods.',
  },
};

function getCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return categories.underweight;
  if (bmi < 25) return categories.normal;
  if (bmi < 30) return categories.overweight;
  return categories.obese;
}

export function BMIWidget() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLb, setWeightLb] = useState('');

  const bmiResult = useMemo(() => {
    let heightM: number;
    let weightKgVal: number;

    if (unit === 'metric') {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (!cm || !kg || cm <= 0 || kg <= 0) return null;
      heightM = cm / 100;
      weightKgVal = kg;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const lb = parseFloat(weightLb);
      const totalInches = ft * 12 + inches;
      if (totalInches <= 0 || !lb || lb <= 0) return null;
      heightM = totalInches * 0.0254;
      weightKgVal = lb * 0.453592;
    }

    const bmi = weightKgVal / (heightM * heightM);
    if (!isFinite(bmi) || bmi <= 0) return null;

    return {
      value: Math.round(bmi * 10) / 10,
      category: getCategory(bmi),
    };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 my-4 bg-white rounded-2xl p-4 border border-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Scale size={18} className="text-accent" />
          </div>
          <h3 className="font-semibold text-text-primary">BMI Calculator</h3>
        </div>

        {/* Unit Toggle */}
        <div className="flex bg-surface rounded-lg p-0.5">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              unit === 'metric'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-tertiary'
            }`}
          >
            Metric
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              unit === 'imperial'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-tertiary'
            }`}
          >
            Imperial
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Height Input */}
        <div>
          <label className="text-xs text-text-tertiary mb-1 block">
            Height {unit === 'metric' ? '(cm)' : '(ft/in)'}
          </label>
          {unit === 'metric' ? (
            <div className="relative">
              <Ruler size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="175"
                className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">ft</span>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">in</span>
              </div>
            </div>
          )}
        </div>

        {/* Weight Input */}
        <div>
          <label className="text-xs text-text-tertiary mb-1 block">
            Weight {unit === 'metric' ? '(kg)' : '(lb)'}
          </label>
          <div className="relative">
            <Scale size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            {unit === 'metric' ? (
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <input
                type="number"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
                placeholder="154"
                className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-xl p-3 ${bmiResult ? bmiResult.category.bgColor : 'bg-surface'}`}>
        {bmiResult ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${bmiResult.category.color}`}>
                  {bmiResult.value}
                </span>
                <span className={`text-sm font-medium ${bmiResult.category.color}`}>
                  {bmiResult.category.label}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {bmiResult.category.hint}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <p className="text-sm text-text-tertiary">
              Enter height and weight
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
