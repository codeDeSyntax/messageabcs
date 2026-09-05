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
  index?: number;
  viewMode?: "grid" | "list";
}

export const TopicCardSkeleton: React.FC<TopicCardSkeletonProps> = ({
  className = "",
  index = 0,
}) => {
  const isOdd = index % 2 !== 0;

  return (
    <div
      className={`py-3.5 sm:py-4 px-3 sm:px-4 border-b border-border/80 flex items-stretch sm:items-start justify-between gap-3 sm:gap-5 ${
        isOdd ? "bg-primary/[0.09]" : "bg-primary/[0.015]"
      } ${className}`}
    >
      {/* Left: Text Skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Author / Source Meta Bar */}
        <div className="flex items-center gap-2">
          <LoadingSkeleton variant="circular" className="w-4 h-4" />
          <LoadingSkeleton variant="text" className="h-3 w-20" />
          <LoadingSkeleton variant="text" className="h-3 w-14" />
        </div>

        {/* Title */}
        <div className="space-y-1 pt-0.5">
          <LoadingSkeleton variant="text" className="h-4 w-4/5" />
        </div>

        {/* Excerpt */}
        <div className="space-y-1">
          <LoadingSkeleton variant="text" className="h-3 w-full opacity-70" />
          <LoadingSkeleton variant="text" className="h-3 w-3/4 opacity-70" />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-3 pt-1">
          <LoadingSkeleton variant="text" className="h-3 w-16" />
          <LoadingSkeleton variant="text" className="h-3 w-14" />
        </div>
      </div>

      {/* Right: Thumbnail Skeleton */}
      <div className="flex-shrink-0 self-stretch sm:self-start flex">
        <LoadingSkeleton
          variant="rectangular"
          className="w-20 sm:w-28 md:w-36 h-full min-h-[5.5rem] sm:min-h-0 sm:h-20 md:h-24 rounded-lg"
        />
      </div>
    </div>
  );
};

interface TopicGridSkeletonProps {
  count?: number;
  className?: string;
  viewMode?: "grid" | "list";
}

export const TopicGridSkeleton: React.FC<TopicGridSkeletonProps> = ({
  count = 6,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <TopicCardSkeleton key={`topic-skel-${index}`} index={index} />
      ))}
    </div>
  );
};



