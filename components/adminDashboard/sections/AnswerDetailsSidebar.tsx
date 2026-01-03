import React, { useState } from "react";
import {
  User,
  Calendar,
  XCircle,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface AnswerDetailsSidebarProps {
  answer: AdminAnswer;
  onClose: () => void;
  onUpdate: (
    answerId: string,
    content: string,
    isOfficial: boolean
  ) => Promise<void>;
  onUpdateStatus: (
    answerId: string,
    status: "published" | "draft" | "archived"
  ) => Promise<void>;
  onDelete: (answerId: string) => Promise<void>;
}

const AnswerDetailsSidebar: React.FC<AnswerDetailsSidebarProps> = ({
  answer,
  onClose,
  onUpdate,
  onUpdateStatus,
  onDelete,
}) => {
  const [answerContent, setAnswerContent] = useState(answer.content);
  const [isOfficial, setIsOfficial] = useState(answer.isOfficial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "draft":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "archived":
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(answer.id, answerContent, isOfficial);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(answer.id);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full h-screen md:w-[500px] bg-background rounded-l-2xl border-none border-border shadow-2xl overflow-hidden flex flex-col">
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-bold text-foreground">
            Answer Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <XCircle className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            scrollbarGutter: "stable",
            scrollbarColor: "hsl(var(--primary)) hsl(var(--muted))",
            scrollbarWidth: "thin",
          }}
        >
          <div className="space-y-6">
            {/* Question Context */}
            <div className="bg-cream-200 p-4 rounded-xl shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium text-muted-foreground">
                  Question
                </span>
              </div>
              <p className="text-base text-foreground font-medium">
                {answer.questionTitle}
              </p>
            </div>

            {/* Answer Content */}
            <div className="space-y-4">
          <div className="bg-cream-200 p-4 rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(answer.status)}
              {getStatusBadge(answer.status)}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{answer.answeredBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(answer.answeredAt).toLocaleDateString()}</span>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-background"
              >
                {answer.topicTitle}
              </Badge>
              {answer.isOfficial && (
                <Badge className="bg-primary text-primary-foreground">
                  Official
                </Badge>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4 pt-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Edit Answer
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar-answer" className="text-sm font-medium">
                  Answer Content *
                </Label>
                <Textarea
                  id="sidebar-answer"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Provide a thoughtful, biblical answer..."
                  className="bg-cream-200 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sidebar-isOfficial"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="rounded border-border bg-background text-primary focus:ring-primary/30"
                />
                <Label
                  htmlFor="sidebar-isOfficial"
                  className="text-sm text-foreground"
                >
                  Mark as official answer
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-accent text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* Status Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground text-sm mb-3">
              Status Actions
            </h4>
            {answer.status !== "published" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(answer.id, "published")}
              >
                <CheckCircle className="h-4 w-4" />
                Publish Answer
              </Button>
            )}
            {answer.status !== "draft" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(answer.id, "draft")}
              >
                <AlertCircle className="h-4 w-4" />
                Move to Draft
              </Button>
            )}
            {answer.status !== "archived" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(answer.id, "archived")}
              >
                <AlertCircle className="h-4 w-4" />
                Archive Answer
              </Button>
            )}
          </div>

          {/* Delete Action */}
          <div className="pt-4 border-t border-border">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Answer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background border-border rounded-2xl max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    Delete Answer
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Are you sure you want to delete this answer? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
};

export default AnswerDetailsSidebar;


 
