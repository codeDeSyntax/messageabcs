import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
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
import { apiService } from "@/services/api";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";

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
  const [answers, setAnswers] = useState<AdminAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");
  const [filterType, setFilterType] = useState<
    "all" | "official" | "community"
  >("all");
  const [editingAnswer, setEditingAnswer] = useState<AdminAnswer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [answerFormData, setAnswerFormData] = useState<AnswerFormData>({
    content: "",
    isOfficial: false,
    status: "published",
  });

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
          answer.answeredBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((answer) => answer.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((answer) =>
        filterType === "official" ? answer.isOfficial : !answer.isOfficial
      );
    }

    return filtered;
  }, [answers, searchTerm, filterStatus, filterType]);

  const handleEdit = (answer: AdminAnswer) => {
    setEditingAnswer(answer);
    setAnswerFormData({
      content: answer.content,
      isOfficial: answer.isOfficial,
      status: answer.status === "archived" ? "published" : answer.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnswer) return;

    setIsSubmitting(true);

    try {
      // Call the update answer API
      const response = await apiService.adminUpdateAnswer(
        editingAnswer.questionId,
        editingAnswer.id,
        answerFormData.content
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Answer updated successfully",
        });

        // Refresh the answers list
        await fetchAnswers();
        setIsEditModalOpen(false);
        resetForm();
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
    } finally {
      setIsSubmitting(false);
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
        title: "Success",
        description: `Answer ${newStatus} successfully`,
      });
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnswers((prev) => prev.filter((answer) => answer.id !== answerId));
      toast({
        title: "Success",
        description: "Answer deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setAnswerFormData({
      content: "",
      isOfficial: false,
      status: "published",
    });
    setEditingAnswer(null);
  };

  const getStatusBadge = (status: AdminAnswer["status"]) => {
    switch (status) {
      case "published":
        return <button className={GAME_BUTTON_SMALL.success}>Published</button>;
      case "draft":
        return <button className={GAME_BUTTON_SMALL.warning}>Draft</button>;
      case "archived":
        return (
          <button className={GAME_BUTTON_SMALL.secondary}>Archived</button>
        );
    }
  };

  const getStatusIcon = (status: AdminAnswer["status"]) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Answers Management
              </h2>
              <p className="text-muted-foreground">
                Edit, manage, and moderate community answers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
              >
                {answers.filter((a) => a.status === "published").length}{" "}
                Published
              </Badge>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                {answers.filter((a) => a.status === "draft").length} Drafts
              </Badge>
            </div>
          </div> */}

          {/* Filters */}
          <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-none border-blue-500/20">
            <CardContent className="p-2 border-none">
              <div className="flex flex-row md:flex-row gap-4">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search answers, questions, or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50 border-none rounded-full border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={filterType}
                    onValueChange={(value) =>
                      setFilterType(value as typeof filterType)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-40 bg-background/50 border-none rounded-full border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
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
          <div className="md:space-y-6 pb-40">
            {filteredAnswers.map((answer, index) => (
              <div key={`${answer.questionId}-${answer.id}`}>
                <div className="relative px-2 md:px-6 hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 rounded-lg">
                  {/* Mobile: Three dots in top-right corner */}
                  <div className="absolute top-2 right-2 z-10 md:hidden"></div>

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-start gap-3">
                        {/* {getStatusIcon(answer.status)} */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <mark className="text-lg bg-transparent  font-semibold text-black dark:text-blue-50 break-words">
                              Question: {answer.questionTitle}
                            </mark>
                          </div>
                          <div className="p-4 bg-transparent rounded-lg border border-blue-500/10 mb-3">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-foreground">
                                  Answer:
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-transparent hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(answer)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Answer
                                  </DropdownMenuItem>
                                  {answer.status !== "published" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateAnswerStatus(
                                          answer.id,
                                          "published"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Publish
                                    </DropdownMenuItem>
                                  )}

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Answer
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this
                                          answer? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            deleteAnswer(answer.id)
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="md:text-[15px]  dark:text-blue-100 text-black line-clamp-3 break-words">
                              {answer.content}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{answer.answeredBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  answer.answeredAt
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <Badge
                              variant="outline"
                              className=" game-nav-button  text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                            >
                              {answer.topicTitle}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Three dots in the side/bottom area */}
                    <div className="hidden md:flex flex-row lg:flex-col items-start lg:items-end gap-2 mt-2 lg:mt-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(answer)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Answer
                          </DropdownMenuItem>
                          {answer.status !== "published" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateAnswerStatus(answer.id, "published")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {answer.status !== "draft" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateAnswerStatus(answer.id, "draft")
                              }
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Move to Draft
                            </DropdownMenuItem>
                          )}
                          {answer.status !== "archived" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateAnswerStatus(answer.id, "archived")
                              }
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Answer
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this answer?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAnswer(answer.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                {index < filteredAnswers.length - 1 && (
                  <div className="border-b border-border/20 mt-6"></div>
                )}
              </div>
            ))}

            {filteredAnswers.length === 0 && (
              <div className="p-12 text-center bg-white/5 dark:bg-black/5 rounded-lg">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No answers found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Answers will appear here when they are created"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Answer Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl bg-white focus:ring-blue-500 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Edit Answer
            </DialogTitle>
          </DialogHeader>
          {editingAnswer && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-foreground mb-2">
                  Question:
                </h4>
                <p className="text-muted-foreground">
                  {editingAnswer.questionTitle}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>Topic: {editingAnswer.topicTitle}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Answer Content *</Label>
                  <Textarea
                    id="content"
                    value={answerFormData.content}
                    onChange={(e) =>
                      setAnswerFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Provide a thoughtful, biblical answer..."
                    className="bg-background/50 text-base focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 border-blue-500/20  focus:ring-blue-500/30 focus:border-blue-500 min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={answerFormData.status}
                      onValueChange={(value) =>
                        setAnswerFormData((prev) => ({
                          ...prev,
                          status: value as "published" | "draft",
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
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
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSubmitting ? "Updating..." : "Update Answer"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnswersManager;
