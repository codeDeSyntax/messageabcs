"use client";

import React from "react";
import { Check, Palette, Sparkles } from "lucide-react";
import { useAppTheme, AppTheme } from "@/contexts/ThemeContext";

interface ThemeOption {
  id: AppTheme;
  title: string;
  description: string;
  badge: string;
  palette: {
    canvas: string;
    surface: string;
    accent: string;
    primary: string;
    text: string;
  };
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "cream",
    title: "Cream & Amber",
    description: "Warm parchment tones inspired by classical biblical manuscripts",
    badge: "Warm Parchment",
    palette: {
      canvas: "#faeed1",
      surface: "#f5e3bb",
      accent: "#edd8b0",
      primary: "#9a674a",
      text: "#402715",
    },
  },
  {
    id: "sky-blue",
    title: "Sky Blue & Crisp White",
    description: "Modern Google-inspired blue aesthetic with bright clean surfaces",
    badge: "#146fa3 • #c2e7ff",
    palette: {
      canvas: "#f0f4f9",
      surface: "#ffffff",
      accent: "#c2e7ff",
      primary: "#146fa3",
      text: "#041e49",
    },
  },
];

export const ThemeChooser: React.FC = () => {
  const { theme, setTheme } = useAppTheme();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-[var(--theme-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--theme-text-primary)]">
          Application Theme Preset
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = theme === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`
                relative p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left border
                ${
                  isSelected
                    ? "border-[var(--theme-primary)] shadow-sm ring-1 ring-[var(--theme-primary)]"
                    : "border-[var(--theme-border)] hover:border-[var(--theme-primary)]/50"
                }
              `}
              style={{
                backgroundColor: isSelected ? "var(--theme-surface-hover)" : "var(--theme-surface)",
              }}
            >
              {/* Top Header: Title & Checkmark */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[var(--theme-text-primary)]">
                      {opt.title}
                    </h4>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--theme-primary)] text-[var(--theme-primary-fg)]">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] mt-1 line-clamp-2">
                    {opt.description}
                  </p>
                </div>
              </div>

              {/* Color Swatch Preview */}
              <div className="mt-3.5 pt-3 border-t border-[var(--theme-border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: opt.palette.canvas }}
                    title="Canvas"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: opt.palette.surface }}
                    title="Surface"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: opt.palette.accent }}
                    title="Container / Pill"
                  />
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: opt.palette.primary }}
                    title="Primary"
                  />
                </div>

                <span className="text-[11px] font-medium text-[var(--theme-text-secondary)]">
                  {opt.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
