import React from "react";
import { Minimize2, Keyboard, Info } from "lucide-react";
import { useFullscreen } from "../contexts/FullscreenContext";

export function FullscreenIndicator() {
  const { isFullscreen, exitFullscreen } = useFullscreen();

  if (!isFullscreen) return null;

  return (
    <div className="fixed top-4 right-3/4 z-[90] flex flex-col space-y-2">
      {/* Main indicator */}

      {/* Keyboard shortcuts hint */}
      <div className="bg-primary/70 text-primary-foreground px-3 py-2 rounded-lg backdrop-blur-sm border border-primary-foreground/10 shadow-lg">
        <div className="flex items-center space-x-2 text-xs text-primary-foreground/80">
          <Keyboard className="w-3 h-3" />
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-primary-foreground/20 rounded text-xs">
            Ctrl+F
          </kbd>
          <span>or</span>
          <kbd className="px-1 py-0.5 bg-primary-foreground/20 rounded text-xs">
            ESC
          </kbd>
          <span>to exit</span>
        </div>
      </div>
    </div>
  );
}

export default FullscreenIndicator;
