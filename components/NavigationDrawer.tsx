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
          className={`md:hidden text-foreground ${isHomePage ? " " : ""}`}
        >
          <AlignLeft className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="w-80 bg-background border-0 p-0 flex flex-col rounded-r-2xl h-full"
      >
        {/* Header with Logo and Brand */}
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-border bg-muted/30">
          <Logo variant="compact" />
          <div className="ml-2">
            <p className="text-xs text-muted-foreground font-medium">
              The Apostolic Truth
            </p>
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
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left group
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm"
                      : "text-foreground hover:bg-muted hover:translate-x-1"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span className="flex-1 font-medium">{item.label}</span>
                {hasSubmenu && (
                  <svg
                    className={`h-3.5 w-3.5 transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-border bg-muted/20">
          {/* Contact via WhatsApp */}
          <div className="px-3 py-3">
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 bg-green-50 hover:bg-green-100 text-foreground text-left group border border-green-200"
            >
              <WhatsAppIcon className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">
                Contact Us on WhatsApp
              </span>
            </button>
          </div>

          {/* Authentication Section */}
          <div className="border-t border-border">
            {isAuthenticated ? (
              <div className="p-3 space-y-2">
                {/* User Profile - Minimal */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                    <Image
                      src="/mabcs.png"
                      alt="admin"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.username || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-red-600 hover:bg-red-50 border border-red-200 text-left group"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            ) : (
              <div className="p-3">
                <button
                  onClick={() => {
                    router.push("/login");
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-left group"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Admin Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
