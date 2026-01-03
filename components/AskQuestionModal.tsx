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
      <DialogContent className="max-w-3xl max-h-[90vh] bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground ">
            <MessageCircle className="h-5 w-5 text-primary" />
            Ask a Question
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Field */}
            <div className="space-y-2">
              <Label htmlFor="question" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Your Question *
              </Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="What would you like to know about biblical topics? Be specific and clear..."
                className="bg-background/50 border-border min-h-[120px] font-reading focus-visible:ring-primary/30 focus:outline-primary m-1"
                required
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimum 10 characters required</span>
                <span>{formData.question.length}/1000</span>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-4 w-4 rounded-full p-0 border-primary/50"
                >
                  <span className="text-xs">T</span>
                </Badge>
                Related Topic *
              </Label>
              <Select
                value={formData.topicId?.toString() || ""}
                onValueChange={(value) => handleInputChange("topicId", value)}
                disabled={loadingTopics}
              >
                <SelectTrigger className="bg-background/50 border-border focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <SelectValue
                    placeholder={
                      loadingTopics
                        ? "Loading topics..."
                        : "Select a biblical topic"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      <div className="flex items-center gap-3">
                        <img
                          src={topic.image}
                          alt={topic.title}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{topic.title}</span>
                          {topic.subtitle && (
                            <span className="text-xs text-muted-foreground">
                              {topic.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  {/* Other Option */}
                  <SelectItem value="other">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted flex items-center justify-center border border-border">
                        <HelpCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Other</span>
                        <span className="text-xs text-muted-foreground">
                          General or uncategorized questions
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {(selectedTopic || isOtherSelected) && (
                <Card className="bg-background/50 border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {isOtherSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted to-muted flex items-center justify-center border border-border">
                          <HelpCircle className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : (
                        <img
                          src={selectedTopic!.image}
                          alt={selectedTopic!.title}
                          className="w-6 h-6 rounded-full object-cover border border-border"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            isOtherSelected
                              ? "bg-accent text-primary-foreground text-xs"
                              : "bg-primary text-primary-foreground text-xs"
                          }
                        >
                          {isOtherSelected ? "Other" : selectedTopic!.title}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {isOtherSelected
                            ? "General or uncategorized question"
                            : selectedTopic!.subtitle}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Name Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="askedBy" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Your Name (Optional)
              </Label>
              <Input
                id="askedBy"
                value={formData.askedBy}
                onChange={(e) => handleInputChange("askedBy", e.target.value)}
                placeholder="Enter your name or leave blank for Anonymous"
                className="bg-background/50 border-border focus:ring-2 focus-visible:ring-primary/30 focus:border-primary m-1"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to ask anonymously. Your question will be public
                regardless.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || !formData.question.trim() || !formData.topicId
                }
                className="bg-primary hover:bg-accent text-primary-foreground flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Ask Question
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
