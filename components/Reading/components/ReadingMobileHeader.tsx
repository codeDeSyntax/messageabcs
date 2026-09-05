"use client";

import { ArrowLeft, Share2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiblicalTopic } from "@/services/api";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Reading link copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/70 transition-colors">
      <div className="flex items-center justify-between h-14 px-4 gap-2">
        {/* Back Button */}
        <button
          onClick={() => router.push("/topics")}
          className="flex items-center justify-center w-8 h-8 hover:bg-muted/70 rounded-full text-foreground transition-colors"
          aria-label="Back to topics"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Center Title */}
        <div className="flex-1 text-center min-w-0 px-2">
          <span className="font-serif text-xs font-semibold text-foreground truncate block">
            {currentTopic?.title || "Reading"}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center w-8 h-8 hover:bg-muted/70 rounded-full text-foreground transition-colors"
          aria-label="Share this topic"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
