"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ProfileCard } from "@/components/ProfileCard";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuestions, useTopics } from "@/hooks/queries";
import { QuestionCard } from "@/components/QA/components/QuestionCard";
import { TopicsSidebar } from "@/components/QA/components/TopicsSidebar";

type StatusFilter = "all" | "answered" | "pending";

export default function QA() {
  const router = useRouter();
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    document.title = "Q & A - Biblical Insights & Community Answers - MessageABCs";
  }, []);

  // Fetch questions
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
    refetch: refetchQuestions,
  } = useQuestions({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
    topicId: selectedTopic || undefined,
  });

  // Fetch topics for sidebar filter
  const { data: topicsData, isLoading: topicsLoading } = useTopics({
    page: 1,
    limit: 50,
  });

  const rawQuestions = questionsData?.data || [];
  const topics = topicsData?.data || [];
  const loading = questionsLoading || topicsLoading;

  // Client-side filtering for status tabs (All / Answered / Pending)
  const filteredQuestions = useMemo(() => {
    return rawQuestions.filter((q) => {
      const hasAnswer = q.answers && q.answers.length > 0;
      if (statusFilter === "answered") return hasAnswer;
      if (statusFilter === "pending") return !hasAnswer;
      return true;
    });
  }, [rawQuestions, statusFilter]);

  // Client-side pagination
  const totalItems = filteredQuestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic, statusFilter]);

  const activeTopicObj = useMemo(() => {
    if (!selectedTopic) return null;
    return topics.find((t) => t.id === selectedTopic);
  }, [selectedTopic, topics]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="h-screen relative bg flex flex-col overflow-hidden">
      {/* Dynamic Themed Background */}
      <AnimatedBackground />
      <div className="bg-background/40 backdrop-blur-md inset-0 absolute pointer-events-none" />

      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            {/* Left: Mobile Drawer Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              </div>
              <Logo className="h-4" />
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search questions, answers, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 h-9 text-xs sm:text-sm bg-muted/40 border-border/70 rounded-full focus:bg-background transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Direct Navigation & User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile Quick Ask Button */}
              <button
                type="button"
                onClick={() => setIsAskModalOpen(true)}
                className="md:hidden bg-primary hover:bg-primary-hover text-primary-foreground p-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs flex items-center justify-center"
                aria-label="Ask Question"
                title="Ask Question"
              >
                <Plus className="h-4 w-4" />
              </button>

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
                  onClick={() => setIsAskModalOpen(true)}
                  className="ml-1 bg-primary hover:bg-primary-hover text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ask</span>
                </button>
              </div>

              <ProfileCard />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
          {/* Mobile Search Bar */}
          <div className="md:hidden mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 h-8 text-xs bg-muted/50 border-border/70 rounded-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left Stream: Questions Feed (lg:col-span-8) */}
            <div className="lg:col-span-8 min-w-0">
              {/* Header Section */}
              <div className="pb-2.5 sm:pb-3 border-b border-border/75 mb-0.5">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground font-serif">
                      Questions & Answers
                    </h1>
                    <p className="text-[11.5px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Community inquiries, doctrinal clarifications, and verified answers from MessageABCs.
                    </p>
                  </div>

                  {!loading && !questionsError && (
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      {totalItems} {totalItems === 1 ? "question" : "questions"}
                    </span>
                  )}
                </div>

                {/* Filter Tabs & Active Topic Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 mt-2.5 pt-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11.5px] font-medium transition-all ${
                        statusFilter === "all"
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>All Questions</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusFilter("answered")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11.5px] font-medium transition-all ${
                        statusFilter === "answered"
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Answered</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusFilter("pending")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11.5px] font-medium transition-all ${
                        statusFilter === "pending"
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </button>
                  </div>

                  {/* Active Topic Filter Pill */}
                  {activeTopicObj && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                      <Layers className="h-3 w-3" />
                      <span className="truncate max-w-[140px]">
                        Topic: {activeTopicObj.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedTopic(null)}
                        aria-label="Remove topic filter"
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Topic Filter Dropdown */}
                {topics.length > 0 && (
                  <div className="lg:hidden mt-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Select
                          value={selectedTopic || "all"}
                          onValueChange={(val) =>
                            setSelectedTopic(val === "all" ? null : val)
                          }
                        >
                          <SelectTrigger className="w-full h-8 text-xs bg-muted/40 border-border/70 rounded-lg px-2.5 flex items-center justify-between focus:ring-1 focus:ring-primary/30">
                            <div className="flex items-center gap-1.5 truncate">
                              <Layers className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <span className="text-[11.5px] font-medium truncate">
                                {activeTopicObj
                                  ? activeTopicObj.title
                                  : "Filter by Topic (All Topics)"}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-h-64 bg-background/95 backdrop-blur-xl border border-border/80 rounded-xl p-1 shadow-lg">
                            <SelectItem value="all" className="text-xs py-1.5 px-2">
                              <span className="font-medium text-xs">All Topics</span>
                            </SelectItem>
                            {topics.map((t) => (
                              <SelectItem
                                key={t.id}
                                value={t.id.toString()}
                                className="text-xs py-1.5 px-2"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="relative w-4.5 h-4.5 rounded-full overflow-hidden flex-shrink-0 border border-border/60">
                                    <Image
                                      src={t.image || "/mabcs.png"}
                                      alt={t.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-xs truncate max-w-[220px]">
                                    {t.title}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedTopic && (
                        <button
                          type="button"
                          onClick={() => setSelectedTopic(null)}
                          className="h-8 px-2.5 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors flex-shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="divide-y divide-border/60">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`py-4 px-3.5 animate-pulse space-y-2.5 ${
                        i % 2 !== 0 ? "bg-primary/[0.04]" : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4.5 h-4.5 bg-muted rounded-full" />
                        <div className="h-3 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16 ml-auto" />
                      </div>
                      <div className="h-3.5 bg-muted rounded w-4/5" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {questionsError && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2.5">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Unable to load questions
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 max-w-sm">
                    We encountered an issue connecting to the server. Please check your connection and try again.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => refetchQuestions()}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Retry
                  </Button>
                </div>
              )}

              {/* Question Stream */}
              {!loading && !questionsError && (
                <div>
                  {paginatedQuestions.length > 0 ? (
                    <div className="w-full">
                      {paginatedQuestions.map((q, idx) => (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          index={idx}
                          formatDate={formatDate}
                          onTopicClick={(topicId) => setSelectedTopic(topicId)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center px-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2.5">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        No questions found
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 max-w-sm mx-auto">
                        {searchQuery
                          ? `No questions matching "${searchQuery}". Try a different keyword.`
                          : activeTopicObj
                          ? `No questions under the topic "${activeTopicObj.title}" yet.`
                          : "Be the first to ask a question to the community."}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAskModalOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs h-8"
                      >
                        <Plus className="h-3 w-3 mr-1.5" />
                        Ask a Question
                      </Button>
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 border-t border-border/40 mt-3">
                      <div className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{startItem}</span>–<span className="font-semibold text-foreground">{endItem}</span> of{" "}
                        <span className="font-semibold text-foreground">{totalItems}</span> questions
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                          className="p-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => {
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
                                  <span className="px-1.5 text-xs text-muted-foreground">
                                    …
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-all ${
                                    currentPage === pageNum
                                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
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
                          className="p-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar: Topics Filter & Ask Widget (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-20">
              <TopicsSidebar
                topics={topics}
                loading={topicsLoading}
                selectedTopic={selectedTopic}
                onTopicSelect={(topicId) => setSelectedTopic(topicId)}
                onAskQuestion={() => setIsAskModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onQuestionCreated={() => refetchQuestions()}
      />
    </div>
  );
}
