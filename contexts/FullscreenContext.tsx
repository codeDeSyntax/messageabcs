"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Extend document and element interfaces for cross-browser fullscreen support
declare global {
  interface Document {
    webkitFullscreenElement?: Element;
    msFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
  }
}

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  isSupported: boolean;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(
  undefined
);

interface FullscreenProviderProps {
  children: ReactNode;
}

export function FullscreenProvider({ children }: FullscreenProviderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if fullscreen is supported
  useEffect(() => {
    const supported = !!(
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen ||
      document.documentElement.msRequestFullscreen ||
      document.documentElement.mozRequestFullScreen
    );
    setIsSupported(supported);
  }, []);

  // Fullscreen functions with cross-browser support
  const enterFullscreen = useCallback(async (): Promise<void> => {
    try {
      const element = document.documentElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
      throw error;
    }
  }, []);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
      throw error;
    }
  }, []);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, exitFullscreen, enterFullscreen]);

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement;

      setIsFullscreen(!!fullscreenElement);
    };

    // Add event listeners for different browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+F (Windows/Linux) or Cmd+F (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        event.preventDefault(); // Prevent browser's default find dialog
        toggleFullscreen().catch(console.error);
      }

      // Also support F11 for fullscreen toggle
      if (event.key === "F11") {
        event.preventDefault();
        toggleFullscreen().catch(console.error);
      }

      // ESC to exit fullscreen
      if (event.key === "Escape" && isFullscreen) {
        exitFullscreen().catch(console.error);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, toggleFullscreen, exitFullscreen]);

  const value: FullscreenContextType = {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isSupported,
  };

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen(): FullscreenContextType {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error("useFullscreen must be used within a FullscreenProvider");
  }
  return context;
}

export default FullscreenProvider;
