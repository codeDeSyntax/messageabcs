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

// Static spiral design component for bottom right corner
const SpiralBackground = () => {
  const { theme } = useTheme();

  // Generate flowing wave paths for the spiral effect (like in the image)
  const generateWavePath = (
    offsetY: number,
    amplitude: number,
    frequency: number
  ) => {
    const points: string[] = [];
    const numPoints = 150; // More points for smoother curves
    const startX = 60; // Start from middle-right
    const startY = 55 + offsetY; // Moved up from 70 to 55 for better visibility

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = startX + t * 38; // Flow towards right edge
      const y = startY + Math.sin(t * Math.PI * frequency) * amplitude; // Create wave

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }

    return points.join(" ");
  };

  // Generate dots scattered around the waves (more dots, smaller size)
  const generateScatteredDots = () => {
    const dots: Array<{ x: number; y: number; size: number }> = [];
    const numDots = 60; // More dots like in the image

    // Create dots in the bottom-right area (moved up)
    for (let i = 0; i < numDots; i++) {
      const baseX = 65 + Math.random() * 33; // Spread across right area
      const baseY = 50 + Math.random() * 40; // Moved up from 65 to 50, expanded range

      // Add some clustering around the wave paths
      const waveInfluence = Math.sin(((baseX - 65) / 33) * Math.PI * 5) * 2;

      dots.push({
        x: baseX,
        y: baseY + waveInfluence,
        size: Math.random() * 1.2 + 0.3, // Smaller dots
      });
    }

    return dots;
  };

  // Generate multiple thin wave paths (6 waves for layered effect)
  const wave1Path = generateWavePath(0, 2, 5);
  const wave2Path = generateWavePath(3, 2.5, 4.5);
  const wave3Path = generateWavePath(6, 2, 5.5);
  const wave4Path = generateWavePath(9, 2.2, 5);
  const wave5Path = generateWavePath(12, 2.3, 4.8);
  const wave6Path = generateWavePath(15, 2, 5.2);
  const scatteredDots = generateScatteredDots();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none ">
      <AnimatedBackground />
      {/* Blue gradient background - using our biblical theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/5 to-transparent dark:from-black/5 dark:via-black/5 backdrop-blur-sm dark:to-transparent" />

      {/* Subtle blue accent in the ce backdrop-blur-smnter */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 dark:opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(10, 25, 226, 0.742) 20%, rgba(37, 99, 235, 0.2) 50%, transparent 100%)",
        }}
      />

      {/* Static wave/spiral design in bottom right */}
      <svg
        className="w-full h-full "
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Multiple thin wave lines for layered spiral effect */}
        <path
          d={wave1Path}
          stroke={
            theme === "dark"
              ? "rgba(59, 130, 246, 0.7)"
              : "rgba(37, 99, 235, 0.6)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        <path
          d={wave2Path}
          stroke={
            theme === "dark"
              ? "rgba(37, 99, 235, 0.65)"
              : "rgba(59, 130, 246, 0.55)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        <path
          d={wave3Path}
          stroke={
            theme === "dark"
              ? "rgba(59, 130, 246, 0.6)"
              : "rgba(37, 99, 235, 0.5)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        <path
          d={wave4Path}
          stroke={
            theme === "dark"
              ? "rgba(37, 99, 235, 0.55)"
              : "rgba(59, 130, 246, 0.45)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        <path
          d={wave5Path}
          stroke={
            theme === "dark"
              ? "rgba(59, 130, 246, 0.5)"
              : "rgba(37, 99, 235, 0.4)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        <path
          d={wave6Path}
          stroke={
            theme === "dark"
              ? "rgba(37, 99, 235, 0.45)"
              : "rgba(59, 130, 246, 0.35)"
          }
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Smaller scattered dots around the waves */}
        {scatteredDots.map((dot, index) => (
          <circle
            key={`dot-${index}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.size * 0.1}
            fill={
              theme === "dark"
                ? index % 2 === 0
                  ? "rgba(59, 130, 246, 0.9)"
                  : "rgba(37, 99, 235, 0.95)"
                : index % 2 === 0
                ? "rgba(37, 99, 235, 0.8)"
                : "rgba(59, 130, 246, 0.85)"
            }
            filter="url(#glow)"
          />
        ))}
      </svg>

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

        @keyframes typewriter {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes blink {
          0%, 50% {
            border-color: currentColor;
          }
          51%, 100% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

const navigationItems = [
  { icon: Hash, label: "Topics", path: "/topics" },
  { icon: BookOpen, label: "Reading", path: "/reading" },
  { icon: MessageCircleQuestion, label: "Q & A", path: "/qa" },
];

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen overflow-hidden relative bg-blue-50 dark:bg-slate-900 transition-all duration-500">
      {/* Spiral Background */}
      <SpiralBackground />

      {/* Desktop Header - Top Navigation (Logo left, links centered) */}
      <div className="hidden absolute md:flex items-center p-6 z-40 w-full">
        <div className="w-full max-w-7xl mx-auto flex items-center">
          <div className="flex-shrink-0">
            <Logo className="cursor-pointer" />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon as any;
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="hidden lg:inline">
                {mounted ? (theme === "dark" ? "Light" : "Dark") : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className="md:hidden relative z-10 p-6">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          isHomePage={true}
        />
      </div>

      {/* Main Content - Centered with compact layout like in the image */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-12 pb-24 md:pb-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Main Heading - Compact and impactful */}
          <div className="space-y-3">
            <h1
              className="text-3xl sm:text-3xl md:text-6xl  font-bold tracking-tight text-blue-900 dark:text-blue-400 uppercase leading-tight"
              style={{
                animation: "slideUpFade 1.2s ease-out forwards",
              }}
            >
              KNOWING CHRIST JESUS
            </h1>

            <span
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-white uppercase leading-tight"
              style={{
                animation: "slideUpFade 1.2s ease-out 0.2s forwards",
                transform: "translateY(100%)",
                opacity: 0,
              }}
            >
              EQUALS KNOWING THE TRUTH.
            </span>
          </div>

          {/* Scripture Quote */}
          <div className="pt-2">
            <span
              className="text-lg sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed italic"
              style={{
                animation: "slideUpFade 1.2s ease-out 0.8s forwards",
                transform: "translateY(100%)",
                opacity: 0,
              }}
            >
              &quot;And ye shall know the truth, and the truth shall make you
              free.&quot;
              <br />
              <span className="text-xl sm:text-sm font-medium not-italic">
                - John 8:32
              </span>
            </span>
          </div>

          {/* Platform Description */}
          <div className="pt-2">
            <mark
              className="text-sm bg-white px-2 sm:text-sm md:text-base text-slate-600 game-nav-button dark:text-white font-normal leading-relaxed max-w-xl mx-auto"
              style={{
                animation: "slideUpFade 1.2s ease-out 1.2s forwards",
                transform: "translateY(100%)",
                opacity: 0,
              }}
            >
              Discover a platform to help enlighten readers on Bible truths
              hidden from Christians.
            </mark>
          </div>

          {/* Call to Action Button - Smaller like in the image */}
          <div className="pt-6">
            <button
              className="bg-white hover:bg-gray-50 text-black hover:text-blue-700 font-semibold py-2 px-6 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-none"
              style={{
                animation: "slideUpFade 1.2s ease-out 1.6s forwards",
                transform: "translateY(100%)",
                opacity: 0,
                // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onClick={() => router.push("/topics")}
            >
              Let&apos;s Read
            </button>
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
