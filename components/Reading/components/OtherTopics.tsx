"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiblicalTopic } from "@/services/api";
import { useTopicsWithQuestionCounts } from "@/hooks/queries";
import { generateSlug } from "@/lib/slugs";
import { ArrowRight, BookOpen } from "lucide-react";

interface OtherTopicsProps {
  currentTopicId: string;
}

export const OtherTopics = ({ currentTopicId }: OtherTopicsProps) => {
  const router = useRouter();
  const [otherTopics, setOtherTopics] = useState<BiblicalTopic[]>([]);

  const { data, isLoading } = useTopicsWithQuestionCounts({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    if (data?.data) {
      // Filter out current topic and get random 6 topics
      const filtered = data.data.filter((topic) => topic.id !== currentTopicId);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setOtherTopics(shuffled.slice(0, 6));
    }
  }, [data, currentTopicId]);

  if (isLoading || otherTopics.length === 0) return null;

  return (
    <div className="mt-16 mb-12">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Other Topics You Might Like
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {otherTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => router.push(`/reading/${generateSlug(topic.title)}`)}
            className="group flex items-center justify-between p-4 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all duration-200 text-left"
          >
            <div className="flex-1 min-w-0 pr-3">
              <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {topic.title}
              </h4>
              {topic.subtitle && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {topic.subtitle}
                </p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/topics")}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View all topics
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
