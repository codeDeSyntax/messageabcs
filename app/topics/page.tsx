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

      {/* Medium-style Sticky Navbar - Full Width */}
      <nav className="sticky top-0 z-[500] bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo and Menu */}
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              </div>
              <Logo className="h-6" />

              {/* Desktop Menu Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Menu className="h-4 w-4" />
                  Menu
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
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
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
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
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchAndPagination
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/ask-question")}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Ask</span>
              </Button>

              <div className="hidden md:block">
                <ProfileCard />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Panel - Split Layout */}
      <div className="flex justify-center relative z-10">
        <div className="w-full max-w-4xl">
          {/* Mobile: Single Panel Layout */}
          <div className="md:hidden w-full">
            {/* Mobile Search Bar */}
            <div className="sticky top-14 z-10 bg-background border-b border-border px-4 py-3">
              <SearchAndPagination
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Mobile Scrollable Content Area */}
            <div className="px-4 py-6">
              <div>
                {/* Loading State */}
                {loading && (
                  <div className="pb-20">
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
                      <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto px-4">
                        {paginatedTopics.map((topic) => (
                          <TopicCard
                            key={topic.id}
                            topic={topic}
                            viewMode="grid"
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

          {/* Desktop: Grid Layout */}
          <div className="hidden md:block px-6 lg:px-8 py-8">
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
              <div>
                {paginatedTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {paginatedTopics.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} viewMode="grid" />
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

      {/* Bottom navigation intentionally removed on topics page - desktop nav moved to top */}

      {/* Topic Action Buttons */}
      <TopicActionButtons />
    </div>
  );
}
