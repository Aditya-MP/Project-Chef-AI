
"use client";

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileHeader } from '@/components/mobile-header';
import { useRecipeStore } from '@/store/recipe-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { loadRecipes, loadActivities, loadMealPlans } = useRecipeStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let mounted = true;
    if (user && mounted) {
      // Only load once when user is authenticated
      loadRecipes(user.uid);
      loadActivities(user.uid);
      loadMealPlans(user.uid);
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Skeleton className="w-full h-screen" />
        </div>
        <div className="flex-1 flex flex-col">
          <Skeleton className="h-16" />
          <div className="flex-1 p-4 md:p-8">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-card/10 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {/* Ambient Background Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[150px]" />
      </div>
      <div className="hidden md:block z-10">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col z-10 h-full overflow-hidden">
        <div className="md:hidden">
          <MobileHeader />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="p-4 md:p-8 min-h-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
