"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BiblicalTopic } from "@/services/api";

interface ReadingMobileHeaderProps {
  currentTopic: BiblicalTopic | null;
  isGeneratingShareCard: boolean;
  onShare: () => void;
}

export const ReadingMobileHeader = ({
  currentTopic,
  isGeneratingShareCard,
  onShare,
}: ReadingMobileHeaderProps) => {
  const router = useRouter();

  return (
    <header
      className="md:hidden sticky top-0 z-[500] bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-200"
      style={{ height: "56px" }}
    >
      <div className="h-full flex items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/topics")}
          className="flex items-center justify-center w-9 h-9 hover:bg-muted rounded-full transition-colors duration-200"
          aria-label="Back to topics"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Share Button */}
        <button
          onClick={onShare}
          disabled={isGeneratingShareCard}
          className="flex items-center justify-center w-9 h-9 hover:bg-muted rounded-full transition-colors duration-200 disabled:opacity-50"
          aria-label="Share this topic"
        >
          {isGeneratingShareCard ? (
            <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>
    </header>
  );
};
