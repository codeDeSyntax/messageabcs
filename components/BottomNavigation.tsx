import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
  Sun,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  };

  // Create dynamic nav items including dashboard for admin
  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: Hash, label: "Topics", path: "/topics" },
      { icon: BookOpen, label: "Reading", path: "/reading" },
      { icon: MessageCircleQuestion, label: "Q&A", path: "/qa" },
    ];

    if (isAuthenticated && user?.role === "admin") {
      baseItems.push({
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin?direct=true",
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop Only - Game-style Crystal Bar */}
      <div className="hidden md:block max-w-[88%] overflow-auto no-scrollbar fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="game-crystal-bar bg-white border-none">
          <div className="flex items-center gap-2 rounded-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={cn(
                    "game-nav-button relative text-center flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-out font-ui dark:text-white text-black",
                    isActive
                      ? "game-nav-button-active"
                      : "game-nav-button-hover"
                  )}
                  style={{
                    fontFamily: "fantasy",
                  }}
                >
                  <Icon className="h-5 w-5 relative z-10" />
                  <span className="text-sm font-medium relative z-10">
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Theme Toggle Separator */}
            <div className="w-px h-6 mx-2 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent game-separator"></div>

            {/* WhatsApp Contact Button */}
            <div
              onClick={openWhatsApp}
              className=" relative f rounded-xl transition-all duration-300 ease-out game-nav-button-hover font-ui hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                fontFamily: "fantasy",
              }}
            >
              <WhatsAppIcon className="h-10 w-10 relative z-10 text-green-500" />
              {/* <span className="text-sm font-medium relative z-10">Contact</span> */}
            </div>

            {/* Theme Toggle Separator */}
            <div className="w-px h-6 mx-2 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent game-separator"></div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="game-nav-button relative flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ease-out game-nav-button-hover font-ui text-black dark:text-white"
              style={{
                fontFamily: "fantasy",
              }}
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5 relative z-10" />
                ) : (
                  <Moon className="h-5 w-5 relative z-10" />
                )
              ) : (
                <Moon className="h-5 w-5 relative z-10" />
              )}
              <span className="text-sm font-medium relative z-10">
                {mounted ? (theme === "dark" ? "Light" : "Dark") : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
