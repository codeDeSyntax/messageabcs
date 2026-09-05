import React from "react";
import {
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface AnswerListItemProps {
  answer: AdminAnswer;
  onClick: (answer: AdminAnswer) => void;
  showDivider?: boolean;
}

const AnswerListItem: React.FC<AnswerListItemProps> = ({
  answer,
  onClick,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/50">
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-surface-subtle)] text-[var(--theme-text-secondary)]">
            Archived
          </span>
        );
      case "published":
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/50">
            Published
          </span>
        );
    }
  };

  return (
    <div
      className="px-4 py-2.5 hover:bg-[var(--theme-surface)]/60 transition-all duration-150 cursor-pointer rounded-xl group flex items-center justify-between gap-3"
      onClick={() => onClick(answer)}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] mt-0.5 group-hover:scale-105 transition-transform">
          <MessageSquare className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider line-clamp-1">
            Re: {answer.questionTitle}
          </p>
          <h3 className="text-sm font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-dark)] line-clamp-2 mt-0.5">
            {answer.content}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[var(--theme-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <User className="h-3 w-3" />
              {answer.answeredBy || "Official Staff"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(answer.answeredAt).toLocaleDateString()}
            </span>
            {answer.topicTitle && (
              <>
                <span>•</span>
                <span className="text-[var(--theme-primary)] font-medium truncate max-w-[150px]">
                  {answer.topicTitle}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {getStatusBadge(answer.status)}
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)]/60 group-hover:text-[var(--theme-text-primary)] transition-all">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default AnswerListItem;
