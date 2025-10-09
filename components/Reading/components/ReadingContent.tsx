import { Button } from "@/components/ui/button";
import { Share2, Quote } from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BiblicalTopic } from "@/services/api";

interface ReadingContentProps {
  currentTopic: BiblicalTopic;
  isGeneratingShareCard: boolean;
  onShare: () => void;
}

export const ReadingContent = ({
  currentTopic,
  isGeneratingShareCard,
  onShare,
}: ReadingContentProps) => {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* <AnimatedBackground /> */}

      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-white dark:bg-black/10 backdrop-blur-sm z-10" />

      <div className="relative z-20 h-screen flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full mx-auto h-full overflow-hidden">
            <div className="flex h-full">
              {/* Main Reading Content */}
              <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#07072d]/60 rounded-lg overflow-hidden">
                {/* Fixed Header with Background Image (Mobile + Desktop) */}
                <div className="relative flex-shrink-0 border-b border-gray-200/10">
                  {/* Mobile Header */}
                  <div className="md:hidden relative h-40 w-full overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center px-6">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-black dark:text-white mb-2 drop-shadow-lg">
                          {currentTopic.title}
                        </h1>
                        {currentTopic.subtitle && (
                          <mark className="text-sm dark:bg-white bg-black text-white dark:text-black rounded-br-2xl px-3 font-medium drop-shadow-md">
                            {currentTopic.subtitle}
                          </mark>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <div className="max-w-6xl mx-auto px-3 md:px-6 py-0 md:py-8">
                    {/* Main Content */}
                    {currentTopic.mainExtract && (
                      <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                        <div
                          className="text-gray-800 text-xl md:text-xl text-center dark:text-gray-200 leading-normal"
                          style={{
                            fontFamily: "'Crimson Pro', Georgia, serif",
                            lineHeight: "1.8",
                            // fontSize: "18px",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: currentTopic.mainExtract,
                          }}
                        />
                      </div>
                    )}

                    {/* Quotes Section */}
                    {currentTopic.quotes && currentTopic.quotes.length > 0 && (
                      <div className="mt-12 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                          ✨ Inspirational Quotes
                        </h3>
                        {currentTopic.quotes.map((quote, index) => (
                          <div
                            key={index}
                            className="p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-lg border border-purple-200/30 dark:border-purple-800/30"
                          >
                            <Quote className="h-8 w-8 text-purple-500 mb-4" />
                            <blockquote className="text-xl font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
                              {quote}
                            </blockquote>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Share Button */}
                    <div className="mt-12 text-center pb-40">
                      <Button
                        onClick={onShare}
                        disabled={isGeneratingShareCard}
                        className="bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm text-white px-8 py-3 text-lg disabled:opacity-50"
                        size="lg"
                      >
                        {isGeneratingShareCard ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Share2 className="h-5 w-5 mr-2" />
                            Share This Topic
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
