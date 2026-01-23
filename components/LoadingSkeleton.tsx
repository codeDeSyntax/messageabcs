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
  // Enhanced shimmer with better colors and smoother animation
  const baseClasses =
    "animate-shimmer bg-gradient-to-r from-muted/40 via-primary/20 to-muted/40 bg-[length:200%_100%] relative overflow-hidden";

  const variantClasses = {
    text: "h-4 rounded-md",
    rectangular: "rounded-lg",
    circular: "rounded-full",
    card: "rounded-xl",
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
      className={`animate-shimmer border-none bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 bg-[length:200%_100%] ${skeletonClassName}`}
      style={{
        clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }}
    />
  );

  // Desktop List View Skeleton
  if (viewMode === "list") {
    return (
      <div
        className={`flex items-center gap-4 p-3 bg-muted/30 rounded-xl h-20 w-full max-w-4xl mx-auto ${className}`}
      >
        {/* Left: Image Skeleton with pulse */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
          <LoadingSkeleton variant="rectangular" className="w-full h-full" />
        </div>

        {/* Center: Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <LoadingSkeleton variant="text" className="h-4 w-48" />
          <LoadingSkeleton variant="text" className="h-3 w-32 opacity-70" />
        </div>

        {/* Right: Badge Skeleton */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <LoadingSkeleton
            variant="rectangular"
            className="w-14 h-6 rounded-full"
          />
          <LoadingSkeleton variant="circular" className="w-7 h-7" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Skeleton */}
      <div
        className={`relative group cursor-pointer transition-all duration-300 md:hidden h-20 rounded-xl bg-muted/30 flex items-center space-x-3 p-2 ${className}`}
      >
        {/* Mobile - Avatar Image Skeleton */}
        <div className="flex-shrink-0">
          <LoadingSkeleton
            variant="rectangular"
            className="w-16 h-16 rounded-lg"
          />
        </div>

        {/* Mobile - Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <LoadingSkeleton variant="text" className="h-4 w-40" />
          <LoadingSkeleton variant="text" className="h-3 w-28 opacity-70" />
          <div className="flex items-center gap-2">
            <LoadingSkeleton
              variant="rectangular"
              className="h-5 w-12 rounded-full"
            />
          </div>
        </div>

        {/* Mobile - Action Icon Skeleton */}
        <div className="absolute bottom-2 right-2">
          <LoadingSkeleton variant="circular" className="w-7 h-7" />
        </div>
      </div>

      {/* Desktop Grid Card Skeleton */}
      <div className="hidden md:block cursor-pointer transition-all duration-300">
        <div className="relative flex flex-col gap-0 p-0 bg-muted/30 rounded-xl h-52 overflow-hidden">
          {/* Top: Image Section */}
          <div className="flex-shrink-0 w-full h-32 relative overflow-hidden">
            <LoadingSkeleton variant="rectangular" className="w-full h-full" />

            {/* Overlay Badge Skeleton */}
            <div className="absolute top-2 right-2">
              <LoadingSkeleton
                variant="rectangular"
                className="w-16 h-6 rounded-full"
              />
            </div>
          </div>

          {/* Bottom: Content Section */}
          <div className="flex-1 p-3 space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-3/4" />
            <LoadingSkeleton variant="text" className="h-3 w-1/2 opacity-70" />
            <div className="flex items-center gap-2 pt-1">
              <LoadingSkeleton variant="circular" className="w-5 h-5" />
              <LoadingSkeleton variant="text" className="h-3 w-14" />
            </div>
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
