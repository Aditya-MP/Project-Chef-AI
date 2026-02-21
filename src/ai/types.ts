// Purely static TypeScript interfaces for use in both Client and Server Components
// Do NOT import 'zod' or 'genkit' here to prevent Webpack bundling errors on the client.

export interface GenerateRecipeInput {
    ingredients: string[];
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    highProtein?: boolean;
}

export interface GenerateRecipeOutput {
    recipeName: string;
    steps: string[];
    requiredIngredients: string[];
    alternativeSuggestions: string[];
}

export interface AnalyzeIngredientsInput {
    ingredients: string[];
    dietaryPreferences?: {
        vegetarian?: boolean;
        vegan?: boolean;
        glutenFree?: boolean;
        highProtein?: boolean;
    };
}

export interface Substitution {
    ingredientToReplace: string;
    suggestion: string;
    reason: string;
}

export interface TasteSuggestion {
    suggestion: string;
    reason: string;
}

export interface AnalyzeIngredientsOutput {
    isCompatible: boolean;
    incompatibilityReason?: string;
    substitutions?: Substitution[];
    tasteSuggestions?: TasteSuggestion[];
}

export interface AnalyzeImageInput {
    photoDataUri: string;
    ingredientCatalog: string[];
}

export interface AnalyzeImageOutput {
    identifiedIngredients: string[];
}
