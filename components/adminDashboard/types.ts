import React from "react";

export type DashboardSection =
  | "overview"
  | "topics"
  | "questions"
  | "answers"
  | "settings";

export interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}
