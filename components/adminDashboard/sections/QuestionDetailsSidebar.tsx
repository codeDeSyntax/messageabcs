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
    status: "pending" | "answered" | "closed"
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
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-background backdrop-blur rounded-l-2xl border-none border-border shadow-2xl overflow-hidden flex flex-col">
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-bold text-foreground">
            Question Details
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
            {/* Question Content */}
            <div className="bg-cream-200 p-4 rounded-xl shadow-sm border-none border-border">
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(question.status)}
                {getStatusBadge(question.status)}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {question.question}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{question.askedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(question.dateAsked).toLocaleDateString()}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-background border-border"
                >
                  {question.topicTitle}
                </Badge>
              </div>
            </div>

            {/* Existing Answers */}
            {question.answers && question.answers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Existing Answers ({question.answers.length})
                </h4>
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="bg-cream-200 p-4 rounded-xl shadow-sm border border-border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {answer.adminUser}
                      </span>
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Official
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(answer.dateAnswered).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {answer.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Form */}
            <div className="space-y-4 pt-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                {question.answers && question.answers.length > 0
                  ? "Add Another Answer"
                  : "Answer Question"}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="sidebar-answer"
                    className="text-sm font-medium"
                  >
                    Your Answer *
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
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground text-sm mb-3">
                Quick Actions
              </h4>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(question.id, "pending")}
              >
                <Clock className="h-4 w-4" />
                Mark as Pending
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(question.id, "answered")}
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Answered
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-cream-200 border-border hover:bg-muted rounded-xl transition-all"
                onClick={() => onUpdateStatus(question.id, "closed")}
              >
                <XCircle className="h-4 w-4" />
                Close Question
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsSidebar;
