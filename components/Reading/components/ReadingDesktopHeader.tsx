"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BiblicalTopic } from "@/services/api";

interface ReadingDesktopHeaderProps {
  currentTopic: BiblicalTopic | null;
  isGeneratingShareCard: boolean;
  onShare: () => void;
}

export const ReadingDesktopHeader = ({
  currentTopic,
  isGeneratingShareCard,
  onShare,
}: ReadingDesktopHeaderProps) => {
  const router = useRouter();

  return (
    <header
      className="hidden md:block sticky top-0 z-[500] bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-200"
      style={{ height: "64px" }}
    >
      <div className="h-full flex items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/topics")}
          className="flex items-center justify-center w-10 h-10 hover:bg-muted rounded-full transition-colors duration-200"
          aria-label="Back to topics"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Title Section */}
        {currentTopic && (
          <div className="flex-1 text-center px-8">
            <h1 className="text-base lg:text-lg font-semibold text-foreground truncate">
              {currentTopic.title}
            </h1>
            {currentTopic.subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {currentTopic.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={onShare}
          disabled={isGeneratingShareCard}
          className="flex items-center gap-2 px-4 h-10 hover:bg-muted rounded-full transition-colors duration-200 disabled:opacity-50 text-sm font-medium text-foreground"
          aria-label="Share this topic"
        >
          {isGeneratingShareCard ? (
            <>
              <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              <span className="hidden lg:inline">Sharing...</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="hidden lg:inline">Share</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
