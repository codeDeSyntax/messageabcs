import React, { useState, useEffect } from "react";
import { MessageSquare, Search, Filter } from "lucide-react";
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
import { apiService } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import AnswerListItem from "./AnswerListItem";
import AnswerDetailsSidebar from "./AnswerDetailsSidebar";

interface AdminAnswer {
  id: string;
  content: string;
  questionId: string;
  questionTitle: string;
  topicTitle: string;
  answeredBy: string;
  answeredAt: string;
  isOfficial: boolean;
  status: "published" | "draft" | "archived";
  upvotes: number;
  downvotes: number;
  views: number;
}

interface AnswerFormData {
  content: string;
  isOfficial: boolean;
  status: "published" | "draft";
}

const AnswersManager: React.FC = () => {
  const { searchTerm, setSearchTerm } = useAdminDashboard();
  const [answers, setAnswers] = useState<AdminAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<
    "all" | "official" | "community"
  >("all");
  const [selectedAnswer, setSelectedAnswer] = useState<AdminAnswer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnswers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions({
        page: 1,
        limit: 100,
      });

      if (response.success && response.data) {
        const allAnswers: AdminAnswer[] = [];
        response.data.forEach((question) => {
          question.answers?.forEach((answer) => {
            allAnswers.push({
              id: answer.id,
              content: answer.answer,
              questionId: question.id,
              questionTitle: question.question,
              topicTitle: question.topicTitle || `Topic ${question.topicId}`,
              answeredBy: answer.adminUser || "Official Staff",
              answeredAt: answer.dateAnswered,
              isOfficial: true,
              status: "published" as const,
              upvotes: 0,
              downvotes: 0,
              views: 0,
            });
          });
        });
        setAnswers(allAnswers);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnswers = React.useMemo(() => {
    let filtered = answers;

    if (searchTerm) {
      filtered = filtered.filter(
        (answer) =>
          answer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          answer.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          answer.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          answer.answeredBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((answer) =>
        filterType === "official" ? answer.isOfficial : !answer.isOfficial
      );
    }

    return filtered;
  }, [answers, searchTerm, filterType]);

  const handleAnswerClick = (answer: AdminAnswer) => {
    setSelectedAnswer(answer);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedAnswer(null);
  };

  const handleUpdateAnswer = async (
    answerId: string,
    content: string,
    isOfficial: boolean
  ) => {
    if (!selectedAnswer) return;
    try {
      const response = await apiService.updateAnswer(
        selectedAnswer.questionId,
        answerId,
        content
      );
      if (response.success) {
        toast({
          title: "Answer Updated",
          description: "Your edits have been saved successfully.",
        });
        setSidebarOpen(false);
        setSelectedAnswer(null);
        await fetchAnswers();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update answer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update answer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update answer",
        variant: "destructive",
      });
    }
  };

  const updateAnswerStatus = async (
    answerId: string,
    newStatus: "published" | "draft" | "archived"
  ) => {
    try {
      setAnswers((prev) =>
        prev.map((answer) =>
          answer.id === answerId ? { ...answer, status: newStatus } : answer
        )
      );
      toast({
        title: "Status Updated",
        description: `Answer ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    if (!selectedAnswer) return;
    try {
      const response = await apiService.deleteAnswer(
        selectedAnswer.questionId,
        answerId
      );
      if (response.success) {
        toast({
          title: "Deleted",
          description: "Answer deleted successfully.",
        });
        setSidebarOpen(false);
        setSelectedAnswer(null);
        await fetchAnswers();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete answer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete answer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete answer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 max-w-4xl pb-16">
      {/* Section Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
          Answers Management
        </h2>
        <p className="text-xs md:text-sm text-[var(--theme-text-secondary)] mt-0.5">
          Inspect, edit, and moderate published biblical answers
        </p>
      </div>

      {/* Main Space Search & Filter Bar - Borderless */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--theme-text-secondary)]/70 z-10" />
          <Input
            placeholder="Search answers by text, question, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-2xl border-0 bg-[var(--theme-surface)] text-sm placeholder:text-[var(--theme-text-secondary)]/60 focus:bg-[var(--theme-surface-subtle)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-all shadow-none w-full text-[var(--theme-text-primary)]"
          />
        </div>

        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as typeof filterType)}
        >
          <SelectTrigger className="w-full sm:w-40 bg-[var(--theme-surface)] border-0 rounded-2xl text-xs font-medium text-[var(--theme-text-dark)] h-10 shadow-none">
            <Filter className="h-3.5 w-3.5 mr-2 text-[var(--theme-text-secondary)]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--theme-canvas)] border-0 rounded-xl shadow-lg">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="official">Official Staff</SelectItem>
            <SelectItem value="community">Community</SelectItem>
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
        ) : filteredAnswers.length === 0 ? (
          <div className="p-8 text-center text-[var(--theme-text-secondary)] text-sm">
            No answers found matching your search.
          </div>
        ) : (
          filteredAnswers.map((answer) => (
            <AnswerListItem
              key={`${answer.questionId}-${answer.id}`}
              answer={answer}
              onClick={handleAnswerClick}
            />
          ))
        )}
      </div>

      {/* Answer Details Sidebar */}
      {sidebarOpen && selectedAnswer && (
        <AnswerDetailsSidebar
          answer={selectedAnswer}
          onClose={handleCloseSidebar}
          onUpdate={handleUpdateAnswer}
          onUpdateStatus={updateAnswerStatus}
          onDelete={deleteAnswer}
        />
      )}
    </div>
  );
};

export default AnswersManager;
