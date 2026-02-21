'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Heart, ChefHat } from 'lucide-react';
import { useProfileStore } from '@/store/profile-store';
import { useRecipeStore } from '@/store/recipe-store';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  description?: string;
}

const StatCard = ({ title, value, icon, trend, description }: StatCardProps) => (
  <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
          {trend}
        </p>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  const { profile } = useProfileStore();
  const stats = profile?.stats || { totalRecipes: 0, cookedRecipes: 0, successRate: 0 };
  const { favoriteRecipes } = useRecipeStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Recipes"
        value={stats.totalRecipes}
        icon={<ChefHat className="h-5 w-5" />}
        description="Created by your AI Chef"
      />
      <StatCard
        title="Favorites"
        value={favoriteRecipes.length}
        icon={<Heart className="h-5 w-5" />}
        description="Saved for later"
      />
      <StatCard
        title="Cooked"
        value={stats.cookedRecipes}
        icon={<Clock className="h-5 w-5" />}
        description="Successfully prepared"
      />
      <StatCard
        title="Success Rate"
        value={`${stats.successRate || 100}%`}
        icon={<TrendingUp className="h-5 w-5" />}
        description="Positive feedback rating"
      />
    </div>
  );
};