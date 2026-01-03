import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export const ReadingLoadingState = () => (
  <Card className="h-full bg-background/20 backdrop-blur-sm border-border">
    <CardContent className="p-6 h-full">
      <div className="space-y-6 h-full">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="rectangular" className="h-8 w-32" />
          <LoadingSkeleton variant="circular" className="h-8 w-8" />
        </div>

        {/* Title Skeleton */}
        <div className="text-center space-y-3">
          <LoadingSkeleton variant="text" className="h-8 w-64 mx-auto" />
          <LoadingSkeleton variant="text" className="h-5 w-48 mx-auto" />
        </div>

        {/* Image Skeleton */}
        <div className="flex justify-center">
          <LoadingSkeleton
            variant="rectangular"
            className="h-20 w-72 rounded-lg"
          />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <LoadingSkeleton variant="text" lines={3} className="h-4" />
          <LoadingSkeleton variant="text" lines={2} className="h-4" />
        </div>

        {/* Navigation Dots Skeleton */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              variant="circular"
              className="h-3 w-3"
            />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
