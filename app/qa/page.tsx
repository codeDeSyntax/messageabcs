"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { useQuestions, useTopics } from "@/hooks/queries";

// Import modular components
import { QASearchHeader } from "@/components/QA/components/QASearchHeader";
import { QuestionCard } from "@/components/QA/components/QuestionCard";
import { TopicsSidebar } from "@/components/QA/components/TopicsSidebar";

export default function QA() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(
    null
  );
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Use TanStack Query for data fetching
  const {
    data: questionsData,
    isLoading: questionsLoading,
    refetch: refetchQuestions,
  } = useQuestions({
    page: 1,
    limit: 20,
    search: searchQuery || undefined,
    topicId: selectedTopic || undefined,
  });

  const { data: topicsData, isLoading: topicsLoading } = useTopics({
    page: 1,
    limit: 50,
  });

  const questions = questionsData?.data || [];
  const topics = topicsData?.data || [];
  const loading = questionsLoading || topicsLoading;

  useEffect(() => {
    document.title = "Q & A - MessageABCs";
  }, []);

  // Auto-select first question on initial load only (not on mobile when user manually deselects)
  useEffect(() => {
    if (questions.length > 0 && !selectedQuestion && window.innerWidth >= 768) {
      setSelectedQuestion(questions[0]);
    }
  }, [questions]);

  const handleSearch = () => {
    // Query will automatically refetch when searchQuery changes
    refetchQuestions();
  };

  const handleQuestionCreated = () => {
    // Refresh the questions list when a new question is created
    refetchQuestions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* <AnimatedBackground /> */}

      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-background/30  z-10" />

      <div className="relative z-20 h-screen flex flex-col overflow-hidden">
        {/* Mobile Navigation Drawer */}
        <div className="md:hidden p-4 pb-2 flex items-center justify-between flex-shrink-0">
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
          <h1 className="text-xl font-bold text-foreground ">Q & A</h1>
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full mx-auto h-full overflow-hidden">
            {/* Horizontal scrollable container on mobile */}
            <div className="flex h-full overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory md:snap-none">
              {/* Left Side - Main Q&A Content (Takes most space) */}
              <div className="flex-none w-full md:flex-1 lg:w-2/3 xl:w-3/4 flex h-full bg-background/5 rounded-lg overflow-hidden snap-start">
                {/* Questions List Column */}
                <div
                  className={`w-full md:w-5/12 flex flex-col h-full md:border-r border-border ${
                    selectedQuestion ? "hidden md:flex" : "flex"
                  }`}
                >
                  {/* Q&A Header - Fixed */}
                  <div className="hidden md:flex items-center justify-between py-2 px-2 flex-shrink-0 border-b border-border bg-background/50">
                    <div className="flex-shrink-0">
                      <h1 className="text-xl lg:text-2xl font-bold text-foreground ">
                        Q & A
                      </h1>
                    </div>

                    {/* Centered top nav links (desktop) */}
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-1 lg:gap-3">
                        {(() => {
                          const baseItems = [
                            { label: "Home", path: "/" },
                            { label: "Topics", path: "/topics" },
                            { label: "Reading", path: "/reading" },
                            { label: "Q&A", path: "/qa" },
                          ];

                          if (isAuthenticated && user?.role === "admin") {
                            baseItems.push({
                              label: "Dashboard",
                              path: "/admin?direct=true",
                            });
                          }

                          return baseItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                              <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-150 ${
                                  isActive
                                    ? "bg-primary/20 text-primary"
                                    : "text-foreground hover:bg-background/40"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Right placeholder - keep spacing consistent on the right */}
                    <div className="w-28" />
                  </div>

                  {/* Search and Controls Section - Fixed */}
                  <QASearchHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    onAskQuestion={() => setIsAskModalOpen(true)}
                  />

                  {/* Questions Content - SCROLLABLE */}
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {loading ? (
                      <div className="space-y-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="p-3 border-b border-border">
                            <div className="animate-pulse space-y-2">
                              <div className="h-3 bg-muted/50 rounded w-3/4"></div>
                              <div className="h-2 bg-muted/50 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : questions.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageCircle className="h-12 w-12 mx-auto text-primary mb-3" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No questions yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Be the first to ask a question
                        </p>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-accent text-primary-foreground"
                          onClick={() => setIsAskModalOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ask Question
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {questions.map((question) => (
                          <div
                            key={question.id}
                            onClick={() => setSelectedQuestion(question)}
                            className={`p-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedQuestion?.id === question.id
                                ? "bg-muted border-l-4 border-l-primary"
                                : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                                  {question.question}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{question.askedBy || "Anonymous"}</span>
                                  <span>·</span>
                                  <span>{formatDate(question.dateAsked)}</span>
                                  {question.answers &&
                                    question.answers.length > 0 && (
                                      <>
                                        <span>·</span>
                                        <span className="text-green-600 font-medium">
                                          {question.answers.length} answer
                                          {question.answers.length !== 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </>
                                    )}
                                </div>
                              </div>
                              <MessageCircle
                                className={`h-4 w-4 flex-shrink-0 ${
                                  question.answers &&
                                  question.answers.length > 0
                                    ? "text-green-500"
                                    : "text-orange-500"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Detail Column */}
                <div
                  className={`w-full md:w-7/12 flex-col h-full bg-background ${
                    selectedQuestion ? "flex" : "hidden md:flex"
                  }`}
                >
                  {selectedQuestion ? (
                    <>
                      {/* Detail Header */}
                      <div className="p-4 border-b border-border">
                        {/* Mobile back button */}
                        <button
                          onClick={() => setSelectedQuestion(null)}
                          className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Back to questions
                        </button>
                        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                              {selectedQuestion.askedBy
                                ?.charAt(0)
                                .toUpperCase() || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {selectedQuestion.askedBy || "Anonymous"}
                          </span>
                          <span>·</span>
                          <span>{formatDate(selectedQuestion.dateAsked)}</span>
                          {selectedQuestion.topicTitle && (
                            <>
                              <span>·</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-0 h-5"
                              >
                                {selectedQuestion.topicTitle}
                              </Button>
                            </>
                          )}
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground leading-relaxed">
                          {selectedQuestion.question}
                        </h2>
                      </div>

                      {/* Detail Content - Scrollable */}
                      <div
                        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4"
                        style={{
                          scrollbarGutter: "stable",
                          scrollbarColor:
                            "hsl(var(--primary)) hsl(var(--muted))",
                          scrollbarWidth: "thin",
                        }}
                      >
                        {selectedQuestion.answers &&
                        selectedQuestion.answers.length > 0 ? (
                          selectedQuestion.answers.map(
                            (answer: any, index: number) => (
                              <div
                                key={index}
                                className="bg-green-50/30 rounded-lg p-3 md:p-4 border-l-4 border-green-500/50"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <Image
                                    src="/mabcs.png"
                                    alt="admin"
                                    width={24}
                                    height={24}
                                  />
                                  <div>
                                    <span className="font-medium text-green-700 text-sm">
                                      {answer.adminUser}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      answered {formatDate(answer.dateAnswered)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                  {answer.answer}
                                </p>
                              </div>
                            )
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageCircle className="h-12 w-12 text-orange-500 mb-3" />
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              Pending Answer
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              This question hasn't been answered yet
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center p-8">
                      <div>
                        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                          Select a question
                        </h3>
                        <p className="text-sm text-muted-foreground/70">
                          Choose a question from the list to view details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Divider */}
              {/* <div className="hidden lg:block w-px bg-gradient-to-b from-blue-500/20 via-blue-500/50 to-blue-500/20"></div> */}

              {/* Right Side - Topics Sidebar */}
              <TopicsSidebar
                topics={topics}
                loading={loading}
                selectedTopic={selectedTopic}
                onTopicSelect={setSelectedTopic}
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation removed: top nav links are rendered in the desktop header */}
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onQuestionCreated={handleQuestionCreated}
      />
    </div>
  );
}
