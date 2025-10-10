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
          background:
            "relative bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-gray-800/50",
          gradientOverlay: (
            <>
              {/* Primary blue gradient spot - top right */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/30 dark:bg-blue-400/20 rounded-full blur-2xl"></div>
              {/* Secondary blue spot - bottom left */}
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-600/25 dark:bg-blue-500/15 rounded-full blur-xl"></div>
              {/* Accent spot - center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-400/20 dark:bg-blue-300/10 rounded-full blur-xl"></div>
            </>
          ),
          iconBg:
            "bg-gradient-to-br from-blue-100/80 to-blue-200/60 dark:from-blue-900/40 dark:to-blue-800/30",
          iconColor: "text-blue-600 dark:text-blue-400",
        };
      case "Pending Questions":
        return {
          background:
            "relative bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-gray-800/50",
          gradientOverlay: (
            <>
              {/* Primary blue gradient spot - top left */}
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-blue-600/25 dark:bg-blue-500/15 rounded-full blur-2xl"></div>
              {/* Secondary cyan spot - bottom right */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-cyan-500/30 dark:bg-cyan-400/18 rounded-full blur-xl"></div>
              {/* Accent spot - center right */}
              <div className="absolute top-1/3 right-4 w-16 h-16 bg-blue-300/25 dark:bg-blue-200/12 rounded-full blur-lg"></div>
            </>
          ),
          iconBg:
            "bg-gradient-to-br from-cyan-100/80 to-blue-200/60 dark:from-cyan-900/40 dark:to-blue-800/30",
          iconColor: "text-cyan-600 dark:text-cyan-400",
        };
      default:
        return {
          background:
            "bg-white/15 dark:bg-black/15 backdrop-blur-sm border border-blue-500/10",
          gradientOverlay: null,
          iconBg: "bg-blue-50/60 dark:bg-blue-900/15",
          iconColor: "text-blue-500",
        };
    }
  };

  const cardStyles = getCardStyles();

  return (
    <Card
      className={`${cardStyles.background} hover:border-white/30 dark:hover:border-gray-700/60 transition-all duration-500  hover:shadow-xl overflow-hidden group`}
    >
      {/* Abstract gradient overlay */}
      {cardStyles.gradientOverlay}

      {/* Subtle shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp
                  className={`h-3 w-3 ${
                    trend === "up"
                      ? "text-green-500"
                      : trend === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div
            className={`w-12 h-12 ${cardStyles.iconBg} rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm border border-white/20 dark:border-gray-700/30`}
          >
            <Icon className={`h-6 w-6 ${cardStyles.iconColor}`} />
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
    []
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
          (q) => q.answers && q.answers.length > 0
        ).length;
        calculatedStats.pendingQuestions =
          calculatedStats.totalQuestions - answeredQuestions;
        calculatedStats.answeredPercentage =
          calculatedStats.totalQuestions > 0
            ? Math.round(
                (answeredQuestions / calculatedStats.totalQuestions) * 100
              )
            : 0;
      }

      // Calculate answers from questions data
      if (questionsResponse.success && questionsResponse.data) {
        calculatedStats.totalAnswers = questionsResponse.data.reduce(
          (total, q) => total + (q.answers?.length || 0),
          0
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
          activityError
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
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            Pending
          </Badge>
        );
      case "answered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
          >
            Answered
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
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
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "answer":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "topic":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="bg-white/15 dark:bg-biblical-navy/25 backdrop-blur-sm border-biblical-blue/20"
            >
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-biblical-blue/20 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-biblical-blue/20 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-biblical-blue/20 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-scrollbar">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-white/15 dark:bg-black/5 backdrop-blur-sm border-blue-500/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto no-scrollbar p-2 space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/30 dark:bg-blue-900/20 border border-blue-500/5"
                >
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {activity.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {activity.user}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <Button
                variant="outline"
                className="w-full border-blue-500/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/20 transition-all duration-300"
              >
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/15 dark:bg-black/5 backdrop-blur-sm border-blue-500/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex  items-center gap-2 text-foreground">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleCreateTopic}
              className="w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              <BookOpen className="h-4 w-4" />
              Create New Topic
            </Button>
            <Button
              onClick={handleManageTopics}
              variant="outline"
              className="w-full justify-start gap-3 border-blue-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.02]"
            >
              <Settings className="h-4 w-4" />
              Manage Topics
            </Button>
            <Button
              onClick={handleReviewQuestions}
              variant="outline"
              className="w-full justify-start gap-3 border-blue-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" />
              Review Pending Questions
            </Button>
            <Button
              onClick={handleManageAnswers}
              variant="outline"
              className="w-full justify-start gap-3 border-blue-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageSquare className="h-4 w-4" />
              Manage Answers
            </Button>
            <Button
              onClick={handleUserManagement}
              variant="outline"
              className="w-full justify-start gap-3 border-blue-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/40 transition-all duration-200 hover:scale-[1.02] opacity-75"
            >
              <Users className="h-4 w-4" />
              User Management
              <Badge variant="secondary" className="ml-auto text-xs">
                Coming Soon
              </Badge>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
