import { BiblicalTopic } from "@/services/api";
import { BookPage } from "../components/BookPageRenderer";

// Function to split HTML content into chunks of approximately maxWords
export const splitContentIntoPages = (
  htmlContent: string,
  maxWords: number = 200
): string[] => {
  if (!htmlContent) return [];

  // Strip HTML tags to count words, but preserve the HTML structure
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const words = stripHtml(htmlContent).split(" ");

  if (words.length <= maxWords) {
    return [htmlContent];
  }

  const pages: string[] = [];
  let currentPage = "";
  let wordCount = 0;

  // Split by paragraphs first to maintain structure
  const paragraphs = htmlContent.split(/<\/p>|<br\s*\/?>/i);

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    if (!paragraph) continue;

    const paragraphWords = stripHtml(paragraph).split(" ").length;

    // If adding this paragraph would exceed word limit, start new page
    if (wordCount + paragraphWords > maxWords && currentPage) {
      pages.push(currentPage.trim());
      currentPage = "";
      wordCount = 0;
    }

    // Add paragraph to current page
    currentPage += paragraph;
    if (i < paragraphs.length - 1 && !paragraph.includes("</p>")) {
      currentPage += "</p>";
    }
    wordCount += paragraphWords;
  }

  // Add remaining content as last page
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [htmlContent];
};

// Create pages from topic content
export const createPages = (topic: BiblicalTopic | null): BookPage[] => {
  if (!topic) return [];

  const pages: BookPage[] = [];

  // Split main extract into chunks of ~200 words
  const contentPages = topic.mainExtract
    ? splitContentIntoPages(topic.mainExtract, 300)
    : [];

  // Page 1: Cover with image, title, subtitle and first content chunk
  pages.push({
    type: "cover",
    content: {
      image: topic.image,
      title: topic.title,
      subtitle: topic.subtitle,
      text: contentPages[0] || "",
    },
  });

  // Additional content pages (if content was split)
  for (let i = 1; i < contentPages.length; i++) {
    pages.push({
      type: "content",
      content: {
        title: topic.title,
        subtitle: topic.subtitle,
        text: contentPages[i],
      },
    });
  }

  // Quote pages (one per page)
  if (topic.quotes && topic.quotes.length > 0) {
    topic.quotes.forEach((quote, index) => {
      pages.push({
        type: "quote",
        content: {
          title: `Inspirational Quote ${index + 1}`,
          text: quote,
        },
      });
    });
  }

  return pages;
};
