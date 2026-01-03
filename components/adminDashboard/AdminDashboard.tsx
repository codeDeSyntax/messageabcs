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
            className="bg-white/20 backdrop-blur-sm border-none"
          >
            <CardContent className="p-6">
              <h2 className="text-2xl  text-foreground mb-4">Settings</h2>
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
      <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm z-0 pointer-events-none" />

      <div className="relative z-20 flex h-screen">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-[70] w-80 bg-background  backdrop-blur-md border-r border-primary/20
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Header with Logo and Brand */}
          <div className="flex items-center gap-3 p-6 border-b border-primary/20">
            <Logo variant="compact" />
            <div className="flex-1">
              <h2 className="text-xs text-muted-foreground ml-2">
                Admin Panel
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-muted transition-colors rounded-md bg-primary/15"
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
                        ? "bg-primary/20  text-foreground "
                        : "text-muted-foreground hover:bg-primary/10  hover:text-foreground "
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
                        ? "text-primary "
                        : "text-muted-foreground  group-hover:text-primary "
                    }`}
                  />
                  <span className="flex-1 font-normal">{item.label}</span>
                  {hasSubmenu && (
                    <svg
                      className={`h-3 w-3 transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground/50 group-hover:text-primary "
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
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle Section */}
          <div className="px-4 py-2">
            <Separator className="mb-3 bg-primary/20 " />
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-muted-foreground  hover:bg-primary/10 hover:text-foreground  text-left group"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground " />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground " />
              )}
              <span className="font-normal">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto border-t border-primary/20">
            <div className="p-4 space-y-3">
              {/* User Profile - Minimal */}
              <div className="flex items-center gap-3">
                <Logo />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal text-foreground truncate">
                    {user?.username || "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role || "administrator"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-muted-foreground  hover:bg-muted hover:text-foreground text-left group"
              >
                <LogOut className="h-4 w-4 text-muted-foreground " />
                <span className="font-normal">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen no-scrollbar lg:ml-0">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/10 backdrop-blur-sm border-b border-primary/20 p-3 md:p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="p-1.5 md:p-2 hover:bg-primary/20 transition-colors rounded-lg bg-primary/15 flex-shrink-0"
                  title="Go back"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 md:p-2 hover:bg-primary/20 transition-colors rounded-lg bg-primary/15 flex-shrink-0"
                  title="Open sidebar menu"
                >
                  <Menu className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base md:text-xl lg:text-2xl  text-foreground truncate">
                    {navItems.find((item) => item.id === activeSection)?.label}
                  </h1>
                </div>
              </div>
              <div className="flex-shrink-0 scale-75 md:scale-90 lg:scale-100 origin-right">
                <Logo />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div
            key={activeSection}
            className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 overflow-auto no-scrollbar min-w-0"
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
      {/* <BottomNavigation /> */}
    </div>
  );
};
export default AdminDashboard;
