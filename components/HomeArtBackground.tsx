"use client";

import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/contexts/ThemeContext";

export function HomeArtBackground() {
  const { theme: appTheme } = useAppTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[var(--theme-canvas)]" />
    );
  }

  const isSkyBlue = appTheme === "sky-blue";

  // Color tokens
  const primaryColor = isSkyBlue ? "#146fa3" : "#9a674a";
  const secondaryColor = isSkyBlue ? "#38bdf8" : "#d4a574";
  const accentColor = isSkyBlue ? "#0b57d0" : "#5c3d2a";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 selection:bg-transparent">
      {/* 1. Soft Whisper Ambient Aura Orbs */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full blur-[130px] opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background: isSkyBlue
            ? "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(194, 231, 255, 0.18) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(212, 165, 116, 0.22) 0%, rgba(245, 227, 187, 0.25) 45%, transparent 70%)",
        }}
      />

      <div
        className="absolute top-[28%] -right-24 w-[450px] h-[450px] rounded-full blur-[130px] opacity-35 transition-all duration-700 pointer-events-none"
        style={{
          background: isSkyBlue
            ? "radial-gradient(circle, rgba(20, 111, 163, 0.12) 0%, rgba(194, 231, 255, 0.08) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, rgba(154, 103, 74, 0.08) 50%, transparent 75%)",
        }}
      />

      <div
        className="absolute top-[55%] -left-28 w-[400px] h-[400px] rounded-full blur-[130px] opacity-30 transition-all duration-700 pointer-events-none"
        style={{
          background: isSkyBlue
            ? "radial-gradient(circle, rgba(11, 87, 208, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(154, 103, 74, 0.14) 0%, transparent 70%)",
        }}
      />

      {/* 2. Delicate & Subtle Sacred Celestial SVG Art */}
      <svg
        viewBox="0 0 1440 1100"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Radiant Ray Gradient */}
          <linearGradient id="celestialRayGradUltraSubtle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.25" />
            <stop offset="50%" stopColor={primaryColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
          </linearGradient>

          {/* Radial Center Halo Glow */}
          <radialGradient id="centerHeroGlowUltraSubtle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.18" />
            <stop offset="50%" stopColor={primaryColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>

          {/* Delicate Sacred Grid Pattern */}
          <pattern
            id="sacredGridPatternUltraSubtle"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={primaryColor}
              strokeWidth="0.5"
              strokeOpacity="0.025"
            />
            <circle
              cx="40"
              cy="40"
              r="1"
              fill={secondaryColor}
              fillOpacity="0.08"
            />
          </pattern>
        </defs>

        {/* Ambient Grid Background */}
        <rect width="1440" height="1100" fill="url(#sacredGridPatternUltraSubtle)" />

        {/* ======================================================== */}
        {/* CENTER HERO SACRED SUNBURST & CELESTIAL ORBITS (x=720, y=210) */}
        {/* ======================================================== */}
        <g transform="translate(720, 210)">
          {/* Soft Center Light */}
          <circle cx="0" cy="0" r="340" fill="url(#centerHeroGlowUltraSubtle)" />

          {/* Radiant Beams / Subtle Rays */}
          {[
            0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280,
            300, 320, 340,
          ].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 540}
              y2={Math.sin((deg * Math.PI) / 180) * 540}
              stroke="url(#celestialRayGradUltraSubtle)"
              strokeWidth={deg % 60 === 0 ? "0.8" : "0.5"}
              strokeDasharray={deg % 40 === 0 ? "4 8" : "2 10"}
              strokeOpacity={deg % 60 === 0 ? "0.2" : "0.1"}
            />
          ))}

          {/* Concentric Orbit Rings */}
          <circle
            cx="0"
            cy="0"
            r="95"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.75"
            strokeDasharray="4 6"
            strokeOpacity="0.18"
          />
          <circle
            cx="0"
            cy="0"
            r="165"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.85"
            strokeDasharray="6 10"
            strokeOpacity="0.22"
            className="animate-[spin_160s_linear_infinite]"
          />
          <circle
            cx="0"
            cy="0"
            r="260"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.75"
            strokeDasharray="12 16"
            strokeOpacity="0.15"
            className="animate-[spin_240s_linear_infinite_reverse]"
          />
          <circle
            cx="0"
            cy="0"
            r="380"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.6"
            strokeDasharray="4 12"
            strokeOpacity="0.12"
          />
          <circle
            cx="0"
            cy="0"
            r="520"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.5"
            strokeDasharray="3 14"
            strokeOpacity="0.09"
          />
          <circle
            cx="0"
            cy="0"
            r="680"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.5"
            strokeDasharray="2 16"
            strokeOpacity="0.07"
          />

          {/* Intersecting Sacred Geometry Archetype */}
          <g stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.1" fill="none">
            <circle cx="0" cy="-120" r="120" />
            <circle cx="104" cy="-60" r="120" />
            <circle cx="104" cy="60" r="120" />
            <circle cx="0" cy="120" r="120" />
            <circle cx="-104" cy="60" r="120" />
            <circle cx="-104" cy="-60" r="120" />
          </g>

          {/* Orbit Star Markers */}
          <circle cx="0" cy="-165" r="2.5" fill={secondaryColor} fillOpacity="0.3" />
          <circle cx="165" cy="0" r="2.5" fill={secondaryColor} fillOpacity="0.3" />
          <circle cx="0" cy="165" r="2.5" fill={secondaryColor} fillOpacity="0.3" />
          <circle cx="-165" cy="0" r="2.5" fill={secondaryColor} fillOpacity="0.3" />

          <circle cx="184" cy="-184" r="1.8" fill={primaryColor} fillOpacity="0.22" />
          <circle cx="-184" cy="184" r="1.8" fill={primaryColor} fillOpacity="0.22" />
          <circle cx="184" cy="184" r="1.8" fill={primaryColor} fillOpacity="0.22" />
          <circle cx="-184" cy="-184" r="1.8" fill={primaryColor} fillOpacity="0.22" />
        </g>

        {/* ======================================================== */}
        {/* LEFT FLANK SACRED MANUSCRIPT EMBLEM (x=130, y=340) */}
        {/* ======================================================== */}
        <g
          transform="translate(130, 340)"
          stroke={primaryColor}
          fill="none"
          strokeOpacity="0.18"
        >
          {/* Halo rings */}
          <circle cx="0" cy="0" r="95" strokeWidth="0.75" strokeDasharray="5 7" />
          <circle cx="0" cy="0" r="75" strokeWidth="0.6" strokeDasharray="3 4" stroke={secondaryColor} />
          <circle cx="0" cy="0" r="55" strokeWidth="0.75" />

          {/* Radiance crosshairs */}
          <line x1="0" y1="-110" x2="0" y2="110" strokeWidth="0.5" strokeDasharray="3 5" />
          <line x1="-110" y1="0" x2="110" y2="0" strokeWidth="0.5" strokeDasharray="3 5" />

          {/* Open Scripture Codex Illustration */}
          <path
            d="M -32 -18 Q 0 -28 32 -18 L 32 22 Q 0 12 -32 22 Z"
            strokeWidth="0.85"
            stroke={secondaryColor}
            fill={isSkyBlue ? "rgba(194, 231, 255, 0.06)" : "rgba(245, 227, 187, 0.1)"}
          />
          <line x1="0" y1="-26" x2="0" y2="15" strokeWidth="0.85" stroke={primaryColor} />
          <path d="M -24 -9 Q -9 -16 0 -9 M 0 -9 Q 9 -16 24 -9" strokeWidth="0.5" strokeOpacity="0.25" />
          <path d="M -24 0 Q -9 -7 0 0 M 0 0 Q 9 -7 24 0" strokeWidth="0.5" strokeOpacity="0.25" />
          <path d="M -24 9 Q -9 2 0 9 M 0 9 Q 9 2 24 9" strokeWidth="0.5" strokeOpacity="0.25" />

          {/* Soft Descending Light Beam */}
          <polygon
            points="-22,40 22,40 50,160 -50,160"
            strokeWidth="0.5"
            stroke={secondaryColor}
            strokeDasharray="3 6"
            strokeOpacity="0.1"
          />
        </g>

        {/* ======================================================== */}
        {/* RIGHT FLANK CELESTIAL DOVE EMBLEM (x=1310, y=340) */}
        {/* ======================================================== */}
        <g
          transform="translate(1310, 340)"
          stroke={primaryColor}
          fill="none"
          strokeOpacity="0.18"
        >
          {/* Halo rings */}
          <circle cx="0" cy="0" r="95" strokeWidth="0.75" strokeDasharray="5 7" />
          <circle cx="0" cy="0" r="75" strokeWidth="0.6" strokeDasharray="3 4" stroke={secondaryColor} />
          <circle cx="0" cy="0" r="55" strokeWidth="0.75" />

          {/* Star Diamond */}
          <polygon
            points="0,-55 38,0 0,55 -38,0"
            strokeWidth="0.75"
            stroke={secondaryColor}
          />
          <circle cx="0" cy="0" r="24" strokeWidth="0.6" />

          {/* Radiance crosshairs */}
          <line x1="0" y1="-110" x2="0" y2="110" strokeWidth="0.5" strokeDasharray="3 5" />
          <line x1="-110" y1="0" x2="110" y2="0" strokeWidth="0.5" strokeDasharray="3 5" />

          {/* Stylized Holy Dove */}
          <path
            d="M 0 -18 C -15 -12 -28 -4 -34 10 C -18 10 -4 2 0 -4 C 4 2 18 10 34 10 C 28 -4 15 -12 0 -18 Z"
            strokeWidth="0.85"
            stroke={primaryColor}
            fill={isSkyBlue ? "rgba(194, 231, 255, 0.07)" : "rgba(245, 227, 187, 0.11)"}
          />
          <path d="M 0 -4 L 0 20 M -6 15 L 0 22 L 6 15" strokeWidth="0.75" stroke={secondaryColor} />

          {/* Soft Descending Light Beam */}
          <polygon
            points="-22,40 22,40 50,160 -50,160"
            strokeWidth="0.5"
            stroke={secondaryColor}
            strokeDasharray="3 6"
            strokeOpacity="0.1"
          />
        </g>

        {/* ======================================================== */}
        {/* LOWER FOUNDATION ARCS (y=750 to 1100) */}
        {/* ======================================================== */}
        <g stroke={secondaryColor} fill="none" strokeOpacity="0.1">
          <path d="M -100 850 Q 720 720 1540 850" strokeWidth="0.75" strokeDasharray="6 10" />
          <path d="M -100 920 Q 720 790 1540 920" strokeWidth="0.85" />
          <path d="M -100 990 Q 720 860 1540 990" strokeWidth="0.5" strokeDasharray="3 6" />

          <line x1="240" y1="780" x2="240" y2="1080" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.1" />
          <line x1="1200" y1="780" x2="1200" y2="1080" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.1" />
        </g>
      </svg>

      {/* 3. Subtle Whispering Stardust Light Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: "14%", left: "18%", size: "3px", delay: "0s", duration: "5s" },
          { top: "19%", left: "82%", size: "3.5px", delay: "1.2s", duration: "6s" },
          { top: "26%", left: "32%", size: "2.5px", delay: "0.5s", duration: "5.5s" },
          { top: "30%", left: "68%", size: "3px", delay: "2.1s", duration: "6.5s" },
          { top: "45%", left: "12%", size: "2.5px", delay: "1.8s", duration: "5s" },
          { top: "50%", left: "88%", size: "3px", delay: "0.9s", duration: "7s" },
          { top: "68%", left: "22%", size: "3px", delay: "2.5s", duration: "6s" },
          { top: "74%", left: "78%", size: "2.5px", delay: "1.4s", duration: "5.5s" },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none animate-pulse"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              backgroundColor: isSkyBlue ? "#38bdf8" : "#d4a574",
              boxShadow: isSkyBlue
                ? "0 0 5px 1px rgba(56, 189, 248, 0.35)"
                : "0 0 5px 1px rgba(212, 165, 116, 0.35)",
              animationDuration: orb.duration,
              animationDelay: orb.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
