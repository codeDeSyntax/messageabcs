import React, { useState } from "react";
import {
  User,
  Calendar,
  XCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/services/api";

// Backend Question model with admin-specific fields
type AdminQuestion = Question & {
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  views: number;
};

interface Answer {
  id: string;
  adminUser: string;
  answer: string;
  dateAnswered: string;
  isOfficial: boolean;
}

interface QuestionDetailsSidebarProps {
  question: AdminQuestion;
  onClose: () => void;
  onSubmitAnswer: (content: string, isOfficial: boolean) => Promise<void>;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "answered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "closed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "answered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Answered
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Closed
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
      await onSubmitAnswer(answerContent, isOfficial);
      setAnswerContent("");
      setIsOfficial(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-5xl z-[102]  bg-background backdrop-blur  border-none border-border shadow-2xl overflow-hidden flex flex-col">
        <div className="h-full flex flex-col w-[80%] m-auto  ">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-background shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Question Details
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
                    {question.question}
                  </div>
                </div>

                <div className="border-t border-dashed border-border/40 my-3"></div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Status
                  </div>
                  <div className="text-foreground font-semibold uppercase text-xs">
                    {question.status}
                  </div>
                </div>

                {/* Asked By */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Asked By
                  </div>
                  <div className="text-foreground">{question.askedBy}</div>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Date
                  </div>
                  <div className="text-foreground">
                    {new Date(question.dateAsked).toLocaleDateString()}
                  </div>
                </div>

                {/* Topic */}
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-xs uppercase">
                    Topic
                  </div>
                  <div className="text-foreground text-right max-w-[60%]">
                    {question.topicTitle}
                  </div>
                </div>

                <div className="border-t border-dashed border-border/40 my-3"></div>
              </div>
            </div>

            {/* Existing Answers */}
            {question.answers && question.answers.length > 0 && (
              <div className="bg-background px-6 py-5 font-mono">
                <div className="max-w-md">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                    Existing Answers ({question.answers.length})
                  </div>
                  <div className="space-y-4">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="border-l-2 border-dashed border-border/40 pl-3 py-2"
                      >
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <div className="text-foreground font-medium uppercase tracking-wide">
                            {answer.adminUser}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(answer.dateAnswered).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-sans">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-border/40 mt-4"></div>
                </div>
              </div>
            )}

            {/* Answer Form */}
            <div className="bg-background px-6 py-5 font-mono">
              <div className="">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                  {question.answers && question.answers.length > 0
                    ? "Add Another Answer"
                    : "Answer Question"}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sidebar-answer"
                      className="text-xs text-muted-foreground uppercase tracking-wider font-mono"
                    >
                      Your Answer *
                    </Label>
                    <Textarea
                      id="sidebar-answer"
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Provide a thoughtful, biblical answer..."
                      className="bg-cream-200/50 rounded border border-dashed border-border/40 focus:border-border focus:ring-1 focus:ring-primary/20 transition-all min-h-[200px] no-scrollbar text-sm font-sans"
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
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background px-6 py-5 font-mono">
              <div className="max-w-md">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => onUpdateStatus(question.id, "pending")}
                    className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                  >
                    → Mark as Pending
                  </button>
                  <button
                    onClick={() => onUpdateStatus(question.id, "answered")}
                    className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                  >
                    → Mark as Answered
                  </button>
                  <button
                    onClick={() => onUpdateStatus(question.id, "closed")}
                    className="w-full text-left py-2 px-0 text-xs uppercase tracking-wide font-mono text-foreground hover:text-primary transition-colors border-b border-dashed border-border/30 hover:border-primary/50"
                  >
                    → Close Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionDetailsSidebar;
