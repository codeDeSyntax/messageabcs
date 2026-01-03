"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";

// Import modular components
import { ReadingEmptyState } from "@/components/Reading/components/ReadingEmptyState";
import { ReadingLoadingState } from "@/components/Reading/components/ReadingLoadingState";

function ReadingContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { isFullscreen } = useFullscreen();

  useEffect(() => {
    // No specific topic to load, just show empty state
    setIsLoading(false);
    document.title = "Reading - MessageABCs";
  }, []);

  return (
    <div className="h-screen no-scrollbar overflow-auto relative">
      {/* Keep animated background for desktop only - exactly like Vite */}
      {/* <div className="hidden md:block fixed inset-0 -z-10">
        <AnimatedBackground />
      </div> */}

      {/* Mobile Navigation Header */}
      {!isFullscreen && (
        <div className="md:hidden relative z-10 border-b border-border">
          <div className="relative w-full flex items-center justify-center px-4 py-3">
            <h1 className="text-lg font-bold text-foreground">
              Reading
            </h1>
          </div>
        </div>
      )}

      {/* Desktop Navigation Header */}
      {!isFullscreen && (
        <div className="hidden md:block relative bg-background z-10 border-b border-border">
          <div className="relative w-full flex items-center justify-center px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">
              Reading
            </h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex justify-center h-full relative z-10">
        <div className="w-full max-w-7xl h-full">
          {isLoading ? <ReadingLoadingState /> : <ReadingEmptyState />}
        </div>
      </div>

      {/* Bottom Navigation for reading page */}
      {/* {!isFullscreen && <BottomNavigation />} */}
    </div>
  );
}

export default function Reading() {
  return (
    <Suspense fallback={<ReadingLoadingState />}>
      <ReadingContent />
    </Suspense>
  );
}
