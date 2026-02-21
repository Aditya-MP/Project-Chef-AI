
"use client";

import { useProfileStore } from '@/store/profile-store';
import { DashboardStats } from '@/components/dashboard-stats';
import { RecentActivity } from '@/components/recent-activity';
import { AnalyticsCharts } from '@/components/analytics-charts';
import { PopularRecipes } from '@/components/popular-recipes';
import { MealPlanner } from '@/components/meal-planner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  const { profile } = useProfileStore();

  return (
    <div className="flex flex-col space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-end pb-4 border-b border-border/10">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tighter text-foreground">
            <span className="text-primary">Hello,</span> {profile.firstName}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg font-light">
            Ready to create your next culinary masterpiece?
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {/* Analytics Charts */}
          <AnalyticsCharts />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Popular Recipes */}
            <PopularRecipes />

            {/* Meal Planner */}
            <MealPlanner />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold font-headline mb-2 text-primary">Ready to Cook?</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">Create your next culinary masterpiece with our AI chef. It analyzes what you have and delivers custom recipes instantly.</p>
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 text-md px-8 py-6 h-auto font-semibold" asChild>
                <Link href="/dashboard/recipe-generator">Start Generating</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
