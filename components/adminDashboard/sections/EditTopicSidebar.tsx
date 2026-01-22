"use client";

import { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import { EditTopicForm } from "@/components/adminDashboard/forms/EditTopicForm";
import { Button } from "@/components/ui/button";

interface EditTopicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string | null;
  onSuccess: () => void;
}

export function EditTopicSidebar({
  isOpen,
  onClose,
  topicId,
  onSuccess,
}: EditTopicSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !topicId) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-5xl bg-background  sh z-[101] transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full md:w-[90%] m-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-background shadow-sm">
            <h2 className="text-lg font-semibold text-foreground font-mono uppercase tracking-wide">
              {showPreview ? "Preview Topic" : "Edit Topic"}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="border border-dashed border-border/60 bg-background hover:bg-muted/30 font-mono text-xs uppercase tracking-wide"
              >
                <Eye className="h-3 w-3 mr-1" />
                {showPreview ? "Edit" : "Preview"}
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted/50 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto bg-muted/20"
            style={{
              scrollbarGutter: "stable",
              scrollbarColor: "hsl(var(--primary)) hsl(var(--muted))",
              scrollbarWidth: "thin",
            }}
          >
            <EditTopicForm
              topicId={topicId}
              onSuccess={handleSuccess}
              onCancel={onClose}
              showPreview={showPreview}
            />
          </div>
        </div>
      </div>
    </>
  );
}
