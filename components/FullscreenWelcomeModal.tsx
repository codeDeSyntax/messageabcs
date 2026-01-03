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
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal - Compact Card */}
      <div
        className={`relative bg-background rounded-xl shadow-2xl border border-border max-w-sm w-full transform transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-muted rounded-lg">
              <Maximize2 className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Fullscreen Recommended
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground mb-4">
            Fullscreen is recommended for focused engagement with biblical
            content.
          </p>

          {/* Shortcut hint */}
          <div className="flex items-center justify-center space-x-2 mb-4 text-xs text-muted-foreground">
            <Keyboard className="w-3 h-3" />
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
              Ctrl+F
            </kbd>
            <span>anytime</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleEnterFullscreen}
              disabled={isAnimating}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-primary-foreground rounded transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
