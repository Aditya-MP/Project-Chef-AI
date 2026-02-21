"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, Home, Heart, Clock, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const mainNavLinks = [
  { href: "/dashboard", label: "Studio", icon: Home },
  { href: "/dashboard/recipe-generator", label: "Generate Recipe", icon: ChefHat },
  { href: "/dashboard/recent-recipes", label: "History", icon: Clock },
  { href: "/dashboard/favorite-recipes", label: "Favorites", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-[calc(100vh-2rem)] m-4 rounded-3xl bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-white/10 dark:border-white/5 flex flex-col shadow-2xl ring-1 ring-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="p-8 pb-6 z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-orange-600 p-3 rounded-2xl shadow-lg shadow-primary/20 animate-float">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight text-gradient-primary">ChefAI</h1>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-70">Pro Edition</p>
          </div>
        </div>

        <nav className="space-y-3">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-medium transition-all duration-500 group relative overflow-hidden",
                pathname === link.href
                  ? "text-white shadow-2xl shadow-primary/20"
                  : "hover:bg-white/5 hover:text-primary text-muted-foreground"
              )}
            >
              {pathname === link.href && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-90 animate-shimmer bg-[length:200%_auto]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              )}
              <link.icon className={cn("h-6 w-6 relative z-10 transition-transform duration-300 group-hover:scale-110", pathname === link.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              <span className="relative z-10 font-bold tracking-wide">{link.label}</span>
              {pathname === link.href && <div className="absolute right-4 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgb(255,255,255)] z-10" />}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 z-10">
        <div className="bg-white/5 dark:bg-black/20 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">System</h3>
          <div className="space-y-1 flex flex-col">
            <Link
              href="/dashboard/profile"
              className={cn(
                "inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full",
                pathname === '/dashboard/profile' ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-foreground" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <User className="mr-3 h-5 w-5" /> Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full",
                pathname === '/dashboard/settings' ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-foreground" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Settings className="mr-3 h-5 w-5" /> Settings
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
