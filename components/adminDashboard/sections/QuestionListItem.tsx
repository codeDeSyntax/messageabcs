import React from "react";
import { User, Calendar, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/services/api";

type AdminQuestion = Question & {
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  views: number;
};

interface QuestionListItemProps {
  question: AdminQuestion;
  onClick: (question: AdminQuestion) => void;
  showDivider?: boolean;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({
  question,
  onClick,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]">
            Pending
          </span>
        );
      case "answered":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/50">
            Answered
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-surface)] text-[var(--theme-text-secondary)]">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      className="px-4 py-2.5 hover:bg-[var(--theme-surface)]/60 transition-all duration-150 cursor-pointer rounded-xl group flex items-center justify-between gap-3"
      onClick={() => onClick(question)}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
            question.status === "answered"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]"
          }`}
        >
          {question.status === "answered" ? (
            <CheckCircle className="h-4.5 w-4.5" />
          ) : (
            <Clock className="h-4.5 w-4.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-dark)] line-clamp-2">
            {question.question}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[var(--theme-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <User className="h-3 w-3" />
              {question.askedBy || "Anonymous"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(question.dateAsked).toLocaleDateString()}
            </span>
            {question.topicTitle && (
              <>
                <span>•</span>
                <span className="text-[var(--theme-primary)] font-medium truncate max-w-[150px]">
                  {question.topicTitle}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {getStatusBadge(question.status)}
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)]/60 group-hover:text-[var(--theme-text-primary)] transition-all">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default QuestionListItem;
