import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, Bug, Copy } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service if needed
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  copyErrorDetails = () => {
    const errorDetails = `
Error: ${this.state.error?.message || "Unknown error"}
Stack: ${this.state.error?.stack || "No stack trace"}
Component Stack: ${this.state.errorInfo?.componentStack || "No component stack"}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    navigator.clipboard
      .writeText(errorDetails)
      .then(() => {
        alert("Error details copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy error details");
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <p className="text-muted-foreground mt-2">
                We're sorry, but something unexpected happened. Don't worry,
                this has been logged and our team will look into it.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="space-y-4">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <Bug className="inline h-4 w-4 mr-2" />
                      Error Details (Development)
                    </summary>
                    <div className="mt-3 p-4 bg-muted rounded-lg text-sm font-mono">
                      <div className="space-y-2">
                        <div>
                          <strong>Error:</strong>
                          <pre className="whitespace-pre-wrap break-words mt-1 text-destructive">
                            {this.state.error.message}
                          </pre>
                        </div>
                        {this.state.error.stack && (
                          <div>
                            <strong>Stack Trace:</strong>
                            <pre className="whitespace-pre-wrap break-words mt-1 text-xs">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                        {this.state.errorInfo?.componentStack && (
                          <div>
                            <strong>Component Stack:</strong>
                            <pre className="whitespace-pre-wrap break-words mt-1 text-xs">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.copyErrorDetails}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Error Details
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={this.handleRetry}
                  variant="default"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Helpful Tips */}
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p>This error has been automatically logged.</p>
                <p>
                  If the problem persists, try refreshing the page or clearing
                  your browser cache.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use hooks
export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return (
    <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
  );
};

// Simple error fallback components for specific use cases
export const SimpleErrorFallback: React.FC<{
  error?: Error;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-muted-foreground mb-4">
      {error?.message || "An unexpected error occurred"}
    </p>
    {onRetry && (
      <Button onClick={onRetry} size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorBoundary;
