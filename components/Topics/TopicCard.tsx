import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BiblicalTopic } from "@/services/api";
import { generateSlug } from "@/utils/slugs";
import { BookOpen, LibrarySquare, Users } from "lucide-react";

interface TopicCardProps {
  topic: BiblicalTopic;
  viewMode: "grid" | "list";
}

export function TopicCard({ topic, viewMode }: TopicCardProps) {
  const router = useRouter();

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = generateSlug(topic.title);
    router.push(`/reading/${slug}`);
  };

  const handleCardClick = () => {
    const slug = generateSlug(topic.title);
    router.push(`/reading/${slug}`);
  };

  // List View - Horizontal layout like in the first image
  if (viewMode === "list") {
    return (
      <div
        className="flex items-start gap-0 p-0 bg-white dark:bg-blue-900/20 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group h-20 w-3/4 m-auto "
        onClick={handleCardClick}
      >
        {/* Left: Square Image touching the left edge */}
        <div className="flex-shrink-0 w-32 h-full rounded-l-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {topic.image ? (
            <img
              src={topic.image}
              alt={topic.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <LibrarySquare className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* Center: Title and Subtitle */}
        <div className="flex-1 min-w-0 p-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">
            {topic.title}
          </h3>
          {topic.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {topic.subtitle}
            </p>
          )}
        </div>

        {/* Right: Three dots menu */}
        <div className="flex-shrink-0 p-4">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <div className="flex flex-col space-y-0.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div
        className="relative group cursor-pointer transition-all duration-300 md:hidden h-28 rounded-lg border bg-card/30 flex items-center space-x-3 border-none hover:border-primary/30 shadow-sm"
        onClick={handleCardClick}
      >
        {/* Mobile - Avatar Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-24 border-none rounded-br-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-primary/20">
            {topic.image ? (
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <LibrarySquare className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile - Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground leading-tight line-clamp-1 mb-1">
            {topic.title}
          </h3>
          {topic.subtitle && (
            <p className="text-sm text-muted-foreground leading-tight line-clamp-2">
              {topic.subtitle}
            </p>
          )}
        </div>

        {/* Mobile - Clipped Action Button - Bottom Right */}
        <div className="absolute bottom-0 right-0 z-20">
          <div
            onClick={handleReadMore}
            className={`relative bg-blue-500/90 hover:bg-blue-600/95 text-black dark:text-blue-50 px-3 py-2 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg game-nav-button`}
            style={{
              clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            <span className="text-xs font-medium">Read</span>
          </div>
        </div>
      </div>

      {/* Desktop Grid Card Layout - Taller cards with image touching left edge */}
      <div
        className="hidden md:block cursor-pointer transition-all duration-300"
        onClick={handleCardClick}
      >
        <div className="relative flex flex-col items-start gap-0 p-0 bg-blue-50/20 backdrop-blur-sm dark:bg-blue-900/10 rounded-lg border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 h-60">
          {/* Left: Square Image touching the left edge */}
          <div className="flex-shrink-0 flex justify-between items-center w-full h-1/2 rounded-l-lg overflow-hidden">
            {topic.image ? (
              <img
                src={topic.image}
                alt={topic.title}
                className="w-[80%] h-full m-2 object-cover rounded-r-3xl"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <LibrarySquare className="h-6 w-6 text-white" />
              </div>
            )}

            <div
              onClick={handleReadMore}
              className={`absolute right-1 bg-white dark:bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600/95 text-black dark:text-white px-3 py-2 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg h-10 w-[40%] mr-2 game-na-button`}
              // style={{
              //   clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              // }}
            >
              <span className="text-xs font-medium">Read</span>
            </div>
          </div>

          {/* Center: Title and Subtitle */}
          <div className="flex-1 min-w-0 p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white  mb-2">
              {topic.title}
            </h3>
            {topic.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {topic.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
