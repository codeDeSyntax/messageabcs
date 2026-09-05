"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { BiblicalTopic } from "@/services/api";
import { generateSlug } from "@/lib/slugs";
import { StructuredData } from "@/components/StructuredData";

// Import modular components
import { ReadingMobileHeader } from "@/components/Reading/components/ReadingMobileHeader";
import { ReadingDesktopHeader } from "@/components/Reading/components/ReadingDesktopHeader";
import { ReadingContent } from "@/components/Reading/components/ReadingContent";

// Import hooks
import { useShare } from "@/components/Reading/hooks/useShare";

interface ReadingTopicClientProps {
  topic: BiblicalTopic;
  slug: string;
}

export default function ReadingTopicClient({
  topic,
  slug,
}: ReadingTopicClientProps) {
  const [currentTopic, setCurrentTopic] = useState<BiblicalTopic>(topic);
  const router = useRouter();
  const { isFullscreen } = useFullscreen();

  // Custom hooks
  const { isGeneratingShareCard, handleShare } = useShare();

  useEffect(() => {
    // If we received a topic with UUID but the URL should use slug, redirect
    if (
      currentTopic &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      )
    ) {
      const topicSlug = generateSlug(currentTopic.title);
      router.replace(`/reading/${topicSlug}`);
    }

    // Update page title
    if (currentTopic) {
      document.title = `${currentTopic.title} - MessageABCs`;
    }
  }, [currentTopic, slug, router]);

  // Share handler that passes the current topic
  const handleShareClick = () => {
    handleShare(currentTopic);
  };

  return (
    <div className="min-h-screen relative bg-[var(--theme-canvas)] flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Structured Data for SEO and social platforms */}
      <StructuredData topic={currentTopic} />

      {/* Mobile Navigation Header */}
      {!isFullscreen && (
        <ReadingMobileHeader
          currentTopic={currentTopic}
          isGeneratingShareCard={isGeneratingShareCard}
          onShare={handleShareClick}
        />
      )}

      {/* Desktop Navigation Header */}
      {!isFullscreen && (
        <ReadingDesktopHeader
          currentTopic={currentTopic}
          isGeneratingShareCard={isGeneratingShareCard}
          onShare={handleShareClick}
        />
      )}

      {/* Main Reading Content */}
      <main className="flex-1 relative z-10">
        <ReadingContent
          currentTopic={currentTopic}
          isGeneratingShareCard={isGeneratingShareCard}
          onShare={handleShareClick}
        />
      </main>
    </div>
  );
}
