// Recipe data types and local dataset

export interface Macro {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mode: 'bulk' | 'cut' | 'maintain';
  timeMins: number;
  servings: number;
  macrosPerServing: Macro;
  ingredients: string[];
  steps: string[];
  hasWhey: boolean;
  image: string;
}

// 30 recipes: 10 bulk, 10 cut, 10 maintain
export const RECIPES: Recipe[] = [
  // ==================== BULK RECIPES (10) ====================
  {
    id: 'bulk-1',
    title: 'Mass Gainer Shake',
    description: 'Calorie-dense shake perfect for post-workout muscle building.',
    tags: ['bulk', 'high-calorie', 'quick', 'whey'],
    mode: 'bulk',
    timeMins: 5,
    servings: 1,
    macrosPerServing: { kcal: 850, protein: 50, carbs: 95, fat: 28 },
    ingredients: [
      '2 scoops whey protein',
      '2 cups whole milk',
      '1 large banana',
      '2 tbsp peanut butter',
      '1/2 cup oats',
      '1 tbsp honey',
    ],
    steps: [
      'Add all ingredients to a blender.',
      'Blend on high for 60 seconds until smooth.',
      'Pour into a large glass and enjoy immediately.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90a0868?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-2',
    title: 'Beef & Rice Power Bowl',
    description: 'Hearty ground beef bowl loaded with carbs and protein for gains.',
    tags: ['bulk', 'high-protein', 'meal-prep'],
    mode: 'bulk',
    timeMins: 30,
    servings: 2,
    macrosPerServing: { kcal: 720, protein: 45, carbs: 68, fat: 28 },
    ingredients: [
      '400g ground beef (80/20)',
      '2 cups cooked white rice',
      '1 cup black beans',
      '1/2 cup corn',
      '1 avocado',
      'Salsa and cheese for topping',
    ],
    steps: [
      'Brown the ground beef in a large skillet over medium-high heat.',
      'Season with salt, pepper, and cumin.',
      'Warm the rice and beans.',
      'Assemble bowls with rice, beef, beans, corn.',
      'Top with avocado slices, salsa, and cheese.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-3',
    title: 'Peanut Butter Banana Oats',
    description: 'Creamy overnight oats with extra calories from nut butter.',
    tags: ['bulk', 'breakfast', 'meal-prep'],
    mode: 'bulk',
    timeMins: 10,
    servings: 1,
    macrosPerServing: { kcal: 650, protein: 28, carbs: 78, fat: 26 },
    ingredients: [
      '1 cup rolled oats',
      '1.5 cups whole milk',
      '1 scoop whey protein',
      '2 tbsp peanut butter',
      '1 banana, sliced',
      '1 tbsp maple syrup',
    ],
    steps: [
      'Mix oats, milk, and protein powder in a jar.',
      'Stir in peanut butter and maple syrup.',
      'Refrigerate overnight.',
      'Top with banana slices before eating.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-4',
    title: 'Chicken Alfredo Pasta',
    description: 'Creamy pasta dish with grilled chicken for serious bulking.',
    tags: ['bulk', 'high-carb', 'dinner'],
    mode: 'bulk',
    timeMins: 35,
    servings: 2,
    macrosPerServing: { kcal: 780, protein: 48, carbs: 72, fat: 32 },
    ingredients: [
      '300g fettuccine pasta',
      '2 chicken breasts',
      '1 cup heavy cream',
      '1 cup parmesan cheese',
      '3 cloves garlic',
      '2 tbsp butter',
    ],
    steps: [
      'Cook pasta according to package directions.',
      'Season and grill chicken breasts, then slice.',
      'Melt butter, sauté garlic, add cream and cheese.',
      'Toss pasta with sauce and top with chicken.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-5',
    title: 'Loaded Breakfast Burrito',
    description: 'Massive breakfast wrap packed with eggs, meat, and cheese.',
    tags: ['bulk', 'breakfast', 'high-protein'],
    mode: 'bulk',
    timeMins: 20,
    servings: 1,
    macrosPerServing: { kcal: 820, protein: 52, carbs: 58, fat: 42 },
    ingredients: [
      '3 large eggs',
      '100g breakfast sausage',
      '1 large flour tortilla',
      '1/2 cup shredded cheese',
      '2 strips bacon',
      'Salsa and sour cream',
    ],
    steps: [
      'Cook bacon and sausage in a skillet.',
      'Scramble eggs in the same pan.',
      'Warm tortilla and layer all ingredients.',
      'Roll into a burrito and serve with salsa.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-6',
    title: 'Salmon Rice Bowl',
    description: 'Omega-rich salmon over seasoned rice with avocado.',
    tags: ['bulk', 'omega-3', 'dinner'],
    mode: 'bulk',
    timeMins: 25,
    servings: 1,
    macrosPerServing: { kcal: 700, protein: 42, carbs: 62, fat: 30 },
    ingredients: [
      '200g salmon fillet',
      '1.5 cups cooked jasmine rice',
      '1/2 avocado',
      '1 tbsp soy sauce',
      '1 tsp sesame oil',
      'Sesame seeds and green onion',
    ],
    steps: [
      'Season salmon with salt and pepper, pan-sear skin-side down.',
      'Flip and cook until done (about 4 min per side).',
      'Serve over rice with avocado, drizzle soy sauce and sesame oil.',
      'Garnish with sesame seeds and green onion.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-7',
    title: 'Protein French Toast',
    description: 'Sweet and filling French toast with added protein.',
    tags: ['bulk', 'breakfast', 'whey'],
    mode: 'bulk',
    timeMins: 15,
    servings: 2,
    macrosPerServing: { kcal: 580, protein: 38, carbs: 65, fat: 18 },
    ingredients: [
      '4 thick slices brioche bread',
      '3 eggs',
      '1 scoop vanilla whey',
      '1/2 cup milk',
      '1 tsp cinnamon',
      'Maple syrup and berries',
    ],
    steps: [
      'Whisk eggs, milk, protein powder, and cinnamon.',
      'Dip bread slices in the mixture.',
      'Cook on a buttered pan until golden on both sides.',
      'Serve with maple syrup and fresh berries.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-8',
    title: 'Steak & Potato Dinner',
    description: 'Classic bulking meal with ribeye steak and loaded potatoes.',
    tags: ['bulk', 'dinner', 'high-protein'],
    mode: 'bulk',
    timeMins: 40,
    servings: 1,
    macrosPerServing: { kcal: 950, protein: 55, carbs: 58, fat: 55 },
    ingredients: [
      '250g ribeye steak',
      '2 medium potatoes',
      '2 tbsp butter',
      '1/4 cup sour cream',
      'Chives and cheese',
      'Salt and pepper',
    ],
    steps: [
      'Bake potatoes at 400°F for 45 minutes.',
      'Season steak generously with salt and pepper.',
      'Sear in a hot cast iron pan with butter.',
      'Rest steak 5 minutes, slice against the grain.',
      'Split potatoes, load with butter, sour cream, cheese, chives.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-9',
    title: 'Turkey Club Sandwich',
    description: 'Triple-decker sandwich with turkey, bacon, and avocado.',
    tags: ['bulk', 'lunch', 'quick'],
    mode: 'bulk',
    timeMins: 15,
    servings: 1,
    macrosPerServing: { kcal: 680, protein: 48, carbs: 52, fat: 32 },
    ingredients: [
      '200g sliced turkey breast',
      '3 slices sourdough bread',
      '4 strips bacon',
      '1/2 avocado',
      'Lettuce, tomato, mayo',
      '2 slices cheese',
    ],
    steps: [
      'Toast bread slices lightly.',
      'Cook bacon until crispy.',
      'Layer turkey, cheese, bacon, avocado, lettuce, tomato.',
      'Add mayo and stack into triple-decker.',
      'Secure with toothpicks and slice diagonally.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
  },
  {
    id: 'bulk-10',
    title: 'Chocolate Protein Pancakes',
    description: 'Fluffy chocolate pancakes with protein-packed batter.',
    tags: ['bulk', 'breakfast', 'whey'],
    mode: 'bulk',
    timeMins: 20,
    servings: 2,
    macrosPerServing: { kcal: 520, protein: 35, carbs: 58, fat: 16 },
    ingredients: [
      '1 cup flour',
      '2 scoops chocolate whey',
      '2 eggs',
      '1 cup milk',
      '2 tbsp cocoa powder',
      'Chocolate chips and banana',
    ],
    steps: [
      'Mix flour, protein powder, and cocoa.',
      'Add eggs and milk, whisk until smooth.',
      'Fold in chocolate chips.',
      'Cook on a griddle until bubbles form, then flip.',
      'Serve with sliced banana and maple syrup.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  },

  // ==================== CUT RECIPES (10) ====================
  {
    id: 'cut-1',
    title: 'Grilled Chicken Salad',
    description: 'Light and fresh salad with lean grilled chicken breast.',
    tags: ['cut', 'low-calorie', 'high-protein'],
    mode: 'cut',
    timeMins: 20,
    servings: 1,
    macrosPerServing: { kcal: 320, protein: 42, carbs: 12, fat: 12 },
    ingredients: [
      '150g chicken breast',
      '3 cups mixed greens',
      '1/2 cucumber',
      '10 cherry tomatoes',
      '2 tbsp light vinaigrette',
      'Salt, pepper, herbs',
    ],
    steps: [
      'Season chicken with salt, pepper, and herbs.',
      'Grill until internal temp reaches 165°F.',
      'Let rest, then slice.',
      'Toss greens with cucumber and tomatoes.',
      'Top with chicken and drizzle with vinaigrette.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-2',
    title: 'Egg White Veggie Omelette',
    description: 'Low-fat omelette loaded with fresh vegetables.',
    tags: ['cut', 'breakfast', 'low-fat'],
    mode: 'cut',
    timeMins: 15,
    servings: 1,
    macrosPerServing: { kcal: 180, protein: 28, carbs: 8, fat: 4 },
    ingredients: [
      '5 egg whites',
      '1/2 cup spinach',
      '1/4 cup mushrooms',
      '1/4 cup bell peppers',
      '2 tbsp salsa',
      'Salt and pepper',
    ],
    steps: [
      'Sauté vegetables in non-stick pan with cooking spray.',
      'Pour egg whites over vegetables.',
      'Cook until edges set, then fold in half.',
      'Serve with salsa on top.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-3',
    title: 'Shrimp Zucchini Noodles',
    description: 'Low-carb noodle alternative with garlic shrimp.',
    tags: ['cut', 'low-carb', 'dinner'],
    mode: 'cut',
    timeMins: 20,
    servings: 1,
    macrosPerServing: { kcal: 280, protein: 35, carbs: 12, fat: 10 },
    ingredients: [
      '150g shrimp, peeled',
      '2 medium zucchini, spiralized',
      '3 cloves garlic',
      '1 tbsp olive oil',
      'Red pepper flakes',
      'Lemon juice and parsley',
    ],
    steps: [
      'Spiralize zucchini into noodles.',
      'Sauté garlic in olive oil, add shrimp.',
      'Cook shrimp until pink, about 3 minutes.',
      'Add zucchini noodles, toss for 2 minutes.',
      'Finish with lemon juice and parsley.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-4',
    title: 'Turkey Lettuce Wraps',
    description: 'Asian-inspired turkey in crispy lettuce cups.',
    tags: ['cut', 'low-carb', 'quick'],
    mode: 'cut',
    timeMins: 15,
    servings: 2,
    macrosPerServing: { kcal: 240, protein: 32, carbs: 10, fat: 8 },
    ingredients: [
      '300g lean ground turkey',
      '1 head butter lettuce',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp rice vinegar',
      '1 tsp sesame oil',
      'Ginger, garlic, green onions',
    ],
    steps: [
      'Brown turkey with garlic and ginger.',
      'Add soy sauce, vinegar, and sesame oil.',
      'Separate lettuce leaves.',
      'Spoon turkey mixture into cups.',
      'Garnish with green onions.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-5',
    title: 'Protein Shake (Simple)',
    description: 'Quick and clean post-workout shake with minimal carbs.',
    tags: ['cut', 'quick', 'whey', 'post-workout'],
    mode: 'cut',
    timeMins: 3,
    servings: 1,
    macrosPerServing: { kcal: 160, protein: 30, carbs: 4, fat: 2 },
    ingredients: [
      '1.5 scoops whey isolate',
      '1 cup unsweetened almond milk',
      '1/2 cup ice',
      '1 tsp vanilla extract',
    ],
    steps: [
      'Add all ingredients to a shaker or blender.',
      'Shake or blend until smooth.',
      'Drink immediately after workout.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90a0868?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-6',
    title: 'Baked Cod with Asparagus',
    description: 'Light and flaky white fish with roasted asparagus.',
    tags: ['cut', 'dinner', 'low-fat'],
    mode: 'cut',
    timeMins: 25,
    servings: 1,
    macrosPerServing: { kcal: 250, protein: 38, carbs: 8, fat: 6 },
    ingredients: [
      '180g cod fillet',
      '1 bunch asparagus',
      '1 lemon',
      '2 cloves garlic',
      '1 tsp olive oil',
      'Fresh dill',
    ],
    steps: [
      'Preheat oven to 400°F.',
      'Place cod and asparagus on a baking sheet.',
      'Drizzle with olive oil, add garlic and lemon slices.',
      'Bake for 15-18 minutes.',
      'Garnish with fresh dill.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-7',
    title: 'Greek Yogurt Protein Bowl',
    description: 'Creamy yogurt bowl with berries and a protein boost.',
    tags: ['cut', 'breakfast', 'whey', 'quick'],
    mode: 'cut',
    timeMins: 5,
    servings: 1,
    macrosPerServing: { kcal: 220, protein: 35, carbs: 18, fat: 3 },
    ingredients: [
      '200g non-fat Greek yogurt',
      '1/2 scoop vanilla whey',
      '1/2 cup mixed berries',
      '1 tbsp sugar-free sweetener',
      'Cinnamon',
    ],
    steps: [
      'Mix Greek yogurt with protein powder.',
      'Add sweetener and stir until smooth.',
      'Top with berries and cinnamon.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-8',
    title: 'Tuna Cucumber Bites',
    description: 'Refreshing low-carb snack with tuna salad on cucumber.',
    tags: ['cut', 'snack', 'low-carb'],
    mode: 'cut',
    timeMins: 10,
    servings: 2,
    macrosPerServing: { kcal: 150, protein: 25, carbs: 5, fat: 3 },
    ingredients: [
      '1 can tuna in water, drained',
      '2 tbsp light mayo',
      '1 large cucumber',
      '1 tsp Dijon mustard',
      'Salt, pepper, dill',
    ],
    steps: [
      'Mix tuna with mayo, mustard, and seasonings.',
      'Slice cucumber into thick rounds.',
      'Top each round with tuna mixture.',
      'Garnish with fresh dill.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-9',
    title: 'Cauliflower Fried Rice',
    description: 'Low-carb fried rice using cauliflower as the base.',
    tags: ['cut', 'dinner', 'low-carb'],
    mode: 'cut',
    timeMins: 20,
    servings: 2,
    macrosPerServing: { kcal: 200, protein: 18, carbs: 12, fat: 8 },
    ingredients: [
      '1 head cauliflower, riced',
      '2 eggs',
      '100g chicken breast, diced',
      '1/2 cup peas and carrots',
      '2 tbsp low-sodium soy sauce',
      'Sesame oil, garlic, ginger',
    ],
    steps: [
      'Rice cauliflower in food processor.',
      'Stir-fry chicken until cooked.',
      'Push aside, scramble eggs in same pan.',
      'Add cauliflower rice and vegetables.',
      'Season with soy sauce, garlic, ginger.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
  },
  {
    id: 'cut-10',
    title: 'Chicken Broth Soup',
    description: 'Warming soup with chicken and vegetables, very low calorie.',
    tags: ['cut', 'lunch', 'low-calorie'],
    mode: 'cut',
    timeMins: 30,
    servings: 2,
    macrosPerServing: { kcal: 180, protein: 28, carbs: 10, fat: 3 },
    ingredients: [
      '200g chicken breast',
      '4 cups low-sodium chicken broth',
      '1 cup spinach',
      '1/2 cup celery, diced',
      '1/2 cup carrots, diced',
      'Herbs and spices',
    ],
    steps: [
      'Bring broth to a boil.',
      'Add chicken and simmer until cooked (15 min).',
      'Remove chicken, shred, and return to pot.',
      'Add vegetables and cook 5 more minutes.',
      'Season with herbs and serve hot.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  },

  // ==================== MAINTAIN RECIPES (10) ====================
  {
    id: 'maintain-1',
    title: 'Balanced Chicken Bowl',
    description: 'Well-rounded bowl with chicken, rice, and vegetables.',
    tags: ['maintain', 'balanced', 'meal-prep'],
    mode: 'maintain',
    timeMins: 25,
    servings: 1,
    macrosPerServing: { kcal: 480, protein: 40, carbs: 45, fat: 14 },
    ingredients: [
      '150g chicken breast',
      '1 cup brown rice, cooked',
      '1 cup roasted vegetables',
      '1/4 avocado',
      '2 tbsp hummus',
      'Lemon tahini dressing',
    ],
    steps: [
      'Grill or bake chicken breast.',
      'Prepare brown rice.',
      'Roast broccoli, peppers, and zucchini.',
      'Assemble bowl with all components.',
      'Drizzle with tahini dressing.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-2',
    title: 'Salmon & Sweet Potato',
    description: 'Nutrient-dense meal with omega-3s and complex carbs.',
    tags: ['maintain', 'omega-3', 'dinner'],
    mode: 'maintain',
    timeMins: 35,
    servings: 1,
    macrosPerServing: { kcal: 520, protein: 38, carbs: 42, fat: 22 },
    ingredients: [
      '180g salmon fillet',
      '1 medium sweet potato',
      '1 cup green beans',
      '1 tbsp olive oil',
      'Lemon and herbs',
    ],
    steps: [
      'Bake sweet potato at 400°F for 30 minutes.',
      'Season salmon and pan-sear.',
      'Steam green beans.',
      'Plate salmon with potato and beans.',
      'Finish with olive oil and lemon.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-3',
    title: 'Mediterranean Quinoa Salad',
    description: 'Fiber-rich salad with quinoa, feta, and fresh vegetables.',
    tags: ['maintain', 'mediterranean', 'lunch'],
    mode: 'maintain',
    timeMins: 20,
    servings: 2,
    macrosPerServing: { kcal: 420, protein: 18, carbs: 48, fat: 18 },
    ingredients: [
      '1 cup quinoa, cooked',
      '1 cucumber, diced',
      '1 cup cherry tomatoes',
      '1/2 cup feta cheese',
      '1/4 cup olives',
      'Olive oil and lemon dressing',
    ],
    steps: [
      'Cook quinoa and let cool.',
      'Chop cucumber, tomatoes, and olives.',
      'Combine all ingredients in a bowl.',
      'Crumble feta on top.',
      'Dress with olive oil and lemon juice.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-4',
    title: 'Turkey & Veggie Stir-Fry',
    description: 'Quick stir-fry with lean turkey and colorful vegetables.',
    tags: ['maintain', 'quick', 'dinner'],
    mode: 'maintain',
    timeMins: 20,
    servings: 2,
    macrosPerServing: { kcal: 380, protein: 35, carbs: 28, fat: 14 },
    ingredients: [
      '300g turkey breast, sliced',
      '2 cups mixed stir-fry vegetables',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '1 cup jasmine rice',
      'Garlic and ginger',
    ],
    steps: [
      'Cook rice according to package.',
      'Stir-fry turkey in sesame oil.',
      'Add vegetables, garlic, and ginger.',
      'Season with soy sauce.',
      'Serve over rice.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-5',
    title: 'Protein Smoothie Bowl',
    description: 'Thick smoothie bowl topped with granola and fruit.',
    tags: ['maintain', 'breakfast', 'whey'],
    mode: 'maintain',
    timeMins: 10,
    servings: 1,
    macrosPerServing: { kcal: 450, protein: 32, carbs: 55, fat: 12 },
    ingredients: [
      '1 scoop vanilla whey',
      '1 frozen banana',
      '1/2 cup frozen berries',
      '1/2 cup almond milk',
      '1/4 cup granola',
      '1 tbsp almond butter',
    ],
    steps: [
      'Blend protein, banana, berries, and milk until thick.',
      'Pour into a bowl.',
      'Top with granola, extra berries, and almond butter.',
    ],
    hasWhey: true,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-6',
    title: 'Whole Wheat Pasta Primavera',
    description: 'Pasta with seasonal vegetables and light tomato sauce.',
    tags: ['maintain', 'dinner', 'vegetarian'],
    mode: 'maintain',
    timeMins: 30,
    servings: 2,
    macrosPerServing: { kcal: 420, protein: 16, carbs: 62, fat: 12 },
    ingredients: [
      '200g whole wheat pasta',
      '2 cups mixed vegetables',
      '1 cup marinara sauce',
      '2 tbsp olive oil',
      'Parmesan cheese',
      'Basil and garlic',
    ],
    steps: [
      'Cook pasta al dente.',
      'Sauté vegetables with garlic in olive oil.',
      'Add marinara sauce and simmer.',
      'Toss with pasta.',
      'Top with parmesan and fresh basil.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-7',
    title: 'Egg & Avocado Toast',
    description: 'Classic avocado toast with perfectly cooked eggs.',
    tags: ['maintain', 'breakfast', 'quick'],
    mode: 'maintain',
    timeMins: 10,
    servings: 1,
    macrosPerServing: { kcal: 420, protein: 20, carbs: 35, fat: 24 },
    ingredients: [
      '2 slices whole grain bread',
      '1 avocado',
      '2 eggs',
      'Salt, pepper, red pepper flakes',
      'Cherry tomatoes',
      'Fresh herbs',
    ],
    steps: [
      'Toast bread until golden.',
      'Mash avocado with salt and pepper.',
      'Poach or fry eggs to preference.',
      'Spread avocado on toast, top with eggs.',
      'Garnish with tomatoes and herbs.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-8',
    title: 'Grilled Chicken Wrap',
    description: 'Whole wheat wrap with grilled chicken and fresh veggies.',
    tags: ['maintain', 'lunch', 'portable'],
    mode: 'maintain',
    timeMins: 20,
    servings: 1,
    macrosPerServing: { kcal: 450, protein: 38, carbs: 40, fat: 16 },
    ingredients: [
      '150g grilled chicken breast',
      '1 whole wheat tortilla',
      '1/4 avocado',
      'Lettuce, tomato, onion',
      '2 tbsp Greek yogurt ranch',
      'Salt and pepper',
    ],
    steps: [
      'Slice grilled chicken.',
      'Warm tortilla slightly.',
      'Layer all ingredients in center.',
      'Drizzle with ranch.',
      'Fold sides and roll tightly.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-9',
    title: 'Beef & Broccoli',
    description: 'Classic Chinese takeout made healthier at home.',
    tags: ['maintain', 'dinner', 'asian'],
    mode: 'maintain',
    timeMins: 25,
    servings: 2,
    macrosPerServing: { kcal: 420, protein: 35, carbs: 32, fat: 18 },
    ingredients: [
      '300g flank steak, sliced thin',
      '3 cups broccoli florets',
      '3 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '1 cup brown rice',
      'Garlic, ginger, sesame oil',
    ],
    steps: [
      'Cook rice.',
      'Stir-fry beef quickly over high heat.',
      'Remove beef, add broccoli and cook.',
      'Return beef, add sauces and seasonings.',
      'Serve over rice.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  },
  {
    id: 'maintain-10',
    title: 'Cottage Cheese Fruit Bowl',
    description: 'Protein-rich cottage cheese with fresh fruit and honey.',
    tags: ['maintain', 'snack', 'quick'],
    mode: 'maintain',
    timeMins: 5,
    servings: 1,
    macrosPerServing: { kcal: 280, protein: 28, carbs: 32, fat: 4 },
    ingredients: [
      '1 cup low-fat cottage cheese',
      '1/2 cup pineapple chunks',
      '1/2 cup strawberries',
      '1 tbsp honey',
      '2 tbsp sliced almonds',
    ],
    steps: [
      'Place cottage cheese in a bowl.',
      'Top with pineapple and strawberries.',
      'Drizzle with honey.',
      'Sprinkle almonds on top.',
    ],
    hasWhey: false,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
];

// Helper functions

export function getRecipesByMode(mode: 'bulk' | 'cut' | 'maintain'): Recipe[] {
  return RECIPES.filter((recipe) => recipe.mode === mode);
}

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}

export interface FilterOptions {
  query?: string;
  maxTime?: number;
  minProtein?: number;
  hasWhey?: boolean;
}

export function filterRecipes(recipes: Recipe[], options: FilterOptions): Recipe[] {
  return recipes.filter((recipe) => {
    // Query filter (search in title and description)
    if (options.query) {
      const q = options.query.toLowerCase();
      const matchesQuery =
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesQuery) return false;
    }

    // Max time filter
    if (options.maxTime && recipe.timeMins > options.maxTime) {
      return false;
    }

    // Min protein filter
    if (options.minProtein && recipe.macrosPerServing.protein < options.minProtein) {
      return false;
    }

    // Has whey filter
    if (options.hasWhey !== undefined && options.hasWhey && !recipe.hasWhey) {
      return false;
    }

    return true;
  });
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  return filterRecipes(recipes, { query });
}
