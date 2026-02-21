'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Utensils, Flame, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRecipeStore } from '@/store/recipe-store';

// Bar chart data is now stateful based on activities

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export const AnalyticsCharts = () => {
  const { recentRecipes, activities } = useRecipeStore();
  const [cuisineData, setCuisineData] = useState<{ name: string; value: number; reason: string }[]>([]);
  const [recipeActivityData, setRecipeActivityData] = useState<{ name: string; recipes: number }[]>([]);

  useEffect(() => {
    // Calculate cuisine preferences based on recent recipes
    // Count occurrences of cuisine-related keywords in recipe names
    const cuisineKeywords = {
      'Italian': ['pasta', 'pizza', 'risotto', 'lasagna', 'gnocchi', 'fettuccine', 'spaghetti'],
      'Mexican': ['taco', 'burrito', 'quesadilla', 'enchilada', 'fajita', 'guacamole', 'salsa'],
      'Asian': ['ramen', 'sushi', 'pad thai', 'curry', 'stir fry', 'dumpling', 'noodle'],
      'Indian': ['curry', 'dal', 'naan', 'biryani', 'tikka', 'masala', 'korma'],
      'Mediterranean': ['hummus', 'tabbouleh', 'falafel', 'gyro', 'kebab', 'olive'],
      'American': ['burger', 'steak', 'bbq', 'ribs', 'mac and cheese', 'chili']
    };

    // Initialize counts
    const cuisineCounts: Record<string, number> = {};
    Object.keys(cuisineKeywords).forEach(cuisine => {
      cuisineCounts[cuisine] = 0;
    });

    // Count occurrences in recent recipes
    recentRecipes.forEach(recipe => {
      const lowerName = recipe.recipeName.toLowerCase();
      Object.entries(cuisineKeywords).forEach(([cuisine, keywords]) => {
        keywords.forEach(keyword => {
          if (lowerName.includes(keyword)) {
            cuisineCounts[cuisine]++;
          }
        });
      });
    });

    // Convert to array and sort by count
    const sortedCuisines = Object.entries(cuisineCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Take top 5

    // Calculate percentages and create data
    const totalCount = sortedCuisines.reduce((sum, [_, count]) => sum + count, 0);
    const newData = sortedCuisines.map(([name, count], index) => ({
      name,
      value: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      reason: `Based on your recent ${name.toLowerCase()} recipes`
    }));

    // If no cuisines detected, use default values
    if (newData.length === 0) {
      setCuisineData([
        { name: 'Italian', value: 35, reason: 'Classic and popular choice' },
        { name: 'Asian', value: 25, reason: 'Healthy and diverse options' },
        { name: 'Mexican', value: 20, reason: 'Flavorful and satisfying' },
        { name: 'American', value: 15, reason: 'Comfort food favorites' },
        { name: 'Other', value: 5, reason: 'Various international cuisines' }
      ]);
    } else {
      // Normalize to 100% if needed
      let totalValue = newData.reduce((sum, item) => sum + item.value, 0);
      if (totalValue !== 100 && totalValue > 0) {
        // Adjust the first item to make total 100%
        const adjustment = 100 - totalValue;
        newData[0].value += adjustment;
      }
      setCuisineData(newData);
    }
  }, [recentRecipes]);

  useEffect(() => {
    // Generate the last 7 days array
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    const newData = last7Days.map(date => {
      // Find all 'recipe' activities matching this date
      const generateCount = activities.filter(a => {
        if (a.type !== 'recipe') return false;
        const aDate = new Date(a.timestamp);
        return aDate.getDate() === date.getDate() &&
          aDate.getMonth() === date.getMonth() &&
          aDate.getFullYear() === date.getFullYear();
      }).length;

      return {
        name: days[date.getDay()],
        recipes: generateCount
      };
    });

    setRecipeActivityData(newData);
  }, [activities]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-5 w-5" />
            <span>Weekly Recipe Creation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recipeActivityData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" strokeOpacity={0.5} />
              <YAxis strokeOpacity={0.5} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'calc(var(--radius) - 2px)',
                }}
              />
              <Bar dataKey="recipes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white/80 to-white/50 dark:from-slate-800/80 dark:to-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5" />
            <span>Cuisine Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cuisineData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={70}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => {
                  // Show only the name if percentage is too small to avoid crowding
                  const percentage = (percent * 100).toFixed(0);
                  return parseInt(percentage) > 5 ? `${name}\n${percentage}%` : `${name}`;
                }}
              >
                {cuisineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const entry = cuisineData.find(item => item.name === name);
                  // Limit the reason text to prevent overflow
                  const reason = entry?.reason || '';
                  const truncatedReason = reason.length > 50 ? reason.substring(0, 50) + '...' : reason;
                  return [`${value}%`, `${name} - ${truncatedReason}`];
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  maxWidth: '250px',
                  wordWrap: 'break-word',
                }}
                wrapperStyle={{
                  zIndex: 1000,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};