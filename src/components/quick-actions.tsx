'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Plus, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Generate Recipe',
      icon: <Zap className="h-5 w-5" />,
      description: 'Create a new recipe with AI',
      color: 'bg-blue-500/10 text-blue-500',
      link: '/dashboard/recipe-generator'
    },
    {
      title: 'View Favorites',
      icon: <Star className="h-5 w-5" />,
      description: 'Browse your saved recipes',
      color: 'bg-yellow-500/10 text-yellow-500',
      link: '/dashboard/favorite-recipes'
    },
    {
      title: 'Recent Recipes',
      icon: <ChefHat className="h-5 w-5" />,
      description: 'See your recently generated recipes',
      color: 'bg-green-500/10 text-green-500',
      link: '/dashboard/recent-recipes'
    },
    {
      title: 'Meal Planner',
      icon: <ChefHat className="h-5 w-5" />,
      description: 'Plan your weekly meals',
      color: 'bg-purple-500/10 text-purple-500',
      link: '/dashboard#meal-planner'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actions.map((action, index) => (
        <Card key={index} className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={action.link}>Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};