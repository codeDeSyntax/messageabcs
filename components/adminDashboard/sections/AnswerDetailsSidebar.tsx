"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Archive,
  BookOpen,
  Send,
  Loader2,
  Trash2,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onUpdate(answer.id, answerContent.trim(), isOfficial);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "published" | "draft" | "archived",
  ) => {
    if (newStatus === answer.status || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(answer.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(answer.id);
    handleClose();
  };

  const formattedDate = answer.answeredAt
    ? new Date(answer.answeredAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Slide-over Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-lg bg-background border-l border-border/80 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out font-sans ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-14 px-4 sm:px-5 border-b border-border/60 flex items-center justify-between flex-shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground font-serif tracking-tight">
              Answer Details
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3.5 slim-scrollbar">
          {/* Question & Author Context Box */}
          <div className="bg-muted/30 border border-border/70 rounded-xl p-3 sm:p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Avatar className="h-4.5 w-4.5 flex-shrink-0">
                  <AvatarFallback className="text-[8.5px] font-bold bg-primary/15 text-primary">
                    {answer.answeredBy?.charAt(0).toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground text-xs">
                  {answer.answeredBy || "Official Staff"}
                </span>
                {formattedDate && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                      <Clock className="h-3 w-3 text-muted-foreground/60" />
                      {formattedDate}
                    </span>
                  </>
                )}
              </div>

              {answer.topicTitle && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full text-[10.5px] truncate max-w-[150px]">
                  <BookOpen className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">{answer.topicTitle}</span>
                </span>
              )}
            </div>

            {/* Target Question */}
            {answer.questionTitle && (
              <div className="pt-1">
                <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">
                  Question
                </span>
                <p className="font-serif text-sm sm:text-[15px] font-medium text-foreground leading-snug">
                  {answer.questionTitle}
                </p>
              </div>
            )}

            {/* Status Segmented Switcher */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-muted-foreground">
                Status:
              </span>
              <div className="flex items-center gap-1 bg-background/90 p-0.5 rounded-lg border border-border/60 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleStatusChange("published")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    answer.status === "published"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Published</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("draft")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    answer.status === "draft"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("archived")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    answer.status === "archived"
                      ? "bg-muted text-muted-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Archive className="h-3 w-3" />
                  <span>Archived</span>
                </button>
              </div>
            </div>
          </div>

          {/* Edit Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label
                htmlFor="sidebar-answer"
                className="text-xs font-semibold text-foreground flex items-center justify-between"
              >
                <span>Edit Answer Content *</span>
                <span className="text-[10.5px] font-normal text-muted-foreground">
                  {answerContent.length} chars
                </span>
              </Label>
              <Textarea
                id="sidebar-answer"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Provide a biblical answer..."
                className="bg-muted/40 border-border/70 min-h-[110px] text-xs sm:text-[13px] rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="sidebar-isOfficial"
                className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <input
                  type="checkbox"
                  id="sidebar-isOfficial"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="rounded border-border bg-background text-primary focus:ring-primary/30 h-3.5 w-3.5"
                />
                <span className="text-xs font-medium">
                  Mark as official response
                </span>
              </label>
            </div>

            {/* Action Buttons & Danger Zone */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/60">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background border border-border/70 rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-md p-5 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground text-base font-semibold">
                      Delete Answer?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-xs">
                      Are you sure you want to delete this answer? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 pt-2">
                    <AlertDialogCancel className="rounded-xl text-xs h-8">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl text-xs h-8"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-8 px-3.5 text-xs rounded-xl border-border/70 hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !answerContent.trim()}
                  className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
};

export default AnswerDetailsSidebar;
