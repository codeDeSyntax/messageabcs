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
    isOfficial: boolean,
  ) => Promise<void>;
  onUpdateStatus: (
    answerId: string,
    status: "published" | "draft" | "archived",
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full bg-background shadow-2xl overflow-hidden flex flex-col max-w-5xl">
        <div className="h-full  md:w-[80%]  m-auto flex flex-col ">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-background shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Answer Details
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted/50 rounded-md p-2 transition-colors"
            >
              <XCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>

          {/* Content Area */}
          <div
            className="flex-1 overflow-y-auto bg-muted/20"
            style={{
              scrollbarGutter: "stable",
              scrollbarColor: "hsl(var(--primary)) hsl(var(--muted))",
              scrollbarWidth: "thin",
            }}
          >
            {/* Receipt-style Details */}
            <div className="bg-background px-6 py-6 font-mono">
              <div className="max-w-md space-y-3 text-sm">
                {/* Question */}
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Question
                  </div>
                  <div className="text-foreground font-medium">
                    {answer.questionTitle}
                  </div>
                </div>

                <div className="border-t border-dashed border-border/40 my-3"></div>

                {/* Status & Official */}
                <div className="flex gap-4">
                  <div className="text-foreground font-semibold uppercase text-xs">
                    {answer.status}
                  </div>
                  {answer.isOfficial && (
                    <div className="text-foreground font-semibold uppercase text-xs">
                      Official
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed border-border/40 my-3"></div>

                {/* User */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    User
                  </div>
                  <div className="text-foreground">{answer.answeredBy}</div>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Date
                  </div>
                  <div className="text-foreground">
                    {new Date(answer.answeredAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Topic */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Topic
                  </div>
                  <div className="text-foreground text-right max-w-[60%]">
                    {answer.topicTitle}
                  </div>
                </div>

                <div className="border-t border-dashed border-border/40 my-3"></div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-background px-6 py-5 font-mono">
              <div className="">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                  Edit Answer
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sidebar-answer"
                      className="text-xs text-muted-foreground uppercase tracking-wider font-mono"
                    >
                      Answer Content *
                    </Label>
                    <Textarea
                      id="sidebar-answer"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Provide a thoughtful, biblical answer..."
                      className="bg-cream-200/50 rounded border border-dashed border-border/40 focus:border-border focus:ring-1 focus:ring-primary/20 transition-all min-h-[200px] text-sm font-sans no-scrollbar"
                      required
                    />
                  </div>

                  <div className="border-t border-dashed border-border/40 pt-3">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="sidebar-isOfficial"
                        checked={isOfficial}
                        onChange={(e) => setIsOfficial(e.target.checked)}
                        className="mt-0.5 rounded border-border bg-background text-primary focus:ring-primary/30"
                      />
                      <Label
                        htmlFor="sidebar-isOfficial"
                        className="text-xs text-foreground cursor-pointer font-mono uppercase tracking-wide"
                      >
                        Mark as official
                      </Label>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-border/40 pt-4">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border border-dashed border-border/60 bg-background hover:bg-muted/30 font-mono text-xs uppercase tracking-wide"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-mono text-xs uppercase tracking-wide border border-foreground"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-background px-6 py-5 font-mono">
              <div className="max-w-md">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Status Actions
                </div>
                <div className="space-y-1">
                  {answer.status !== "published" && (
                    <button
                      onClick={() => onUpdateStatus(answer.id, "published")}
                      className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                    >
                      → Publish Answer
                    </button>
                  )}
                  {answer.status !== "draft" && (
                    <button
                      onClick={() => onUpdateStatus(answer.id, "draft")}
                      className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                    >
                      → Move to Draft
                    </button>
                  )}
                  {answer.status !== "archived" && (
                    <button
                      onClick={() => onUpdateStatus(answer.id, "archived")}
                      className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                    >
                      → Archive Answer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Action */}
            <div className="bg-background px-6 py-5 font-mono">
              <div className="max-w-md">
                <div className="border-t border-dashed border-border/40 pt-4 mb-3"></div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Danger Zone
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-sans">
                  Deleting this answer is permanent and cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-red-600 hover:text-red-700 transition-colors border-b border-dashed border-red-300 hover:border-red-500">
                      × Delete Answer
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-background border border-dashed border-border/60 shadow-2xl rounded-none max-w-[90vw] sm:max-w-md font-mono">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground uppercase text-sm tracking-wide">
                        Delete Answer
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-xs font-sans">
                        Are you sure you want to delete this answer? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="border border-dashed border-border/60 rounded-none text-xs uppercase tracking-wide">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-none border border-red-600 text-xs uppercase tracking-wide"
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
    </>
  );
};

export default AnswerDetailsSidebar;
