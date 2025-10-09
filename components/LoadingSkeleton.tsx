import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}) => {
  // Glass-style shimmer that matches our theme
  const baseClasses =
    "animate-shimmer bg-gradient-to-r from-white/10 via-white/20 to-white/10 dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-[length:200%_100%]";

  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
    card: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
            style={index === 0 ? style : {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

interface TopicCardSkeletonProps {
  className?: string;
  viewMode?: "grid" | "list";
}

export const TopicCardSkeleton: React.FC<TopicCardSkeletonProps> = ({
  className = "",
  viewMode = "grid",
}) => {
  // Add style support to LoadingSkeleton props temporarily
  const ClippedLoadingSkeleton = ({
    className: skeletonClassName,
  }: {
    className: string;
  }) => (
    <div
      className={`animate-shimmer border-none bg-gradient-to-r from-white/10 via-white/20 to-white/10 dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-[length:200%_100%] ${skeletonClassName}`}
      style={{
        clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    />
  );

  // Desktop List View Skeleton
  if (viewMode === "list") {
    return (
      <div
        className={`flex items-start gap-0 p-0 bg-white dark:bg-blue-900/20 rounded-lg border border-gray-200/50 dark:border-gray-700/50 h-20 w-3/4 m-auto ${className}`}
      >
        {/* Left: Square Image Skeleton */}
        <div className="flex-shrink-0 w-32 h-full rounded-l-lg overflow-hidden">
          <LoadingSkeleton variant="rectangular" className="w-full h-full" />
        </div>

        {/* Center: Title and Subtitle Skeleton */}
        <div className="flex-1 min-w-0 p-4 space-y-2">
          <LoadingSkeleton variant="text" className="h-4 w-32" />
          <LoadingSkeleton variant="text" className="h-3 w-24" />
        </div>

        {/* Right: Three dots menu skeleton */}
        <div className="flex-shrink-0 p-4">
          <div className="flex flex-col space-y-0.5">
            <LoadingSkeleton variant="circular" className="w-1 h-1" />
            <LoadingSkeleton variant="circular" className="w-1 h-1" />
            <LoadingSkeleton variant="circular" className="w-1 h-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Skeleton */}
      <div
        className={`relative group cursor-pointer transition-all duration-300 md:hidden h-24 rounded-lg border-none bg-card/40 flex items-center space-x-3 shadow-sm ${className}`}
      >
        {/* Mobile - Avatar Image Skeleton */}
        <div className="flex-shrink-0">
          <LoadingSkeleton
            variant="rectangular"
            className="w-20 h-20 rounded-br-3xl border-2 border-blue-500/20"
          />
        </div>

        {/* Mobile - Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-1">
          <LoadingSkeleton variant="text" className="h-4 w-32" />
          <LoadingSkeleton variant="text" className="h-3 w-24" />
        </div>

        {/* Mobile - Clipped Action Button Skeleton */}
        <div className="absolute bottom-0 right-0 z-20">
          <ClippedLoadingSkeleton className="w-12 h-8" />
        </div>
      </div>

      {/* Desktop Grid Card Skeleton */}
      <div className="hidden md:block cursor-pointer transition-all duration-300">
        <div className="relative flex flex-col items-start gap-0 p-0 bg-white dark:bg-blue-900/10 rounded-lg border border-gray-200/30 dark:border-gray-700/30 shadow-sm h-60">
          {/* Top: Image and Action Button Skeleton */}
          <div className="flex-shrink-0 flex justify-between items-center w-full h-1/2 rounded-l-lg overflow-hidden relative">
            <LoadingSkeleton
              variant="rectangular"
              className="w-[80%] h-full m-2 rounded-r-3xl"
            />

            {/* Action Button Skeleton */}
            <LoadingSkeleton
              variant="rectangular"
              className="absolute right-3 w-[35%] h-10 rounded-xl"
            />
          </div>

          {/* Bottom: Title and Subtitle Skeleton */}
          <div className="flex-1 min-w-0 p-4 space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-32" />
            <LoadingSkeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
      </div>
    </>
  );
};

interface TopicGridSkeletonProps {
  count?: number;
  className?: string;
  viewMode?: "grid" | "list";
}

export const TopicGridSkeleton: React.FC<TopicGridSkeletonProps> = ({
  count = 8,
  className = "",
  viewMode = "grid",
}) => {
  return (
    <div className={className}>
      {/* Desktop: Board-style Layout with View Mode Support */}
      <div className="hidden md:block">
        <div
          className={`${
            viewMode === "grid"
              ? "w-3/4 m-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr"
              : "space-y-3"
          }`}
        >
          {Array.from({ length: count }).map((_, index) => (
            <TopicCardSkeleton key={`desktop-${index}`} viewMode={viewMode} />
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Grid Layout */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
          {Array.from({ length: count }).map((_, index) => (
            <TopicCardSkeleton key={`mobile-${index}`} viewMode="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};
