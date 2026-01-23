"use client";

import Image from "next/image";
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
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const openWhatsApp = () => {
    const phoneNumber = "+233241210004"; // Replace with your actual WhatsApp number
    const message =
      "Hi! I'm interested in learning more about MessageABCS. I found you through your app.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;

    // Check if user is on mobile or desktop for better experience
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
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
      { icon: MessageCircleQuestion, label: "Questions-Answers", path: "/qa" },
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
          className={`md:hidden text-foreground ${isHomePage ? " " : ""}`}
        >
          <AlignLeft className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 bg-background backdrop-blur-md border-r border-primary/20 p-0 flex flex-col h-full rounded-r-2xl"
      >
        {/* Header with Logo and Brand */}
        <div className="flex items-center gap-3 p-6 border-b border-primary/20">
          <Logo variant="compact" />
          <div className="flex-1">
            <h2 className="text-xs text-muted-foreground ml-2">
              The Apostolic Truth
            </h2>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }
                `}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
                <span className="flex-1 font-normal">{item.label}</span>
                {hasSubmenu && (
                  <svg
                    className={`h-3 w-3 transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-primary"
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
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-white font-medium">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-primary/20">
          {/* Contact via WhatsApp */}
          <div className="px-4 py-2">
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-muted-foreground hover:bg-primary/10 hover:text-foreground text-left group"
            >
              <WhatsAppIcon className="h-4 w-4 text-green-600" />
              <span className="font-normal">Contact on WhatsApp</span>
            </button>
          </div>
          <div className="px-4 py-2">
            <Separator className="bg-primary/20" />
          </div>

          {/* Authentication Section */}
          <div>
            {isAuthenticated ? (
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
                  onClick={() => {
                    logout();
                    router.push("/topics");
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-muted-foreground hover:bg-muted hover:text-foreground text-left group"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span className="font-normal">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="p-4">
                <button
                  onClick={() => {
                    router.push("/login");
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 text-muted-foreground hover:bg-primary/10 hover:text-foreground text-left group"
                >
                  <LogIn className="h-4 w-4 text-muted-foreground" />
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
