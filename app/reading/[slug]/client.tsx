import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BiblicalTopic } from "@/services/api";
import { generateSlug } from "@/lib/slugs";
import { StructuredData } from "@/components/StructuredData";

// Import modular components
import { ReadingMobileHeader } from "@/components/Reading/components/ReadingMobileHeader";
import { ReadingDesktopHeader } from "@/components/Reading/components/ReadingDesktopHeader";
import { ReadingContent } from "@/components/Reading/components/ReadingContent";
import { BookPageRenderer } from "@/components/Reading/components/BookPageRenderer";

// Import hooks and utils
import { useShare } from "@/components/Reading/hooks/useShare";
import { createPages } from "@/components/Reading/utils/contentUtils";

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
  const { theme } = useTheme();
  const { isFullscreen } = useFullscreen();

  // Custom hooks
  const { isGeneratingShareCard, handleShare } = useShare();

  // Create pages from topic content (for potential book-style rendering)
  const pages = createPages(currentTopic);
  const totalPages = pages.length;

  useEffect(() => {
    // If we received a topic with UUID but the URL should use slug, redirect
    if (
      currentTopic &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug
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
    <div className="h-screen no-scrollbar overflow-auto relative">
      {/* Structured Data for SEO and social platforms */}
      <StructuredData topic={currentTopic} />
      
      {/* Keep animated background for desktop only */}
    

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

      {/* Main Book Content */}
      <div className="flex justify-center h-full relative z-10">
        <div className="w-full max-w-7xl h-full">
          <ReadingContent
            currentTopic={currentTopic}
            isGeneratingShareCard={isGeneratingShareCard}
            onShare={handleShareClick}
          />
        </div>
      </div>

      {/* Custom CSS for flip animation and fraying effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            50% { transform: rotateY(-90deg); }
            100% { transform: rotateY(0deg); }
          }
          .animate-flip {
            animation: flip 0.6s ease-in-out;
          }

          /* Fraying Edge Effects */
          .fraying-mask-right {
            -webkit-mask-image: 
              radial-gradient(circle at 95% 20%, transparent 8px, black 12px),
              radial-gradient(circle at 90% 35%, transparent 6px, black 10px),
              radial-gradient(circle at 97% 50%, transparent 10px, black 14px),
              radial-gradient(circle at 92% 65%, transparent 7px, black 11px),
              radial-gradient(circle at 96% 80%, transparent 9px, black 13px),
              radial-gradient(circle at 88% 15%, transparent 5px, black 9px),
              radial-gradient(circle at 94% 45%, transparent 8px, black 12px),
              radial-gradient(circle at 91% 75%, transparent 6px, black 10px),
              linear-gradient(to right, black 85%, transparent 100%);
            mask-image: 
              radial-gradient(circle at 95% 20%, transparent 8px, black 12px),
              radial-gradient(circle at 90% 35%, transparent 6px, black 10px),
              radial-gradient(circle at 97% 50%, transparent 10px, black 14px),
              radial-gradient(circle at 92% 65%, transparent 7px, black 11px),
              radial-gradient(circle at 96% 80%, transparent 9px, black 13px),
              radial-gradient(circle at 88% 15%, transparent 5px, black 9px),
              radial-gradient(circle at 94% 45%, transparent 8px, black 12px),
              radial-gradient(circle at 91% 75%, transparent 6px, black 10px),
              linear-gradient(to right, black 85%, transparent 100%);
            -webkit-mask-composite: intersect;
            mask-composite: intersect;
          }

          .fraying-mask-bottom {
            -webkit-mask-image: 
              radial-gradient(circle at 20% 95%, transparent 8px, black 12px),
              radial-gradient(circle at 35% 90%, transparent 6px, black 10px),
              radial-gradient(circle at 50% 97%, transparent 10px, black 14px),
              radial-gradient(circle at 65% 92%, transparent 7px, black 11px),
              radial-gradient(circle at 80% 96%, transparent 9px, black 13px),
              radial-gradient(circle at 15% 88%, transparent 5px, black 9px),
              radial-gradient(circle at 45% 94%, transparent 8px, black 12px),
              radial-gradient(circle at 75% 91%, transparent 6px, black 10px),
              linear-gradient(to bottom, black 85%, transparent 100%);
            mask-image: 
              radial-gradient(circle at 20% 95%, transparent 8px, black 12px),
              radial-gradient(circle at 35% 90%, transparent 6px, black 10px),
              radial-gradient(circle at 50% 97%, transparent 10px, black 14px),
              radial-gradient(circle at 65% 92%, transparent 7px, black 11px),
              radial-gradient(circle at 80% 96%, transparent 9px, black 13px),
              radial-gradient(circle at 15% 88%, transparent 5px, black 9px),
              radial-gradient(circle at 45% 94%, transparent 8px, black 12px),
              radial-gradient(circle at 75% 91%, transparent 6px, black 10px),
              linear-gradient(to bottom, black 85%, transparent 100%);
            -webkit-mask-composite: intersect;
            mask-composite: intersect;
          }

          .fraying-image {
            filter: contrast(1.1) saturate(1.2);
            transition: all 0.3s ease;
          }

          .fraying-image:hover {
            filter: contrast(1.15) saturate(1.3);
            transform: scale(1.02);
          }

          /* Subtle animation for fraying edges */
          @keyframes frayingMotion {
            0%, 100% { 
              -webkit-mask-position: 0% 0%, 2% 5%, -1% 3%, 1% -2%, -2% 1%, 3% -1%, -1% 2%, 2% -3%, 0% 0%;
              mask-position: 0% 0%, 2% 5%, -1% 3%, 1% -2%, -2% 1%, 3% -1%, -1% 2%, 2% -3%, 0% 0%;
            }
            50% { 
              -webkit-mask-position: 1% 2%, -1% -2%, 2% -1%, -2% 3%, 1% -1%, -3% 2%, 2% -1%, -1% 2%, 0% 0%;
              mask-position: 1% 2%, -1% -2%, 2% -1%, -2% 3%, 1% -1%, -3% 2%, 2% -1%, -1% 2%, 0% 0%;
            }
          }

          .fraying-mask-right, .fraying-mask-bottom {
            animation: frayingMotion 8s ease-in-out infinite;
          }

          /* Additional organic texture overlay */
          .fraying-mask-right::before,
          .fraying-mask-bottom::before {
            content: '';
            position: absolute;
            inset: 0;
            background: 
              radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 1px, transparent 2px),
              radial-gradient(circle at 70% 40%, rgba(255,255,255,0.08) 1px, transparent 2px),
              radial-gradient(circle at 20% 60%, rgba(255,255,255,0.12) 1px, transparent 2px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.09) 1px, transparent 2px);
            background-size: 20px 20px, 25px 25px, 30px 30px, 35px 35px;
            pointer-events: none;
            mix-blend-mode: soft-light;
            opacity: 0.6;
          }

          /* Enhanced edge bleeding effect */
          .fraying-mask-right::after {
            content: '';
            position: absolute;
            top: 0;
            right: -20px;
            width: 40px;
            height: 100%;
            background: linear-gradient(to right, 
              rgba(var(--background), 0) 0%,
              rgba(var(--background), 0.1) 30%,
              rgba(var(--background), 0.3) 60%,
              rgba(var(--background), 0.6) 80%,
              rgba(var(--background), 0.9) 100%
            );
            filter: blur(2px);
            pointer-events: none;
          }

          .fraying-mask-bottom::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            width: 100%;
            height: 40px;
            background: linear-gradient(to bottom, 
              rgba(var(--background), 0) 0%,
              rgba(var(--background), 0.1) 30%,
              rgba(var(--background), 0.3) 60%,
              rgba(var(--background), 0.6) 80%,
              rgba(var(--background), 0.9) 100%
            );
            filter: blur(2px);
            pointer-events: none;
          }

          /* Organic paper texture for enhanced realism */
          @media (min-width: 768px) {
            .fraying-mask-right {
              background-image: 
                radial-gradient(circle at 100% 50%, transparent 2px, rgba(0,0,0,0.02) 3px, transparent 4px);
              background-size: 8px 8px;
            }
          }

          @media (max-width: 767px) {
            .fraying-mask-bottom {
              background-image: 
                radial-gradient(circle at 50% 100%, transparent 2px, rgba(0,0,0,0.02) 3px, transparent 4px);
              background-size: 8px 8px;
            }
          }
        `,
        }}
      />
    </div>
  );
}
