/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
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
    <div className="flex-none w-full md:w-auto md:flex-1 lg:w-1/3 xl:w-1/4 max-w-full md:max-w-sm flex-col h-full flex snap-start">
      <div className="bg-background flex flex-col h-full md:border-l border-border">
        {/* Topics Header - Fixed */}
        <div className="px-4 py-4 border-b border-border flex-shrink-0 bg-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Topics</h3>
            </div>
            <ProfileCard />
          </div>
          <p className="text-xs text-muted-foreground">
            Filter questions by topic
          </p>
        </div>

        {/* Topics Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 ">
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3 p-3 bg-cream-200 rounded-lg">
                    <div className="w-10 h-10 bg-stone-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-stone-300 rounded w-3/4"></div>
                      <div className="h-2 bg-stone-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-primary/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No topics available
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() =>
                    onTopicSelect(selectedTopic === topic.id ? null : topic.id)
                  }
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    selectedTopic === topic.id
                      ? "bg-primary/10 border-primary/30 shadow-sm scale-[1.02]"
                      : "bg-cream-200 border-cream-200 hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Topic Image */}
                    <div className="flex-shrink-0 relative w-10 h-10">
                      <Image
                        src={topic.image}
                        alt={topic.title}
                        fill
                        className="rounded-full object-cover ring-2 ring-background"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div
                        className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    {/* Topic Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm line-clamp-2 leading-snug">
                        {topic.title}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Topics Footer - Fixed */}
        <div className="p-4 border-t border-border flex-shrink-0 bg-background">
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:bg-muted border-border text-sm py-2.5"
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
