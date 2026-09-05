"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  MessageCircleQuestion,
  MessageSquare,
  Search,
  ArrowRight,
  BookMarked,
  ShieldCheck,
  ChevronRight,
  Heart,
} from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { HomeArtBackground } from "@/components/HomeArtBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "MessageABCs - Biblical Truth & Wisdom";
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/topics?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/topics");
    }
  };

  const featureCards = [
    {
      title: "Biblical Topics & Outlines",
      description:
        "Comprehensive scriptural studies, sermon extracts, and outlines categorized for deeper spiritual understanding.",
      icon: BookOpen,
      href: "/topics",
      badge: "Studies",
      action: "Explore Topics",
    },
    {
      title: "Distraction-Free Reader",
      description:
        "Immerse yourself in scripture reading with customizable font sizes, chapter navigation, and offline reading marks.",
      icon: BookMarked,
      href: "/reading",
      badge: "Reader",
      action: "Open Reading Mode",
    },
    {
      title: "Community Q&A & Answers",
      description:
        "Submit your spiritual questions anonymously and explore verified, scripture-backed answers from the ministry.",
      icon: MessageCircleQuestion,
      href: "/qa",
      badge: "Q&A",
      action: "Browse Questions",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[var(--theme-canvas)] flex flex-col overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Sacred Celestial & Geometric Art Background */}
      <HomeArtBackground />

      {/* Seamless Top Navbar matching Hero background */}
      <nav className="sticky top-0 z-40 bg-transparent border-b border-transparent transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            {/* Left: Mobile Drawer Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                  isHomePage={true}
                />
              </div>
              <Logo className="h-4" />
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

      {/* Main Content Body */}
      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-7">
            {/* Sleek Scripture Pill */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/[0.07] text-[11px] sm:text-xs font-medium tracking-wide text-foreground/80 transition-all">
              <span>
                &ldquo;And ye shall know the truth, and the truth shall make you free.&rdquo;
                <span className="ml-1.5 font-bold text-foreground tracking-normal">
                  — John 8:32
                </span>
              </span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15] [text-wrap:balance]">
                Knowing Jesus Christ implies knowing the truth.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed pt-2">
                An enlightened biblical platform dedicated to uncovering the Message of the Hour, sermon outlines, scripture revelations, and community questions.
              </p>
            </div>

            {/* Quick Keyword Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto relative flex items-center pt-2"
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search biblical topics, scriptures, questions..."
                  className="w-full h-11 sm:h-12 pl-11 pr-24 rounded-full bg-background/90 border border-border/80 shadow-sm text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-sans"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 sm:h-9 px-4 rounded-full text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-xs"
                >
                  Explore
                </Button>
              </div>
            </form>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => router.push("/topics")}
                className="h-11 px-6 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>Start Reading</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/ask-question")}
                className="h-11 px-6 rounded-full border-border/80 bg-background/80 hover:bg-muted text-foreground font-medium text-xs sm:text-sm transition-all"
              >
                Ask a Question
              </Button>
            </div>
          </div>
        </section>

        {/* PILLARS & FEATURES SECTION */}
        <section className="py-10 sm:py-14 border-t border-border/50 bg-background/30 backdrop-blur-xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-1.5 mb-8 sm:mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                What You Can Do Here
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                Tools designed to assist in your personal study, understanding, and fellowship
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => router.push(card.href)}
                    className="group relative p-5 sm:p-6 rounded-2xl bg-background/85 border border-border/70 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {card.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed font-sans">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>{card.action}</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INSPIRATIONAL SCRIPTURAL CALLOUT */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center p-6 sm:p-10 rounded-3xl bg-primary/10 border border-primary/20 shadow-sm space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary font-sans">
              The Message of the Hour
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-snug">
              &ldquo;Truth doesn&apos;t change. It remains the same yesterday, today, and forever.&rdquo;
            </blockquote>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans pt-1">
              Join thousands of believers exploring biblical truths and Message teachings worldwide.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => router.push("/reading")}
                className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold px-5 py-2 shadow-xs"
              >
                Open Daily Reading
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-background/70 backdrop-blur-md py-8 px-4 sm:px-6 relative z-10 text-xs text-muted-foreground font-sans">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="compact" />
            <span className="text-muted-foreground/40 hidden sm:inline">|</span>
            <span>Biblical Truth & Wisdom</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => router.push("/topics")}
              className="hover:text-foreground transition-colors"
            >
              Topics
            </button>
            <button
              onClick={() => router.push("/reading")}
              className="hover:text-foreground transition-colors"
            >
              Reading
            </button>
            <button
              onClick={() => router.push("/qa")}
              className="hover:text-foreground transition-colors"
            >
              Q&A
            </button>
            <button
              onClick={() => router.push("/ask-question")}
              className="hover:text-foreground transition-colors"
            >
              Ask
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} MessageABCs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
