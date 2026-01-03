"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Plus, X, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";

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
}

export function NewTopicForm({ onSuccess, onCancel }: NewTopicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleInputChange = (
    field: keyof NewTopicFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addScripture = () => {
    if (
      scriptureInput.trim() &&
      !formData.scriptures.includes(scriptureInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        scriptures: [...prev.scriptures, scriptureInput.trim()],
      }));
      setScriptureInput("");
    }
  };

  const removeScripture = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scriptures: prev.scriptures.filter((_, i) => i !== index),
    }));
  };

  const addQuote = () => {
    if (quoteInput.trim() && !formData.quotes.includes(quoteInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        quotes: [...prev.quotes, quoteInput.trim()],
      }));
      setQuoteInput("");
    }
  };

  const removeQuote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quotes: prev.quotes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the topic",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiService.createTopic(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Topic created successfully!",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin?direct=true");
          router.refresh();
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create topic",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {showPreview ? "Preview" : "New"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40">
        <Card className="bg-background/50 backdrop-blur-sm border-none">
          <CardContent className="p-3">
            {!showPreview ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter topic title..."
                    className="bg-cream-200 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-3">
                  <Label htmlFor="subtitle" className="text-sm font-medium">
                    Subtitle
                  </Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    placeholder="Enter topic subtitle (optional)..."
                    className="bg-cream-200 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Cover Image URL *
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Enter image URL..."
                    className="bg-cream-200 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                    required
                  />
                  {formData.image && (
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-40 h-24 object-cover rounded-2xl border-2 border-border shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Scriptures */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Scriptures</Label>
                  <div className="flex gap-3">
                    <Input
                      value={scriptureInput}
                      onChange={(e) => setScriptureInput(e.target.value)}
                      placeholder="Add a scripture reference (e.g., John 3:16)..."
                      className="bg-cream-200 rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addScripture())
                      }
                    />
                    <button
                      type="button"
                      onClick={addScripture}
                      className="bg-primary hover:bg-accent text-primary-foreground px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.scriptures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.scriptures.map((scripture, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm"
                        >
                          {scripture}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScripture(index)}
                            className="h-5 w-5 p-0 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Extract - Tiptap Editor */}
                <div className="space-y-3 w-full max-w-full">
                  <Label className="text-sm font-medium">Main Extract</Label>
                  <div className="w-full max-w-full overflow-hidden rounded-2xl shadow-sm">
                    <TiptapEditor
                      content={formData.mainExtract}
                      onChange={(content) =>
                        handleInputChange("mainExtract", content)
                      }
                      placeholder="Write the main content for this topic..."
                      className="bg-cream-200 w-full max-w-full"
                    />
                  </div>
                </div>

                {/* Quotes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quotes</Label>
                  <div className="flex-col gap-2">
                    <Textarea
                      value={quoteInput}
                      onChange={(e) => setQuoteInput(e.target.value)}
                      placeholder="Add an inspirational quote..."
                      className="bg-cream-200 min-h-[80px] rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addQuote}
                      className="bg-primary hover:bg-accent text-primary-foreground px-4 py-2 rounded-xl self-start mt-3 transition-all shadow-sm hover:shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.quotes.length > 0 && (
                    <div className="space-y-3 mt-3">
                      {formData.quotes.map((quote, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-cream-200 rounded-2xl border border-border shadow-sm"
                        >
                          <div className="flex-1 text-sm italic">
                            &ldquo;{quote}&rdquo;
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuote(index)}
                            className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-all"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-accent rounded-xl px-6 py-2.5 shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Creating..." : "Create Topic"}
                  </Button>
                </div>
              </form>
            ) : (
              // Preview Mode
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {formData.title || "Untitled Topic"}
                  </h1>
                  {formData.subtitle && (
                    <p className="text-lg text-muted-foreground">
                      {formData.subtitle}
                    </p>
                  )}
                </div>

                {formData.image && (
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {formData.scriptures.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Scriptures</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.scriptures.map((scripture, index) => (
                        <Badge key={index} variant="outline">
                          {scripture}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.mainExtract && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Main Extract</h3>
                    <div
                      className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: formData.mainExtract,
                      }}
                    />
                  </div>
                )}

                {formData.quotes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quotes</h3>
                    <div className="space-y-3">
                      {formData.quotes.map((quote, index) => (
                        <blockquote
                          key={index}
                          className="border-l-4 border-primary pl-4 italic text-foreground"
                        >
                          &ldquo;{quote}&rdquo;
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
