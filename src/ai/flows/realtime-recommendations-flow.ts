'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas for cuisine preferences
const CuisinePreferencesInputSchema = z.object({
  userId: z.string().describe('The ID of the user to get cuisine preferences for'),
  dietaryPreferences: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    highProtein: z.boolean().optional(),
  }).describe('User dietary preferences'),
  recentRecipes: z.array(z.string()).describe('Recently generated recipes for the user'),
});

export type CuisinePreferencesInput = z.infer<typeof CuisinePreferencesInputSchema>;

const CuisinePreferencesOutputSchema = z.object({
  preferences: z.array(z.object({
    name: z.string().describe('Name of the cuisine'),
    percentage: z.number().describe('Percentage preference (0-100)'),
    reason: z.string().describe('Brief reason for the preference'),
  })).describe('Array of cuisine preferences with percentages'),
});

export type CuisinePreferencesOutput = z.infer<typeof CuisinePreferencesOutputSchema>;

// Define schemas for popular recipes
const PopularRecipesInputSchema = z.object({
  userId: z.string().describe('The ID of the user to get popular recipes for'),
  dietaryPreferences: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    highProtein: z.boolean().optional(),
  }).describe('User dietary preferences'),
  currentSeason: z.string().describe('Current season (e.g., winter, spring, summer, fall)'),
  trendingIngredients: z.array(z.string()).describe('Currently trending ingredients'),
});

export type PopularRecipesInput = z.infer<typeof PopularRecipesInputSchema>;

const PopularRecipesOutputSchema = z.object({
  recipes: z.array(z.object({
    id: z.number().describe('Unique ID for the recipe'),
    title: z.string().describe('Title of the recipe'),
    prepTime: z.string().describe('Preparation time'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('Difficulty level'),
    rating: z.number().describe('Rating out of 5'),
    category: z.string().describe('Category of the recipe (e.g., cuisine type)'),
    description: z.string().describe('Brief description of the recipe'),
  })).describe('Array of popular recipes'),
});

export type PopularRecipesOutput = z.infer<typeof PopularRecipesOutputSchema>;

// Define schemas for upcoming meals
const UpcomingMealsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to get upcoming meals for'),
  dietaryPreferences: z.object({
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    highProtein: z.boolean().optional(),
  }).describe('User dietary preferences'),
  schedule: z.object({
    breakfast: z.boolean().optional(),
    lunch: z.boolean().optional(),
    dinner: z.boolean().optional(),
  }).describe('User meal schedule preferences'),
  availableIngredients: z.array(z.string()).describe('Ingredients currently available to the user'),
});

export type UpcomingMealsInput = z.infer<typeof UpcomingMealsInputSchema>;

const UpcomingMealsOutputSchema = z.object({
  meals: z.array(z.object({
    id: z.number().describe('Unique ID for the meal'),
    day: z.string().describe('Day of the week (e.g., Today, Tomorrow, Wed)'),
    date: z.string().describe('Date in readable format (e.g., Feb 9)'),
    meal: z.string().describe('Meal type (e.g., Breakfast, Lunch, Dinner)'),
    recipe: z.string().describe('Recipe name'),
    status: z.enum(['planned', 'cooked', 'skipped']).describe('Status of the meal'),
    ingredients: z.array(z.string()).describe('Ingredients needed for the meal'),
  })).describe('Array of upcoming meals'),
});

export type UpcomingMealsOutput = z.infer<typeof UpcomingMealsOutputSchema>;

// Define the flows
const cuisinePreferencesPrompt = ai.definePrompt({
  name: 'cuisinePreferencesPrompt',
  input: { schema: CuisinePreferencesInputSchema },
  output: { schema: CuisinePreferencesOutputSchema },
  prompt: `You are an expert food analyst and trend predictor. Based on the user's recent recipe history and dietary preferences, determine their cuisine preferences.

User ID: {{userId}}
Dietary Preferences: {{dietaryPreferences}}
Recent Recipes: {{recentRecipes}}

Analyze the user's recent recipe selections and predict their cuisine preferences. Consider:
- Which cuisines appear most frequently in their recent recipes
- How well their dietary restrictions align with different cuisines
- Current food trends that might appeal to them
- Seasonal appropriateness

Return the top 5 cuisine preferences with percentages that sum to 100%, along with a brief reason for each preference.
`,
});

const popularRecipesPrompt = ai.definePrompt({
  name: 'popularRecipesPrompt',
  input: { schema: PopularRecipesInputSchema },
  output: { schema: PopularRecipesOutputSchema },
  prompt: `You are a food trend expert and recipe curator. Based on current trends, user preferences, and seasonal factors, recommend popular recipes that would appeal to this user.

User ID: {{userId}}
Dietary Preferences: {{dietaryPreferences}}
Current Season: {{currentSeason}}
Trending Ingredients: {{trendingIngredients}}

Recommend 4 popular recipes that match the user's dietary preferences and current trends. Consider:
- Recipes that incorporate trending ingredients
- Seasonally appropriate dishes
- Popular dishes that fit dietary restrictions
- Variety in cuisine types and difficulty levels

Provide detailed information for each recipe including title, preparation time, difficulty, rating, category, and a brief description.
`,
});

const upcomingMealsPrompt = ai.definePrompt({
  name: 'upcomingMealsPrompt',
  input: { schema: UpcomingMealsInputSchema },
  output: { schema: UpcomingMealsOutputSchema },
  prompt: `You are a personal meal planner. Based on the user's dietary preferences, meal schedule, and available ingredients, suggest upcoming meals for the next few days.

User ID: {{userId}}
Dietary Preferences: {{dietaryPreferences}}
Meal Schedule: {{schedule}}
Available Ingredients: {{availableIngredients}}

Plan upcoming meals for the next 4 time slots considering:
- The user's dietary restrictions
- Their preferred meal times
- Recipes that can be made with available ingredients (or require minimal additional purchases)
- Balanced variety across days and meal types

Include today's remaining meals and tomorrow's planned meals.
`,
});

// Define the flows
export const getCuisinePreferencesFlow = ai.defineFlow(
  {
    name: 'getCuisinePreferencesFlow',
    inputSchema: CuisinePreferencesInputSchema,
    outputSchema: CuisinePreferencesOutputSchema,
  },
  async input => {
    const { output } = await cuisinePreferencesPrompt(input);
    return output!;
  }
);

export const getPopularRecipesFlow = ai.defineFlow(
  {
    name: 'getPopularRecipesFlow',
    inputSchema: PopularRecipesInputSchema,
    outputSchema: PopularRecipesOutputSchema,
  },
  async input => {
    const { output } = await popularRecipesPrompt(input);
    return output!;
  }
);

export const getUpcomingMealsFlow = ai.defineFlow(
  {
    name: 'getUpcomingMealsFlow',
    inputSchema: UpcomingMealsInputSchema,
    outputSchema: UpcomingMealsOutputSchema,
  },
  async input => {
    const { output } = await upcomingMealsPrompt(input);
    return output!;
  }
);

// Export helper functions
export async function getCuisinePreferences(input: CuisinePreferencesInput): Promise<CuisinePreferencesOutput> {
  return getCuisinePreferencesFlow(input);
}

export async function getPopularRecipes(input: PopularRecipesInput): Promise<PopularRecipesOutput> {
  return getPopularRecipesFlow(input);
}

export async function getUpcomingMeals(input: UpcomingMealsInput): Promise<UpcomingMealsOutput> {
  return getUpcomingMealsFlow(input);
}