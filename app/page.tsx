"use client";

import { Button } from "@/components/ui/button";
import { TopNavigation } from "@/components/TopNavigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Sun,
  Moon,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FullscreenWelcomeModal } from "@/components/FullscreenWelcomeModal";

// Type definitions for spiral design
interface SpiralPoint {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  delay: number;
}

const navigationItems = [
  { icon: Hash, label: "Topics", path: "/topics" },
  { icon: BookOpen, label: "Reading", path: "/reading" },
  { icon: MessageCircleQuestion, label: "Q & A", path: "/qa" },
];

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build nav items with same auth condition as BottomNavigation
  const getNavItems = () => {
    const baseItems = [
      { icon: Hash, label: "Topics", path: "/topics" },
      { icon: BookOpen, label: "Reading", path: "/reading" },
      { icon: MessageCircleQuestion, label: "Q&A", path: "/qa" },
      { icon: MessageCircle, label: "Ask", path: "/ask-question" },
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

  // Check if user has seen the fullscreen modal before
  useEffect(() => {
    const hasSeenFullscreenModal = localStorage.getItem(
      "hasSeenFullscreenModal"
    );
    if (!hasSeenFullscreenModal) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowFullscreenModal(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseFullscreenModal = () => {
    setShowFullscreenModal(false);
    // Mark that user has seen the modal
    localStorage.setItem("hasSeenFullscreenModal", "true");
  };

  return (
    <div className="h-screen overflow-hidden relative bg-stone-800">
      {/* CSS Animations */}
      <style>{`
        @keyframes slideUpFade {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Main Content Container with curved top */}
      <div className="absolute inset-0 flex flex-col">
        {/* Brown header section - takes 20% of height */}
        <div className="h-[2%] md:h-[2%] relative z-10"></div>

        {/* White/Cream content section with rounded top corners */}
        <div className="flex-1 bg-background rounded-t-[60px] md:rounded-t-[80px] relative z-20 shadow-2xl overflow-hidden">
          {/* Decorative geometric background pattern */}
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-background stroke-primary/10 [mask-image:linear-gradient(to_bottom_left,white_50%,transparent_60%)]"
          >
            <rect
              width="100%"
              height="100%"
              fill="url(#geometric-pattern)"
              strokeWidth="0"
            />
            <svg x="50%" y="-96" strokeWidth="0" className="overflow-visible">
              <path
                transform="translate(64 160)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
              <path
                transform="translate(128 320)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
              <path
                transform="translate(288 480)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
              <path
                transform="translate(512 320)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
              <path
                transform="translate(544 640)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
              <path
                transform="translate(320 800)"
                d="M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0  0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z"
              />
            </svg>
            <defs>
              <pattern
                id="geometric-pattern"
                width="96"
                height="480"
                x="50%"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(0 -96)"
                fill="none"
              >
                <path
                  d="M128 0 98.572 147.138A16 16 0 0 1 82.883 160H13.117a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-45.117 320H-116M64-160 34.572-12.862A16 16 0 0 1 18.883 0h-69.766a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-109.117 160H-180M192 160l-29.428 147.138A15.999 15.999 0 0 1 146.883 320H77.117a16 16 0 0 0-15.69 12.862L34.573 467.138A16 16 0 0 1 18.883 480H-52M-136 480h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1-18.883 320h69.766a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 109.117 160H192M-72 640h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 45.117 480h69.766a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A15.999 15.999 0 0 1 173.117 320H256M-200 320h58.883a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A16 16 0 0 1-82.883 160h69.766a16 16 0 0 0 15.69-12.862L29.427 12.862A16 16 0 0 1 45.117 0H128"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
          </svg>

          {/* Header - Top Navigation INSIDE the curved section */}
          <div className="flex items-center px-6 md:px-8 pt-6 md:pt-8 pb-4 relative z-10">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex-shrink-0">
                <Logo className="cursor-pointer" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm transition-all duration-150 bg-transparent border border-foreground/20 hover:border-foreground/40 font-medium"
                >
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">Menu</span>
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Navigation Menu */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[80%] max-w-4xl overflow-hidden transition-all duration-500 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="w-full px-4 md:px-6 pb-6 md:pb-8 pt-4 md:pt-6 bg-cream-200 border-none border-border rounded-2xl">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon as any;
                  const isActive = pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`group flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 text-left ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm"
                          : "hover:bg-muted bg-white/20 hover:translate-x-1 border-l-4 border-transparent"
                      }`}
                      style={{
                        animation: `slideUpFade 0.4s ease-out ${
                          index * 0.1
                        }s forwards`,
                        opacity: 0,
                        transform: "translateY(20px)",
                      }}
                    >
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                        }`}
                      />
                      <span className="text-base font-medium flex-1">
                        {item.label}
                      </span>
                      <svg
                        className={`h-4 w-4 transition-all duration-300 ${
                          isActive
                            ? "text-primary opacity-100"
                            : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-1"
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
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content - Left Aligned */}
          <div
            className={`flex flex-col justify-center h-full px-6 sm:px-12 md:px-16 lg:px-24 pb-24 md:pb-12 pt-12 md:pt-8 relative z-10 transition-all duration-500 ease-in-out ${
              isMenuOpen ? "md:mt-0" : ""
            }`}
          >
            <div className="text-left space-y-6 max-w-5xl">
              {/* Main Heading */}
              <div className="space-y-3">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl [text-wrap:balance] font-medium tracking-tight text-foreground leading-tight"
                  style={{
                    animation: "slideUpFade 1.2s ease-out forwards",
                  }}
                >
                  KNOWING JESUS <br /> CHRIST
                </h1>

                <p
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-primary leading-tight"
                  style={{
                    animation: "slideUpFade 1.2s ease-out 0.2s forwards",
                    transform: "translateY(100%)",
                    opacity: 0,
                  }}
                >
                  EQUALS KNOWING THE TRUTH.
                </p>
              </div>

              {/* Combined Description with Scripture */}
              <div className="pt-6">
                <p
                  className="text-sm sm:text-base md:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl"
                  style={{
                    animation: "slideUpFade 1.2s ease-out 0.8s forwards",
                    transform: "translateY(100%)",
                    opacity: 0,
                  }}
                >
                  Discover a platform to help enlighten readers on Bible truths
                  hidden from Christians.{" "}
                  <span className="italic text-primary/80">
                    &quot;And ye shall know the truth, and the truth shall make
                    you free.&quot;
                  </span>{" "}
                  <span className="text-xs sm:text-sm font-medium not-italic">
                    - John 8:32
                  </span>
                </p>
              </div>

              {/* Call to Action Button */}
              <div className="pt-2">
                <button
                  className="bg-primary hover:bg-primary-hover text-muted font-semibold py-3 px-8 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    animation: "slideUpFade 1.2s ease-out 1.6s forwards",
                    transform: "translateY(100%)",
                    opacity: 0,
                  }}
                  onClick={() => router.push("/topics")}
                >
                  Let&apos;s Read
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fullscreen Welcome Modal */}
      <FullscreenWelcomeModal
        isOpen={showFullscreenModal}
        onClose={handleCloseFullscreenModal}
      />
    </div>
  );
}
