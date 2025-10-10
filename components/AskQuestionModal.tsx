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
import { apiService, BiblicalTopic } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
  const [topics, setTopics] = useState<BiblicalTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load topics on mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoadingTopics(true);
        const response = await apiService.getTopics();
        if (response.success && response.data) {
          setTopics(response.data);
        }
      } catch (error) {
        console.error("Error loading topics:", error);
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive",
        });
      } finally {
        setLoadingTopics(false);
      }
    };

    if (isOpen) {
      loadTopics();
    }
  }, [isOpen, toast]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        question: "",
        topicId: null,
        askedBy: "",
      });
      setIsSubmitting(false);
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

    setIsSubmitting(true);

    try {
      const questionData = {
        question: formData.question.trim(),
        topicId: formData.topicId,
        askedBy: formData.askedBy.trim() || undefined,
      };

      const response = await apiService.createQuestion(questionData);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your question has been submitted successfully",
        });

        if (onQuestionCreated) {
          onQuestionCreated();
        }

        onClose();
      } else {
        throw new Error(response.error || "Failed to submit question");
      }
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTopic = topics.find((topic) => topic.id === formData.topicId);
  const isOtherSelected = formData.topicId === "other";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-white/95 dark:bg-black/95 backdrop-blur-xl border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-heading">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Ask a Question
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Field */}
            <div className="space-y-2">
              <Label htmlFor="question" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                Your Question *
              </Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="What would you like to know about biblical topics? Be specific and clear..."
                className="bg-background/50 border-blue-500/20  dark:focus:ring-blue-500  min-h-[120px] font-reading focus-visible:ring-blue-500/30 focus:outline-blue-500 m-1"
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
                  className="h-4 w-4 rounded-full p-0 border-blue-500/50"
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
                <SelectTrigger className="bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
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
                          className="w-8 h-8 rounded-full object-cover border border-blue-500/20"
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border border-blue-500/20">
                        <HelpCircle className="h-4 w-4 text-white" />
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
                <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-500/20">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {isOtherSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center border border-blue-500/20">
                          <HelpCircle className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <img
                          src={selectedTopic!.image}
                          alt={selectedTopic!.title}
                          className="w-6 h-6 rounded-full object-cover border border-blue-500/20"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            isOtherSelected
                              ? "bg-gray-500 text-white text-xs"
                              : "bg-blue-500 text-white text-xs"
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
                <User className="h-4 w-4 text-blue-500" />
                Your Name (Optional)
              </Label>
              <Input
                id="askedBy"
                value={formData.askedBy}
                onChange={(e) => handleInputChange("askedBy", e.target.value)}
                placeholder="Enter your name or leave blank for Anonymous"
                className="bg-background/50 border-blue-500/20 focus:ring-2 focus-visible:ring-blue-500/30 focus:border-blue-500 m-1"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to ask anonymously. Your question will be public
                regardless.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-500/20">
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
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
