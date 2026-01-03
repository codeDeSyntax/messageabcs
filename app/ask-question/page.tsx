/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { Logo } from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Send,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTopics, useCreateQuestion } from "@/hooks/queries";

interface QuestionFormData {
  question: string;
  topicId: string | null;
  askedBy: string;
}

export default function AskQuestion() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state
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
  const isSubmitting = createQuestionMutation.isPending;

  // Set page title
  useEffect(() => {
    document.title = "Ask a Question - MessageABCs";
  }, []);

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

      // Redirect to Q&A page to see the question
      router.push("/qa");
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

  const selectedTopic = topics.find((topic) => topic.id === formData.topicId);
  const isOtherSelected = formData.topicId === "other";

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Backdrop overlay */}
      <div className="bg-background/30 backdrop-blur-md inset-0 absolute" />

      {/* Fixed Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="py-2 px-6 pb-2 flex justify-between items-center">
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
          <Logo variant="compact" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Fixed Desktop Header */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex justify-center p-6">
          <div className="w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground">
                Ask a Question
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="pt-16 md:pt-24 pb-24 relative z-10">
        <div className="flex justify-center p-2 md:p-6">
          <div className="w-full max-w-5xl">
            {/* Form Card */}
            <Card className="bg-background/50 p-0 backdrop-blur-xl border-border shadow-xl">
              <CardHeader className="border-b border-border">
                <p className="text-muted-foreground">
                  Ask any question about biblical topics and get answers from
                  the MessageABCS.
                </p>
              </CardHeader>

              <CardContent className="p-3 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Question Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="question"
                      className="flex items-center gap-2 text-base font-semibold"
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Your Question *
                    </Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) =>
                        handleInputChange("question", e.target.value)
                      }
                      placeholder="What would you like to know about biblical topics? Be specific and clear..."
                      className="bg-background/50 border-border min-h-[120px] focus-visible:ring-primary/30 focus:outline-primary text-base"
                      required
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Minimum 10 characters required</span>
                      <span
                        className={
                          formData.question.length < 10
                            ? "text-accent"
                            : "text-primary"
                        }
                      >
                        {formData.question.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Topic Selection */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="topic"
                      className="flex items-center gap-2 text-base font-semibold"
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      Related Topic *
                    </Label>
                    <Select
                      value={formData.topicId?.toString() || ""}
                      onValueChange={(value) =>
                        handleInputChange("topicId", value)
                      }
                      disabled={loadingTopics}
                    >
                      <SelectTrigger className="bg-background/50 border-border focus:ring-2 focus:ring-primary/30 focus:border-primary h-12">
                        <SelectValue
                          placeholder={
                            loadingTopics
                              ? "Loading topics..."
                              : "Select a biblical topic"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-auto no-scrollbar max-w-[80%] ">
                        {topics.map((topic) => (
                          <SelectItem
                            key={topic.id}
                            value={topic.id.toString()}
                            className="focus:bg-primary p-0 px-2 py-1 focus:text-primary-foreground bg-background"
                          >
                            <div className="flex items-center gap-3 py-1">
                              {/* <img
                                src={topic.image}
                                alt={topic.title}
                                className="w-8 h-8 rounded-full object-cover border border-border"
                              /> */}
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {topic.title}
                                </span>
                              </div>
                            </div>
                            {/* horizontal line */}
                            <div className="border-t w-full border-border" />
                          </SelectItem>
                        ))}
                        {/* Other Option */}
                        <SelectItem value="other">
                          <div className="flex items-center gap-3 py-1">
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
                      <Card className="bg-background/50 border-border mt-3">
                        <CardContent className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            {isOtherSelected ? (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted to-muted flex items-center justify-center border border-border">
                                <HelpCircle className="h-4 w-4 text-primary-foreground" />
                              </div>
                            ) : (
                              <img
                                src={selectedTopic!.image}
                                alt={selectedTopic!.title}
                                className="w-10 h-10 rounded-full object-cover border border-border"
                              />
                            )}

                            <div className="flex items-center gap-2 mb-1 py-0">
                              <p className="text-foreground truncate">
                                {isOtherSelected
                                  ? "Other"
                                  : selectedTopic!.title}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Name Field (Optional) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="askedBy"
                      className="flex items-center gap-2 text-base font-semibold"
                    >
                      <User className="h-4 w-4 text-primary" />
                      Your Name (Optional)
                    </Label>
                    <Input
                      id="askedBy"
                      value={formData.askedBy}
                      onChange={(e) =>
                        handleInputChange("askedBy", e.target.value)
                      }
                      placeholder="Enter your name or leave blank for Anonymous"
                      className="bg-background/50 border-border focus:ring-2 focus-visible:ring-primary/30 focus:border-primary h-12"
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave blank to ask anonymously. Your question will be
                      public regardless.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 md:order-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.question.trim() ||
                        !formData.topicId
                      }
                      className="bg-primary hover:bg-accent text-primary-foreground flex items-center gap-2 justify-center h-12 md:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Question
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Helper Text */}
            <Card className="mt-4 bg-muted/30 border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">
                      Question Guidelines
                    </h3>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Be clear and specific about your question</li>
                      <li>
                        • Choose the most relevant biblical topic for your
                        question
                      </li>
                      <li>
                        • Select &quot;Other&quot; if your question doesn&apos;t
                        fit any topic
                      </li>
                      <li>
                        • Questions are public and will help others learn too
                      </li>
                      <li>• You can ask anonymously if you prefer</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
