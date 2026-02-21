'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ChefHat, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { useRecipeStore } from '@/store/recipe-store';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemType {
  id?: string;
  title: string;
  timestamp: Date;
  type: 'recipe' | 'favorite' | 'cooked' | 'plan';
}

const getIcon = (type: string) => {
  switch (type) {
    case 'recipe': return <ChefHat className="h-4 w-4" />;
    case 'favorite': return <Star className="h-4 w-4" />;
    case 'cooked': return <Clock className="h-4 w-4" />;
    case 'plan': return <Calendar className="h-4 w-4" />;
    default: return <ChefHat className="h-4 w-4" />;
  }
}

const ActivityItem = ({ item }: { item: ActivityItemType }) => (
  <div className="flex items-start py-3 border-b border-border/20 last:border-0">
    <div className={`p-2 rounded-lg mr-3 ${item.type === 'recipe' ? 'bg-blue-500/10 text-blue-500' :
      item.type === 'favorite' ? 'bg-red-500/10 text-red-500' :
        item.type === 'cooked' ? 'bg-green-500/10 text-green-500' :
          'bg-purple-500/10 text-purple-500'}`}>
      {getIcon(item.type)}
    </div>
    <div className="flex-1">
      <p className="font-medium">{item.title}</p>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <Clock className="h-3 w-3 mr-1" />
        <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
      </div>
    </div>
  </div>
);

export const RecentActivity = () => {
  const { activities } = useRecipeStore();
  const displayActivities = activities.slice(0, 15);

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg h-full max-h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto w-full pr-4 custom-scrollbar">
        {displayActivities.length > 0 ? (
          <div className="divide-y divide-border/20">
            {displayActivities.map((activity, i) => (
              <ActivityItem key={activity.id || i} item={activity as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground flex flex-col items-center justify-center h-full opacity-70">
            <Clock className="h-8 w-8 mb-2" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};