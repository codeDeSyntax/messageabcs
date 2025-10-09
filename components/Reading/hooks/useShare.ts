import { useState } from "react";
import { BiblicalTopic } from "@/services/api";

export const useShare = () => {
  const [isGeneratingShareCard, setIsGeneratingShareCard] = useState(false);

  // Helper function to update meta tags for social sharing
  const updateMetaTags = (currentTopic: BiblicalTopic) => {
    if (!currentTopic) return;

    // Update Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateNameTag = (name: string, content: string) => {
      let element = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update page title
    document.title = `${currentTopic.title} - MessageABCs`;

    // Create description from subtitle or available content
    const description = currentTopic.subtitle
      ? `${currentTopic.subtitle} - Explore biblical wisdom with MessageABCs`
      : `Explore this biblical topic: ${currentTopic.title} - MessageABCs`;

    // Update Open Graph tags
    updateMetaTag("og:title", currentTopic.title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", currentTopic.image);
    updateMetaTag("og:url", window.location.href);
    updateMetaTag("og:type", "article");
    updateMetaTag("og:site_name", "MessageABCs");

    // Update Twitter Card tags
    updateNameTag("twitter:card", "summary_large_image");
    updateNameTag("twitter:title", currentTopic.title);
    updateNameTag("twitter:description", description);
    updateNameTag("twitter:image", currentTopic.image);

    // Update general meta tags
    updateNameTag("description", description);
  };

  // Generate and share clean text content
  const generateAndShareText = async (currentTopic: BiblicalTopic) => {
    if (!currentTopic) return;

    console.log("📝 Generating text-based share content...");

    // Create share content directly
    const title = `📖 ${currentTopic.title} - MessageABCs`;

    const parts = [
      `📖 ${currentTopic.title}`,
      ...(currentTopic.subtitle ? [`✨ ${currentTopic.subtitle}`] : []),
      ...(currentTopic.scriptures && currentTopic.scriptures.length > 0
        ? [
            `📜 Scripture: ${currentTopic.scriptures.slice(0, 2).join(", ")}${
              currentTopic.scriptures.length > 2 ? "..." : ""
            }`,
          ]
        : []),
      ``,
      `🙏 Explore biblical wisdom and deepen your faith journey`,
      ``,
      `🔗 ${window.location.href}`,
    ];

    const formattedText = parts.filter(Boolean).join("\n");

    const shareData = {
      title,
      text: `Check out this biblical topic: ${currentTopic.title}`,
      url: window.location.href,
    };

    try {
      // Update meta tags for social sharing/link previews
      updateMetaTags(currentTopic);

      // Try native sharing first
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        console.log("📱 Using native sharing");
        await navigator.share(shareData);
      } else {
        console.log("📋 Copying formatted text to clipboard");
        // Fallback: Copy formatted text to clipboard
        await navigator.clipboard.writeText(formattedText);
        alert(
          "📋 Share content copied to clipboard!\n\nPaste it anywhere to share this biblical topic."
        );
      }
    } catch (error) {
      console.error("❌ Error in sharing:", error);
      throw error;
    }
  };

  // Enhanced Share functionality with clean text sharing
  const handleShare = async (currentTopic: BiblicalTopic | null) => {
    if (!currentTopic || isGeneratingShareCard) return;

    console.log("🎯 Starting simple text share for:", currentTopic.title);
    setIsGeneratingShareCard(true);

    try {
      // Generate text-based share content
      await generateAndShareText(currentTopic);
    } catch (error) {
      console.error("❌ Error sharing:", error);
      alert("Unable to share. Please copy the URL manually.");
    } finally {
      setIsGeneratingShareCard(false);
    }
  };

  // Helper function to create comprehensive share content
  const createShareContent = (currentTopic: BiblicalTopic | null) => {
    if (!currentTopic) return { title: "", text: "", fullText: "" };

    const title = `${currentTopic.title} - MessageABCs`;

    // Create share text without the main content extract
    const details = [
      `📖 Topic: ${currentTopic.title}`,
      ...(currentTopic.subtitle ? [`📝 ${currentTopic.subtitle}`] : []),
      ...(currentTopic.scriptures && currentTopic.scriptures.length > 0
        ? [
            `📜 Scriptures: ${currentTopic.scriptures.slice(0, 2).join(", ")}${
              currentTopic.scriptures.length > 2 ? "..." : ""
            }`,
          ]
        : []),
      `🙏 Explore biblical wisdom with MessageABCs`,
    ].join("\n");

    const text = `Check out this biblical topic:\n\n${details}`;

    const fullText = `${title}\n\n${text}\n\n🔗 ${window.location.href}`;

    return {
      title,
      text: details,
      fullText,
    };
  };

  return {
    isGeneratingShareCard,
    handleShare,
    createShareContent,
  };
};
