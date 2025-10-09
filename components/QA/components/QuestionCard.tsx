"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageCircle } from "lucide-react";
import { Question } from "@/services/api";

interface QuestionCardProps {
  question: Question;
  formatDate: (dateString: string) => string;
}

export const QuestionCard = ({ question, formatDate }: QuestionCardProps) => {
  return (
    <div className="group hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 cursor-pointer md:p-6 rounded-lg p-2">
      {/* Question Section */}
      <div className="mb-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
              {question.askedBy?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold text-foreground">
                {question.askedBy || "Anonymous"}
              </span>
              <span className="text-sm text-muted-foreground">
                asked {formatDate(question.dateAsked)}
              </span>
              {question.topicTitle && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-0 ml-2 h-6"
                >
                  {question.topicTitle}
                </Button>
              )}
            </div>

            <h3 className="md:text-lg font-bold text-foreground mb-2 font-reading leading-relaxed underline decoration-blue-500/50 decoration-2">
              {question.question}
            </h3>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Answers Section */}
      {question.answers && question.answers.length > 0 ? (
        <div className="ml-12">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-6 bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
            >
              {question.answers.length} Answer
              {question.answers.length !== 1 ? "s" : ""}
            </Button>
          </div>

          {/* Latest Answer */}
          <div className="bg-green-50/30 dark:bg-green-900/10 rounded-lg p-3 ml-3 border-l-4 border-green-500/50">
            <div className="flex items-center gap-2 mb-2">
              <img src="/mabcs.png" alt="admin" className="h-6 w-6" />
              <div>
                <span className="font-medium text-green-700 dark:text-green-300 text-sm">
                  {question.answers[0].adminUser}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  answered {formatDate(question.answers[0].dateAnswered)}
                </span>
              </div>
            </div>
            <p className="md:text-lg font-thin text-foreground font-reading leading-relaxed">
              {question.answers[0].answer}
            </p>
          </div>
        </div>
      ) : (
        <div className="ml-12">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-orange-500" />
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-6 bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
            >
              Pending Answer
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              Be the first to help!
            </span>
          </div>
        </div>
      )}

      {/* Separator line between questions */}
      <div className="mt-4 border-b border-gray-200/10 dark:border-gray-700/10"></div>
    </div>
  );
};
