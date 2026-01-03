"use client";

import Image from "next/image";
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
    <div className="group hover:bg-background/5 transition-all duration-200 cursor-pointer md:p-6 rounded-lg p-2">
      {/* Question Section */}
      <div className="mb-4 ml-4">
        <div className="flex items-start gap-4">
          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* User Avatar */}
              <Avatar className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                <AvatarFallback className=" text-[8px] bg-primary/20 text-primary">
                  {question.askedBy?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <span className=" text-sm text-foreground">
                {question.askedBy || "Anonymous"}
              </span>
              <span className="text-sm text-muted-foreground">
                asked {formatDate(question.dateAsked)}
              </span>
              {question.topicTitle && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 italic py-0 ml-2 h-6"
                >
                  {question.topicTitle}
                </Button>
              )}
            </div>

            <h3 className="md:text-base font-bold text-foreground mb-2 font-reading leading-relaxed underline-offset-8 decoration-primary/50 decoration-2 ml-8">
              Qn:: {question.question}
            </h3>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Answers Section */}
      {question.answers && question.answers.length > 0 ? (
        <div className="ml-4 md:ml-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-6 bg-green-500/10 border-green-500/20 text-green-600"
            >
              {question.answers.length} Answer
              {question.answers.length !== 1 ? "s" : ""}
            </Button>
          </div>

          {/* Latest Answer */}
          <div className="bg-green-50/30 rounded-lg p-3 ml-3 border-l-4 border-green-500/50">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/mabcs.png" alt="admin" width={24} height={24} />
              <div>
                <span className="font-medium text-green-700 text-sm">
                  {question.answers[0].adminUser}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  answered {formatDate(question.answers[0].dateAnswered)}
                </span>
              </div>
            </div>
            <p className="md:text-sm font-thin text-foreground font-reading leading-relaxed">
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
              className="text-xs px-3 py-1 h-6 bg-orange-500/10 border-orange-500/20 text-orange-600"
            >
              Pending Answer
            </Button>
            {/* <span className="text-sm text-muted-foreground ml-2">
              Be the first to help!
            </span> */}
          </div>
        </div>
      )}

      {/* Separator line between questions */}
      <div className="mt-4 border-b border-border"></div>
    </div>
  );
};
