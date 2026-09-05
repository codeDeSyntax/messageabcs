/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { ProfileCard } from "@/components/ProfileCard";
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
  Search,
  Sparkles,
  Info,
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
  const pathname = usePathname();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");

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

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(topicSearch.toLowerCase())
  );

  // Use TanStack Query mutation for creating question
  const createQuestionMutation = useCreateQuestion();
  const isSubmitting = createQuestionMutation.isPending;

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

    if (formData.question.trim().length < 10) {
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

      // Redirect to Q&A page
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
    <div className="min-h-screen relative bg flex flex-col overflow-x-hidden">
      {/* Dynamic Themed Background */}
      <AnimatedBackground />
      <div className="bg-background/40 backdrop-blur-md inset-0 absolute pointer-events-none" />

      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            {/* Left: Mobile Drawer Trigger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="md:hidden">
                <NavigationDrawer
                  isOpen={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              </div>
              <Logo />
            </div>

            {/* Right: Direct Navigation & User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden md:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => router.push("/reading")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/reading"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Reading
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/topics")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/topics"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Topics
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/qa")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/qa"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Q&A
                </button>
              </div>

              <ProfileCard />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 py-5 sm:py-8 px-3.5 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* Back to Q&A Link */}
          <button
            type="button"
            onClick={() => router.push("/qa")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Questions & Answers</span>
          </button>

          {/* Header */}
          <div className="pb-4 mb-4 border-b border-border/70">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif">
                Ask a Question
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Have an inquiry about scripture, doctrinal teachings, or ministry sermons? Submit it below to receive an official answer from MessageABCs.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-background/90 border border-border/70 rounded-2xl p-4 sm:p-6 shadow-xs backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Question Text Area */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="question"
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    Your Question *
                  </span>
                  <span
                    className={`text-[11px] font-normal ${
                      formData.question.length < 10 && formData.question.length > 0
                        ? "text-accent font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formData.question.length}/1000
                  </span>
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange("question", e.target.value)}
                  placeholder="What would you like to ask or understand about the Scriptures? Be clear and specific..."
                  className="bg-muted/40 border-border/70 min-h-[110px] text-xs sm:text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background transition-all"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Minimum 10 characters required.
                </p>
              </div>

              {/* Topic Selection */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="topic"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground"
                >
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Related Biblical Topic *
                </Label>
                <Select
                  value={formData.topicId?.toString() || ""}
                  onValueChange={(value) => handleInputChange("topicId", value)}
                  disabled={loadingTopics}
                >
                  <SelectTrigger className="bg-muted/40 border-border/70 h-10 text-xs sm:text-sm rounded-xl focus:ring-1 focus:ring-primary/40 focus:bg-background">
                    <SelectValue
                      placeholder={
                        loadingTopics
                          ? "Loading topics..."
                          : "Select a biblical topic"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/80 rounded-xl p-1 shadow-lg">
                    {/* Search inside Select */}
                    <div className="sticky top-0 p-1 bg-background/95 backdrop-blur-sm z-10 mb-1 border-b border-border/50">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search topics..."
                          value={topicSearch}
                          onChange={(e) => setTopicSearch(e.target.value)}
                          className="pl-8 h-8 text-xs bg-muted/40 border-border/60 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/30"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* General / Other Option */}
                    <SelectItem
                      value="other"
                      className="cursor-pointer rounded-lg text-xs py-2 px-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-medium text-xs">
                            Other / General Inquiry
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            General or uncategorized questions
                          </span>
                        </div>
                      </div>
                    </SelectItem>

                    {/* Topics List */}
                    {filteredTopics.length > 0 ? (
                      filteredTopics.map((topic) => (
                        <SelectItem
                          key={topic.id}
                          value={topic.id.toString()}
                          className="cursor-pointer rounded-lg text-xs py-1.5 px-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-border/60">
                              <Image
                                src={topic.image || "/mabcs.png"}
                                alt={topic.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium text-xs truncate max-w-[280px]">
                              {topic.title}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-muted-foreground text-xs">
                        No topics matching &quot;{topicSearch}&quot;
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {/* Selected Topic Badge Display */}
                {(selectedTopic || isOtherSelected) && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-primary/10 border border-primary/20 mt-2">
                    {isOtherSelected ? (
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-border/60">
                        <Image
                          src={selectedTopic!.image || "/mabcs.png"}
                          alt={selectedTopic!.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-primary truncate">
                      {isOtherSelected ? "General / Other" : selectedTopic!.title}
                    </span>
                    {selectedTopic?.subtitle && (
                      <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                        — {selectedTopic.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Name Field (Optional) */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="askedBy"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  Your Name (Optional)
                </Label>
                <Input
                  id="askedBy"
                  value={formData.askedBy}
                  onChange={(e) => handleInputChange("askedBy", e.target.value)}
                  placeholder="Enter your name, or leave blank for Anonymous"
                  className="bg-muted/40 border-border/70 h-10 text-xs sm:text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Questions are public. You can ask anonymously if you prefer.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/qa")}
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs font-medium rounded-xl border-border/70 hover:bg-muted"
                >
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
                  className="h-9 px-5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Question</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Helpful Guidelines Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-foreground text-xs">
                  Tips for asking questions:
                </span>
                <ul className="space-y-0.5 text-[11.5px] leading-relaxed">
                  <li>• Be concise and specify any scriptures you are referencing.</li>
                  <li>• Pick the closest matching biblical topic for accurate ministry review.</li>
                  <li>• Once answered by ministry administrators, your question and its official response will appear on the public Q&A page.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
