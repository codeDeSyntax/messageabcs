"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  AlignLeft,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Logo } from "@/components/Logo";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface NavigationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isHomePage?: boolean;
}

export function NavigationDrawer({
  isOpen,
  onOpenChange,
  isHomePage = false,
}: NavigationDrawerProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const openWhatsApp = () => {
    const phoneNumber = "+233241210004"; // Replace with your actual WhatsApp number
    const message =
      "Hi! I'm interested in learning more about MessageABCS. I found you through your app.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Check if user is on mobile or desktop for better experience
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // On mobile, try to open WhatsApp app directly
      window.location.href = whatsappUrl;
    } else {
      // On desktop, open in new tab (WhatsApp Web)
      window.open(whatsappUrl, "_blank");
    }

    onOpenChange(false);
  };

  // Create dynamic nav items including dashboard for admin
  const getNavItems = () => {
    const baseNavItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: Hash, label: "Topics", path: "/topics" },
      { icon: BookOpen, label: "Reading", path: "/reading" },
      { icon: MessageCircleQuestion, label: "Q & A", path: "/qa" },
    ];

    if (isAuthenticated && user?.role === "admin") {
      baseNavItems.push({
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin?direct=true",
      });
    }

    return baseNavItems;
  };

  const navItems = getNavItems();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`md:hidden dark:text-white text-black ${
            isHomePage
              ? " "
              : ""
          }`}
        >
       
          <AlignLeft className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm rounded-r-3xl border-0 shadow-lg p-0 flex flex-col"
      >
        {/* Header with Logo and Brand */}
        <div className="flex items-center gap-3 p-6">
          <Logo variant="compact" />
          <div className="ml-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Biblical Learning
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            const hasSubmenu =
              item.label === "Topics" || item.label === "Q & A"; // Add carets for these items

            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  onOpenChange(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-left group
                  ${
                    isActive
                      ? "bg-blue-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
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
                {item.label === "Reading" && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-medium">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Contact and Theme Toggle */}
          <div className="px-4 py-2 space-y-1">
            {/* Contact via WhatsApp */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
            >
              <WhatsAppIcon className="h-4 w-4 text-green-500" />
              <span className="font-normal">Contact Us</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
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

          {/* Authentication Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 mt-2">
            {isAuthenticated ? (
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
                  onClick={() => {
                    logout();
                    router.push("/topics");
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
                >
                  <LogOut className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="font-normal">Log Out</span>
                </button>
              </div>
            ) : (
              <div className="p-4">
                <button
                  onClick={() => {
                    router.push("/login");
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 text-left group"
                >
                  <LogIn className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="font-normal">Admin Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
