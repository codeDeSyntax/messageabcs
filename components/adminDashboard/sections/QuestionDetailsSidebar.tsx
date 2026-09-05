"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  Send,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Question } from "@/services/api";

type AdminQuestion = Question & {
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  views: number;
};

interface QuestionDetailsSidebarProps {
  question: AdminQuestion;
  onClose: () => void;
  onSubmitAnswer: (answerData: {
    content: string;
    isOfficial: boolean;
  }) => Promise<void>;
  onUpdateStatus: (
    questionId: string,
    status: "pending" | "answered" | "closed",
  ) => Promise<void>;
}

const QuestionDetailsSidebar: React.FC<QuestionDetailsSidebarProps> = ({
  question,
  onClose,
  onSubmitAnswer,
  onUpdateStatus,
}) => {
  const [answerContent, setAnswerContent] = useState("");
  const [isOfficial, setIsOfficial] = useState(true);
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
      await onSubmitAnswer({ content: answerContent.trim(), isOfficial });
      setAnswerContent("");
      setIsOfficial(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "pending" | "answered" | "closed",
  ) => {
    if (newStatus === question.status || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(question.id.toString(), newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formattedDate = question.dateAsked
    ? new Date(question.dateAsked).toLocaleDateString("en-US", {
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
              Question Details
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
          {/* Question Summary Box */}
          <div className="bg-muted/30 border border-border/70 rounded-xl p-3 sm:p-3.5 space-y-2.5">
            {/* Meta bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Avatar className="h-4.5 w-4.5 flex-shrink-0">
                  <AvatarFallback className="text-[8.5px] font-bold bg-primary/15 text-primary">
                    {question.askedBy?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground text-xs">
                  {question.askedBy || "Anonymous"}
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

              {question.topicTitle && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full text-[10.5px] truncate max-w-[150px]">
                  <BookOpen className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">{question.topicTitle}</span>
                </span>
              )}
            </div>

            {/* Question Text */}
            <h3 className="font-serif text-[15px] sm:text-base font-medium text-foreground leading-snug tracking-tight">
              {question.question}
            </h3>

            {/* Status Segmented Switcher */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-muted-foreground">
                Status:
              </span>
              <div className="flex items-center gap-1 bg-background/90 p-0.5 rounded-lg border border-border/60 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleStatusChange("pending")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    question.status === "pending"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("answered")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    question.status === "answered"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Answered</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("closed")}
                  disabled={isUpdatingStatus}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    question.status === "closed"
                      ? "bg-red-500/15 text-red-600 dark:text-red-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <XCircle className="h-3 w-3" />
                  <span>Closed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Existing Answers */}
          {question.answers && question.answers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
                <span className="font-semibold text-foreground text-[11px] tracking-wide">
                  Existing Responses
                </span>
                <span className="bg-primary/10 text-primary font-medium px-2 py-0.2 rounded-full text-[10.5px]">
                  {question.answers.length} {question.answers.length === 1 ? "answer" : "answers"}
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                {question.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-muted/25 border border-border/70 rounded-xl p-2.5 sm:p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
                      <div className="flex items-center gap-1.5">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Image
                            src="/mabcs.png"
                            alt="MessageABCs"
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        </div>
                        <span className="font-semibold text-foreground text-xs">
                          {answer.adminUser || "Official Staff"}
                        </span>
                        <span className="bg-primary/15 text-primary text-[9.5px] font-semibold px-1.5 py-0.1 rounded">
                          Official
                        </span>
                      </div>
                      <span className="text-[10.5px] text-muted-foreground">
                        {new Date(answer.dateAnswered).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-xs sm:text-[12.5px]">
                      {answer.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Composer Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label
                htmlFor="sidebar-answer"
                className="text-xs font-semibold text-foreground flex items-center justify-between"
              >
                <span>
                  {question.answers && question.answers.length > 0
                    ? "Add Another Response"
                    : "Your Response *"}
                </span>
                <span className="text-[10.5px] font-normal text-muted-foreground">
                  {answerContent.length} chars
                </span>
              </Label>
              <Textarea
                id="sidebar-answer"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Provide a thoughtful, scriptural answer to this question..."
                className="bg-muted/40 border-border/70 min-h-[95px] text-xs sm:text-[13px] rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background transition-all"
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

            {/* Footer Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
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
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Publish Answer</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
};

export default QuestionDetailsSidebar;
