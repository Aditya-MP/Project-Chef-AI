
"use client";

import { Button } from "@/components/ui/button";
import { ChefHat, CookingPot, Leaf, Zap, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileHeader } from "@/components/mobile-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">

      {/* Hero Section with Parallax-like Background */}
      <div className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-food.png"
            alt="Culinary Art Background"
            fill
            className="object-cover opacity-90 scale-105"
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/90" />
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 container mx-auto">
          <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-lg">
            <ChefHat className="h-8 w-8 text-primary drop-shadow-md" />
            <h1 className="text-2xl font-bold font-headline text-white tracking-wide">ChefAI</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full text-lg">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-primary text-white border-0 text-lg px-8 py-6">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <MobileHeader isLanding={true} />
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 text-center container mx-auto px-4 mt-20">
          <div className="inline-block mb-4 px-6 py-2 rounded-full bg-primary/90 backdrop-blur-sm border border-primary/50 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-white font-bold tracking-widest uppercase text-sm">The Future of Cooking</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter font-headline text-white drop-shadow-2xl mb-6 leading-tight">
            Culinary Magic <br /><span className="text-primary italic">Reimagined.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/90 font-light drop-shadow-md leading-relaxed mb-10">
            Turn your pantry chaos into gourmet harmony. Your personal AI chef creates masterpiece recipes from what you have.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full text-xl px-10 py-7 bg-white text-black hover:bg-gray-100 shadow-2xl transition-transform hover:-translate-y-1">
              <Link href="/signup">Start Cooking Free <ArrowRight className="ml-2 w-6 h-6" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full text-xl px-10 py-7 bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Glassmorphism Features Section */}
      <section id="features" className="py-24 relative overflow-hidden bg-background">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold font-headline mb-4">Why ChefAI?</h3>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Experience the perfect blend of technology and taste.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Creation",
                desc: "Generate unique recipes in milliseconds using advanced AI models.",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                icon: Leaf,
                title: "Dietary Architect",
                desc: "Vegan, Keto, Gluten-Free? We tailor every dish to your exact needs.",
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                icon: CookingPot,
                title: "Zero Waste",
                desc: "Save money and the planet by using every ingredient in your fridge.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-lg border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`p-4 rounded-2xl w-fit mb-6 ${feature.bg} ${feature.color} ring-1 ring-inset ring-current/20`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold font-headline mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Quote Section */}
      <section className="py-32 relative bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(/hero-food.png)' }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <blockquote className="text-3xl md:text-5xl font-headline font-italic leading-tight max-w-4xl mx-auto">
            "Cooking is an art, but patience is a virtue... unless you have ChefAI."
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-16 h-1 rounded-full bg-primary" />
            <p className="text-xl opacity-90">Happy 2026 User</p>
            <div className="w-16 h-1 rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-4 gap-6">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ChefAI</span>
          </div>
          <p className="text-muted-foreground">&copy; 2026 ChefAI. Crafted with ❤️ and 🌶️.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
