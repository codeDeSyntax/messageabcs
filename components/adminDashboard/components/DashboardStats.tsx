import React from "react";
import {
  BookOpen,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  totalTopics?: number;
  pendingQuestions?: number;
  totalAnswers?: number;
  activeUsers?: number;
  loading?: boolean;
  onSectionClick?: (section: "topics" | "questions" | "answers") => void;
  embedded?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTopics = 0,
  pendingQuestions = 0,
  totalAnswers = 0,
  activeUsers = 0,
  loading = false,
  onSectionClick,
  embedded = false,
}) => {
  if (loading) {
    return (
      <div className={embedded ? "flex flex-col h-full" : "space-y-3"}>
        {!embedded && (
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
        )}
        <div className={embedded ? "divide-y divide-[var(--theme-border-subtle)]" : "bg-[var(--theme-surface)] rounded-2xl md:rounded-3xl overflow-hidden divide-y divide-[var(--theme-border-subtle)]"}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 md:p-5">
              <div className="flex items-center gap-3 md:gap-4">
                <Skeleton className="h-10 w-10 md:h-11 md:w-11 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      id: "topics" as const,
      title: "Biblical Topics",
      description: "Published topics, sermon outlines, and scripture studies",
      value: totalTopics,
      icon: BookOpen,
      iconBg: "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      badgeText: `${totalTopics} Topics`,
      clickable: true,
    },
    {
      id: "questions" as const,
      title: "Pending Questions",
      description: "Community inquiries awaiting biblical answers",
      value: pendingQuestions,
      icon: MessageCircle,
      iconBg: pendingQuestions > 0 ? "bg-amber-200 text-amber-900" : "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      badgeText: pendingQuestions > 0 ? `${pendingQuestions} Pending` : "All Answered",
      badgeVariant: pendingQuestions > 0 ? "warning" : "success",
      clickable: true,
    },
    {
      id: "answers" as const,
      title: "Published Answers",
      description: "Verified answers with Message & biblical citations",
      value: totalAnswers,
      icon: MessageSquare,
      iconBg: "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      badgeText: `${totalAnswers} Answers`,
      clickable: true,
    },
    {
      id: "system" as const,
      title: "Database & Services",
      description: "Neon PostgreSQL serverless pool active",
      value: "Active",
      icon: ShieldCheck,
      iconBg: "bg-emerald-100 text-emerald-800",
      badgeText: "Connected (Neon)",
      badgeVariant: "success",
      clickable: false,
    },
  ];

  const content = (
    <div className="flex flex-col">
      <div className="px-4 py-2.5 border-b border-[var(--theme-border-subtle)] flex items-center justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--theme-text-primary)] tracking-tight">
            Platform Overview
          </h3>
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Live statistics & system health
          </p>
        </div>
      </div>

      <div className="divide-y divide-[var(--theme-border-subtle)]">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.clickable && onSectionClick && item.id !== "system") {
                  onSectionClick(item.id);
                }
              }}
              className={`
                flex items-center justify-between px-4 py-2.5 transition-all duration-150 rounded-xl
                ${
                  item.clickable
                    ? "hover:bg-[var(--theme-surface-hover)] cursor-pointer group"
                    : ""
                }
              `}
            >
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg} transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-dark)] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--theme-text-secondary)] truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right: Badge / Indicator + Chevron */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span
                  className={`
                    px-2.5 py-0.5 rounded-full text-xs font-semibold
                    ${
                      item.badgeVariant === "warning"
                        ? "bg-amber-200 text-amber-900"
                        : item.badgeVariant === "success"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]"
                    }
                  `}
                >
                  {item.badgeText}
                </span>

                {item.clickable && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-all">
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-none divide-y divide-[var(--theme-border-subtle)]">
      {content}
    </div>
  );
};
