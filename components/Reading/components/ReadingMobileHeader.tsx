"use client";

import { Button } from "@/components/ui/button";
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
    <div className="md:hidden relative z-10 border-b border-gray-200 dark:border-gray-800">
      {/* Background Image Container */}
      {currentTopic && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentTopic.image || "/placeholder.svg"})`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      <div className="relative w-full flex items-center justify-around px-4 py-3">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/topics")}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>

        {/* Title with Background Image */}
        {currentTopic && (
          <div className="fle w-[80%] text-center px-4">
            <span className="text-sm line-clamp-1 truncate font-medium text-white drop-shadow-lg">
              {currentTopic.title}
            </span>
          </div>
        )}

        {/* Settings/Share Button */}
        <Button
          onClick={onShare}
          disabled={isGeneratingShareCard}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 disabled:opacity-50"
          title={
            isGeneratingShareCard
              ? "Generating share card..."
              : "Share this topic"
          }
        >
          {isGeneratingShareCard ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};
