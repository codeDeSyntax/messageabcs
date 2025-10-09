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
  Menu,
  Sun,
  Moon,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { AnimatedBackground } from "@/components/AnimatedBackground";

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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatedBackground />
      {/* Blue gradient background - using our biblical theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-blue-50/5 to-blue-50/5 dark:from-black/20 dark:via-black/10 backdrop-blur-sm dark:to-transparent" />

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
        className="w-full h-full"
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
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen overflow-hidden relative bg-slate-50 dark:bg-slate-900 transition-all duration-500">
      {/* Spiral Background */}
      <SpiralBackground />

      {/* Desktop Header */}
      <div className="hidden absolute md:flex justify-end items-center p-6  z-10">
        <Logo className="cursor-pointer" />
        {/* <ProfileCard /> */}
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
              className="text-3xl sm:text-3xl md:text-6xl  font-bold tracking-tight text-slate-800 dark:text-white uppercase leading-tight"
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
              className="bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-semibold py-2 px-6 rounded-md text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                animation: "slideUpFade 1.2s ease-out 1.6s forwards",
                transform: "translateY(100%)",
                opacity: 0,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
              Let&apos;s Start
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
