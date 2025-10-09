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
        <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-3">
            {!showPreview ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter topic title..."
                    className="bg-background/50"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    placeholder="Enter topic subtitle (optional)..."
                    className="bg-background/50"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image URL *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Enter image URL..."
                    className="bg-background/50"
                    required
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Scriptures */}
                <div className="space-y-2">
                  <Label>Scriptures</Label>
                  <div className="flex gap-2">
                    <Input
                      value={scriptureInput}
                      onChange={(e) => setScriptureInput(e.target.value)}
                      placeholder="Add a scripture reference (e.g., John 3:16)..."
                      className="bg-background/50"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addScripture())
                      }
                    />
                    <button
                      type="button"
                      onClick={addScripture}
                      className={`${GAME_BUTTON_SMALL.primary} px-3 py-2`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.scriptures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.scriptures.map((scripture, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {scripture}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScripture(index)}
                            className="h-4 w-4 p-0 bg-blue-700 text-white  hover:text-black hover:bg-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Extract - Tiptap Editor */}
                <div className="space-y-2 w-full max-w-full">
                  <Label>Main Extract</Label>
                  <div className="w-full max-w-full overflow-hidden">
                    <TiptapEditor
                      content={formData.mainExtract}
                      onChange={(content) =>
                        handleInputChange("mainExtract", content)
                      }
                      placeholder="Write the main content for this topic..."
                      className="bg-background/50 w-full max-w-full"
                    />
                  </div>
                </div>

                {/* Quotes */}
                <div className="space-y-2">
                  <Label>Quotes</Label>
                  <div className="flex-col gap-2">
                    <Textarea
                      value={quoteInput}
                      onChange={(e) => setQuoteInput(e.target.value)}
                      placeholder="Add an inspirational quote..."
                      className="bg-background/50 min-h-[80px]"
                    />
                    <button
                      type="button"
                      onClick={addQuote}
                      className={`${GAME_BUTTON_SMALL.primary} px-3 py-2 self-start mt-3`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.quotes.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.quotes.map((quote, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-background/30 rounded border"
                        >
                          <div className="flex-1 text-sm italic">
                            &ldquo;{quote}&rdquo;
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuote(index)}
                            className="h-6 w-6 p-0 hover:bg-destructive flex-shrink-0"
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
                    className="flex items-center bg-blue-700 text-white hover:bg-transparent hover:text-black  gap-2"
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
