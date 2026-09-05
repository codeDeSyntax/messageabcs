"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Plus, X, Save, Loader2, BookOpen, Quote as QuoteIcon, Edit3, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, BiblicalTopic } from "@/lib/api";

interface EditTopicFormData {
  title: string;
  subtitle: string;
  scriptures: string[];
  mainExtract: string;
  quotes: string[];
  image: string;
}

interface EditTopicFormProps {
  topicId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showPreview?: boolean;
  onTogglePreview?: (preview: boolean) => void;
}

const normalizeStringArray = (val: any): string[] => {
  if (Array.isArray(val)) return val.map((item) => String(item).trim()).filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {}
    return val.trim() ? [val.trim()] : [];
  }
  return [];
};

export function EditTopicForm({
  topicId,
  onSuccess,
  onCancel,
  showPreview = false,
  onTogglePreview,
}: EditTopicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<EditTopicFormData>({
    title: "",
    subtitle: "",
    scriptures: [],
    mainExtract: "",
    quotes: [],
    image: "",
  });

  const [scriptureInput, setScriptureInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTopic = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getTopic(topicId);

        if (response.success && response.data && isMounted) {
          const topic = response.data;
          setFormData({
            title: topic.title || "",
            subtitle: topic.subtitle || "",
            scriptures: normalizeStringArray(topic.scriptures),
            mainExtract: topic.mainExtract || "",
            quotes: normalizeStringArray(topic.quotes),
            image: topic.image || "",
          });
        } else if (isMounted) {
          toast({
            title: "Error",
            description: "Topic not found",
            variant: "destructive",
          });
          if (onCancel) {
            onCancel();
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading topic:", error);
          toast({
            title: "Error",
            description: "Failed to load topic details",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (topicId) {
      loadTopic();
    }

    return () => {
      isMounted = false;
    };
  }, [topicId, toast, onCancel]);

  const safeScriptures = Array.isArray(formData.scriptures)
    ? formData.scriptures
    : normalizeStringArray(formData.scriptures);

  const safeQuotes = Array.isArray(formData.quotes)
    ? formData.quotes
    : normalizeStringArray(formData.quotes);

  const handleInputChange = (
    field: keyof EditTopicFormData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddScripture = () => {
    const val = scriptureInput.trim();
    if (val && !safeScriptures.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        scriptures: [...safeScriptures, val],
      }));
      setScriptureInput("");
    }
  };

  const handleRemoveScripture = (scriptureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      scriptures: safeScriptures.filter(
        (scripture) => scripture !== scriptureToRemove,
      ),
    }));
  };

  const handleAddQuote = () => {
    const val = quoteInput.trim();
    if (val && !safeQuotes.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        quotes: [...safeQuotes, val],
      }));
      setQuoteInput("");
    }
  };

  const handleRemoveQuote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quotes: safeQuotes.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a topic title",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const updateData: Partial<BiblicalTopic> = {
        title: formData.title,
        subtitle: formData.subtitle,
        scriptures: safeScriptures,
        mainExtract: formData.mainExtract || "",
        quotes: safeQuotes,
        image: formData.image,
      };

      const response = await apiService.updateTopic(topicId, updateData);

      if (response.success) {
        toast({
          title: "Topic Updated",
          description: "Topic changes saved successfully!",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin?direct=true");
          router.refresh();
        }
      } else {
        toast({
          title: "Failed to Update",
          description: response.error || "An error occurred while saving topic.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update topic",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-52 space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading topic details...</p>
      </div>
    );
  }

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
                  disabled={isSaving}
                  className="h-8 px-3 text-xs rounded-xl text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving || !formData.title?.trim()}
                className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FORM VIEW (hidden when preview is active so Tiptap stays mounted and intact) */}
      <div className={showPreview ? "hidden" : "block space-y-3.5"}>
        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Title & Subtitle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-topic-title" className="text-xs font-semibold text-foreground">
                Topic Title *
              </Label>
              <Input
                id="edit-topic-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. The Mystery of the Godhead"
                className="h-8.5 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-topic-subtitle" className="text-xs font-semibold text-foreground">
                Subtitle / Theme
              </Label>
              <Input
                id="edit-topic-subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="e.g. Scriptural exploration of truth"
                className="h-8.5 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40 focus:bg-background text-foreground transition-all"
              />
            </div>
          </div>

          {/* Image URL & Thumbnail */}
          <div className="space-y-1">
            <Label htmlFor="edit-topic-image" className="text-xs font-semibold text-foreground">
              Cover Image URL *
            </Label>
            <div className="flex gap-2 items-start">
              <Input
                id="edit-topic-image"
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
                    handleAddScripture();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddScripture}
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
                      onClick={() => handleRemoveScripture(scripture)}
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
                  onClick={handleAddQuote}
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
                      onClick={() => handleRemoveQuote(index)}
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
                disabled={isSaving}
                className="h-8 px-3.5 text-xs rounded-xl border-border/70 hover:bg-muted"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSaving || !formData.title?.trim()}
              className="h-8 px-4 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
