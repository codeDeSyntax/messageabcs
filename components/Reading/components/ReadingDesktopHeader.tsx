"use client";

import { ArrowLeft, Share2, Bookmark, Check, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiblicalTopic } from "@/services/api";
import { Logo } from "@/components/Logo";
import { ProfileCard } from "@/components/ProfileCard";
import { toast } from "sonner";

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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Reading link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/70 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4 flex-nowrap">
          {/* Left: Back Button & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0 flex-nowrap min-w-max">
            <button
              onClick={() => router.push("/topics")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/70 transition-all font-sans shrink-0 whitespace-nowrap"
              aria-label="Back to Topics"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span>Topics</span>
            </button>
            <span className="text-border shrink-0 select-none">|</span>
            <Logo variant="compact" className="shrink-0" />
          </div>

          {/* Center: Truncated Topic Title */}
          {currentTopic && (
            <div className="flex flex-1 items-center justify-center min-w-0 px-4 text-center">
              <span className="font-serif text-sm font-medium text-foreground truncate max-w-md">
                {currentTopic.title}
              </span>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap min-w-max">
            {/* Share / Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/40 hover:bg-muted/80 text-foreground border border-border/60 transition-all font-sans shrink-0 whitespace-nowrap"
              title="Copy share link"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Share</span>
                </>
              )}
            </button>

            <ProfileCard />
          </div>
        </div>
      </div>
    </header>
  );
};

