/* eslint-disable @next/next/no-img-element */
"use client";

import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useEffect, useRef, useState } from "react";

export function FloatingWhatsApp() {
  const phoneNumber = "+233241210004"; // same number as BottomNavigation
  const defaultMessage =
    "Hi! I'm interested in learning more about MessageABCS. I found you through your app.";

  const whatsappLink = (msg = defaultMessage) =>
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;

  const openWhatsApp = () => {
    const whatsappUrl = whatsappLink();

    // Detect mobile user agents (same as BottomNavigation)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // Open WhatsApp app on mobile
      window.location.href = whatsappUrl;
    } else {
      // Open WhatsApp Web in a new tab on desktop
      window.open(whatsappUrl, "_blank");
    }
  };

  const [isOpen, setIsOpen] = useState(true); // popup initially visible
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        // clicking outside closes popup
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-4 bottom-6 z-50 flex flex-col items-end"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Popup card - chatbot style */}
      {isOpen && (
        <div className="mb-2 w-72 bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-600">
            <img
              src="/mabcs.png"
              alt="MessageABCs"
              className="h-9 w-9 rounded-full object-cover border-2 border-white"
            />
            <div>
              <div className="text-white font-semibold text-sm">
                Chat with mABCS
              </div>
              <div className="text-blue-100 text-xs">Chatbot (coming soon)</div>
            </div>
          </div>

          {/* Message / body */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900 text-sm text-gray-800 dark:text-gray-100">
            <div className="mb-3">
              You can always reach out — we&apos;re here to help! Click the
              button
            </div>

            {/* Disabled input to mimic chat input for future feature */}
            <div className="mt-2">
              <input
                disabled
                placeholder="Type a message... (coming soon)"
                aria-label="Chat input (disabled)"
                className="w-full rounded-md px-3 py-2 bg-white dark:bg-blue-800 border border-gray-200 dark:border-blue-700 text-sm text-gray-600 dark:text-gray-200 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Footer with action */}
          <div className="px-3 py-3 bg-white dark:bg-blue-950 flex items-center gap-2">
            <button
              onClick={openWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              Open WhatsApp
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-blue-800 text-gray-600 dark:text-gray-300"
              aria-label="Close popup"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating button toggles popup */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((s) => !s);
        }}
        aria-label="Toggle contact popup"
        className="bg-white dark:bg-blue-600 shadow-lg hover:shadow-xl rounded-full p-3 transform transition-transform duration-150 active:scale-95 border border-gray-100 dark:border-blue-700"
        title="Contact us on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 dark:text-blue-100 text-blue-950" />
      </button>
    </div>
  );
}
