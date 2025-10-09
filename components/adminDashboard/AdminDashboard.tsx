import React, { useState } from "react";
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

// Import dashboard sections
import DashboardOverview from "./sections/DashboardOverview";
import TopicsManager from "./sections/TopicsManager";
import QuestionsManager from "./sections/QuestionsManager";
import AnswersManager from "./sections/AnswersManager";

type DashboardSection =
  | "overview"
  | "topics"
  | "questions"
  | "answers"
  | "settings";

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleBackNavigation = () => {
    router.back(); // Go back to previous page
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
          <DashboardOverview
            key="overview"
            onSectionChange={setActiveSection}
          />
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
            className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20"
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-heading text-foreground mb-4">
                Settings
              </h2>
              <p className="text-muted-foreground">
                Settings panel coming soon...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return <DashboardOverview key="default" />;
    }
  }, [activeSection]);

  return (
    <div className="h-screen overflow-hidden no-scrollbar relative ">
      <AnimatedBackground />

      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-blue-50/5 dark:bg-black/5 backdrop-blur-sm z-0 pointer-events-none" />

      <div className="relative z-20 flex h-screen">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-[70] w-80 bg-blue-50/20 dark:bg-gray-900/20 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Header with Logo and Brand */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-800">
            <Logo variant="compact" />
            <div className="flex-1">
              <h2 className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                Admin Panel
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const hasSubmenu =
                item.id === "topics" || item.id === "questions"; // Add carets for these items

              return (
                <button
                  key={item.id}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-left group
                    ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/20 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                    }`}
                  />
                  <span className="flex-1 font-normal">{item.label}</span>
                  {hasSubmenu && (
                    <svg
                      className={`h-3 w-3 transition-colors ${
                        isActive
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle Section */}
          <div className="px-4 py-2">
            <Separator className="mb-3 bg-gray-200 dark:bg-gray-800" />
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              )}
              <span className="font-normal">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
            <div className="p-4 space-y-3">
              {/* User Profile - Minimal */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <img src="./mabcs.png" alt="admin" className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal text-gray-900 dark:text-white truncate">
                    {user?.username || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || "administrator"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
              >
                <LogOut className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="font-normal">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen no-scrollbar lg:ml-0">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-blue-500/20 p-3 md:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="p-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-colors rounded-lg border border-blue-500/20 bg-white/10 dark:bg-black/10"
                  title="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-colors rounded-lg border border-blue-500/20 bg-white/10 dark:bg-black/10"
                  title="Open sidebar menu"
                >
                  <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground truncate">
                    {navItems.find((item) => item.id === activeSection)?.label}
                  </h1>
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <img src="./mabcs.png" alt="admin" className=" text-blue-500" />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div
            key={activeSection}
            className="flex-1 p-4 md:p-6 overflow-auto no-scrollbar min-w-0"
          >
            {renderActiveSection}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-y-0 left-80 right-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
export default AdminDashboard;
