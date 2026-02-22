


import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { GenerateRecipeOutput } from '@/ai/types';

const USERS_COLLECTION = 'users';
const RECIPES_COLLECTION = 'recipes';

export async function saveRecipe(uid: string, recipe: GenerateRecipeOutput & { isFavorite?: boolean; createdAt?: number }) {
  const recipeRef = doc(db, USERS_COLLECTION, uid, RECIPES_COLLECTION, recipe.recipeName);
  await setDoc(recipeRef, { ...recipe, isFavorite: true, createdAt: recipe.createdAt || Date.now() }, { merge: true });
}

export async function saveGeneratedRecipe(uid: string, recipe: GenerateRecipeOutput) {
  const recipeRef = doc(db, USERS_COLLECTION, uid, RECIPES_COLLECTION, recipe.recipeName);
  // Merges the recipe without overwriting the isFavorite flag if it already exists
  await setDoc(recipeRef, { ...recipe, createdAt: Date.now() }, { merge: true });
}

export async function removeRecipe(uid: string, recipeName: string) {
  const recipeRef = doc(db, USERS_COLLECTION, uid, RECIPES_COLLECTION, recipeName);
  await deleteDoc(recipeRef);
}

export async function getRecipes(uid: string): Promise<(GenerateRecipeOutput & { isFavorite?: boolean })[]> {
  const recipesRef = collection(db, USERS_COLLECTION, uid, RECIPES_COLLECTION);
  const querySnapshot = await getDocs(recipesRef);
  const recipes: (GenerateRecipeOutput & { isFavorite?: boolean; createdAt?: number })[] = [];
  querySnapshot.forEach((doc) => {
    recipes.push(doc.data() as GenerateRecipeOutput & { isFavorite?: boolean; createdAt?: number });
  });

  // Sort by createdAt descending (newest first)
  return recipes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
