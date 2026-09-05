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
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { apiService } from "@/services/api";

// Import dashboard sections
import DashboardOverview from "./sections/DashboardOverview";
import TopicsManager from "./sections/TopicsManager";
import QuestionsManager from "./sections/QuestionsManager";
import AnswersManager from "./sections/AnswersManager";

// Import modular components
import { DashboardStats } from "./components/DashboardStats";
import { QuickActions } from "./components/QuickActions";
import { ThemeChooser } from "./components/ThemeChooser";
import { NavItem } from "./types";
import {
  AdminDashboardProvider,
  useAdminDashboard,
} from "@/contexts/AdminDashboardContext";

const AdminDashboardContent: React.FC = () => {
  const { activeSection, setActiveSection, setSearchTerm } =
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
            (q) => q.answers && q.answers.length > 0
          ).length;
          pendingQuestions = totalQuestions - answeredQuestions;

          totalAnswers = questionsResponse.data.reduce(
            (total, q) => total + (q.answers?.length || 0),
            0
          );
        }

        setStats({
          totalTopics,
          pendingQuestions,
          totalAnswers,
          activeUsers: 1,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navItems: NavItem[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "topics", label: "Topics", icon: BookOpen },
    {
      id: "questions",
      label: "Questions",
      icon: MessageCircle,
      badge: stats.pendingQuestions > 0 ? stats.pendingQuestions : undefined,
    },
    { id: "answers", label: "Answers", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderActiveSection = React.useMemo(() => {
    switch (activeSection) {
      case "overview":
        return (
          <div
            className="flex flex-col lg:flex-row items-start gap-3.5 xl:gap-5 pb-8"
            key="overview"
          >
            {/* Left Column (Main Content): Platform Overview + Quick Actions + Recent Activity */}
            <div className="flex-1 min-w-0 w-full space-y-3 md:space-y-3.5 order-2 lg:order-1">
              {/* Platform Overview Card */}
              <DashboardStats
                totalTopics={stats.totalTopics}
                pendingQuestions={stats.pendingQuestions}
                totalAnswers={stats.totalAnswers}
                activeUsers={stats.activeUsers}
                loading={statsLoading}
                onSectionClick={setActiveSection}
                embedded={false}
              />

              {/* Quick Actions Card */}
              <QuickActions
                onActionClick={setActiveSection}
                embedded={false}
              />

              {/* Recent Activity Section */}
              <DashboardOverview onSectionChange={setActiveSection} embedded={false} />
            </div>

            {/* Right Column (Fixed / Sticky on Desktop): Ministry Hero Profile Card */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-1 lg:order-2 lg:sticky lg:top-0">
              <div className="bg-[var(--theme-surface)] rounded-2xl overflow-hidden p-4 md:p-5 text-center space-y-3.5 shadow-sm border border-[var(--theme-border-subtle)]">
                {/* Top Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--theme-primary)]" />
                    <span>MessageABCs Admin</span>
                  </div>
                </div>

                {/* Portrait Image (William Marrion Branham) */}
                <div className="relative flex justify-center items-center py-1">
                  <div className="absolute w-32 h-32 md:w-36 md:h-36 bg-[var(--theme-surface-subtle)] rounded-full filter blur-lg opacity-75" />
                  <img
                    src="/wmb.png"
                    alt="William Marrion Branham"
                    className="relative z-10 h-36 sm:h-40 md:h-44 w-auto object-contain drop-shadow-sm select-none pointer-events-none"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h2 className="text-base md:text-lg font-bold text-[var(--theme-text-primary)] tracking-tight">
                    Biblical Message Portal
                  </h2>
                  <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed">
                    Administering sermon extracts, scripture outlines, and
                    community inquiries inspired by the ministry of Bro.
                    William Marrion Branham.
                  </p>
                </div>

                {/* Status Badges & Metrics */}
                <div className="pt-2 border-t border-[var(--theme-border-subtle)] space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--theme-canvas)] text-xs text-[var(--theme-text-primary)]">
                    <span className="font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      PostgreSQL
                    </span>
                    <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--theme-canvas)] text-xs text-[var(--theme-text-primary)]">
                    <span className="font-medium flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-[var(--theme-primary)]" />
                      Active Topics
                    </span>
                    <span className="font-semibold bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] px-2 py-0.5 rounded-full text-xs">
                      {stats.totalTopics}
                    </span>
                  </div>
                </div>
              </div>
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
          <div className="space-y-6 max-w-4xl pb-16" key="settings">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
                Admin Settings & Configuration
              </h2>
              <p className="text-xs md:text-sm text-[var(--theme-text-secondary)] mt-0.5">
                Manage your administrative session, dynamic theme, and system health
              </p>
            </div>

            {/* Dynamic Theme Chooser Section */}
            <div className="p-4 md:p-5 rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-surface)] shadow-xs">
              <ThemeChooser />
            </div>

            {/* Account Information Card Group */}
            <div className="rounded-2xl overflow-hidden divide-y divide-[var(--theme-border-subtle)] bg-[var(--theme-surface)] border border-[var(--theme-border-subtle)] shadow-xs">
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--theme-surface-subtle)] flex items-center justify-center text-[var(--theme-accent)] font-semibold">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--theme-text-primary)]">
                      Logged in Administrator
                    </h3>
                    <p className="text-xs text-[var(--theme-text-secondary)]">
                      {user?.username || "Admin"} • Active Session
                    </p>
                  </div>
                </div>
                <Badge className="bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] border-0 text-xs">
                  {user?.role || "Administrator"}
                </Badge>
              </div>

              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--theme-text-primary)]">
                      Neon PostgreSQL Storage
                    </h3>
                    <p className="text-xs text-[var(--theme-text-secondary)]">
                      Database migration verified with active connection pool
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Healthy
                </span>
              </div>
            </div>

            {/* Quick Logout Group */}
            <div className="rounded-2xl overflow-hidden px-4 py-3.5 flex items-center justify-between bg-[var(--theme-surface)] border border-[var(--theme-border-subtle)] shadow-xs">
              <div>
                <h3 className="text-sm font-semibold text-[var(--theme-text-primary)]">
                  Sign Out of Admin Console
                </h3>
                <p className="text-xs text-[var(--theme-text-secondary)]">
                  Terminate your active admin authentication session securely
                </p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-700 border-0 rounded-xl gap-2 font-medium text-xs h-9 px-3"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        );
      default:
        return <TopicsManager key="default" />;
    }
  }, [activeSection, setActiveSection, stats, statsLoading, user, logout]);

  return (
    <div className="h-screen w-full bg-[var(--theme-canvas)] text-[var(--theme-text-primary)] flex flex-col overflow-hidden font-sans transition-colors duration-200">
      {/* Top Header - Seamless background, Clean & Non-Redundant */}
      <header className="h-16 bg-[var(--theme-canvas)] px-4 md:px-8 flex items-center justify-between flex-shrink-0 z-40 border-none shadow-none transition-colors duration-200">
        {/* Left: Brand Logo & Admin Badge */}
        <div className="flex items-center gap-3">
          <Logo variant="compact" />
          <span className="hidden sm:inline-flex text-xs px-2.5 py-0.5 rounded-full bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] font-medium border border-[var(--theme-border-subtle)]">
            Admin Console
          </span>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-hover)] rounded-xl px-3 py-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Site</span>
          </Button>

          {/* User Profile Chip */}
          <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-[var(--theme-border-subtle)]">
            <div className="text-right">
              <p className="text-xs font-semibold text-[var(--theme-text-primary)] leading-none">
                {user?.username || "Admin"}
              </p>
              <p className="text-[10px] text-[var(--theme-text-secondary)] mt-0.5 capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--theme-surface-subtle)] border border-[var(--theme-border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--theme-accent)]">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl text-[var(--theme-accent)]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main App Body with Google-Settings-Style Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Rail - Curved at top-right (rounded-tr-3xl) with distinct shaded background */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[var(--theme-sidebar-bg)] rounded-tr-3xl border-t border-r border-[var(--theme-border-subtle)] p-4 justify-between flex-shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-10 transition-colors duration-200">
          {/* Nav Items */}
          <div className="space-y-1.5 pt-1">
            <div className="px-3 pb-2 text-[10.5px] font-semibold text-[var(--theme-text-secondary)] uppercase tracking-widest font-sans">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSearchTerm("");
                    }}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[14.5px] transition-all duration-200 text-left group
                      ${
                        isActive
                          ? "bg-[var(--theme-sidebar-active)] text-[var(--theme-text-primary)] font-normal shadow-xs ring-1 ring-[var(--theme-sidebar-active-border)]"
                          : "text-[var(--theme-text-secondary)] font-normal hover:bg-[var(--theme-canvas)] hover:text-[var(--theme-text-primary)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${
                          isActive ? "text-[var(--theme-accent)]" : "text-[var(--theme-text-secondary)]"
                        }`}
                      />
                      <span className="truncate font-serif tracking-tight">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded-full font-semibold font-sans
                          ${
                            isActive
                              ? "bg-[var(--theme-primary)] text-[var(--theme-primary-fg)]"
                              : "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]"
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom: Admin Status & Logout */}
          <div className="pt-4 border-t border-[var(--theme-border-subtle)] space-y-2">
            <div className="px-3 py-2 rounded-2xl bg-[var(--theme-canvas)]/80 border border-[var(--theme-border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--theme-text-primary)] truncate font-serif">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-[10px] text-[var(--theme-text-secondary)] truncate font-sans">
                    Neon PostgreSQL Active
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-medium text-red-700 hover:bg-red-50/80 transition-all text-left font-sans"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area (Google Settings Canvas) */}
        <main className="flex-1 bg-[var(--theme-canvas)] overflow-y-auto no-scrollbar p-3 md:p-5 lg:p-6 transition-colors duration-200">
          <div
            className={
              activeSection === "overview"
                ? "max-w-6xl xl:max-w-7xl mx-auto"
                : "max-w-4xl mx-auto"
            }
          >
            {renderActiveSection}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-[80vw] max-w-[300px] bg-[var(--theme-sidebar-bg)] rounded-r-3xl shadow-2xl p-5 flex flex-col justify-between font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border-subtle)]">
                <Logo variant="compact" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-[var(--theme-canvas)] rounded-full text-[var(--theme-accent)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="mt-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                        setSearchTerm("");
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left
                        ${
                          isActive
                            ? "bg-[var(--theme-sidebar-active)] text-[var(--theme-text-primary)] font-semibold shadow-xs ring-1 ring-[var(--theme-sidebar-active-border)]"
                            : "text-[var(--theme-text-secondary)] hover:bg-[var(--theme-canvas)]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-serif text-base tracking-tight">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--theme-primary)] text-[var(--theme-primary-fg)] font-sans">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-[var(--theme-border-subtle)]">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-700 hover:bg-red-50 transition-all text-left font-sans"
              >
                <LogOut className="h-5 w-5 text-red-600" />
                <span>Sign Out</span>
              </button>
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
