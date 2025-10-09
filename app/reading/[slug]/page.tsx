import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiService } from "@/services/api";
import { generateSlug } from "@/lib/slugs";
import ReadingTopicClient from "./client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Utility function to find topic by slug
async function findTopicBySlug(slug: string) {
  try {
    // Get all topics and find the one with matching slug
    const response = await apiService.getTopics({ limit: 50 });
    if (response.success && response.data) {
      const topic = response.data.find((t) => generateSlug(t.title) === slug);
      return topic || null;
    }
    return null;
  } catch (error) {
    console.error("Error finding topic by slug:", error);
    return null;
  }
}

// Generate dynamic metadata for each topic
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let topic = null;

  // Check if the parameter is a UUID (ID) or a slug
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  ) {
    // It's a UUID - use the existing API
    const response = await apiService.getTopic(slug);
    if (response.success && response.data) {
      topic = response.data;
    }
  } else {
    // It's a slug - find the topic by slug
    topic = await findTopicBySlug(slug);
  }

  if (!topic) {
    return {
      title: "Topic Not Found - MessageABCs",
      description: "The requested biblical topic could not be found.",
    };
  }

  const title = `${topic.title} - MessageABCs`;
  const description =
    topic.subtitle ||
    topic.mainExtract?.substring(0, 160) ||
    "Discover biblical truth and wisdom.";
  
  // Enhanced image handling with fallback
  const image = topic.image || "/mabcs.png";
  const imageUrl = image.startsWith('http') ? image : `https://messageabcs.vercel.app${image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: topic.title,
        },
      ],
      type: "article",
      siteName: "MessageABCs",
      url: `https://messageabcs.vercel.app/reading/${generateSlug(topic.title)}`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: topic.title,
        },
      ],
      creator: "@messageabcs",
    },
    alternates: {
      canonical: `https://messageabcs.vercel.app/reading/${generateSlug(
        topic.title
      )}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ReadingTopicPage({ params }: PageProps) {
  const { slug } = await params;

  let topic = null;

  // Check if the parameter is a UUID (ID) or a slug
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  ) {
    // It's a UUID - use the existing API
    const response = await apiService.getTopic(slug);
    if (response.success && response.data) {
      topic = response.data;
    }
  } else {
    // It's a slug - find the topic by slug
    topic = await findTopicBySlug(slug);
  }

  if (!topic) {
    notFound();
  }

  return <ReadingTopicClient topic={topic} slug={slug} />;
}
