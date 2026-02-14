/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { BiblicalTopicWithCount, BiblicalTopic } from "@/services/api";
import { generateSlug } from "@/utils/slugs";
import { BookOpen, MessageSquare, Calendar, Bookmark } from "lucide-react";

interface TopicCardProps {
  topic: BiblicalTopicWithCount | BiblicalTopic;
  viewMode: "grid" | "list";
}

export function TopicCard({ topic, viewMode }: TopicCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    const slug = generateSlug(topic.title);
    router.push(`/reading/${slug}`);
  };

  const questionCount =
    ("questionsCount" in topic ? topic.questionsCount : 0) || 0;
  const createdDate = topic.createdAt
    ? new Date(topic.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article
      className="group cursor-pointer transition-all duration-200"
      onClick={handleCardClick}
    >
      {/* Image at Top */}
      <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden rounded">
        {topic.image ? (
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
      </div>

      {/* Content Below */}
      <div className="space-y-2">
        {/* Author/Source Info */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground truncate">
            MessageABCs
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base md:text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {topic.title}
        </h2>

        {/* Subtitle/Excerpt */}
        {topic.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {topic.subtitle}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {createdDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {createdDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {questionCount}
            </span>
          </div>
          <button
            className="p-1.5 hover:bg-muted rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Bookmark functionality would go here
            }}
          >
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </article>
  );
}
