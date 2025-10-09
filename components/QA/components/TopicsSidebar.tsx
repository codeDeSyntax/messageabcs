"use client";

import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { BiblicalTopic } from "@/services/api";
import { ProfileCard } from "@/components/ProfileCard";

interface TopicsSidebarProps {
  topics: BiblicalTopic[];
  loading: boolean;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string | null) => void;
}

export const TopicsSidebar = ({
  topics,
  loading,
  selectedTopic,
  onTopicSelect,
}: TopicsSidebarProps) => {
  return (
    <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 max-w-sm flex-col h-full">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-blue-500/20 flex flex-col h-full">
        {/* Topics Header - Fixed */}
        <div className="p-6 border-b border-blue-500/20 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">Topics</h3>
            </div>
            <ProfileCard />
          </div>
          <p className="text-sm text-muted-foreground">
            Browse and filter by biblical topics
          </p>
        </div>

        {/* Topics Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-8 h-8 bg-gray-300/30 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300/30 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300/30 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-blue-500/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No topics available
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() =>
                    onTopicSelect(selectedTopic === topic.id ? null : topic.id)
                  }
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm hover:bg-white/10 dark:hover:bg-black/10 border ${
                    selectedTopic === topic.id
                      ? "bg-blue-500/20 border-blue-500/40 shadow-sm"
                      : "bg-white/5 dark:bg-black/5 border-transparent hover:border-blue-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Topic Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-8 h-8 rounded-full object-cover bg-blue-500/10"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const nextEl = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextEl) nextEl.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <Tag className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>

                    {/* Topic Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground mb-1 line-clamp-2 leading-relaxed">
                        {topic.title}
                      </div>
                      {topic.subtitle && (
                        <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {topic.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Topics Footer - Fixed */}
        <div className="p-6 border-t border-blue-500/20 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 border-blue-500/20 text-sm py-3"
            onClick={() => window.open("/topics", "_blank")}
          >
            <Tag className="h-4 w-4 mr-2" />
            View All {topics.length > 0 ? topics.length : ""} Topics
          </Button>
        </div>
      </div>
    </div>
  );
};
