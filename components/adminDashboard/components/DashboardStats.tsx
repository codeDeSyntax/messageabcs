import React from "react";
import { BookOpen, MessageCircle, MessageSquare, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  totalTopics?: number;
  pendingQuestions?: number;
  totalAnswers?: number;
  activeUsers?: number;
  loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTopics = 0,
  pendingQuestions = 0,
  totalAnswers = 0,
  activeUsers = 0,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-background rounded-2xl shadow-none border-0 px-6 py-6 font-mono relative overflow-hidden">
        {/* Islamic Geometric Pattern Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="w-full h-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="islamicPattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M65,35 L35,65"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicPattern)" />
          </svg>
        </div>

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-amber-100/10 pointer-events-none"></div>

        {/* Content */}
        <div className="max-w-2xl space-y-3 text-sm relative z-10">
          <div className="text-center mb-4">
            <Skeleton className="h-6 w-48 mx-auto" />
            <div className="border-t border-dashed border-border/40 mt-3"></div>
          </div>

          {/* Skeleton Stats */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}

          <div className="border-t border-dashed border-border/40 my-4"></div>

          <div className="text-center">
            <Skeleton className="h-3 w-40 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-2xl shadow-none border-0 px-6 py-6 font-mono relative overflow-hidden">
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="islamicPattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M65,35 L35,65"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicPattern)" />
        </svg>
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-amber-100/10 pointer-events-none"></div>

      {/* Content */}
      <div className="max-w-2xl space-y-3 text-sm relative z-10">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">
            Dashboard Overview
          </h3>
          <div className="border-t border-dashed border-border/40 mt-3"></div>
        </div>

        {/* Total Topics */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-xs uppercase">
              Total Topics
            </span>
          </div>
          <div className="text-foreground font-bold text-lg">{totalTopics}</div>
        </div>

        {/* Pending Questions */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-muted-foreground text-xs uppercase">
              Pending Questions
            </span>
          </div>
          <div className="text-foreground font-bold text-lg">{pendingQuestions}</div>
        </div>

        {/* Total Answers */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground text-xs uppercase">
              Total Answers
            </span>
          </div>
          <div className="text-foreground font-bold text-lg">{totalAnswers}</div>
        </div>

        {/* Active Users */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-muted-foreground text-xs uppercase">
              Active Users
            </span>
          </div>
          <div className="text-foreground font-bold text-lg">{activeUsers}</div>
        </div>

        <div className="border-t border-dashed border-border/40 my-4"></div>

        <div className="text-center text-xs text-muted-foreground uppercase tracking-wider">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
