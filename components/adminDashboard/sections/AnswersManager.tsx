import React, { useState, useEffect } from "react";
import { Search, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// Backend Answer model from admin endpoint
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
  const { searchTerm } = useAdminDashboard();
  const [answers, setAnswers] = useState<AdminAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");
  const [filterType, setFilterType] = useState<
    "all" | "official" | "community"
  >("all");
  const [selectedAnswer, setSelectedAnswer] = useState<AdminAnswer | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Load answers from API
  useEffect(() => {
    fetchAnswers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        // Transform questions with answers to AdminAnswer format
        const allAnswers: AdminAnswer[] = [];
        response.data.forEach((question) => {
          question.answers?.forEach((answer) => {
            allAnswers.push({
              id: answer.id,
              content: answer.answer,
              questionId: question.id,
              questionTitle: question.question,
              topicTitle: question.topicTitle || `Topic ${question.topicId}`,
              answeredBy: answer.adminUser,
              answeredAt: answer.dateAnswered,
              isOfficial: true, // Assume admin answers are official
              status: "published" as const,
              upvotes: 0, // Default values since not in backend
              downvotes: 0,
              views: 0,
            });
          });
        });
        setAnswers(allAnswers);
      } else {
        toast({
          title: "Error",
          description: "Failed to load answers",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      toast({
        title: "Error",
        description: "Failed to load answers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to answers
  const filteredAnswers = React.useMemo(() => {
    let filtered = answers;

    if (searchTerm) {
      filtered = filtered.filter(
        (answer) =>
          answer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          answer.questionTitle
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          answer.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          answer.answeredBy.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((answer) => answer.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((answer) =>
        filterType === "official" ? answer.isOfficial : !answer.isOfficial,
      );
    }

    return filtered;
  }, [answers, searchTerm, filterStatus, filterType]);

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
    isOfficial: boolean,
  ) => {
    const answer = answers.find((a) => a.id === answerId);
    if (!answer) return;

    try {
      const response = await apiService.adminUpdateAnswer(
        answer.questionId,
        answerId,
        content,
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Answer updated successfully",
        });

        await fetchAnswers();
        setSidebarOpen(false);
        setSelectedAnswer(null);
      } else {
        throw new Error(response.error || "Failed to update answer");
      }
    } catch (error) {
      console.error("Error updating answer:", error);
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
    newStatus: "published" | "draft" | "archived",
  ) => {
    try {
      setAnswers((prev) =>
        prev.map((answer) =>
          answer.id === answerId ? { ...answer, status: newStatus } : answer,
        ),
      );

      toast({
        title: "Success",
        description: `Answer ${newStatus} successfully`,
      });

      setSidebarOpen(false);
      setSelectedAnswer(null);
      await fetchAnswers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update answer status",
        variant: "destructive",
      });
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnswers((prev) => prev.filter((answer) => answer.id !== answerId));
      toast({
        title: "Success",
        description: "Answer deleted successfully",
      });

      setSidebarOpen(false);
      setSelectedAnswer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 space-y-6 pb-6">
          {/* Header */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl  font-bold text-foreground">
                Answers Management
              </h2>
              <p className="text-muted-foreground">
                Edit, manage, and moderate community answers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {answers.filter((a) => a.status === "published").length}{" "}
                Published
              </Badge>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                {answers.filter((a) => a.status === "draft").length} Drafts
              </Badge>
            </div>
          </div> */}

          {/* Filters */}
          <Card className="bg-background/20 backdrop-blur-sm border-none">
            <CardContent className="p-2 border-none">
              <div className="flex flex-row md:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={filterType}
                    onValueChange={(value) =>
                      setFilterType(value as typeof filterType)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-40 bg-primary/15 rounded-full focus:ring-2 focus:ring-primary/30 focus:border-primary">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="official">Official</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scrollable Answers List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="pb-20 md:pb-40 flex flex-col items-start justify-center gap-0.5 md:gap-1 px-2 md:px-0">
            {loading
              ? // Loading Skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="w-full px-2 md:px-4 py-2 md:py-3"
                  >
                    <div className="flex items-start justify-between gap-3 p-3 bg-primary/5 rounded-xl border border-border/20">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-4/5" />
                            <div className="p-2 md:p-3 bg-background/50 rounded-lg border border-border/10">
                              <Skeleton className="h-16 w-full rounded-md" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                              <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : filteredAnswers.map((answer, index) => (
                  <AnswerListItem
                    key={`${answer.questionId}-${answer.id}`}
                    answer={answer}
                    onClick={handleAnswerClick}
                    showDivider={index < filteredAnswers.length - 1}
                  />
                ))}
          </div>
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
    </>
  );
};

export default AnswersManager;
