import React, { useState, useEffect } from "react";
import { MessageCircle, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

// Backend Question model with admin-specific fields
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
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "answered" | "closed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [selectedQuestion, setSelectedQuestion] =
    useState<AdminQuestion | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Load questions from API
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
        // Transform public Question data to AdminQuestion format
        const adminQuestions = response.data.map((q) => ({
          ...q,
          status: (q.answers && q.answers.length > 0
            ? "answered"
            : "pending") as "pending" | "answered" | "closed",
          priority: "medium" as "low" | "medium" | "high", // Default priority
          views: 0, // Default views since not tracked
        }));
        setQuestions(adminQuestions);
      } else {
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to questions
  const filteredQuestions = React.useMemo(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(
        (question) =>
          question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.topicTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          question.askedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (question) => question.status === filterStatus
      );
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(
        (question) => question.priority === filterPriority
      );
    }

    return filtered;
  }, [questions, searchTerm, filterStatus, filterPriority]);

  const handleQuestionClick = (question: AdminQuestion) => {
    setSelectedQuestion(question);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedQuestion(null);
  };

  const updateQuestionStatus = async (
    questionId: string,
    newStatus: "pending" | "answered" | "closed"
  ) => {
    try {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === questionId
            ? { ...question, status: newStatus }
            : question
        )
      );

      toast({
        title: "Success",
        description: `Question marked as ${newStatus}`,
      });

      // Close sidebar and refresh
      setSidebarOpen(false);
      setSelectedQuestion(null);
      await fetchQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question status",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAnswer = async (content: string, isOfficial: boolean) => {
    if (!selectedQuestion) return;

    try {
      await apiService.addAnswer(selectedQuestion.id, content);

      toast({
        title: "Success",
        description: "Answer submitted successfully",
      });

      await fetchQuestions();
      setSidebarOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrnk-0 space-y-6 pb-6">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl  font-bold text-foreground">
              Questions Management
            </h2>
            <p className="text-muted-foreground">
              Review and answer community questions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`${GAME_BUTTON_SMALL.warning} text-xs px-3 py-1 cursor-default`}
            >
              {questions.filter((q) => q.status === "pending").length} Pending
            </button>
            <button
              className={`${GAME_BUTTON_SMALL.success} text-xs px-3 py-1 cursor-default`}
            >
              {questions.filter((q) => q.status === "answered").length} Answered
            </button>
          </div>
        </div> */}

        {/* Filters */}
        <Card className="bg-background/20 backdrop-blur-sm border-none w-full">
          <CardContent className="p-4">
            <div className="flex flex-row md:flex-row gap-4">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions, topics, or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-primary/15 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(value as typeof filterStatus)
                  }
                >
                  <SelectTrigger className="w-full sm:w-40 bg-primary/15 focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Questions List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="pb-20 md:pb-40 flex flex-col items-start justify-center gap-0.5 md:gap-1">
          {loading
            ? // Loading Skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-14" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                  {index < 4 && <div className="bg-primary/6 mt-6 h-px"></div>}
                </div>
              ))
            : filteredQuestions.map((question, index) => (
                <QuestionListItem
                  key={question.id}
                  question={question}
                  onClick={handleQuestionClick}
                  showDivider={index < filteredQuestions.length - 1}
                />
              ))}
        </div>
      </div>

      {/* Question Details Sidebar */}
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
