import { ErrorInfo } from "react";

// Hook for manually triggering error boundary from functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Manual error trigger:", error, errorInfo);
    // This will be caught by the nearest error boundary
    throw error;
  };

  return handleError;
};
