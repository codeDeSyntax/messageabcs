import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService, Question } from "@/services/api";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();

  const [answerFormData, setAnswerFormData] = useState<AnswerFormData>({
    content: "",
    isOfficial: true,
  });

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

  const toggleAnswerExpansion = (questionId: string) => {
    setExpandedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    setIsSubmitting(true);

    try {
      // Use the API to answer the question
      await apiService.addAnswer(selectedQuestion.id, answerFormData.content);

      // Refresh questions list
      fetchQuestions();

      toast({
        title: "Success",
        description: "Answer submitted successfully",
      });

      setIsAnswerModalOpen(false);
      setAnswerFormData({ content: "", isOfficial: true });
      setSelectedQuestion(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: "pending" | "answered" | "closed") => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "answered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: "pending" | "answered" | "closed") => {
    switch (status) {
      case "pending":
        return (
          <button
            className={`${GAME_BUTTON_SMALL.warning} text-xs px-3 py-1 cursor-default`}
          >
            Pending
          </button>
        );
      case "answered":
        return (
          <button
            className={`${GAME_BUTTON_SMALL.success} text-xs px-3 py-0 cursor-default`}
          >
            Answered
          </button>
        );
      case "closed":
        return (
          <button
            className={`${GAME_BUTTON_SMALL.danger} text-xs px-3 py-1 cursor-default`}
          >
            Closed
          </button>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-6">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">
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
        <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex flex-row md:flex-row gap-4">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions, topics, or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
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
                  <SelectTrigger className="w-full sm:w-40 bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
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
        <div className="space-y-6 pb-40">
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
                  {index < 4 && (
                    <div className="border-b border-border/20 mt-6"></div>
                  )}
                </div>
              ))
            : filteredQuestions.map((question, index) => (
                <div key={question.id}>
                  <div className="px-2 md:px-6 hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 rounded-lg">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(question.status)}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground mb-2 break-words">
                              {question.question}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{question.askedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(
                                    question.dateAsked
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <button
                                className={`${GAME_BUTTON_SMALL.primary} text-xs px-2  cursor-default`}
                              >
                                {question.topicTitle}
                              </button>
                            </div>
                          </div>
                        </div>

                        {question.answers.length > 0 && (
                          <div className="pl-7">
                            <button
                              onClick={() => toggleAnswerExpansion(question.id)}
                              className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-all duration-200 w-full text-left group"
                            >
                              <MessageSquare className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                              <span className="text-sm font-medium text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                {question.answers.length} Answer
                                {question.answers.length > 1 ? "s" : ""}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {expandedAnswers.has(question.id)
                                  ? "Click to hide"
                                  : "Click to view"}
                              </span>
                              <div className="ml-auto">
                                {expandedAnswers.has(question.id) ? (
                                  <ChevronUp className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transform transition-transform" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transform transition-transform" />
                                )}
                              </div>
                            </button>

                            {expandedAnswers.has(question.id) && (
                              <div className="space-y-2">
                                {question.answers.map((answer) => (
                                  <div
                                    key={answer.id}
                                    className="p-3 bg-blue-50/50 dark:bg-transparent rounded-lg border border-blue-500/10"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <MessageSquare className="h-4 w-4 text-blue-500" />
                                      <span className="text-sm font-medium text-foreground">
                                        {answer.adminUser}
                                      </span>
                                      <button
                                        className={`${GAME_BUTTON_SMALL.primary} text-xs px-2 py-1 cursor-default`}
                                      >
                                        Official
                                      </button>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(
                                          answer.dateAnswered
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className=" md:text-[15px] leading-normal text-black dark:text-blue-100">
                                      {answer.answer}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {question.answers.length === 0 && (
                          <div className="pl-7">
                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-500/20">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-700 dark:text-orange-300">
                                No answers yet - Needs attention
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 mt-2 lg:mt-0">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(question.status)}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {question.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setIsAnswerModalOpen(true);
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Answer Question
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                updateQuestionStatus(question.id, "pending")
                              }
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateQuestionStatus(question.id, "answered")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Answered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateQuestionStatus(question.id, "closed")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Close Question
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                        onClick={() =>
                          updateQuestionPriority(question.id, "high")
                        }
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        High Priority
                      </DropdownMenuItem> */}
                            {/* <DropdownMenuItem
                        onClick={() =>
                          updateQuestionPriority(question.id, "medium")
                        }
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Medium Priority
                      </DropdownMenuItem> */}
                            {/* <DropdownMenuItem
                        onClick={() =>
                          updateQuestionPriority(question.id, "low")
                        }
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Low Priority
                      </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  {/* Separator line between questions */}
                  {index < filteredQuestions.length - 1 && (
                    <div className="mt-6 border-b border-gray-200/20 dark:border-gray-700/20"></div>
                  )}
                </div>
              ))}
        </div>

        {!loading && filteredQuestions.length === 0 && (
          <div className="p-12 text-center bg-white/5 dark:bg-black/5 rounded-lg">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No questions found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filters"
                : "Questions will appear here when users ask them"}
            </p>
          </div>
        )}
      </div>

      {/* Answer Modal */}
      <Dialog open={isAnswerModalOpen} onOpenChange={setIsAnswerModalOpen}>
        <DialogContent className="max-w-2xl bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Answer Question
            </DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-foreground mb-2">
                  Question:
                </h4>
                <p className="text-muted-foreground">
                  {selectedQuestion.question}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>Asked by {selectedQuestion.askedBy}</span>
                  <span>•</span>
                  <span>{selectedQuestion.topicTitle}</span>
                </div>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="answer">Your Answer *</Label>
                  <Textarea
                    id="answer"
                    value={answerFormData.content}
                    onChange={(e) =>
                      setAnswerFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Provide a thoughtful, biblical answer..."
                    className="bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 min-h-[150px]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOfficial"
                    checked={answerFormData.isOfficial}
                    onChange={(e) =>
                      setAnswerFormData((prev) => ({
                        ...prev,
                        isOfficial: e.target.checked,
                      }))
                    }
                    className="rounded border-blue-500/20 text-blue-500 focus:ring-blue-500/30"
                  />
                  <Label htmlFor="isOfficial" className="text-sm">
                    Mark as official answer
                  </Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAnswerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsManager;
