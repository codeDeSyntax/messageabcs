import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  MessageCircle,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

// Props interface for dashboard section switching
interface DashboardOverviewProps {
  onSectionChange?: (section: "topics" | "questions" | "answers") => void;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
}) => {
  // Define sophisticated gradient styles with focused color spots
  const getCardStyles = () => {
    switch (title) {
      case "Total Topics":
        return {
          background: "relative bg-background/10 backdrop-blur-sm border-none",
          gradientOverlay: (
            <>
              {/* Primary gradient spot - top right */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
              {/* Secondary spot - bottom left */}
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent/25 rounded-full blur-xl"></div>
              {/* Accent spot - center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
            </>
          ),
          iconBg: "bg-gradient-to-br from-primary/80 to-accent/60",
          iconColor: "text-primary-foreground",
        };
      case "Pending Questions":
        return {
          background: "relative bg-background backdrop-blur-sm border-none",
          gradientOverlay: (
            <>
              {/* Primary gradient spot - top left */}
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-primary/25 rounded-full blur-2xl"></div>
              {/* Secondary spot - bottom right */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-secondary/30 rounded-full blur-xl"></div>
              {/* Accent spot - center right */}
              <div className="absolute top-1/3 right-4 w-16 h-16 bg-primary/25 rounded-full blur-lg"></div>
            </>
          ),
          iconBg: "bg-gradient-to-br from-secondary/80 to-accent/60",
          iconColor: "text-cyan-600",
        };
      default:
        return {
          background: "bg-primary/10 backdrop-blur-sm",
          gradientOverlay: null,
          iconBg: "bg-muted",
          iconColor: "text-primary",
        };
    }
  };

  const cardStyles = getCardStyles();

  return (
    <Card
      className={`${cardStyles.background} transition-all duration-300  hover:-translate-y-0.5 overflow-hidden group border-none border-border/40 shadow-none`}
    >
      {/* Abstract gradient overlay */}
      {/* {cardStyles.gradientOverlay} */}

      {/* Subtle shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp
                  className={`h-4 w-4 ${
                    trend === "up"
                      ? "text-green-500"
                      : trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div
            className={`w-14 h-14 ${cardStyles.iconBg} rounded-2xl flex items-center justify-center shadow-md backdrop-blur-sm border border-border/30 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`h-7 w-7 ${cardStyles.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalTopics: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingQuestions: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    responseTime: 0,
    answeredPercentage: 0,
  });

  // Navigation handlers
  const handleCreateTopic = () => {
    router.push("/topics/new");
    toast({
      title: "Navigating...",
      description: "Taking you to create a new topic",
    });
  };

  const handleManageTopics = () => {
    if (onSectionChange) {
      onSectionChange("topics");
      toast({
        title: "Topics Manager",
        description: "Switched to topics management section",
      });
    }
  };

  const handleReviewQuestions = () => {
    if (onSectionChange) {
      onSectionChange("questions");
      toast({
        title: "Questions Manager",
        description: "Switched to questions management section",
      });
    }
  };

  const handleManageAnswers = () => {
    if (onSectionChange) {
      onSectionChange("answers");
      toast({
        title: "Answers Manager",
        description: "Switched to answers management section",
      });
    }
  };

  const handleUserManagement = () => {
    // For now, show a toast as user management might not be implemented yet
    toast({
      title: "Coming Soon",
      description: "User management feature is under development",
      variant: "default",
    });
  };
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Use public endpoints that actually exist on backend
      const [topicsResponse, questionsResponse] = await Promise.all([
        apiService.getTopics({ page: 1, limit: 50 }),
        apiService.getQuestions({ page: 1, limit: 50 }),
      ]);

      // Calculate stats from actual data
      const calculatedStats = {
        totalTopics: 0,
        totalQuestions: 0,
        totalAnswers: 0,
        pendingQuestions: 0,
        totalUsers: 0,
        monthlyGrowth: 0,
        responseTime: 0,
        answeredPercentage: 0,
      };

      if (topicsResponse.success && topicsResponse.data) {
        calculatedStats.totalTopics = topicsResponse.data.length;
      }

      if (questionsResponse.success && questionsResponse.data) {
        calculatedStats.totalQuestions = questionsResponse.data.length;
        // Calculate pending vs answered based on answers array
        const answeredQuestions = questionsResponse.data.filter(
          (q) => q.answers && q.answers.length > 0,
        ).length;
        calculatedStats.pendingQuestions =
          calculatedStats.totalQuestions - answeredQuestions;
        calculatedStats.answeredPercentage =
          calculatedStats.totalQuestions > 0
            ? Math.round(
                (answeredQuestions / calculatedStats.totalQuestions) * 100,
              )
            : 0;
      }

      // Calculate answers from questions data
      if (questionsResponse.success && questionsResponse.data) {
        calculatedStats.totalAnswers = questionsResponse.data.reduce(
          (total, q) => total + (q.answers?.length || 0),
          0,
        );
      }

      setStats(calculatedStats);

      // Fetch recent activity from the dedicated endpoint
      try {
        const activityResponse = await apiService.getRecentActivity({
          limit: 8,
        });
        if (activityResponse.success && activityResponse.data) {
          const activities = activityResponse.data.map((activity) => ({
            id: activity.id,
            type: activity.type,
            action: activity.action,
            title: activity.title,
            description: activity.description,
            user: activity.user,
            timestamp: new Date(activity.timestamp).toLocaleDateString(),
            status: activity.status,
            relatedId: activity.relatedId,
          }));
          setRecentActivity(activities);
        }
      } catch (activityError) {
        console.warn(
          "Failed to fetch recent activity, using fallback:",
          activityError,
        );
        // Fallback to question data if activity endpoint fails
        if (questionsResponse.success && questionsResponse.data) {
          const recentQuestions = questionsResponse.data
            .slice(0, 5)
            .map((q) => ({
              id: q.id.toString(),
              type: "question" as const,
              action: "created" as const,
              title: q.question,
              user: q.askedBy || "Anonymous",
              timestamp: new Date(q.dateAsked).toLocaleDateString(),
              status: (q.answers && q.answers.length > 0
                ? "answered"
                : "pending") as "pending" | "answered" | "published",
            }));
          setRecentActivity(recentQuestions);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: "Total Topics",
      value: stats.totalTopics,
      change: `${stats.monthlyGrowth > 0 ? "+" : ""}${
        stats.monthlyGrowth
      }% this month`,
      icon: BookOpen,
      trend:
        stats.monthlyGrowth > 0
          ? ("up" as const)
          : stats.monthlyGrowth < 0
            ? ("down" as const)
            : ("neutral" as const),
    },
    {
      title: "Pending Questions",
      value: stats.pendingQuestions,
      change: `${stats.answeredPercentage}% answered`,
      icon: MessageCircle,
      trend: "neutral" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "answered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Answered
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            Published
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question":
        return <MessageCircle className="h-4 w-4 text-primary" />;
      case "answer":
        return <MessageSquare className="h-4 w-4 text-accent" />;
      case "topic":
        return <BookOpen className="h-4 w-4 text-primary" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <Card className="bg-background rounded-2xl border-0 flex-1 flex flex-col shadow-none">
          <CardHeader className="pb-3 px-5 pt-5 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-5 flex-1 overflow-hidden">
            <div className="space-y-2 h-full overflow-y-auto no-scrollbar">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-border/20"
                >
                  {/* Icon skeleton */}
                  <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                    <Skeleton className="h-4 w-4" />
                  </div>
                  {/* Content skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3 w-20" />
                      <span className="text-xs text-muted-foreground">•</span>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  {/* Badge skeleton */}
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Recent Activity - Full Height */}
      <Card className="bg-background rounded-2xl  border-0  flex-1 flex flex-col shadow-none">
        <CardHeader className="pb-3 px-5 pt-5 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-foreground text-sm font-semibold">
            <Clock className="h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-5 flex-1 overflow-hidden">
          <div className="space-y-2 h-full overflow-y-auto no-scrollbar">
            {recentActivity.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-sm"
              >
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-muted-foreground truncate">
                      {activity.user}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs shrink-0 rounded-full"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
