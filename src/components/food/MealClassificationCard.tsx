import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, TrendingUp, TrendingDown, Target } from 'lucide-react';
import type { MealClassification } from '@/services/MealClassifier';

interface Props {
  classification: MealClassification;
  currentMode: 'bulk' | 'cut' | 'maintain';
  compact?: boolean;
}

const modeIcons = {
  bulk: TrendingUp,
  cut: TrendingDown,
  maintain: Target,
};

const modeLabels = {
  bulk: 'Bulk',
  cut: 'Cut',
  maintain: 'Maintain',
};

const badgeEmojis: Record<string, string> = {
  'Very High Protein': '💪',
  'High Protein': '💪',
  'Protein Rich': '💪',
  'Calorie Dense': '🔥',
  'Low Calorie': '🥗',
  'Low Carb': '🥑',
  'High Carb': '🍚',
  'High Fiber': '🌾',
  'Low Fat': '💧',
  'High Fat': '🥜',
  'Balanced': '⚖️',
};

export function MealClassificationCard({ classification, currentMode, compact = false }: Props) {
  const currentScore = classification.score[currentMode];
  const ModeIcon = modeIcons[currentMode];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-carbs';
    return 'text-protein';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-success';
    if (score >= 50) return 'bg-carbs';
    return 'bg-protein';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <Check size={16} />;
    if (score >= 50) return <AlertTriangle size={16} />;
    return <X size={16} />;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getScoreBgColor(currentScore)}`}
        >
          {getScoreIcon(currentScore)}
          <span>{currentScore}</span>
        </div>
        {classification.badges.slice(0, 2).map((badge, i) => (
          <span key={i} className="text-xs bg-surface px-2 py-1 rounded-full">
            {badgeEmojis[badge] || ''} {badge}
          </span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 border border-border"
    >
      {/* Header with current mode score */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ModeIcon size={18} className={getScoreColor(currentScore)} />
          <span className="text-sm font-medium text-text-secondary">
            Fit for {modeLabels[currentMode]}
          </span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
          {currentScore}/100
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${currentScore}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${getScoreBgColor(currentScore)}`}
        />
      </div>

      {/* Badges */}
      {classification.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {classification.badges.map((badge, i) => (
            <span
              key={i}
              className="text-xs bg-surface text-text-secondary px-2.5 py-1 rounded-full"
            >
              {badgeEmojis[badge] || '•'} {badge}
            </span>
          ))}
        </div>
      )}

      {/* Reasons */}
      {classification.reasons.length > 0 && (
        <div className="space-y-2 mb-4">
          {classification.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Check size={14} className="text-success mt-0.5 flex-shrink-0" />
              <span className="text-text-secondary">{reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {classification.warnings && classification.warnings.length > 0 && (
        <div className="space-y-2 border-t border-border pt-3 mb-4">
          {classification.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <AlertTriangle size={14} className="text-carbs mt-0.5 flex-shrink-0" />
              <span className="text-carbs">{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* All mode scores */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
        {(['bulk', 'cut', 'maintain'] as const).map((mode) => {
          const score = classification.score[mode];
          const Icon = modeIcons[mode];
          const isCurrentMode = mode === currentMode;
          return (
            <div
              key={mode}
              className={`text-center p-2 rounded-lg ${isCurrentMode ? 'bg-surface' : ''}`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon size={12} className="text-text-tertiary" />
                <span className="text-xs text-text-tertiary capitalize">{mode}</span>
              </div>
              <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Small badge component for meal cards
interface ClassificationBadgeProps {
  score: number;
  mode: 'bulk' | 'cut' | 'maintain';
}

export function ClassificationBadge({ score, mode }: ClassificationBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'bg-success/10 text-success border-success/20';
    if (s >= 50) return 'bg-carbs/10 text-carbs border-carbs/20';
    return 'bg-protein/10 text-protein border-protein/20';
  };

  const getScoreIcon = (s: number) => {
    if (s >= 70) return <Check size={10} />;
    if (s >= 50) return <AlertTriangle size={10} />;
    return <X size={10} />;
  };

  const ModeIcon = modeIcons[mode];

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getScoreColor(score)}`}
    >
      {getScoreIcon(score)}
      <ModeIcon size={10} />
      <span>{score}</span>
    </div>
  );
}
