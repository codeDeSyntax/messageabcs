import React from "react";
import {
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
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
  showDivider: boolean;
}

const AnswerListItem: React.FC<AnswerListItemProps> = ({
  answer,
  onClick,
  showDivider,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "archived":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
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

  return (
    <div className="w-full">
      <div
        className="px-3 md:px-6 py-3 md:py-4 bg-primary/10 transition-all duration-200 rounded-lg cursor-pointer border border-primary/10"
        onClick={() => onClick(answer)}
      >
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col gap-3">
          {/* Question Title */}
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground flex-1">
              Question: {answer.questionTitle}
            </h4>
          </div>

          {/* Answer Content Card */}
          <div className="bg-primary/15 p-3 md:p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(answer.status)}
                <span className="text-xs md:text-sm font-medium text-foreground">
                  Answer
                </span>
              </div>
              {getStatusBadge(answer.status)}
            </div>
            <p className="text-sm md:text-base text-foreground line-clamp-2 break-words">
              {answer.content}
            </p>
          </div>

          {/* Metadata - Compact on mobile */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[100px] md:max-w-none">
                {answer.answeredBy}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {new Date(answer.answeredAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {answer.topicTitle}
            </Badge>
            {answer.isOfficial && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Official
              </Badge>
            )}
          </div>
        </div>
      </div>
      {showDivider && <div className="bg-primary/12 mt-2 mb-2 h-px"></div>}
    </div>
  );
};

export default AnswerListItem;
