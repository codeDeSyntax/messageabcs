"use client";

import { useState, useEffect } from "react";
import { BookOpen, Eye, X } from "lucide-react";
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
  const [showPreview, setShowPreview] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && topicId) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, topicId]);

  if (!isOpen || !topicId) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSuccess = () => {
    onSuccess();
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Slide-over Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-2xl bg-background border-l border-border/80 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out font-sans ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-14 px-4 sm:px-6 border-b border-border/60 flex items-center justify-between flex-shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground font-serif tracking-tight">
              {showPreview ? "Preview Topic" : "Edit Topic"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-7 px-2.5 text-xs rounded-lg border-border/70 hover:bg-muted"
            >
              <Eye className="h-3 w-3 mr-1" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 slim-scrollbar">
          <EditTopicForm
            topicId={topicId}
            onSuccess={handleSuccess}
            onCancel={handleClose}
            showPreview={showPreview}
            onTogglePreview={setShowPreview}
          />
        </div>
      </aside>
    </>
  );
}
