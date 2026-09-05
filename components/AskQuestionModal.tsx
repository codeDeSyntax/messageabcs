/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, User, Send, X, HelpCircle } from "lucide-react";
import { BiblicalTopic } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useTopics, useCreateQuestion } from "@/hooks/queries";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated?: () => void;
}

interface QuestionFormData {
  question: string;
  topicId: string | null;
  askedBy: string;
}

export function AskQuestionModal({
  isOpen,
  onClose,
  onQuestionCreated,
}: AskQuestionModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    topicId: null,
    askedBy: "",
  });

  // Use TanStack Query for topics
  const { data: topicsData, isLoading: loadingTopics } = useTopics({
    page: 1,
    limit: 100,
  });
  const topics = topicsData?.data || [];

  // Use TanStack Query mutation for creating question
  const createQuestionMutation = useCreateQuestion();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        question: "",
        topicId: null,
        askedBy: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof QuestionFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter your question",
        variant: "destructive",
      });
      return;
    }

    if (!formData.topicId) {
      toast({
        title: "Error",
        description: "Please select a topic for your question",
        variant: "destructive",
      });
      return;
    }

    if (formData.question.length < 10) {
      toast({
        title: "Error",
        description: "Question must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      const questionData = {
        question: formData.question.trim(),
        topicId: formData.topicId,
        askedBy: formData.askedBy.trim() || undefined,
      };

      await createQuestionMutation.mutateAsync(questionData);

      toast({
        title: "Success!",
        description: "Your question has been submitted successfully",
      });

      if (onQuestionCreated) {
        onQuestionCreated();
      }

      onClose();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = createQuestionMutation.isPending;

  const selectedTopic = topics.find((topic) => topic.id === formData.topicId);
  const isOtherSelected = formData.topicId === "other";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] bg-background/95 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xl">
        <DialogHeader className="pb-2 border-b border-border/60">
          <DialogTitle className="flex items-center gap-2 text-foreground font-serif text-lg font-semibold">
            <MessageCircle className="h-4.5 w-4.5 text-primary" />
            Ask a Question
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-1 -mr-1">
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Question Field */}
            <div className="space-y-1.5">
              <Label htmlFor="question" className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                  Your Question *
                </span>
                <span className="text-[10.5px] font-normal text-muted-foreground">
                  {formData.question.length}/1000
                </span>
              </Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="What would you like to ask or understand about the Scriptures? Be specific..."
                className="bg-muted/40 border-border/70 min-h-[95px] text-xs sm:text-[13px] rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background transition-all"
                required
              />
              <p className="text-[10.5px] text-muted-foreground">
                Minimum 10 characters required.
              </p>
            </div>

            {/* Topic Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Badge
                  variant="outline"
                  className="h-3.5 w-3.5 rounded-full p-0 border-primary/50 text-[9px] flex items-center justify-center"
                >
                  T
                </Badge>
                Related Topic *
              </Label>
              <Select
                value={formData.topicId?.toString() || ""}
                onValueChange={(value) => handleInputChange("topicId", value)}
                disabled={loadingTopics}
              >
                <SelectTrigger className="bg-muted/40 border-border/70 h-9 text-xs rounded-xl focus:ring-1 focus:ring-primary/40 focus:bg-background">
                  <SelectValue
                    placeholder={
                      loadingTopics
                        ? "Loading topics..."
                        : "Select a biblical topic"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-background/95 backdrop-blur-xl border border-border/80 rounded-xl p-1 shadow-lg">
                  {/* Other Option */}
                  <SelectItem value="other" className="cursor-pointer rounded-lg text-xs py-1.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="h-3 w-3" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-xs">Other / General Inquiry</span>
                        <span className="text-[10px] text-muted-foreground">
                          General or uncategorized questions
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()} className="cursor-pointer rounded-lg text-xs py-1.5 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={topic.image || "/mabcs.png"}
                          alt={topic.title}
                          className="w-5 h-5 rounded-full object-cover border border-border/60"
                        />
                        <span className="font-medium text-xs truncate max-w-[240px]">
                          {topic.title}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(selectedTopic || isOtherSelected) && (
                <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-primary/10 border border-primary/20 mt-1">
                  {isOtherSelected ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-3 w-3" />
                    </div>
                  ) : (
                    <img
                      src={selectedTopic!.image || "/mabcs.png"}
                      alt={selectedTopic!.title}
                      className="w-4.5 h-4.5 rounded-full object-cover border border-border/60"
                    />
                  )}
                  <span className="text-xs font-semibold text-primary truncate">
                    {isOtherSelected ? "General / Other" : selectedTopic!.title}
                  </span>
                </div>
              )}
            </div>

            {/* Name Field (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="askedBy" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                Your Name (Optional)
              </Label>
              <Input
                id="askedBy"
                value={formData.askedBy}
                onChange={(e) => handleInputChange("askedBy", e.target.value)}
                placeholder="Enter your name, or leave blank for Anonymous"
                className="bg-muted/40 border-border/70 h-9 text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background"
              />
              <p className="text-[10.5px] text-muted-foreground">
                Leave blank to ask anonymously. Your question will be public.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 px-3.5 text-xs rounded-xl border-border/70 hover:bg-muted"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.question.trim() ||
                  formData.question.trim().length < 10 ||
                  !formData.topicId
                }
                className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Ask Question</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
