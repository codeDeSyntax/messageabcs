/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Share2,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { Question } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/slugs";
import { useRouter } from "next/navigation";

interface QuestionCardProps {
  question: Question;
  formatDate: (dateString: string) => string;
  onTopicClick?: (topicId: string) => void;
  index?: number;
}

export const QuestionCard = ({
  question,
  formatDate,
  onTopicClick,
  index = 0,
}: QuestionCardProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const isAnswered = question.answers && question.answers.length > 0;
  const isOdd = index % 2 !== 0;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/qa?q=${question.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Question link copied to clipboard.",
      });
    }
  };

  const handleTopicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (question.topicTitle) {
      const slug = generateSlug(question.topicTitle);
      router.push(`/reading/${slug}`);
    } else if (question.topicId && onTopicClick) {
      onTopicClick(question.topicId);
    }
  };

  return (
    <article
      className={`py-3 sm:py-3.5 px-3 sm:px-4.5 border-b border-border/80 transition-colors duration-150 ${
        isOdd ? "bg-primary/[0.04]" : "bg-transparent"
      }`}
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap text-xs text-muted-foreground mb-1 sm:mb-1.5">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Avatar className="h-4.5 w-4.5 flex-shrink-0">
            <AvatarFallback className="text-[8.5px] font-bold bg-primary/15 text-primary">
              {question.askedBy?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground text-xs">
            {question.askedBy || "Anonymous"}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <Clock className="h-2.5 w-2.5 text-muted-foreground/60" />
            {formatDate(question.dateAsked)}
          </span>
          {question.topicTitle && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <button
                type="button"
                onClick={handleTopicClick}
                className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary font-medium px-2 py-0.2 rounded-full text-[10.5px] transition-colors"
              >
                <BookOpen className="h-2.5 w-2.5" />
                <span className="truncate max-w-[150px]">
                  {question.topicTitle}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Answer Status Badge & Share Action */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isAnswered ? (
            <span className="inline-flex items-center gap-1 bg-primary/15 text-primary font-medium px-2 py-0.2 rounded-full text-[10px]">
              <CheckCircle2 className="h-2.5 w-2.5 text-primary" />
              <span>
                {question.answers.length}{" "}
                {question.answers.length === 1 ? "Answer" : "Answers"}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-muted/60 text-muted-foreground font-medium px-2 py-0.2 rounded-full text-[10px]">
              <Clock className="h-2.5 w-2.5" />
              <span>Pending</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share question"
            title="Share question"
            className="p-1 text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-full transition-colors"
          >
            <Share2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Main Question Headline (Compact Medium typography) */}
      <h2 className="font-serif text-[15px] sm:text-base md:text-[17px] font-medium text-foreground leading-snug tracking-tight my-1 sm:my-1.5">
        {question.question}
      </h2>

      {/* Answer Body / Thread Section */}
      {isAnswered ? (
        <div className="mt-2">
          {isExpanded ? (
            <div className="space-y-2">
              {question.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className="bg-muted/30 border border-border/70 rounded-lg p-2.5 sm:p-3 text-xs sm:text-[13px]"
                >
                  {/* Verified Answer Header */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/40">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-4.5 h-4.5 flex-shrink-0">
                        <Image
                          src="/mabcs.png"
                          alt="MessageABCs"
                          width={18}
                          height={18}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-foreground text-xs">
                          {ans.adminUser || "MessageABCs"}
                        </span>
                        <span className="bg-primary/15 text-primary text-[9.5px] font-semibold px-1.5 py-0.1 rounded">
                          Official Answer
                        </span>
                      </div>
                    </div>
                    <span className="text-[10.5px] text-muted-foreground/80">
                      {formatDate(ans.dateAnswered)}
                    </span>
                  </div>

                  {/* Answer Text */}
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-xs sm:text-[13px]">
                    {ans.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Show answer</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="bg-muted/20 border border-dashed border-border/60 rounded-lg p-2 mt-1.5 text-xs text-muted-foreground flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-[11.5px]">This question is queued and awaiting an official response from MessageABCs.</span>
        </div>
      )}

      {/* Card Footer Actions (Only when answered) */}
      {isAnswered && (
        <div className="flex items-center gap-3.5 pt-1.5 mt-0.5 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Collapse answer</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>View answer</span>
              </>
            )}
          </button>
        </div>
      )}
    </article>
  );
};


