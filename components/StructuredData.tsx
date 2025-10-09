import { BiblicalTopic } from "@/services/api";

interface StructuredDataProps {
  topic: BiblicalTopic;
}

export function StructuredData({ topic }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description:
      topic.subtitle ||
      topic.mainExtract?.substring(0, 200) ||
      "Biblical wisdom and truth",
    image: topic.image || "/mabcs.png",
    datePublished: topic.createdAt,
    dateModified: topic.updatedAt,
    author: {
      "@type": "Organization",
      name: "MessageABCs",
      url: "https://messageabcs.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "MessageABCs",
      logo: {
        "@type": "ImageObject",
        url: "https://messageabcs.vercel.app/mabcs.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://messageabcs.vercel.app/reading/${topic.id}`,
    },
    about: {
      "@type": "Thing",
      name: "Biblical Subjects",
      description: "Christian faith and biblical truth",
    },
    keywords: [
      "bible",
      "biblical",
      "Christian",
      "faith",
      "truth",
      "wisdom",
      ...(topic.scriptures || []),
    ],
    ...(topic.scriptures &&
      topic.scriptures.length > 0 && {
        citation: topic.scriptures.map((scripture) => ({
          "@type": "CreativeWork",
          name: scripture,
          description: "Biblical scripture reference",
        })),
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Website-level structured data for the main site
export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MessageABCs",
    alternateName: "Biblical Blogs",
    description:
      "Discover inspiring biblical truth content, get a deeper read on different bible subjects usually not taught right amongst Christians",
    url: "https://messageabcs.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://messageabcs.vercel.app/topics?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "MessageABCs",
      logo: {
        "@type": "ImageObject",
        url: "https://messageabcs.vercel.app/mabcs.png",
      },
    },
    sameAs: ["https://twitter.com/messageabcs"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData),
      }}
    />
  );
}
