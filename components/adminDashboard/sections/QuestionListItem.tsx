import React from "react";
import { User, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/services/api";

// Backend Question model with admin-specific fields
type AdminQuestion = Question & {
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  views: number;
};

interface QuestionListItemProps {
  question: AdminQuestion;
  onClick: (question: AdminQuestion) => void;
  showDivider: boolean;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({
  question,
  onClick,
  showDivider,
}) => {
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

  return (
    <div className="w-full">
      <div
        className="px-3 md:px-6 py-3 md:py-4 hover:bg-primary/10 transition-all duration-200 rounded-lg cursor-pointer border border-primary/10" 
        onClick={() => onClick(question)}
      >
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            {/* Question Title with Icon */}
            <div className="flex items-start gap-2 md:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(question.status)}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-foreground break-words flex-1">
                {question.question}
              </h3>
            </div>

            {/* Metadata - Compact on mobile */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground pl-7 md:pl-8">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[100px] md:max-w-none">
                  {question.askedBy}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {new Date(question.dateAsked).toLocaleDateString()}
                </span>
              </div>
              <Badge variant="outline" className="text-xs  whitespace-nowrap">
                {question.topicTitle?.slice(0, 30)}{question.topicTitle && question.topicTitle.length > 30 ? "..." : ""}
              </Badge>
            </div>
          </div>

          {/* Status Badge - Top right on mobile, right side on desktop */}
          <div className="flex items-center gap-2 pl-7 md:pl-0">
            {getStatusBadge(question.status)}
          </div>
        </div>
      </div>
      {showDivider && <div className="bg-primary/12 mt-2 mb-2 h-px"></div>}
    </div>
  );
};

export default QuestionListItem;
