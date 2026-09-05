import React, { useState, useEffect } from "react";
import { MessageCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminDashboard } from "@/contexts/AdminDashboardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService, Question } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import QuestionListItem from "./QuestionListItem";
import QuestionDetailsSidebar from "./QuestionDetailsSidebar";

type AdminQuestion = Question & {
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  views: number;
};

interface AnswerFormData {
  content: string;
  isOfficial: boolean;
}

const QuestionsManager: React.FC = () => {
  const { searchTerm, setSearchTerm } = useAdminDashboard();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "answered" | "closed"
  >("all");
  const [selectedQuestion, setSelectedQuestion] =
    useState<AdminQuestion | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        const adminQuestions = response.data.map((q) => ({
          ...q,
          status: (q.answers && q.answers.length > 0
            ? "answered"
            : "pending") as "pending" | "answered" | "closed",
          priority: "medium" as "low" | "medium" | "high",
          views: 0,
        }));
        setQuestions(adminQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = React.useMemo(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(
        (question) =>
          question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.topicTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.askedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (question) => question.status === filterStatus
      );
    }

    return filtered;
  }, [questions, searchTerm, filterStatus]);

  const handleQuestionClick = (question: AdminQuestion) => {
    setSelectedQuestion(question);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedQuestion(null);
  };

  const handleSubmitAnswer = async (answerData: AnswerFormData) => {
    if (!selectedQuestion) return;

    try {
      const response = await apiService.addAnswer(
        selectedQuestion.id.toString(),
        answerData.content
      );

      if (response.success) {
        toast({
          title: "Answer Published",
          description: "Your biblical answer has been recorded successfully.",
        });
        await fetchQuestions();
        handleCloseSidebar();
      } else {
        toast({
          title: "Failed to Publish Answer",
          description: response.error || "An error occurred while saving your answer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to publish answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuestionStatus = async (
    questionId: string,
    newStatus: "pending" | "answered" | "closed"
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id.toString() === questionId ? { ...q, status: newStatus } : q))
    );
    if (selectedQuestion && selectedQuestion.id.toString() === questionId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast({
      title: "Status Updated",
      description: `Question marked as ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-4 max-w-4xl pb-16">
      {/* Section Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
          Questions Management
        </h2>
        <p className="text-xs md:text-sm text-[var(--theme-text-secondary)] mt-0.5">
          Review community questions, provide answers, and manage question statuses
        </p>
      </div>

      {/* Main Space Search & Filter Bar - Borderless */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--theme-text-secondary)]/70 z-10" />
          <Input
            placeholder="Search questions by keyword, topic, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-2xl border-0 bg-[var(--theme-surface)] text-sm placeholder:text-[var(--theme-text-secondary)]/60 focus:bg-[var(--theme-surface-subtle)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-all shadow-none w-full text-[var(--theme-text-primary)]"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
        >
          <SelectTrigger className="w-full sm:w-40 bg-[var(--theme-surface)] border-0 rounded-2xl text-xs font-medium text-[var(--theme-text-dark)] h-10 shadow-none">
            <Filter className="h-3.5 w-3.5 mr-2 text-[var(--theme-text-secondary)]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--theme-canvas)] border-0 rounded-xl shadow-lg">
            <SelectItem value="all">All Questions</SelectItem>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="answered">Answered Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Google Settings Style Grouped Container - Borderless, Canvas Integrated */}
      <div className="rounded-2xl overflow-hidden divide-y divide-[var(--theme-border-subtle)]/60">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-[var(--theme-text-secondary)] text-sm">
            No questions found matching your search.
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionListItem
              key={question.id}
              question={question}
              onClick={handleQuestionClick}
            />
          ))
        )}
      </div>

      {/* Question Details Sidebar Drawer */}
      {sidebarOpen && selectedQuestion && (
        <QuestionDetailsSidebar
          question={selectedQuestion}
          onClose={handleCloseSidebar}
          onSubmitAnswer={handleSubmitAnswer}
          onUpdateStatus={updateQuestionStatus}
        />
      )}
    </div>
  );
};

export default QuestionsManager;
