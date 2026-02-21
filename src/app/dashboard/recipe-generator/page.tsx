"use client";

import { RecipeGenerator } from '@/components/recipe-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecipeGeneratorPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-border/10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
            <span className="text-primary">Recipe</span> Generator
          </h1>
          <p className="text-muted-foreground mt-1 text-base md:text-lg font-light">
            Create your culinary masterpiece with AI assistance
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            ← Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Recipe Generator Component */}
      <div className="flex-1 overflow-auto">
        <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg h-full min-h-[600px]">
          <CardContent className="p-5 h-full">
            <RecipeGenerator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}