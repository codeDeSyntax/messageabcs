import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Quote, BookOpen, Sparkles, BookMarked, Calendar } from "lucide-react";
import { BiblicalTopic } from "@/services/api";
import { OtherTopics } from "./OtherTopics";
import { format } from "date-fns";

interface ReadingContentProps {
  currentTopic: BiblicalTopic;
  isGeneratingShareCard: boolean;
  onShare: () => void;
}

export const ReadingContent = ({
  currentTopic,
  isGeneratingShareCard,
  onShare,
}: ReadingContentProps) => {
  // Normalize scriptures
  const scriptures = Array.isArray(currentTopic.scriptures)
    ? currentTopic.scriptures
    : typeof currentTopic.scriptures === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(currentTopic.scriptures);
          return Array.isArray(parsed) ? parsed : [currentTopic.scriptures];
        } catch {
          return [currentTopic.scriptures];
        }
      })()
    : [];

  // Normalize quotes
  const quotes = Array.isArray(currentTopic.quotes)
    ? currentTopic.quotes
    : typeof currentTopic.quotes === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(currentTopic.quotes);
          return Array.isArray(parsed) ? parsed : [currentTopic.quotes];
        } catch {
          return [currentTopic.quotes];
        }
      })()
    : [];

  const formattedDate = currentTopic.createdAt
    ? format(new Date(currentTopic.createdAt), "MMMM d, yyyy")
    : null;

  return (
    <article className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-10">
      {/* 1. Article Header */}
      <header className="space-y-4 pb-6 border-b border-border/60">
        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider font-sans">
            <BookMarked className="h-3 w-3" />
            <span>Scripture Study</span>
          </span>

          {formattedDate && (
            <span className="text-xs text-muted-foreground font-sans flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.18] [text-wrap:balance]">
          {currentTopic.title}
        </h1>

        {/* Subtitle / Excerpt Lead */}
        {currentTopic.subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed pt-1">
            {currentTopic.subtitle}
          </p>
        )}

        {/* Scripture Pills Row */}
        {scriptures.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">
              References:
            </span>
            {scriptures.map((scripture, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] font-medium font-sans border border-border/40"
              >
                {scripture}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 2. Main Article Body */}
      {currentTopic.mainExtract && (
        <section className="prose prose-lg max-w-none">
          <div
            className="reading-content text-foreground text-lg sm:text-xl leading-relaxed space-y-4 break-words"
            dangerouslySetInnerHTML={{
              __html: currentTopic.mainExtract,
            }}
          />
        </section>
      )}

      {/* 3. Quotes Section (Theme Harmonized) */}
      {quotes.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="h-4 w-4 text-[var(--theme-primary)]" />
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-foreground">
              Key Quotes & Citations
            </h2>
          </div>

          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <blockquote
                key={index}
                className="relative p-5 sm:p-6 rounded-2xl bg-[var(--theme-surface-subtle)]/60 border-l-4 border-[var(--theme-primary)] shadow-2xs space-y-2 transition-colors"
              >
                <p className="font-serif text-base sm:text-lg text-foreground italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* 4. Other Related Topics */}
      <section className="pt-8 border-t border-border/60">
        <OtherTopics currentTopicId={currentTopic.id} />
      </section>

      {/* 5. Bottom Share & Navigation Action */}
      <footer className="pt-8 pb-16 text-center space-y-4">
        <Button
          onClick={onShare}
          disabled={isGeneratingShareCard}
          className="h-11 px-8 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
        >
          {isGeneratingShareCard ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Preparing Share Card...</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span>Share This Study</span>
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground font-sans">
          Share biblical truth with friends, study groups, and believers.
        </p>
      </footer>
    </article>
  );
};
