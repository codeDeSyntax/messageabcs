/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles, Check, BookOpen, Layers } from "lucide-react";
import { BiblicalTopic } from "@/services/api";
import { useRouter } from "next/navigation";

interface TopicsSidebarProps {
  topics: BiblicalTopic[];
  loading: boolean;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string | null) => void;
  onAskQuestion?: () => void;
}

export const TopicsSidebar = ({
  topics,
  loading,
  selectedTopic,
  onTopicSelect,
  onAskQuestion,
}: TopicsSidebarProps) => {
  const router = useRouter();

  return (
    <aside className="w-full space-y-2.5">
      {/* Ask Question Callout Card (Compact) */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <h3 className="font-serif font-medium text-foreground text-xs sm:text-sm">
            Have a Biblical Question?
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug mb-2.5">
          Ask about scripture, doctrine, or ministry teachings.
        </p>
        {onAskQuestion && (
          <Button
            type="button"
            size="sm"
            onClick={onAskQuestion}
            className="w-full h-7 bg-primary hover:bg-primary-hover text-primary-foreground text-[11.5px] font-semibold rounded-lg shadow-2xs transition-all"
          >
            Ask a Question
          </Button>
        )}
      </div>

      {/* Topics Filter Box (Compact) */}
      <div className="bg-background/80 border border-border/70 rounded-xl p-2.5 sm:p-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border/60">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">
              Filter by Topic
            </h3>
          </div>
          {selectedTopic && (
            <button
              type="button"
              onClick={() => onTopicSelect(null)}
              className="text-[10.5px] font-medium text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* All Topics Option */}
        <button
          type="button"
          onClick={() => onTopicSelect(null)}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors mb-0.5 ${
            selectedTopic === null
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="h-3 w-3 opacity-70" />
            <span className="text-[11.5px]">All Topics</span>
          </div>
          {selectedTopic === null && <Check className="h-3 w-3 text-primary" />}
        </button>

        {/* Topics List */}
        <div className="space-y-0.5 max-h-[340px] overflow-y-auto no-scrollbar pr-0.5">
          {loading ? (
            <div className="space-y-1.5 py-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-2 p-1.5 rounded-lg bg-muted/40">
                  <div className="w-5 h-5 bg-muted/80 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 bg-muted/80 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-4">
              <Tag className="h-6 w-6 mx-auto text-muted-foreground/40 mb-1" />
              <p className="text-[11px] text-muted-foreground">
                No topics available
              </p>
            </div>
          ) : (
            topics.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() =>
                    onTopicSelect(isSelected ? null : topic.id)
                  }
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/25"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="relative w-5 h-5 flex-shrink-0 rounded-full overflow-hidden border border-border/80">
                    <Image
                      src={topic.image || "/mabcs.png"}
                      alt={topic.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium truncate leading-tight">
                      {topic.title}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-3 w-3 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* View All Topics in Library Link */}
        <div className="pt-2 mt-1.5 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-[11px] text-muted-foreground hover:text-foreground justify-center h-7 px-2"
            onClick={() => router.push("/topics")}
          >
            <BookOpen className="h-3 w-3 mr-1.5" />
            Explore Full Topics Library
          </Button>
        </div>
      </div>
    </aside>
  );
};


