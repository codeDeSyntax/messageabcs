import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ArrowLeft,
  Moon,
  Sun,
  Search,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Logo } from "@/components/Logo";
import { apiService } from "@/services/api";

// Import dashboard sections
import DashboardOverview from "./sections/DashboardOverview";
import TopicsManager from "./sections/TopicsManager";
import QuestionsManager from "./sections/QuestionsManager";

// Import modular components
import { DashboardStats } from "./components/DashboardStats";
import { QuickActions } from "./components/QuickActions";
import { DashboardSection, NavItem } from "./types";
import AnswersManager from "./sections/AnswersManager";
import {
  AdminDashboardProvider,
  useAdminDashboard,
} from "@/contexts/AdminDashboardContext";
import { Input } from "@/components/ui/input";

const AdminDashboardContent: React.FC = () => {
  const { activeSection, setActiveSection, searchTerm, setSearchTerm } =
    useAdminDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTopics: 0,
    pendingQuestions: 0,
    totalAnswers: 0,
    activeUsers: 0,
  });
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [topicsResponse, questionsResponse] = await Promise.all([
          apiService.getTopics({ page: 1, limit: 100 }),
          apiService.getQuestions({ page: 1, limit: 100 }),
        ]);

        let totalTopics = 0;
        let pendingQuestions = 0;
        let totalAnswers = 0;

        if (topicsResponse.success && topicsResponse.data) {
          totalTopics = topicsResponse.data.length;
        }

        if (questionsResponse.success && questionsResponse.data) {
          const totalQuestions = questionsResponse.data.length;
          const answeredQuestions = questionsResponse.data.filter(
            (q) => q.answers && q.answers.length > 0,
          ).length;
          pendingQuestions = totalQuestions - answeredQuestions;

          totalAnswers = questionsResponse.data.reduce(
            (total, q) => total + (q.answers?.length || 0),
            0,
          );
        }

        setStats({
          totalTopics,
          pendingQuestions,
          totalAnswers,
          activeUsers: 0, // This would need a separate users endpoint
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleBackNavigation = () => {
    router.back();
  };

  const navItems: NavItem[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "topics", label: "Topics", icon: BookOpen },
    { id: "questions", label: "Questions", icon: MessageCircle, badge: 5 },
    { id: "answers", label: "Answers", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderActiveSection = React.useMemo(() => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6" key="overview">
            <DashboardStats
              totalTopics={stats.totalTopics}
              pendingQuestions={stats.pendingQuestions}
              totalAnswers={stats.totalAnswers}
              activeUsers={stats.activeUsers}
              loading={statsLoading}
            />
            <QuickActions onActionClick={setActiveSection} />

            {/* Recent Activity - Show on mobile below stats/actions */}
            <div className="xl:hidden">
              <DashboardOverview onSectionChange={setActiveSection} />
            </div>
          </div>
        );
      case "topics":
        return <TopicsManager key="topics" />;
      case "questions":
        return <QuestionsManager key="questions" />;
      case "answers":
        return <AnswersManager key="answers" />;
      case "settings":
        return (
          <Card
            key="settings"
            className="bg-background/60 backdrop-blur-xl border border-border/40"
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Settings
              </h2>
              <p className="text-muted-foreground">
                Settings panel coming soon...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return <TopicsManager key="default" />;
    }
  }, [activeSection, setActiveSection]);

  return (
    <div className="h-screen max-w-[78rem] m-auto overflow-hidden relative">
      {/* Top Navigation Bar */}
      <header className="m-auto left-0 right-0 z-50 border-0">
        <div className="px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Nav */}
            <div className="flex items-center gap-2 md:gap-8 flex-1 min-w-0">
              {/* Logo - Always visible on mobile */}
              <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
                <Logo variant="compact" />
              </div>

              {/* Horizontal Navigation - Desktop */}
              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      className={`
                        flex items-center gap-2 px-2 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary/15 text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }
                      `}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSearchTerm(""); // Clear search when switching tabs
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Unified Search Bar - Show only for searchable sections */}
              {(activeSection === "topics" ||
                activeSection === "questions" ||
                activeSection === "answers") && (
                <div className="hidden xl:flex relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder={
                      activeSection === "topics"
                        ? "Search topics..."
                        : activeSection === "questions"
                          ? "Search questions, topics, or users..."
                          : "Search answers, questions, or authors..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm"
                  />
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="hidden md:flex p-2 hover:bg-muted rounded-xl"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Button> */}

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border/40">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <Logo className="h-8 text-[10px]" />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-xl"
              >
                <div className="flex flex-col gap-1 w-5 h-5 items-end justify-center">
                  <span className="w-5 h-0.5 bg-muted-foreground rounded-full transition-all" />
                  <span className="w-4 h-0.5 bg-muted-foreground rounded-full transition-all" />
                  <span className="w-3 h-0.5 bg-muted-foreground rounded-full transition-all" />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar - Show below header on mobile for searchable sections */}
          {(activeSection === "topics" ||
            activeSection === "questions" ||
            activeSection === "answers") && (
            <div className="mt-3 xl:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder={
                    activeSection === "topics"
                      ? "Search topics..."
                      : activeSection === "questions"
                        ? "Search questions..."
                        : "Search answers..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm w-full"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] flex overflow-hidden px-2 md:px-6 pb-2 md:pb-6 gap-2 md:gap-3">
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto no-scrollbar">
          <Card className="h-full bg-[#f9e4b5] rounded-xl md:rounded-2xl border-0 overflow-hidden shadow-none">
            <div className="p-3 md:p-6 h-full overflow-auto no-scrollbar">
              {renderActiveSection}
            </div>
          </Card>
        </main>

        {/* Right Sidebar - Recent Activity Only */}
        <aside className="hidden xl:block w-[26rem] overflow-auto no-scrollbar">
          <DashboardOverview onSectionChange={setActiveSection} />
        </aside>
      </div>

      {/* Mobile Navigation Menu */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] bg-background/95 backdrop-blur-xl  border-none border-border/20 rounded-l-2xl "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <Logo />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Admin Panel
                    </p>
                    <p className="text-xs text-muted-foreground">Dashboard</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-muted/50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-auto no-scrollbar">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      className={`
                        w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 text-left group
                        ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        }
                      `}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                        setSearchTerm(""); // Clear search when switching tabs
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 transition-all ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground/40 group-hover:text-foreground/60"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-3 border-t border-border/20 space-y-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-destructive/10 hover:text-destructive text-left group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-destructive/60" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardContent />
    </AdminDashboardProvider>
  );
};

export default AdminDashboard;
