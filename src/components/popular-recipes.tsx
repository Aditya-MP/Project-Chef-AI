'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, ChefHat, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRecipeStore } from '@/store/recipe-store';

interface Recipe {
  id: number;
  title: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  category: string;
  description: string;
}

export const PopularRecipes = () => {
  const { favoriteRecipes } = useRecipeStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // We treat User Favorites as the "Popular Recipes" for now,
    // taking the 4 most recently favorited.
    const convertedRecipes = favoriteRecipes.slice(0, 4).map((recipe, index) => ({
      id: index + 1,
      title: recipe.recipeName,
      prepTime: "25 min", // Default display
      difficulty: "Medium" as const,
      rating: 5.0, // Favorites are 5 stars!
      category: recipe.recipeName.split(' ')[0] || 'General',
      description: `Your saved chef-crafted ${recipe.recipeName.toLowerCase()} recipe.`
    }));

    setRecipes(convertedRecipes);
  }, [favoriteRecipes]);

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChefHat className="mr-2 h-5 w-5" />
          <span>Popular Recipes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recipes.length > 0 ? (
          <div className="space-y-4">
            {recipes.map(recipe => (
              <div key={recipe.id} className="flex flex-col xl:flex-row xl:items-center justify-between p-4 rounded-xl bg-card/50 hover:bg-card/80 transition-colors border border-border/20 gap-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4 shrink-0 mt-1 xl:mt-0">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight">{recipe.title}</h3>
                    <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 shrink-0" />
                        <span>{recipe.prepTime}</span>
                      </div>
                      <span className="shrink-0 hidden sm:inline">•</span>
                      <span>{recipe.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">{recipe.description}</p>
                  </div>
                </div>
                <div className="flex xl:flex-col items-center justify-between xl:justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0 pt-3 xl:pt-0 border-t xl:border-0 border-border/10 shrink-0">
                  <Badge variant={recipe.difficulty === 'Easy' ? 'secondary' : recipe.difficulty === 'Medium' ? 'default' : 'destructive'}>
                    {recipe.difficulty}
                  </Badge>
                  <div className="flex items-center bg-background/50 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-bold">{recipe.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ChefHat className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No popular recipes yet</p>
            <p className="text-sm mt-1">Generate some recipes to see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};