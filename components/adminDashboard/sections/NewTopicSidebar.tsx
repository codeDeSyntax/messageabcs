"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { NewTopicForm } from "@/components/adminDashboard/forms/NewTopicForm";

interface NewTopicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewTopicSidebar({
  isOpen,
  onClose,
  onSuccess,
}: NewTopicSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] lg:w-[600px] bg-background sh z-[101] rounded-l-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h2 className="text-xl font-bold text-foreground">
              Create New Topic
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto p-4"
            style={{
              scrollbarGutter: "stable",
              scrollbarColor: "hsl(var(--primary)) hsl(var(--muted))",
              scrollbarWidth: "thin",
            }}
          >
            <NewTopicForm onSuccess={handleSuccess} onCancel={onClose} />
          </div>
        </div>
      </div>
    </>
  );
}
