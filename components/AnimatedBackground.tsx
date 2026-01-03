"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface LineData {
  id: string;
  x: number;
  y: number;
  height?: number;
  width?: number;
  color: string;
  duration: number;
  delay: number;
  thickness?: number;
}

interface ParticleData {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export function AnimatedBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [verticalLines, setVerticalLines] = useState<LineData[]>([]);
  const [horizontalLines, setHorizontalLines] = useState<LineData[]>([]);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Theme-aware color generation
    const getThemeColors = () => {
      if (theme === "dark") {
        return {
          primary: "154, 103, 74", // Brown primary
          secondary: "250, 238, 209", // Cream secondary
          gradientFrom: "primary/10",
          gradientTo: "accent/10",
          circleColors: {
            primary: "rgba(154, 103, 74, 0.4)",
            secondary: "rgba(250, 238, 209, 0.6)",
          },
        };
      } else {
        return {
          primary: "154, 103, 74", // Brown primary
          secondary: "250, 238, 209", // Cream secondary
          gradientFrom: "background/30",
          gradientTo: "muted/20",
          circleColors: {
            primary: "rgba(154, 103, 74, 0.3)",
            secondary: "rgba(250, 238, 209, 0.2)",
          },
        };
      }
    };

    // Generate vertical lines (music track style)
    const generateVerticalLines = () => {
      const colors = getThemeColors();
      const newLines: LineData[] = [];
      for (let i = 0; i < 30; i++) {
        const lineHeight = Math.random() * 60 + 20;
        const lineData: LineData = {
          id: `v-${i}`,
          x: Math.random() * 95 + 2.5,
          y: Math.random() * 30 + 10,
          height: lineHeight,
          color: `rgba(${
            Math.random() > 0.5 ? colors.primary : colors.secondary
          }, ${Math.random() * 0.5 + 0.2})`,
          duration: Math.random() * 10 + 6,
          delay: Math.random() * 8,
          width: Math.random() > 0.7 ? 2 : 1,
        };
        newLines.push(lineData);
      }
      setVerticalLines(newLines);
    };

    // Generate horizontal lines
    const generateHorizontalLines = () => {
      const colors = getThemeColors();
      const newLines: LineData[] = [];
      for (let i = 0; i < 60; i++) {
        const lineWidth = Math.random() * 40 + 30;
        const lineData: LineData = {
          id: `h-${i}`,
          x: Math.random() * 20 + 5,
          y: Math.random() * 90 + 5,
          width: lineWidth,
          color: `rgba(${
            Math.random() > 0.5 ? colors.primary : colors.secondary
          }, ${Math.random() * 0.3 + 0.1})`,
          duration: Math.random() * 15 + 8,
          delay: Math.random() * 10,
          thickness: Math.random() > 0.8 ? 1.5 : 0.8,
        };
        newLines.push(lineData);
      }
      setHorizontalLines(newLines);
    };

    // Generate floating particles
    const generateParticles = () => {
      const colors = getThemeColors();
      const newParticles: ParticleData[] = [];
      for (let i = 0; i < 15; i++) {
        const particleData: ParticleData = {
          id: `p-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          color: `rgba(${
            Math.random() > 0.5 ? colors.primary : colors.secondary
          }, ${Math.random() * 0.6 + 0.2})`,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        };
        newParticles.push(particleData);
      }
      setParticles(newParticles);
    };

    generateVerticalLines();
    generateHorizontalLines();
    generateParticles();

    const horizontalInterval = setInterval(generateHorizontalLines, 2000);
    const verticalInterval = setInterval(generateVerticalLines, 8000);
    const particleInterval = setInterval(generateParticles, 8000);

    return () => {
      clearInterval(horizontalInterval);
      clearInterval(verticalInterval);
      clearInterval(particleInterval);
    };
  }, [theme, mounted]);

  const colors =
    theme === "dark"
      ? {
          gradientFrom: "primary/10",
          gradientTo: "accent/10",
          circleColors: {
            primary: "rgba(154, 103, 74, 0.8)",
            secondary: "rgba(250, 238, 209, 0.6)",
          },
        }
      : {
          gradientFrom: "background/20",
          gradientTo: "muted/20",
          circleColors: {
            primary: "rgba(154, 103, 74, 0.3)",
            secondary: "rgba(250, 238, 209, 0.2)",
          },
        };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${
        theme === "light" ? "bg-background/50" : ""
      }`}
    >
      {/* Theme-aware gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-${colors.gradientFrom} via-transparent to-${colors.gradientTo}`}
      />

      {/* Gradient circles */}
      <div
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${
            colors.circleColors.primary
          } 0%, ${colors.circleColors.primary.replace(
            "0.8",
            "0.4"
          )} 30%, ${colors.circleColors.primary.replace(
            "0.8",
            "0.1"
          )} 60%, transparent 100%)`,
          animationDuration: "8s",
        }}
      />

      <div
        className="absolute bottom-1/3 -left-24 w-64 h-64 rounded-full opacity-15 blur-2xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${
            colors.circleColors.secondary
          } 0%, ${colors.circleColors.secondary.replace(
            "0.6",
            "0.3"
          )} 40%, ${colors.circleColors.secondary.replace(
            "0.6",
            "0.1"
          )} 70%, transparent 100%)`,
          animationDuration: "12s",
          animationDelay: "2s",
        }}
      />

      <svg className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.6)"
                  : "rgba(154, 103, 74, 0.6)"
              }
            />
            <stop
              offset="50%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.4)"
                  : "rgba(154, 103, 74, 0.4)"
              }
            />
            <stop
              offset="100%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.2)"
                  : "rgba(154, 103, 74, 0.2)"
              }
            />
          </linearGradient>

          <linearGradient
            id="horizontalGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.2)"
                  : "rgba(154, 103, 74, 0.2)"
              }
            />
            <stop
              offset="50%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.5)"
                  : "rgba(154, 103, 74, 0.5)"
              }
            />
            <stop
              offset="100%"
              stopColor={
                theme === "dark"
                  ? "rgba(154, 103, 74, 0.1)"
                  : "rgba(154, 103, 74, 0.1)"
              }
            />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render vertical lines */}
        {verticalLines.map((line) => (
          <line
            key={line.id}
            x1={`${line.x}%`}
            y1={`${line.y}%`}
            x2={`${line.x}%`}
            y2={`${line.y + (line.height || 0)}%`}
            stroke={Math.random() > 0.6 ? "url(#lineGradient)" : line.color}
            strokeWidth={line.width}
            strokeLinecap="round"
            filter={Math.random() > 0.7 ? "url(#glow)" : "none"}
            style={{
              animationDuration: `${line.duration}s`,
              animationDelay: `${line.delay}s`,
              animation: `moveUp ${line.duration}s linear infinite ${line.delay}s`,
            }}
          />
        ))}

        {/* Render horizontal lines */}
        {horizontalLines.map((line) => (
          <line
            key={line.id}
            x1={`${line.x}%`}
            y1={`${line.y}%`}
            x2={`${line.x + (line.width || 0)}%`}
            y2={`${line.y}%`}
            stroke={
              Math.random() > 0.7 ? "url(#horizontalGradient)" : line.color
            }
            strokeWidth={line.thickness}
            strokeLinecap="round"
            filter={Math.random() > 0.6 ? "url(#glow)" : "none"}
            style={{
              animationDuration: `${line.duration}s`,
              animationDelay: `${line.delay}s`,
              animation: `moveRight ${line.duration}s linear infinite ${line.delay}s`,
            }}
          />
        ))}

        {/* Render floating particles */}
        {particles.map((particle) => (
          <circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill={particle.color}
            filter={Math.random() > 0.5 ? "url(#glow)" : "none"}
            style={{
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes moveUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }

        @keyframes moveRight {
          0% {
            transform: translateX(-100vw);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-10px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px) scale(0.9);
            opacity: 1;
          }
          75% {
            transform: translateY(-15px) scale(1.05);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
