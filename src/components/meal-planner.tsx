'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ChefHat, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRecipeStore } from '@/store/recipe-store';
import type { MealPlanItem } from '@/services/profile-service';

export const MealPlanner = () => {
  const { mealPlans } = useRecipeStore();

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          <span>Upcoming Meals</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mealPlans.length > 0 ? (
          <div className="space-y-3">
            {mealPlans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors border border-border/10">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Utensils className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{plan.recipe}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5 mr-1" />
                      <span>{plan.day}, {plan.date}</span>
                      <span className="mx-1">•</span>
                      <span>{plan.meal}</span>
                    </div>
                  </div>
                </div>
                <Button variant={plan.status === 'planned' ? 'outline' : plan.status === 'cooked' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs cursor-default hover:bg-transparent">
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground flex flex-col items-center justify-center">
            <Calendar className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No upcoming meals</p>
            <p className="text-xs mt-1">Visit your Saved Recipes to plan your week.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};