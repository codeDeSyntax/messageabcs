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
    <div className="hidden md:block relative bg-blue-50 dark:bg-[#07072d] z-10 border-b border-gray-200 dark:border-gray-800">
      <div className="relative w-full flex items-center justify-between px-6 py-4">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/topics")}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-white/20 rounded-full text-blue-900 dark:text-white/90 backdrop-blur-sm border border-white/20"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>

        {/* Title with Background Image */}
        {currentTopic && (
          <div className="flex-1 text-center px-8">
            <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white drop-shadow-lg">
              {currentTopic.title}
            </h1>
            {currentTopic.subtitle && (
              <p className="text-sm md:text-base text-blue-900 dark:text-white/90 font-medium drop-shadow-md mt-1">
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
          className="p-2 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 disabled:opacity-50"
          title={
            isGeneratingShareCard
              ? "Generating share card..."
              : "Share this topic"
          }
        >
          {isGeneratingShareCard ? (
            <div className="w-5 h-5 border-2 border-white text-blue-900 dark:text-white/90 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
