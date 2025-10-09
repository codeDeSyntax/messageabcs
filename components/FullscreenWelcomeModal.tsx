import React, { useState } from "react";
import { X, Maximize2, Keyboard } from "lucide-react";
import { useFullscreen } from "../contexts/FullscreenContext";

interface FullscreenWelcomeModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function FullscreenWelcomeModal({
  onClose,
  isOpen,
}: FullscreenWelcomeModalProps) {
  const { enterFullscreen, isSupported } = useFullscreen();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnterFullscreen = async () => {
    setIsAnimating(true);
    try {
      await enterFullscreen();
      // Close modal after successful fullscreen entry
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      setIsAnimating(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Don't render if fullscreen is not supported
  if (!isSupported) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal - Compact Card */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-sm w-full transform transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Fullscreen Recommended
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Fullscreen is recommended for focused engagement with biblical
            content.
          </p>

          {/* Shortcut hint */}
          <div className="flex items-center justify-center space-x-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
            <Keyboard className="w-3 h-3" />
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
              Ctrl+F
            </kbd>
            <span>anytime</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleEnterFullscreen}
              disabled={isAnimating}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>Enable</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullscreenWelcomeModal;
