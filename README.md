# CalorieTracker

A modern calorie tracking web application with AI-powered food recognition built with React, TypeScript, and Tailwind CSS.

## Features

- **Smart Food Logging**: Take photos of your meals and let AI analyze the nutritional content
- **Calorie & Macro Tracking**: Track daily calories, protein, carbs, and fat with beautiful progress rings
- **Date Navigation**: Easy 7-day date selector to view history
- **Progress Tracking**: Weight charts, macro distribution, and goal tracking
- **Social Features**: Friends, challenges, and motivational feed
- **Profile Management**: Customize goals, preferences, and settings

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Backend (Optional)**: Supabase
- **AI (Optional)**: Anthropic Claude API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calorie-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional, for full features):
```bash
cp .env.example .env
```

4. Configure environment variables (if using Supabase/Claude):
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLAUDE_API_KEY=your-claude-api-key
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication components
│   ├── food/         # Food logging, camera, meal modal
│   ├── home/         # Home screen components
│   ├── layout/       # Navigation, layout components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # External service configurations
├── pages/            # Page components
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Key Components

- **ProgressRing**: Animated circular progress indicator
- **MacroCircle**: Macro nutrient display with progress
- **DateSelector**: 7-day horizontal date picker
- **FoodCard**: Meal display card with photo and macros
- **BottomNav**: Mobile navigation with floating action button
- **CameraView**: Camera interface for food photos
- **AddMealModal**: Meal logging interface

## Customization

### Colors

Edit the color variables in `src/index.css`:

```css
@theme {
  --color-protein: #FF6B6B;
  --color-carbs: #FFA726;
  --color-fat: #42A5F5;
  --color-accent: #000000;
}
```

### Default Goals

Edit the default user goals in `src/stores/useStore.ts`:

```typescript
const defaultGoals: UserGoals = {
  calories: 2500,
  protein: 150,
  carbs: 275,
  fat: 70,
  water: 8,
};
```

## Supabase Setup (Optional)

1. Create a new Supabase project
2. Run the following SQL to create tables:

```sql
-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  avatar_url text,
  goals jsonb default '{"calories": 2500, "protein": 150, "carbs": 275, "fat": 70, "water": 8}',
  preferences jsonb default '{"theme": "light", "notifications": true, "units": "metric", "startOfWeek": 1}',
  created_at timestamp with time zone default now()
);

-- Meals table
create table meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  photo_url text,
  category text check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  foods jsonb default '[]',
  date date not null,
  created_at timestamp with time zone default now()
);

-- Weight entries table
create table weight_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  weight decimal not null,
  date date not null,
  created_at timestamp with time zone default now()
);
```

3. Enable Row Level Security and create policies as needed.

## Claude API Integration (Optional)

For AI food recognition, you'll need to set up a backend endpoint that calls the Claude Vision API. The frontend expects an endpoint at `/api/analyze-food` that accepts a POST request with a base64 image.

Example prompt for Claude Vision is provided in `src/lib/claude.ts`.

## License

MIT
