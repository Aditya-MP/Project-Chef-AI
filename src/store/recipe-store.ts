import { create } from 'zustand';
import type { GenerateRecipeOutput } from '@/ai/types';
import { getRecipes, saveRecipe, removeRecipe } from '@/services/recipe-service';
import { logActivity, incrementStat, getActivities, type ActivityItem, addMealPlan, getMealPlans, type MealPlanItem } from '@/services/profile-service';

export type Recipe = GenerateRecipeOutput & {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  isFavorite?: boolean;
};

interface RecipeStore {
  recentRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  activities: ActivityItem[];
  mealPlans: MealPlanItem[];
  addRecentRecipe: (recipe: Recipe, uid: string) => Promise<void>;
  toggleFavorite: (recipe: Recipe, uid: string) => Promise<void>;
  loadRecipes: (uid: string) => Promise<void>;
  loadActivities: (uid: string) => Promise<void>;
  loadMealPlans: (uid: string) => Promise<void>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  selectedRecipe: Recipe | null;
  logEvent: (uid: string, event: Omit<ActivityItem, 'id' | 'timestamp'>) => Promise<void>;
  logPlan: (uid: string, plan: Omit<MealPlanItem, 'id' | 'timestamp'>) => Promise<void>;
  clearRecipes: () => void;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recentRecipes: [],
  favoriteRecipes: [],
  activities: [],
  mealPlans: [],
  selectedRecipe: null,

  addRecentRecipe: async (recipe, uid) => {
    // We increment generated stat and log activity when a new recipe is generated
    await incrementStat(uid, 'totalRecipes');
    await get().logEvent(uid, {
      title: `Generated '${recipe.recipeName}'`,
      type: 'recipe',
    });

    set((state) => {
      const filteredRecents = state.recentRecipes.filter(r => r.recipeName !== recipe.recipeName);
      const newRecents = [recipe, ...filteredRecents].slice(0, 10);
      return { recentRecipes: newRecents };
    });
  },

  toggleFavorite: async (recipe: Recipe, uid: string) => {
    const state = get();
    const isFavorite = state.favoriteRecipes.some(r => r.recipeName === recipe.recipeName);

    if (isFavorite) {
      await removeRecipe(uid, recipe.recipeName);
      set({
        favoriteRecipes: state.favoriteRecipes.filter(r => r.recipeName !== recipe.recipeName)
      });
      // Optionally we might want to decrement 'Favorites' stat or just let it be. Handled by activity.
    } else {
      await saveRecipe(uid, { ...recipe, isFavorite: true });
      await get().logEvent(uid, {
        title: `Added '${recipe.recipeName}' to favorites`,
        type: 'favorite',
      });
      set({
        favoriteRecipes: [{ ...recipe, isFavorite: true }, ...state.favoriteRecipes]
      });
    }
  },

  loadRecipes: async (uid: string) => {
    const recipes = await getRecipes(uid);
    set({ favoriteRecipes: recipes.filter(r => r.isFavorite) });
  },

  loadActivities: async (uid: string) => {
    const activities = await getActivities(uid);
    set({ activities });
  },

  loadMealPlans: async (uid: string) => {
    const mealPlans = await getMealPlans(uid);
    set({ mealPlans });
  },

  logEvent: async (uid: string, event: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    await logActivity(uid, event);
    // Reload activities to reflect the new state instantly on dashboard
    await get().loadActivities(uid);
  },

  logPlan: async (uid: string, plan: Omit<MealPlanItem, 'id' | 'timestamp'>) => {
    await addMealPlan(uid, plan);
    await get().loadMealPlans(uid);
    // Also track as activity
    await get().logEvent(uid, {
      title: `Planned '${plan.recipe}' for ${plan.day}`,
      type: 'plan'
    });
  },

  setSelectedRecipe: (recipe) => {
    set({ selectedRecipe: recipe });
  },

  clearRecipes: () => {
    set({ recentRecipes: [], favoriteRecipes: [], activities: [], mealPlans: [], selectedRecipe: null });
  }
}));
