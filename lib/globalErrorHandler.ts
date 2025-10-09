// Global error handlers for unhandled errors

// Types for error logging
interface ErrorContext {
  type?: string;
  filename?: string;
  line?: number;
  column?: number;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  [key: string]: unknown;
}

interface ToastFunction {
  (options: {
    title: string;
    description: string;
    variant?: "destructive" | "default";
  }): void;
}

// Extend Window interface to include toast
declare global {
  interface Window {
    toast?: ToastFunction;
  }
}

export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);

    // Log to external service if needed
    // logErrorToService(event.reason, { type: 'unhandledrejection' });

    // Show user-friendly notification
    if ("toast" in window && typeof window.toast === "function") {
      window.toast({
        title: "Unexpected Error",
        description:
          "An unexpected error occurred. Please refresh the page if issues persist.",
        variant: "destructive",
      });
    } else {
      // Fallback notification
      console.warn("Global error occurred, but toast not available");
    }

    // Prevent the default unhandled rejection behavior
    event.preventDefault();
  });

  // Handle unhandled JavaScript errors
  window.addEventListener("error", (event) => {
    console.error("Unhandled JavaScript error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Log to external service if needed
    // logErrorToService(event.error, {
    //   type: 'javascript',
    //   filename: event.filename,
    //   line: event.lineno,
    //   column: event.colno
    // });

    // Show user-friendly notification for critical errors
    if (event.error && event.error.name !== "ChunkLoadError") {
      if ("toast" in window && typeof window.toast === "function") {
        window.toast({
          title: "Application Error",
          description:
            "An error occurred in the application. Please refresh if needed.",
          variant: "destructive",
        });
      }
    }
  });

  // Handle chunk loading errors (code splitting failures)
  window.addEventListener("error", (event) => {
    if (event.error && event.error.name === "ChunkLoadError") {
      console.warn("Chunk loading failed, suggesting page refresh");

      if (
        confirm(
          "A new version of the app is available. Would you like to refresh?"
        )
      ) {
        window.location.reload();
      }
    }
  });
};

// Function to manually log errors to external service
export const logErrorToService = (
  error: Error | string | unknown,
  context?: ErrorContext
) => {
  // Implementation for external error logging service
  // e.g., Sentry, LogRocket, or custom endpoint
  console.info("Error logged:", { error, context });

  // Example implementation:
  // try {
  //   fetch('/api/errors', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       error: error instanceof Error ? error.message : String(error),
  //       stack: error instanceof Error ? error.stack : undefined,
  //       context,
  //       timestamp: new Date().toISOString(),
  //       userAgent: navigator.userAgent,
  //       url: window.location.href,
  //     }),
  //   });
  // } catch (loggingError) {
  //   console.error('Failed to log error to service:', loggingError);
  // }
};
