"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { TopicActionButtons } from "@/components/TopicActionButtons";
import { TopicGridSkeleton } from "@/components/LoadingSkeleton";
import { LoadingFailedIcon } from "@/components/LoadingFailedIcon";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  MessageSquare,
  Sparkles,
  Flame,
  Clock,
  ArrowDownAZ,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTopics, TopicSortOption } from "@/hooks/useTopics";

// Import modular components
import { SearchAndPagination } from "@/components/Topics/SearchAndPagination";
import { TopicCard } from "@/components/Topics/TopicCard";
import { NoResults } from "@/components/Topics/NoResults";
import { Logo } from "@/components/Logo";

export default function Topics() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use the custom hook for topics data management
  const {
    topics: paginatedTopics,
    totalItems,
    loading,
    error,
    totalPages,
    currentPage,
    searchQuery,
    sortBy,
    setSortBy,
    setCurrentPage,
    setSearchQuery,
    refetch,
  } = useTopics({ itemsPerPage: 8 });

  useEffect(() => {
    document.title = "Biblical Topics & Study List - MessageABCs";
  }, []);

  const filterTabs: {
    id: TopicSortOption;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "latest" as TopicSortOption, label: "Latest", icon: Clock },
    { id: "popular" as TopicSortOption, label: "Most Discussed", icon: Flame },
    { id: "alphabetical" as TopicSortOption, label: "A – Z", icon: ArrowDownAZ },
  ];

  // Calculate range for pagination display
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 8 + 1;
  const endItem = Math.min(currentPage * 8, totalItems);

  return (
    <div className="h-screen relative bg flex flex-col overflow-hidden">
      {/* Dynamic Themed Background */}
      <AnimatedBackground />
      <div className="bg-background/40 backdrop-blur-md inset-0 absolute pointer-events-none" />

      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            {/* Left: Mobile Drawer Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              </div>
              <Logo />
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-2">
              <SearchAndPagination
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Search topics, scriptures, keywords..."
              />
            </div>

            {/* Right: Direct Navigation & User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden md:flex items-center gap-1">
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
                  className="ml-1 bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Search Bar */}
          <div className="md:hidden mb-4">
            <SearchAndPagination
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search biblical topics..."
            />
          </div>

          {/* Medium-style Reading List Header */}
          <div className="pb-3 sm:pb-4 border-b border-border/75 mb-1">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif">
                  Biblical Topics
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  Curated scripture studies, doctrinal insights, and community questions.
                </p>
              </div>

              {!loading && !error && totalItems > 0 && (
                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? "topic" : "topics"}
                </span>
              )}
            </div>

            {/* Filter & Sort Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = sortBy === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSortBy(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-foreground text-background font-semibold shadow-xs"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-2">
              <TopicGridSkeleton count={6} />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <LoadingFailedIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Unable to load topics
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
                We encountered an issue connecting to the server. Please check your connection and try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-lg font-medium shadow-sm transition-all"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {/* Topic List Stream */}
          {!loading && !error && (
            <div>
              {paginatedTopics.length > 0 ? (
                <div className="w-full">
                  {paginatedTopics.map((topic, index) => (
                    <TopicCard key={topic.id} topic={topic} index={index} />
                  ))}
                </div>
              ) : (
                <NoResults
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery("")}
                />
              )}


              {/* Bottom Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-border/40 mt-4">
                  <div className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{startItem}</span>–<span className="font-semibold text-foreground">{endItem}</span> of{" "}
                    <span className="font-semibold text-foreground">{totalItems}</span> topics
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="p-2 rounded-lg border border-border/60 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Always show first, last, and pages adjacent to current
                        return (
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - currentPage) <= 1
                        );
                      })
                      .map((pageNum, idx, arr) => {
                        const showEllipsis =
                          idx > 0 && pageNum - arr[idx - 1] > 1;
                        return (
                          <div key={pageNum} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-xs text-muted-foreground">
                                …
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-all ${
                                currentPage === pageNum
                                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </div>
                        );
                      })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="p-2 rounded-lg border border-border/60 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Topic Action Buttons (Admin/Create actions if applicable) */}
      <TopicActionButtons />
    </div>
  );
}

