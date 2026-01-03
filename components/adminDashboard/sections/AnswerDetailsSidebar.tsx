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
    <div className="fixed inset-y-0 right-0 z-50 w-full h-screen md:w-[500px] bg-stone-700 backdrop-blur-xl flex items-center justify-center border-l border-white/20 shadow-2xl overflow-hidden rounded-l-2xl">
      <div className="p-6 space-y-6 h-[95%] overflow-y-scroll no-scrollbar ">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/20">
          <h2 className="text-xl font-semibold text-stone-50">
            Answer Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/10 text-stone-100"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Question Context */}
        <div className="space-y-3">
          <div className="bg-stone-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-stone-200" />
              <span className="text-sm font-medium text-stone-300">
                Question
              </span>
            </div>
            <p className="text-base text-stone-100 font-medium">
              {answer.questionTitle}
            </p>
          </div>
        </div>

        {/* Answer Content */}
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(answer.status)}
              {getStatusBadge(answer.status)}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-stone-300 mb-3">
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
                className="border-stone-600 text-stone-200"
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
            <h4 className="font-semibold text-stone-50 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-stone-200" />
              Edit Answer
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar-answer" className="text-stone-200">
                  Answer Content *
                </Label>
                <Textarea
                  id="sidebar-answer"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Provide a thoughtful, biblical answer..."
                  className="bg-stone-800/50 border-stone-600 text-stone-100 placeholder:text-stone-400 focus:ring-2 focus:ring-primary/30 min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sidebar-isOfficial"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="rounded border-stone-600 bg-stone-800/50 text-primary focus:ring-primary/30"
                />
                <Label
                  htmlFor="sidebar-isOfficial"
                  className="text-sm text-stone-200"
                >
                  Mark as official answer
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-stone-600 text-stone-100 hover:bg-stone-800 hover:text-stone-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-accent text-primary-foreground"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* Status Actions */}
          <div className="space-y-2 pt-4 border-t border-white/20">
            <h4 className="font-semibold text-stone-50 text-sm mb-3">
              Status Actions
            </h4>
            {answer.status !== "published" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-stone-800/50 border-stone-600 text-stone-100 hover:bg-stone-800 hover:text-stone-50"
                onClick={() => onUpdateStatus(answer.id, "published")}
              >
                <CheckCircle className="h-4 w-4" />
                Publish Answer
              </Button>
            )}
            {answer.status !== "draft" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-stone-800/50 border-stone-600 text-stone-100 hover:bg-stone-800 hover:text-stone-50"
                onClick={() => onUpdateStatus(answer.id, "draft")}
              >
                <AlertCircle className="h-4 w-4" />
                Move to Draft
              </Button>
            )}
            {answer.status !== "archived" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-stone-800/50 border-stone-600 text-stone-100 hover:bg-stone-800 hover:text-stone-50"
                onClick={() => onUpdateStatus(answer.id, "archived")}
              >
                <AlertCircle className="h-4 w-4" />
                Archive Answer
              </Button>
            )}
          </div>

          {/* Delete Action */}
          <div className="pt-4 border-t border-white/20">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-red-900/20 border-red-900/50 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Answer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-stone-800 border-stone-600">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-stone-50">
                    Delete Answer
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-stone-300">
                    Are you sure you want to delete this answer? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-stone-600 text-stone-100 hover:bg-stone-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
  );
};

export default AnswerDetailsSidebar;
