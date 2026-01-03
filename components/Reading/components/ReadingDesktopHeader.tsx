"use client";

import { Button } from "@/components/ui/button";
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
    <div className="hidden md:block relative bg-background z-10 border-b border-border">
      <div className="relative w-full flex items-center justify-between px-6 py-4">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/topics")}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-muted rounded-full text-foreground backdrop-blur-sm border border-border"
        >
          <ArrowLeft className="h-5 w-5 text-primary-foreground" />
        </Button>

        {/* Title with Background Image */}
        {currentTopic && (
          <div className="flex-1 text-center px-8">
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground drop-shadow-lg">
              {currentTopic.title}
            </h1>
            {currentTopic.subtitle && (
              <p className="text-sm md:text-base text-foreground font-medium drop-shadow-md mt-1">
                {currentTopic.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Settings/Share Button */}
        <Button
          onClick={onShare}
          disabled={isGeneratingShareCard}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-primary-foreground/20 rounded-full backdrop-blur-sm border border-primary-foreground/20 disabled:opacity-50"
          title={
            isGeneratingShareCard
              ? "Generating share card..."
              : "Share this topic"
          }
        >
          {isGeneratingShareCard ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
