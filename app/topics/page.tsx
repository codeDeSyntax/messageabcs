"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { TopicActionButtons } from "@/components/TopicActionButtons";
import { TopicGridSkeleton } from "@/components/LoadingSkeleton";
import { LoadingFailedIcon } from "@/components/LoadingFailedIcon";
import { Button } from "@/components/ui/button";
import {
  Plus,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  MessageSquare,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useTopics } from "@/hooks/useTopics";

// Import modular components
import { TopNavbar } from "@/components/Topics/TopNavbar";
import { SearchAndPagination } from "@/components/Topics/SearchAndPagination";
import { TopicCard } from "@/components/Topics/TopicCard";
import { NoResults } from "@/components/Topics/NoResults";
import { Logo } from "@/components/Logo";

export default function Topics() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Use the custom hook for topics data management
  const {
    topics: paginatedTopics,
    loading,
    error,
    totalPages,
    currentPage,
    searchQuery,
    setCurrentPage,
    setSearchQuery,
    refetch,
  } = useTopics({ itemsPerPage: 8 });

  useEffect(() => {
    document.title = "Biblical Topics - MessageABCs";
  }, []);

  // Build nav items for top navigation (admin-only Dashboard)
  const getNavItems = () => {
    const baseItems = [
      { icon: Hash, label: "Topics", path: "/topics" },
      { icon: BookOpen, label: "Reading", path: "/reading" },
      { icon: MessageCircleQuestion, label: "Q&A", path: "/qa" },
      { icon: MessageCircle, label: "Ask", path: "/ask-question" },
    ];

    if (isAuthenticated && user?.role === "admin") {
      baseItems.push({
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin?direct=true",
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen relative">
      {/* CSS Animations */}
      <style>{`
        @keyframes slideUpFade {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <AnimatedBackground />
      {/* white blur over animation background  */}
      <div className="bg-background/20 backdrop-blur-md inset-0 absolute" />
      {/* Mobile Navigation Drawer with MESSAGEABCS logo */}
      <div className="md:hidden py-2 px-6 pb-2 relative z-10 flex justify-between items-center">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
        <Logo variant="compact" />
        <Button
          onClick={() => router.push("/ask-question")}
          size="sm"
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Ask
        </Button>
      </div>

      {/* Main Content Panel - Split Layout */}
      <div className="flex justify-center m-2 md:m-0 p-3 sm:p-0 pt-2 md:pt-0 relative z-10 md:h-screen">
        <div className="w-full max-w-7xl md:h-full">
          {/* Mobile: Single Panel Layout */}
          <div className="md:hidden w-full border-none bg-background/20 backdrop-blur-0 border-border rounded-2xl flex flex-col h-[95%] overflow-hidden">
            {/* Fixed Search Bar and Pagination within panel */}
            <div className="sticky top-0 z-10 bg-transparent backdrop-blur-md border-b border-white/10 p-0 sm:p-4 rounded-t-2xl">
              {/* Mobile: Stacked layout */}
              {/* <div className="space-y-4">
                <div className="flex items-center w-  justify-between ">
                  <SearchAndPagination
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div> */}
            </div>

            {/* Mobile Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar  sm:p-4 sm:px-6 pt-0">
              <div className="mt-4">
                {/* Loading State */}
                {loading && (
                  <div className="pb-40">
                    <TopicGridSkeleton count={8} viewMode="list" />
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <LoadingFailedIcon className="h-20 w-20 mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
                      {
                        "We couldn't load the biblical topics. Please check your connection and try again."
                      }
                    </p>
                    <Button
                      onClick={() => refetch()}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Error: {error}
                    </p>
                  </div>
                )}

                {/* Mobile Content List */}
                {!loading && !error && (
                  <div className="pb-40">
                    {paginatedTopics.length > 0 ? (
                      <div className="space-y-3 w-full">
                        {paginatedTopics.map((topic) => (
                          <TopicCard
                            key={topic.id}
                            topic={topic}
                            viewMode="list"
                          />
                        ))}
                      </div>
                    ) : (
                      <NoResults />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Board-style Grid Layout */}
          <div className="hidden md:flex md:flex-col h-full bg-background/20 backdrop-blur-sm border border-border shadow-2xl rounded-lg overflow-hidden">
            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-3 px-6">
              {/* Second Row: Title and Search */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Logo className="h-5 " />
                </div>

                

                <div className="flex w- items-center gap-4">
                  <div className="flex items-center gap-2 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all duration-150 bg-background border border-border hover:bg-muted"
                  >
                    <Menu className="h-3.5 w-3.5" />
                    <span>Menu</span>
                  </button>

                  {/* Compact Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg overflow-hidden z-50"
                    >
                      <nav className="py-1">
                        {navItems.map((item) => {
                          const Icon = item.icon as any;
                          const isActive = pathname === item.path;

                          return (
                            <button
                              key={item.path}
                              onClick={() => {
                                router.push(item.path);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors ${
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted text-foreground"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  )}
                </div>
                  <SearchAndPagination
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />

                  <div className="flex gap-2">
                    {/* Ask Question Button */}
                    <Button
                      onClick={() => router.push("/ask-question")}
                      className="bg-primary hover:bg-accent text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ask a Question
                    </Button>

                    <ProfileCard />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content List - Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden p-6 pt-4 min-h-0 max-h-full">
              {/* Loading State */}
              {loading && <TopicGridSkeleton count={8} viewMode="list" />}

              {/* Error State */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <LoadingFailedIcon className="h-24 w-24 mb-8" />
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md text-base leading-relaxed">
                    {
                      "We couldn't load the biblical topics. Please check your internet connection and try again."
                    }
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Try Again
                  </Button>
                  <div className="mt-6 text-xs text-muted-foreground max-w-lg">
                    <details className="cursor-pointer">
                      <summary className="hover:text-foreground">
                        Technical details
                      </summary>
                      <p className="mt-2 text-left bg-background/50 p-3 rounded-md border">
                        {error}
                      </p>
                    </details>
                  </div>
                </div>
              )}

              {/* Success State - Topic List */}
              {!loading && !error && (
                <div className="pb-20">
                  {paginatedTopics.length > 0 ? (
                    <div className="max-w-4xl mx-auto space-y-3">
                      {paginatedTopics.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          topic={topic}
                          viewMode="list"
                        />
                      ))}
                    </div>
                  ) : (
                    <NoResults />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation intentionally removed on topics page - desktop nav moved to top */}

      {/* Topic Action Buttons */}
      <TopicActionButtons />
    </div>
  );
}
