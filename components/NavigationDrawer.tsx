"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  LayoutDashboard,
  LogOut,
  LogIn,
  X,
  Palette,
  AlignLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Logo } from "@/components/Logo";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
  const { theme: appTheme, toggleTheme } = useAppTheme();

  const openWhatsApp = () => {
    const phoneNumber = "+233241210004";
    const message =
      "Hi! I'm interested in learning more about MessageABCS. I found you through your app.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, "_blank");
    }

    onOpenChange(false);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Hash, label: "Topics", path: "/topics" },
    { icon: BookOpen, label: "Reading", path: "/reading" },
    { icon: MessageCircleQuestion, label: "Questions & Answers", path: "/qa" },
  ];

  if (isAuthenticated && user?.role === "admin") {
    navItems.push({
      icon: LayoutDashboard,
      label: "Admin Dashboard",
      path: "/admin?direct=true",
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open Navigation Menu"
          className="p-1.5 rounded-lg text-foreground hover:bg-muted/60 transition-colors flex items-center justify-center focus:outline-none"
        >
          <AlignLeft className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 sm:w-80 bg-background/95 backdrop-blur-xl border-r border-border/70 p-0 flex flex-col h-full rounded-r-3xl shadow-2xl"
      >
        {/* Header with Logo */}
        <div className="flex items-center px-5 py-4 border-b border-border/60 pr-12">
          <Logo />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 pb-1">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  router.push(item.path);
                  onOpenChange(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 text-left group
                  ${
                    isActive
                      ? "bg-primary/15 text-primary font-semibold shadow-2xs"
                      : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                  }
                `}
              >
                <Icon
                  className={`h-4 w-4 transition-colors flex-shrink-0 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                {!isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-border/60 bg-muted/20 p-3.5 space-y-2.5">
          {/* Dynamic Theme Toggle Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all bg-background/80 hover:bg-background border border-border/60 text-foreground text-left shadow-2xs group"
            title="Toggle Application Theme"
          >
            <div className="flex items-center gap-2.5">
              <Palette className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-xs">
                Theme: {appTheme === "sky-blue" ? "Sky Blue" : "Cream & Amber"}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
              Switch
            </span>
          </button>

          {/* Contact via WhatsApp */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all bg-background/80 hover:bg-background border border-border/60 text-foreground text-left shadow-2xs group"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            <span className="font-medium flex-1 truncate">Contact on WhatsApp</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
          </button>

          {/* Authentication Section */}
          <div className="pt-1">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border flex-shrink-0">
                    <Image
                      src="/mabcs.png"
                      alt="admin"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-foreground truncate max-w-[90px]">
                        {user?.username || "Admin"}
                      </span>
                      <span className="bg-primary/15 text-primary text-[8.5px] font-semibold px-1 rounded inline-flex items-center">
                        Admin
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/topics");
                    onOpenChange(false);
                  }}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  router.push("/login");
                  onOpenChange(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all bg-primary hover:bg-primary-hover text-primary-foreground shadow-2xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

