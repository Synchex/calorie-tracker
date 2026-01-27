// Claude API integration for food recognition
// In production, this should call your backend API which then calls Claude

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export interface FoodAnalysisResult {
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

export async function analyzeFood(imageBase64: string): Promise<FoodAnalysisResult> {
  // For demo purposes, return mock data
  // In production, this would call your backend API

  if (!CLAUDE_API_KEY) {
    // Return demo data when no API key is configured
    return {
      foods: [
        {
          name: 'Grilled Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          serving_size: '100g',
          confidence: 0.95,
        },
        {
          name: 'Mixed Salad',
          calories: 25,
          protein: 2,
          carbs: 4,
          fat: 0.5,
          serving_size: '1 cup',
          confidence: 0.88,
        },
        {
          name: 'Quinoa',
          calories: 120,
          protein: 4.4,
          carbs: 21,
          fat: 1.9,
          serving_size: '100g',
          confidence: 0.82,
        },
      ],
      total: {
        calories: 310,
        protein: 37.4,
        carbs: 25,
        fat: 6,
      },
    };
  }

  // Production API call would go here
  // This should call YOUR backend, which then makes the Claude API request
  // Never expose API keys in the frontend

  const response = await fetch('/api/analyze-food', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze food');
  }

  return response.json();
}

// Prompt template for Claude Vision API (for backend use)
export const FOOD_ANALYSIS_PROMPT = `
Analyze this food image and provide nutritional information.

For each food item visible in the image, estimate:
1. Food name
2. Serving size
3. Calories
4. Protein (g)
5. Carbohydrates (g)
6. Fat (g)
7. Confidence level (0-1)

Return the response as JSON in this format:
{
  "foods": [
    {
      "name": "Food Name",
      "calories": 200,
      "protein": 10,
      "carbs": 25,
      "fat": 8,
      "serving_size": "1 cup",
      "confidence": 0.9
    }
  ],
  "total": {
    "calories": 200,
    "protein": 10,
    "carbs": 25,
    "fat": 8
  }
}

Be accurate with portion sizes and nutritional values based on standard USDA values.
If you cannot identify a food with reasonable confidence, include it with a lower confidence score.
`;
