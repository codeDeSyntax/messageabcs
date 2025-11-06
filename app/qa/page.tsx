"use client";

import { Button } from "@/components/ui/button";
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
      <div className="absolute inset-0 bg-blue-50 dark:bg-black/10  z-10" />

      <div className="relative z-20 h-screen flex flex-col overflow-hidden">
        {/* Mobile Navigation Drawer */}
        <div className="md:hidden p-6 pb-2 flex items-center justify-between flex-shrink-0">
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
          <h1 className="text-2xl font-bold text-foreground font-heading mb-2">
            Q & A
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full mx-auto h-full overflow-hidden">
            <div className="flex h-full">
              {/* Left Side - Main Q&A Content (Takes most space) */}
              <div className="flex-1 lg:w-2/3 xl:w-3/4 flex flex-col h-full bg-white/5 dark:bg-black/5 rounded-lg overflow-hidden">
                {/* Q&A Header - Fixed */}
                <div className="hidden md:flex items-center justify-between  py-2 px-2 flex-shrink-0 border-b border-gray-200/10 bg-white/50 dark:bg-black/10">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-heading ">
                      Q & A
                    </h1>
                  </div>

                  {/* Centered top nav links (desktop) */}
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-3">
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
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                isActive
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-blue-50/40 dark:hover:bg-blue-900/20"
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
                <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                  {loading ? (
                    <div className="space-y-6">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="p-6 hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 rounded-lg"
                        >
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300/50 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-300/50 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="md:p-12 text-center">
                      <MessageCircle className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No questions yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Be the first to ask a question about biblical topics
                      </p>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setIsAskModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ask the First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="sp">
                      {questions.map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          formatDate={formatDate}
                        />
                      ))}
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
