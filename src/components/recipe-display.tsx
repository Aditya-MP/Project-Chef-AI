import type { GenerateRecipeOutput } from "@/ai/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Heart, ChefHat, Timer, AlignLeft, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useRecipeStore, type Recipe } from "@/store/recipe-store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { incrementStat } from "@/services/profile-service";

interface RecipeDisplayProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

export function RecipeDisplay({ recipe, isLoading }: RecipeDisplayProps) {
  const { favoriteRecipes, toggleFavorite } = useRecipeStore();
  const { user } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return <RecipeSkeleton />;
  }

  if (!recipe) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-2 border-dashed border-border/60 rounded-3xl shadow-xl text-center space-y-6 flex-grow">
        <div className="bg-background/50 p-6 rounded-full ring-1 ring-border shadow-inner">
          <UtensilsCrossed className="w-20 h-20 text-muted-foreground/50" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl font-bold font-headline text-foreground">Awaiting Your Ingredients</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Select items from your pantry on the left to unlock ChefAI's culinary magic.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 bg-background/30 backdrop-blur-md">Instant</Badge>
          <Badge variant="outline" className="text-xs py-1 px-3 bg-background/30 backdrop-blur-md">Personalized</Badge>
          <Badge variant="outline" className="text-xs py-1 px-3 bg-background/30 backdrop-blur-md">Delicious</Badge>
        </div>
      </Card>
    );
  }

  const isFavorite = favoriteRecipes.some(r => r.recipeName === recipe.recipeName);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You need to be logged in to save favorite recipes.",
      });
      return;
    }
    await toggleFavorite(recipe, user.uid);
  }

  const handleCooked = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You need to be logged in to log activities.",
      });
      return;
    }

    // Optimistic toast
    toast({
      title: "Bon Appétit! 👨‍🍳",
      description: `Logged '${recipe.recipeName}' as cooked.`,
    });

    // We can use the generic logEvent from the recipeStore which writes to fb and reloads the feed
    const { logEvent } = useRecipeStore.getState();
    await logEvent(user.uid, {
      title: `Cooked '${recipe.recipeName}'`,
      type: 'cooked'
    });

    // For the cooked stat we also need to increment it. 
    // We should ideally have addCookedRecipe in store but we can just import incrementStat here.
    await incrementStat(user.uid, 'cookedRecipes');
  }


  return (
    <Card className="h-full flex flex-col animate-in fade-in-50 slide-in-from-right-10 duration-700 shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-white/20 rounded-3xl ring-1 ring-black/5">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-yellow-400" />
      <CardHeader className="p-8 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-primary/20">AI Generated Masterpiece</Badge>
            <CardTitle className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-foreground leading-tight">{recipe.recipeName}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground flex items-center gap-2">
              <ChefHat className="w-5 h-5" /> Created by ChefAI
            </CardDescription>
          </div>

        </div>
      </CardHeader>
      <CardContent className="space-y-8 flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">

        <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-4 font-headline flex items-center gap-2"><AlignLeft className="w-5 h-5 text-primary" /> Required Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.requiredIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="outline" className="bg-background/80 text-foreground border-border/60 hover:bg-background hover:scale-105 transition-all py-1.5 px-3 text-sm shadow-sm backdrop-blur-sm">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-headline flex items-center gap-2 border-b pb-2"><Timer className="w-6 h-6 text-primary" /> Instructions</h3>
          <ol className="space-y-6 relative border-l-2 border-primary/20 ml-3 pl-8">
            {recipe.steps.map((step, index) => (
              <li key={index} className="relative group">
                <span className="absolute -left-[41px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary/30 text-primary font-bold text-sm shadow-sm group-hover:scale-110 group-hover:border-primary transition-all duration-300">
                  {index + 1}
                </span>
                <p className="text-lg leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {recipe.alternativeSuggestions && recipe.alternativeSuggestions.length > 0 && (
          <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-800/30">
            <h3 className="text-xl font-bold mb-3 font-headline flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Lightbulb className="w-5 h-5" /> Chef's Tips & Alternatives
            </h3>
            <ul className="space-y-2">
              {recipe.alternativeSuggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2 text-yellow-800/90 dark:text-yellow-300/90 text-base leading-relaxed">
                  <span className="text-yellow-500">•</span> {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-background/40 backdrop-blur-md border-t p-6 mt-auto flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={handleToggleFavorite}
          className={cn(
            "flex-1 text-lg h-14 rounded-xl shadow-lg transition-all duration-300",
            isFavorite
              ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Heart className={cn("mr-2 h-6 w-6 transition-all", isFavorite ? "fill-current scale-110" : "scale-100")} />
          {isFavorite ? 'Saved' : 'Save Recipe'}
        </Button>
        <Button
          size="lg"
          onClick={handleCooked}
          variant="outline"
          className="flex-1 text-lg h-14 rounded-xl shadow-lg transition-all duration-300 border-primary/20 hover:bg-primary/5 text-primary"
        >
          <UtensilsCrossed className="mr-2 h-6 w-6" />
          I Cooked This
        </Button>
      </CardFooter>
    </Card>
  );
}

function RecipeSkeleton() {
  return (
    <Card className="h-full flex flex-col bg-white/40 dark:bg-black/40 backdrop-blur-xl border-white/20 rounded-3xl overflow-hidden">
      <CardHeader className="p-8">
        <Skeleton className="h-12 w-3/4 rounded-xl bg-primary/10" />
        <Skeleton className="h-5 w-1/2 mt-4 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-8 p-8 pt-0 flex-grow">
        <div className="bg-secondary/30 p-6 rounded-2xl">
          <Skeleton className="h-7 w-1/3 mb-4 rounded-lg" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-1/2 mb-6 rounded-lg" />
          <div className="space-y-6 ml-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <Skeleton className="h-6 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
