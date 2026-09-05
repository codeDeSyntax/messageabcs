"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Search,
  ArrowRight,
  BookMarked,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { HomeArtBackground } from "@/components/HomeArtBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function ReadingHub() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Scripture Reader - MessageABCs";
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/topics?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/topics");
    }
  };

  const sampleStudies = [
    { title: "The Godhead & Revelation", slug: "the-godhead", count: "8 scriptures" },
    { title: "The Seven Church Ages", slug: "the-seven-church-ages", count: "12 scriptures" },
    { title: "The Token of Faith", slug: "the-token", count: "6 scriptures" },
    { title: "Water Baptism in Jesus' Name", slug: "water-baptism", count: "10 scriptures" },
  ];

  return (
    <div className="min-h-screen relative bg-[var(--theme-canvas)] flex flex-col overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background artwork */}
      <HomeArtBackground />

      {/* Sticky Top Navbar with Solid Backdrop */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/70 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            {/* Left: Mobile Drawer Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap min-w-max">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              </div>
              <Logo className="shrink-0" />
            </div>

            {/* Right: Direct Navigation & User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden md:flex items-center gap-1 font-sans">
                <button
                  type="button"
                  onClick={() => router.push("/topics")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/topics"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Topics
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/reading")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/reading"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Reading
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/qa")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/qa"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Q&A
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/ask-question")}
                  className="ml-1 bg-primary hover:bg-primary-hover text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs hover:scale-105"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Ask</span>
                </button>
              </div>

              <ProfileCard />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hub Content */}
      <main className="flex-1 relative z-10 flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
          {/* Header Icon & Badge */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider font-sans">
              <BookMarked className="h-3.5 w-3.5" />
              <span>Distraction-Free Mode</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.15] [text-wrap:balance]">
              Immerse yourself in biblical study and scripture
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto font-sans leading-relaxed">
              Choose a study topic from the library to open distraction-free reading with scripture references, sermon extracts, and notes.
            </p>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto relative flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study titles, scriptures, themes..."
                className="w-full h-11 sm:h-12 pl-11 pr-24 rounded-full bg-background/90 border border-border/80 shadow-sm text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-sans"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 sm:h-9 px-4 rounded-full text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-xs"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => router.push("/topics")}
              className="h-11 px-6 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse All Topics</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-4 text-center text-xs text-muted-foreground font-sans relative z-10">
        MessageABCs &copy; {new Date().getFullYear()} &bull; Biblical Truth & Wisdom
      </footer>
    </div>
  );
}
