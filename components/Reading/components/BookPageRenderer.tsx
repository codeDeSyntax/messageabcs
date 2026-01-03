import { Quote } from "lucide-react";
import { BiblicalTopic } from "@/services/api";

export interface BookPage {
  type: "cover" | "content" | "quote";
  content: {
    image?: string;
    title: string;
    subtitle?: string;
    scriptures?: string[];
    text?: string;
  };
}

interface BookPageRendererProps {
  page: BookPage;
  pageIndex: number;
  currentTopic: BiblicalTopic | null;
}

export const BookPageRenderer = ({
  page,
  pageIndex,
  currentTopic,
}: BookPageRendererProps) => {
  if (!page) return null;

  switch (page.type) {
    case "cover":
      return <CoverPage page={page} />;
    case "content":
      return <ContentPage page={page} currentTopic={currentTopic} />;
    case "quote":
      return <QuotePage page={page} currentTopic={currentTopic} />;
    default:
      return null;
  }
};

const CoverPage = ({ page }: { page: BookPage }) => (
  <>
    {/* Mobile: Clean Modern Layout */}
    <div className="md:hidden h-full bg-background">
      {/* Chapter/Topic Header */}
      <div className="text-center py-4 px-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {page.content.title}
        </h1>
        {page.content.subtitle && (
          <p className="text-lg text-muted-foreground font-medium">
            {page.content.subtitle}
          </p>
        )}
      </div>

      {/* Content Section - Clean Typography */}
      <div
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {page.content.text ? (
          <div className="prose prose-lg max-w-none">
            <div
              className="text-foreground leading-relaxed text-base font-normal"
              style={{
                fontFamily: "'Crimson Pro', Georgia, serif",
              }}
              dangerouslySetInnerHTML={{ __html: page.content.text }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              No content available
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Desktop: Mobile-inspired Layout */}
    <div className="hidden md:block h-full bg-background">
      {/* Topic Image Header - Shorter Height */}
      {page.content.image && (
        <div className="relative h-20 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                page.content.image || "/placeholder.svg"
              })`,
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-primary/40"></div>
          </div>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
                {page.content.title}
              </h1>
              {page.content.subtitle && (
                <p className="text-lg md:text-xl text-primary-foreground/90 font-medium drop-shadow-md">
                  {page.content.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section - Full Width */}
      <div className="px-8 py-8 max-w-4xl mx-auto">
        {page.content.text ? (
          <div className="prose prose-lg max-w-none">
            <div
              className="text-foreground leading-relaxed text-lg font-normal"
              style={{
                fontFamily: "'Crimson Pro', Georgia, serif",
                lineHeight: "1.7",
              }}
              dangerouslySetInnerHTML={{ __html: page.content.text }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              No content available
            </p>
          </div>
        )}
      </div>
    </div>
  </>
);

const ContentPage = ({
  page,
  currentTopic,
}: {
  page: BookPage;
  currentTopic: BiblicalTopic | null;
}) => (
  <>
    {/* Mobile: Clean Modern Layout */}
    <div className="md:hidden h-full bg-background">
      {/* Chapter/Topic Header */}
      <div className="text-center py-8 px-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {page.content.title}
        </h1>
      </div>

      {/* Content Section - Clean Typography */}
      <div
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="prose prose-lg max-w-none">
          <div
            className="text-foreground leading-relaxed text-base font-normal"
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              lineHeight: "1.7",
              fontSize: "17px",
            }}
            dangerouslySetInnerHTML={{ __html: page.content.text || "" }}
          />
        </div>
      </div>
    </div>

    {/* Desktop: Mobile-inspired Layout */}
    <div className="hidden md:block h-full bg-background">
      {/* Quote Header with Image - Shorter Height */}
      {currentTopic?.image && (
        <div className="relative h-20 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                currentTopic.image || "/placeholder.svg"
              })`,
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-primary/50"></div>
          </div>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
                {page.content.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Content Section - Full Width */}
      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div
            className="text-foreground leading-relaxed text-lg font-normal"
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              lineHeight: "1.7",
            }}
            dangerouslySetInnerHTML={{ __html: page.content.text || "" }}
          />
        </div>
      </div>
    </div>
  </>
);

const QuotePage = ({
  page,
  currentTopic,
}: {
  page: BookPage;
  currentTopic: BiblicalTopic | null;
}) => (
  <>
    {/* Mobile: Clean Modern Layout */}
    <div className="md:hidden h-full bg-background">
      {/* Quote Header */}
      <div className="text-center py-8 px-6 border-b border-border">
        <Quote className="h-8 w-8 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-foreground">
          Inspiration
        </h1>
      </div>

      {/* Quote Content - Clean Typography */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-md">
          <blockquote
            className="text-xl font-medium text-foreground italic leading-relaxed mb-6"
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              lineHeight: "1.6",
            }}
          >
            {page.content.text}
          </blockquote>
        </div>
      </div>
    </div>

    {/* Desktop: Mobile-inspired Layout */}
    <div className="hidden md:block h-full bg-background">
      {/* Quote Header with Image - Shorter Height */}
      {currentTopic?.image && (
        <div className="relative h-20 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                currentTopic.image || "/placeholder.svg"
              })`,
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-primary/50"></div>
          </div>

          {/* Quote Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="text-center">
              <Quote className="h-16 w-16 text-primary-foreground mx-auto mb-4 drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-lg">
                Inspiration
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Quote Content Section - Full Width */}
      <div className="px-8 py-12 max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Quote className="h-12 w-12 text-purple-500/50 mx-auto mb-6" />
          <blockquote
            className="text-2xl md:text-3xl font-medium text-foreground italic leading-relaxed mb-6"
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              lineHeight: "1.6",
            }}
          >
            {page.content.text}
          </blockquote>
        </div>
      </div>
    </div>
  </>
);
