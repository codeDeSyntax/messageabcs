"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Plus, X, Save, Loader2, BookOpen, Quote as QuoteIcon, Edit3, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

interface NewTopicFormData {
  title: string;
  subtitle: string;
  scriptures: string[];
  mainExtract: string;
  quotes: string[];
  image: string;
}

interface NewTopicFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showPreview?: boolean;
  onTogglePreview?: (preview: boolean) => void;
}

export function NewTopicForm({
  onSuccess,
  onCancel,
  showPreview = false,
  onTogglePreview,
}: NewTopicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<NewTopicFormData>({
    title: "",
    subtitle: "",
    scriptures: [],
    mainExtract: "",
    quotes: [],
    image: "",
  });

  const [scriptureInput, setScriptureInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");

  const safeScriptures = Array.isArray(formData.scriptures)
    ? formData.scriptures
    : typeof formData.scriptures === "string"
    ? [formData.scriptures]
    : [];

  const safeQuotes = Array.isArray(formData.quotes)
    ? formData.quotes
    : typeof formData.quotes === "string"
    ? [formData.quotes]
    : [];

  const handleInputChange = (
    field: keyof NewTopicFormData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addScripture = () => {
    const val = scriptureInput.trim();
    if (val && !safeScriptures.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        scriptures: [...safeScriptures, val],
      }));
      setScriptureInput("");
    }
  };

  const removeScripture = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scriptures: safeScriptures.filter((_, i) => i !== index),
    }));
  };

  const addQuote = () => {
    const val = quoteInput.trim();
    if (val && !safeQuotes.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        quotes: [...safeQuotes, val],
      }));
      setQuoteInput("");
    }
  };

  const removeQuote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quotes: safeQuotes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a topic title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a cover image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        scriptures: safeScriptures,
        quotes: safeQuotes,
        mainExtract: formData.mainExtract || "",
      };

      const response = await apiService.createTopic(payload);

      if (response.success) {
        toast({
          title: "Topic Created",
          description: "New biblical topic published successfully!",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin?direct=true");
          router.refresh();
        }
      } else {
        toast({
          title: "Failed to Create Topic",
          description: response.error || "An error occurred while creating the topic.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create topic",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* PREVIEW VIEW */}
      {showPreview && (
        <div className="space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
          {/* Header Preview */}
          <div className="border-b border-border/60 pb-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground font-serif tracking-tight leading-snug">
              {formData.title || "Untitled Topic"}
            </h1>
            {formData.subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {formData.subtitle}
              </p>
            )}
          </div>

          {/* Cover Image Preview */}
          {formData.image ? (
            <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-border/60 bg-muted/30">
              <img
                src={formData.image}
                alt={formData.title || "Cover"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full h-24 rounded-xl border border-dashed border-border/80 flex items-center justify-center text-muted-foreground/70 gap-2 bg-muted/10">
              <ImageIcon className="h-4 w-4" />
              <span className="text-xs">No cover image specified</span>
            </div>
          )}

          {/* Scriptures Preview */}
          {safeScriptures.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>Scripture References</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {safeScriptures.map((scripture, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {scripture}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Extract Preview */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Main Extract & Sermon Notes
            </h3>
            {formData.mainExtract ? (
              <div
                className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap rounded-xl bg-muted/20 border border-border/60 p-3.5"
                dangerouslySetInnerHTML={{
                  __html: formData.mainExtract,
                }}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground/60 italic bg-muted/10">
                No extract content written yet.
              </div>
            )}
          </div>

          {/* Quotes Preview */}
          {safeQuotes.length > 0 && (
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <QuoteIcon className="h-3.5 w-3.5 text-primary" />
                <span>Inspirational Quotes</span>
              </h3>
              <div className="space-y-2">
                {safeQuotes.map((quote, index) => (
                  <blockquote
                    key={index}
                    className="border-l-2 border-primary pl-3 italic text-xs text-foreground/90 bg-muted/20 py-2 rounded-r-xl"
                  >
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Preview Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            {onTogglePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onTogglePreview(false)}
                className="h-8 px-3 text-xs rounded-xl border-border/70 hover:bg-muted flex items-center gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Back to Edit</span>
              </Button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="h-8 px-3 text-xs rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !formData.title?.trim()}
                className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    <span>Publish Topic</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FORM VIEW (hidden when preview is active so Tiptap stays mounted and intact) */}
      <div className={showPreview ? "hidden" : "block space-y-3.5"}>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Title & Subtitle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="topic-title" className="text-xs font-semibold text-foreground">
                Topic Title *
              </Label>
              <Input
                id="topic-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. The Mystery of the Godhead"
                className="h-8.5 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="topic-subtitle" className="text-xs font-semibold text-foreground">
                Subtitle / Theme
              </Label>
              <Input
                id="topic-subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="e.g. Scriptural exploration of truth"
                className="h-8.5 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
              />
            </div>
          </div>

          {/* Image URL & Thumbnail */}
          <div className="space-y-1">
            <Label htmlFor="topic-image" className="text-xs font-semibold text-foreground">
              Cover Image URL *
            </Label>
            <div className="flex gap-2 items-start">
              <Input
                id="topic-image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-8.5 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all flex-1"
                required
              />
              {formData.image && (
                <div className="w-16 h-8.5 rounded-lg overflow-hidden border border-border/70 flex-shrink-0 bg-muted/40">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Scriptures */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Scriptures</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {safeScriptures.length} added
              </span>
            </Label>
            <div className="flex gap-1.5">
              <Input
                value={scriptureInput}
                onChange={(e) => setScriptureInput(e.target.value)}
                placeholder="Add scripture reference (e.g. John 3:16) & hit Add..."
                className="h-8 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addScripture();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={addScripture}
                disabled={!scriptureInput.trim()}
                className="h-8 px-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs rounded-xl shadow-2xs transition-all flex-shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>

            {safeScriptures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {safeScriptures.map((scripture, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11.5px] font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>{scripture}</span>
                    <button
                      type="button"
                      onClick={() => removeScripture(index)}
                      className="hover:text-destructive hover:scale-110 transition-transform"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Extract (Tiptap Editor) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Main Extract & Sermon Notes
            </Label>
            <div className="rounded-xl border border-border/70 overflow-hidden bg-muted/15 shadow-2xs">
              <TiptapEditor
                content={formData.mainExtract}
                onChange={(content) => handleInputChange("mainExtract", content)}
                placeholder="Write the main biblical content, message extracts, and commentary..."
                className="w-full max-w-full"
              />
            </div>
          </div>

          {/* Quotes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Inspirational Quotes</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {safeQuotes.length} added
              </span>
            </Label>
            <div className="space-y-1.5">
              <Textarea
                value={quoteInput}
                onChange={(e) => setQuoteInput(e.target.value)}
                placeholder="Add an inspirational quote from the Message or Scriptures..."
                className="min-h-[56px] text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={addQuote}
                  disabled={!quoteInput.trim()}
                  className="h-7 px-2.5 text-[11px] rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border/60 shadow-2xs transition-all"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Quote
                </Button>
              </div>
            </div>

            {safeQuotes.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {safeQuotes.map((quote, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-2 p-2 bg-muted/30 border border-border/60 rounded-xl text-xs"
                  >
                    <p className="italic text-foreground/90 flex-1 leading-relaxed text-[11.5px]">
                      &ldquo;{quote}&rdquo;
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuote(index)}
                      className="h-5 w-5 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60 mt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-8 px-3.5 text-xs rounded-xl border-border/70 hover:bg-muted"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title?.trim()}
              className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  <span>Create Topic</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
