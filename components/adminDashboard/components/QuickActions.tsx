import React from "react";
import { BookOpen, MessageCircle, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { DashboardSection } from "../types";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  onActionClick: (action: DashboardSection) => void;
  embedded?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
  embedded = false,
}) => {
  const router = useRouter();

  const actions = [
    {
      title: "Create New Topic",
      description: "Draft a new biblical topic with scriptures and outlines",
      icon: Plus,
      iconBg: "bg-[var(--theme-primary)] text-[var(--theme-primary-fg)]",
      onClick: () => router.push("/topics/new"),
      badge: "Add",
    },
    {
      title: "Topics Management",
      description: "Edit topic summaries, outlines, and visibility",
      icon: BookOpen,
      iconBg: "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      onClick: () => onActionClick("topics"),
      badge: "Open",
    },
    {
      title: "Review Questions",
      description: "Provide biblical responses to community inquiries",
      icon: MessageCircle,
      iconBg: "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      onClick: () => onActionClick("questions"),
      badge: "Review",
    },
    {
      title: "Answers Directory",
      description: "Moderate published answers and draft replies",
      icon: MessageSquare,
      iconBg: "bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]",
      onClick: () => onActionClick("answers"),
      badge: "Manage",
    },
  ];

  const content = (
    <div className="flex flex-col">
      <div className="px-4 py-2.5 border-b border-[var(--theme-border-subtle)] flex items-center justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--theme-text-primary)] tracking-tight">
            Quick Actions
          </h3>
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Everyday shortcuts & administrative tools
          </p>
        </div>
      </div>

      <div className="divide-y divide-[var(--theme-border-subtle)]">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              onClick={action.onClick}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--theme-surface-hover)] cursor-pointer transition-all duration-150 rounded-xl group"
            >
              {/* Left: Icon + Text */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${action.iconBg} transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-dark)] transition-colors truncate">
                    {action.title}
                  </h4>
                  <p className="text-xs text-[var(--theme-text-secondary)] truncate">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Right: Action pill + Chevron */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] transition-colors">
                  {action.badge}
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-all">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
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
