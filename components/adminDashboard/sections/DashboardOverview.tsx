import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  MessageCircle,
  MessageSquare,
  ChevronRight,
  Activity as ActivityIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService } from "@/services/api";

interface DashboardOverviewProps {
  onSectionChange?: (section: "topics" | "questions" | "answers") => void;
  embedded?: boolean;
}

interface RecentActivityItem {
  id: string;
  type: "question" | "answer" | "topic" | "message";
  action: "created" | "updated" | "deleted" | "answered" | "replied";
  title: string;
  description?: string;
  user: string;
  timestamp: string;
  status: "pending" | "answered" | "published" | "draft" | "archived";
  relatedId?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSectionChange,
  embedded = false,
}) => {
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      try {
        const activityResponse = await apiService.getRecentActivity({
          limit: 10,
        });
        if (activityResponse.success && activityResponse.data) {
          const activities = activityResponse.data.map((activity) => ({
            id: activity.id,
            type: activity.type,
            action: activity.action,
            title: activity.title,
            description: activity.description,
            user: activity.user,
            timestamp: new Date(activity.timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: activity.status,
            relatedId: activity.relatedId,
          }));
          setRecentActivity(activities);
        }
      } catch (activityError) {
        console.warn("Failed to fetch recent activity, using fallback:", activityError);
        const questionsResponse = await apiService.getQuestions({ page: 1, limit: 10 });
        if (questionsResponse.success && questionsResponse.data) {
          const fallback = questionsResponse.data.slice(0, 8).map((q) => ({
            id: q.id.toString(),
            type: "question" as const,
            action: "created" as const,
            title: q.question,
            user: q.askedBy || "Community Member",
            timestamp: new Date(q.dateAsked).toLocaleDateString(),
            status: (q.answers && q.answers.length > 0 ? "answered" : "pending") as "pending" | "answered",
          }));
          setRecentActivity(fallback);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question":
        return <MessageCircle className="h-4 w-4 text-[var(--theme-text-secondary)]" />;
      case "answer":
        return <MessageSquare className="h-4 w-4 text-[var(--theme-primary)]" />;
      case "topic":
        return <BookOpen className="h-4 w-4 text-[var(--theme-accent)]" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-[var(--theme-text-secondary)]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
            Pending
          </span>
        );
      case "answered":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Answered
          </span>
        );
      case "published":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]">
            Published
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-surface-subtle)] text-[var(--theme-text-secondary)]">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    if (embedded) {
      return (
        <div>
          <div className="p-4 md:p-5 pb-3 border-b border-[var(--theme-border-subtle)]">
            <Skeleton className="h-5 w-36 mb-1" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <div className="divide-y divide-[var(--theme-border-subtle)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-2xl overflow-hidden divide-y divide-[var(--theme-border-subtle)] p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activityListContent = (
    <div className="flex flex-col">
      <div className="px-4 py-2.5 border-b border-[var(--theme-border-subtle)] flex items-center justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--theme-text-primary)] tracking-tight">
            Recent Activity
          </h3>
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Audit log of content updates, answered inquiries, and administrative actions
          </p>
        </div>
      </div>

      <div className="divide-y divide-[var(--theme-border-subtle)]">
        {recentActivity.length === 0 ? (
          <div className="p-6 text-center text-[var(--theme-text-secondary)] text-xs">
            No recent activity recorded yet.
          </div>
        ) : (
          recentActivity.map((activity) => (
            <div
              key={activity.id}
              onClick={() => {
                if (activity.type === "topic" && onSectionChange) {
                  onSectionChange("topics");
                } else if (activity.type === "question" && onSectionChange) {
                  onSectionChange("questions");
                } else if (activity.type === "answer" && onSectionChange) {
                  onSectionChange("answers");
                }
              }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--theme-surface-hover)] cursor-pointer transition-all duration-150 rounded-xl group"
            >
              {/* Left: Icon + Activity Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--theme-surface-subtle)] group-hover:scale-105 transition-transform">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)] truncate group-hover:text-[var(--theme-text-dark)]">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--theme-text-secondary)]">
                    <span className="font-medium">{activity.user}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Right: Status Badge + Chevron */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {getStatusBadge(activity.status)}
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-all">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (embedded) {
    return <div>{activityListContent}</div>;
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-none divide-y divide-[var(--theme-border-subtle)]">
      {activityListContent}
    </div>
  );
};

export default DashboardOverview;
