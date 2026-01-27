export interface NutritionProfile {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface UserGoals {
  mode: 'bulk' | 'cut' | 'maintain';
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface MealClassification {
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

export class MealClassifier {
  static classify(meal: NutritionProfile, userGoals: UserGoals): MealClassification {
    const scores = {
      bulk: this.calculateBulkScore(meal, userGoals),
      cut: this.calculateCutScore(meal, userGoals),
      maintain: this.calculateMaintainScore(meal, userGoals),
    };

    const suitableFor: ('bulk' | 'cut' | 'maintain')[] = [];
    if (scores.bulk >= 60) suitableFor.push('bulk');
    if (scores.cut >= 60) suitableFor.push('cut');
    if (scores.maintain >= 60) suitableFor.push('maintain');

    return {
      suitableFor,
      score: scores,
      reasons: this.generateReasons(meal, scores, userGoals),
      warnings: this.generateWarnings(meal, userGoals),
      badges: this.generateBadges(meal, userGoals),
    };
  }

  private static calculateBulkScore(meal: NutritionProfile, goals: UserGoals): number {
    let score = 0;
    const caloriesPerMeal = goals.dailyCalories / 4;
    const proteinPerMeal = goals.dailyProtein / 4;
    const carbsPerMeal = goals.dailyCarbs / 4;
    const fatPerMeal = goals.dailyFat / 4;

    // Calorie scoring - bulking needs higher calories
    const calorieRatio = meal.calories / caloriesPerMeal;
    if (calorieRatio >= 1.2) score += 30;
    else if (calorieRatio >= 0.9) score += 20;
    else if (calorieRatio >= 0.6) score += 10;

    // Protein scoring - critical for muscle building
    const proteinRatio = meal.protein / proteinPerMeal;
    if (proteinRatio >= 1.0) score += 35;
    else if (proteinRatio >= 0.7) score += 25;
    else if (proteinRatio >= 0.5) score += 15;

    // Carb scoring - energy for workouts
    const carbRatio = meal.carbs / carbsPerMeal;
    if (carbRatio >= 0.8) score += 20;
    else if (carbRatio >= 0.5) score += 12;
    else score += 5;

    // Fat scoring - moderate fat is good
    const fatRatio = meal.fat / fatPerMeal;
    if (fatRatio >= 0.7 && fatRatio <= 1.5) score += 15;
    else if (fatRatio > 1.5) score += 10;
    else score += 5;

    return Math.min(score, 100);
  }

  private static calculateCutScore(meal: NutritionProfile, goals: UserGoals): number {
    let score = 0;
    const caloriesPerMeal = goals.dailyCalories / 4;
    const proteinPerMeal = goals.dailyProtein / 4;

    // Calorie scoring - cutting needs lower calories
    const calorieRatio = meal.calories / caloriesPerMeal;
    if (calorieRatio <= 0.8) score += 35;
    else if (calorieRatio <= 1.0) score += 25;
    else if (calorieRatio <= 1.2) score += 10;

    // Protein scoring - very important during cut to preserve muscle
    const proteinRatio = meal.protein / proteinPerMeal;
    if (proteinRatio >= 1.2) score += 40;
    else if (proteinRatio >= 1.0) score += 35;
    else if (proteinRatio >= 0.8) score += 25;
    else if (proteinRatio >= 0.6) score += 15;
    else score += 5;

    // Protein percentage - higher is better for cutting
    const proteinCalories = meal.protein * 4;
    const proteinPercentage = (proteinCalories / meal.calories) * 100;
    if (proteinPercentage >= 35) score += 15;
    else if (proteinPercentage >= 25) score += 12;
    else if (proteinPercentage >= 20) score += 8;
    else score += 3;

    // Fiber bonus - helps with satiety
    if (meal.fiber) {
      if (meal.fiber >= 8) score += 10;
      else if (meal.fiber >= 5) score += 7;
      else if (meal.fiber >= 3) score += 4;
    }

    return Math.min(score, 100);
  }

  private static calculateMaintainScore(meal: NutritionProfile, goals: UserGoals): number {
    let score = 0;
    const caloriesPerMeal = goals.dailyCalories / 4;
    const proteinPerMeal = goals.dailyProtein / 4;
    const carbsPerMeal = goals.dailyCarbs / 4;
    const fatPerMeal = goals.dailyFat / 4;

    // Calorie scoring - should be close to target
    const calorieRatio = meal.calories / caloriesPerMeal;
    if (calorieRatio >= 0.85 && calorieRatio <= 1.15) score += 30;
    else if (calorieRatio >= 0.7 && calorieRatio <= 1.3) score += 20;
    else score += 10;

    // Protein scoring - should be balanced
    const proteinRatio = meal.protein / proteinPerMeal;
    if (proteinRatio >= 0.8 && proteinRatio <= 1.2) score += 25;
    else if (proteinRatio >= 0.6 && proteinRatio <= 1.4) score += 18;
    else score += 10;

    // Carb scoring - should be balanced
    const carbRatio = meal.carbs / carbsPerMeal;
    if (carbRatio >= 0.8 && carbRatio <= 1.2) score += 25;
    else if (carbRatio >= 0.6 && carbRatio <= 1.4) score += 18;
    else score += 10;

    // Fat scoring - should be balanced
    const fatRatio = meal.fat / fatPerMeal;
    if (fatRatio >= 0.8 && fatRatio <= 1.2) score += 20;
    else if (fatRatio >= 0.6 && fatRatio <= 1.4) score += 14;
    else score += 8;

    return Math.min(score, 100);
  }

  private static generateReasons(
    meal: NutritionProfile,
    scores: { bulk: number; cut: number; maintain: number },
    goals: UserGoals
  ): string[] {
    const reasons: string[] = [];
    const proteinPercentage = ((meal.protein * 4) / meal.calories) * 100;
    const caloriesPerMeal = goals.dailyCalories / 4;

    if (scores.bulk >= 70) {
      if (meal.calories >= caloriesPerMeal * 1.1) {
        reasons.push('High calorie content supports muscle growth');
      }
      if (meal.protein >= goals.dailyProtein / 4) {
        reasons.push('Excellent protein for muscle building');
      }
      if (meal.carbs >= goals.dailyCarbs / 4) {
        reasons.push('Good carbs for workout energy');
      }
    }

    if (scores.cut >= 70) {
      if (meal.calories <= caloriesPerMeal * 0.9) {
        reasons.push('Low calorie helps create deficit');
      }
      if (proteinPercentage >= 30) {
        reasons.push('High protein preserves muscle during cut');
      }
      if (meal.fiber && meal.fiber >= 5) {
        reasons.push('High fiber increases satiety');
      }
      if (meal.protein >= goals.dailyProtein / 4) {
        reasons.push('Protein content supports fat loss');
      }
    }

    if (scores.maintain >= 70) {
      reasons.push('Well-balanced macro distribution');
      if (Math.abs(meal.calories - caloriesPerMeal) <= caloriesPerMeal * 0.15) {
        reasons.push('Calorie count supports maintenance');
      }
    }

    return reasons;
  }

  private static generateWarnings(meal: NutritionProfile, goals: UserGoals): string[] {
    const warnings: string[] = [];
    const proteinPercentage = ((meal.protein * 4) / meal.calories) * 100;
    const caloriesPerMeal = goals.dailyCalories / 4;

    if (goals.mode === 'cut' && meal.calories > caloriesPerMeal * 1.3) {
      warnings.push('High calories may hinder fat loss goals');
    }

    if (meal.protein < goals.dailyProtein / 6) {
      warnings.push('Low protein content');
    }

    if (meal.fat > goals.dailyFat / 2) {
      warnings.push('Very high fat content');
    }

    if (proteinPercentage < 15 && goals.mode === 'cut') {
      warnings.push('Consider adding more protein for better satiety');
    }

    if (goals.mode === 'bulk' && meal.calories < caloriesPerMeal * 0.6) {
      warnings.push('May be too low calorie for muscle gain');
    }

    return warnings;
  }

  private static generateBadges(meal: NutritionProfile, goals: UserGoals): string[] {
    const badges: string[] = [];
    const proteinPercentage = ((meal.protein * 4) / meal.calories) * 100;
    const caloriesPerMeal = goals.dailyCalories / 4;

    // Protein badges
    if (proteinPercentage >= 35) {
      badges.push('Very High Protein');
    } else if (proteinPercentage >= 25) {
      badges.push('High Protein');
    } else if (meal.protein >= goals.dailyProtein / 3) {
      badges.push('Protein Rich');
    }

    // Calorie badges
    if (meal.calories >= caloriesPerMeal * 1.3) {
      badges.push('Calorie Dense');
    } else if (meal.calories <= caloriesPerMeal * 0.7) {
      badges.push('Low Calorie');
    }

    // Carb badges
    if (meal.carbs <= goals.dailyCarbs / 8) {
      badges.push('Low Carb');
    } else if (meal.carbs >= goals.dailyCarbs / 3) {
      badges.push('High Carb');
    }

    // Fiber badge
    if (meal.fiber && meal.fiber >= 8) {
      badges.push('High Fiber');
    }

    // Fat badges
    if (meal.fat <= goals.dailyFat / 8) {
      badges.push('Low Fat');
    } else if (meal.fat >= goals.dailyFat / 2.5) {
      badges.push('High Fat');
    }

    // Balance badge
    const isBalanced =
      proteinPercentage >= 20 &&
      proteinPercentage <= 35 &&
      meal.calories >= caloriesPerMeal * 0.8 &&
      meal.calories <= caloriesPerMeal * 1.2;
    if (isBalanced) {
      badges.push('Balanced');
    }

    return badges;
  }

  static isSuitableForMode(meal: NutritionProfile, userGoals: UserGoals): boolean {
    const classification = this.classify(meal, userGoals);
    return classification.suitableFor.includes(userGoals.mode);
  }

  static getScoreForMode(
    meal: NutritionProfile,
    userGoals: UserGoals,
    mode: 'bulk' | 'cut' | 'maintain'
  ): number {
    const classification = this.classify(meal, userGoals);
    return classification.score[mode];
  }

  static getScoreStatus(score: number): 'good' | 'moderate' | 'poor' {
    if (score >= 70) return 'good';
    if (score >= 50) return 'moderate';
    return 'poor';
  }
}
