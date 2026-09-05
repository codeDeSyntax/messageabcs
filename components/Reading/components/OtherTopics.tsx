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
      // Filter out current topic and get random 4 topics
      const filtered = data.data.filter((topic) => topic.id !== currentTopicId);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setOtherTopics(shuffled.slice(0, 4));
    }
  }, [data, currentTopicId]);

  if (isLoading || otherTopics.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-xl font-medium text-foreground">
            Continue Reading
          </h3>
        </div>

        <button
          onClick={() => router.push("/topics")}
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 font-sans"
        >
          <span>All Topics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {otherTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => router.push(`/reading/${generateSlug(topic.title)}`)}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/70 hover:border-primary/40 shadow-2xs transition-all duration-200 cursor-pointer text-left"
          >
            <div className="space-y-1">
              <h4 className="font-serif text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {topic.title}
              </h4>
              {topic.subtitle && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                  {topic.subtitle}
                </p>
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
              <span>Read study</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
