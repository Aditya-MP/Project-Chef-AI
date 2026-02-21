'use server';

import { 
  getCuisinePreferences, 
  getPopularRecipes, 
  getUpcomingMeals,
  type CuisinePreferencesInput,
  type PopularRecipesInput,
  type UpcomingMealsInput
} from '@/ai/flows/realtime-recommendations-flow';
import { revalidateTag } from 'next/cache';

// Action to get real-time cuisine preferences
export async function fetchCuisinePreferences(input: CuisinePreferencesInput) {
  try {
    const result = await getCuisinePreferences(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching cuisine preferences:', error);
    return { success: false, error: 'Failed to fetch cuisine preferences' };
  }
}

// Action to get real-time popular recipes
export async function fetchPopularRecipes(input: PopularRecipesInput) {
  try {
    const result = await getPopularRecipes(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return { success: false, error: 'Failed to fetch popular recipes' };
  }
}

// Action to get real-time upcoming meals
export async function fetchUpcomingMeals(input: UpcomingMealsInput) {
  try {
    const result = await getUpcomingMeals(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching upcoming meals:', error);
    return { success: false, error: 'Failed to fetch upcoming meals' };
  }
}

// Revalidation function to refresh data
export async function refreshRecommendations(userId: string) {
  // Revalidate any cached data for this user
  revalidateTag(`cuisine-preferences-${userId}`);
  revalidateTag(`popular-recipes-${userId}`);
  revalidateTag(`upcoming-meals-${userId}`);
}