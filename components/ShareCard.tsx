import React from "react";
import { BiblicalTopic } from "@/services/api";

interface ShareCardProps {
  topic: BiblicalTopic;
  onShareReady?: (shareData: ShareData) => void;
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
  formattedText: string;
}

export function ShareCard({ topic, onShareReady }: ShareCardProps) {
  React.useEffect(() => {
    // Generate clean text-based share content
    const generateShareContent = () => {
      const title = `📖 ${topic.title} - MessageABCs`;

      const parts = [
        `📖 ${topic.title}`,
        ...(topic.subtitle ? [`✨ ${topic.subtitle}`] : []),
        ...(topic.scriptures && topic.scriptures.length > 0
          ? [
              `📜 Scripture: ${topic.scriptures.slice(0, 2).join(", ")}${
                topic.scriptures.length > 2 ? "..." : ""
              }`,
            ]
          : []),
        ``,
        `🙏 Explore biblical wisdom and deepen your faith journey`,
        ``,
        `🔗 ${window.location.href}`,
      ];

      const formattedText = parts.filter(Boolean).join("\n");

      const shareData: ShareData = {
        title,
        text: `Check out this biblical topic: ${topic.title}`,
        url: window.location.href,
        formattedText,
      };

      return shareData;
    };

    const shareData = generateShareContent();
    onShareReady?.(shareData);
  }, [topic, onShareReady]);

  // This component doesn't render anything visible
  return null;
}

export default ShareCard;
