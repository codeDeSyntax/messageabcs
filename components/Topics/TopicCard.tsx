/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiblicalTopicWithCount, BiblicalTopic } from "@/services/api";
import { generateSlug } from "@/utils/slugs";
import {
  BookOpen,
  MessageSquare,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Share2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TopicCardProps {
  topic: BiblicalTopicWithCount | BiblicalTopic;
  index?: number;
  viewMode?: "grid" | "list";
}

export function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Initialize bookmark status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mabcs_bookmark_${topic.id}`);
      if (saved === "true") {
        setIsBookmarked(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [topic.id]);

  const handleCardClick = () => {
    const slug = generateSlug(topic.title);
    router.push(`/reading/${slug}`);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      if (nextState) {
        localStorage.setItem(`mabcs_bookmark_${topic.id}`, "true");
        toast({
          title: "Saved to Reading List",
          description: `"${topic.title}" has been bookmarked.`,
        });
      } else {
        localStorage.removeItem(`mabcs_bookmark_${topic.id}`);
        toast({
          title: "Removed from Reading List",
          description: `"${topic.title}" was removed from bookmarks.`,
        });
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = generateSlug(topic.title);
    const url = `${window.location.origin}/reading/${slug}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Topic link copied to your clipboard.",
      });
    }
  };

  const questionCount =
    ("questionsCount" in topic ? topic.questionsCount : 0) || 0;

  const formattedDate = topic.createdAt
    ? new Date(topic.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Calculate approximate read time (average 200 words/min)
  const totalWords =
    (topic.title?.split(/\s+/).length || 0) +
    (topic.subtitle?.split(/\s+/).length || 0) +
    (topic.mainExtract?.split(/\s+/).length || 0) +
    (topic.quotes?.join(" ").split(/\s+/).length || 0);
  const estimatedReadTime = Math.max(2, Math.ceil(totalWords / 40));

  const primaryScripture =
    topic.scriptures && topic.scriptures.length > 0
      ? topic.scriptures[0]
      : null;

  const isOdd = index % 2 !== 0;

  return (
    <article
      onClick={handleCardClick}
      className={`group cursor-pointer py-3.5 sm:py-4 px-3 sm:px-4 border-b border-border/80 transition-colors duration-150 ${
        isOdd
          ? "bg-primary/[0.09] hover:bg-primary/[0.14]"
          : "bg-primary/[0.015] hover:bg-primary/[0.05]"
      }`}
    >
      <div className="flex items-stretch sm:items-start justify-between gap-3 sm:gap-5">
        {/* Left: Text & Metadata Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Author / Source Meta Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-2.5 w-2.5" />
              </span>
              <span className="text-[11px] sm:text-xs">MessageABCs</span>
            </div>
            {primaryScripture && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full text-[10.5px] truncate max-w-[130px] sm:max-w-[140px]">
                  {primaryScripture}
                </span>
              </>
            )}
            {formattedDate && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                  <Calendar className="h-3 w-3 text-muted-foreground/70" />
                  {formattedDate}
                </span>
              </>
            )}
          </div>

          {/* Main Title - Medium Editorial Serif Headline */}
          <h2 className="font-serif text-base sm:text-lg md:text-xl font-medium text-foreground leading-snug tracking-tight mt-1 mb-0.5 group-hover:text-primary transition-colors line-clamp-2">
            {topic.title}
          </h2>

          {/* Subtitle / Excerpt Snippet */}
          {(topic.subtitle || topic.mainExtract) && (
            <p className="font-sans text-xs sm:text-[13px] text-muted-foreground line-clamp-2 leading-relaxed font-normal">
              {topic.subtitle || topic.mainExtract}
            </p>
          )}

          {/* Bottom Meta & Actions Bar */}
          <div className="flex items-center justify-between pt-1.5 mt-auto">
            <div className="flex items-center gap-2 sm:gap-3.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px] sm:text-xs">
                <Clock className="h-3 w-3 text-muted-foreground/70" />
                {estimatedReadTime} min read
              </span>

              {questionCount > 0 && (
                <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-full text-[10.5px]">
                  <MessageSquare className="h-2.5 w-2.5 text-muted-foreground" />
                  {questionCount} {questionCount === 1 ? "question" : "questions"}
                </span>
              )}

              {topic.scriptures && topic.scriptures.length > 1 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] text-muted-foreground/80">
                  <Sparkles className="h-2.5 w-2.5 text-primary/70" />
                  {topic.scriptures.length} scriptures
                </span>
              )}
            </div>

            {/* Interactive Actions */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share topic link"
                title="Share link"
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleBookmarkToggle}
                aria-label={
                  isBookmarked
                    ? "Remove from reading list"
                    : "Save to reading list"
                }
                title={
                  isBookmarked
                    ? "Remove from reading list"
                    : "Save to reading list"
                }
                className={`p-1 rounded-full transition-colors ${
                  isBookmarked
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-3.5 w-3.5" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Medium-style Compact Preview Thumbnail (Stretches vertically on mobile to match text height) */}
        <div className="flex-shrink-0 self-stretch sm:self-start flex items-stretch">
          <div className="relative w-20 sm:w-28 md:w-36 h-full min-h-[5.5rem] sm:min-h-0 sm:h-20 md:h-24 rounded-lg overflow-hidden border border-border/60 shadow-2xs group-hover:shadow-xs transition-all group-hover:scale-[1.02] bg-muted/30 flex items-center justify-center">
            {topic.image ? (
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

