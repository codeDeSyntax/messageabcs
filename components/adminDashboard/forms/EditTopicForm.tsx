"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/TiptapEditor";
import { Plus, X, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, BiblicalTopic } from "@/lib/api";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";

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
}

export function EditTopicForm({
  topicId,
  onSuccess,
  onCancel,
}: EditTopicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    const loadTopic = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getTopic(topicId);

        if (response.success && response.data) {
          const topic = response.data;
          setFormData({
            title: topic.title,
            subtitle: topic.subtitle || "",
            scriptures: topic.scriptures || [],
            mainExtract: topic.mainExtract || "",
            quotes: topic.quotes || [],
            image: topic.image,
          });
        } else {
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
        console.error("Error loading topic:", error);
        toast({
          title: "Error",
          description: "Failed to load topic",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTopic();
  }, [topicId, toast, onCancel]);

  const handleInputChange = (
    field: keyof EditTopicFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddScripture = () => {
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

  const handleRemoveScripture = (scriptureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      scriptures: prev.scriptures.filter(
        (scripture) => scripture !== scriptureToRemove
      ),
    }));
  };

  const handleAddQuote = () => {
    if (quoteInput.trim() && !formData.quotes.includes(quoteInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        quotes: [...prev.quotes, quoteInput.trim()],
      }));
      setQuoteInput("");
    }
  };

  const handleRemoveQuote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quotes: prev.quotes.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const updateData: Partial<BiblicalTopic> = {
        title: formData.title,
        subtitle: formData.subtitle,
        scriptures: formData.scriptures,
        mainExtract: formData.mainExtract,
        quotes: formData.quotes,
        image: formData.image,
      };

      const response = await apiService.updateTopic(topicId, updateData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Topic updated successfully!",
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
          description: response.error || "Failed to update topic",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      toast({
        title: "Error",
        description: "Failed to update topic",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading topic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {showPreview ? "Preview" : "Edit"}
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
        <Card className="bg-background/50 backdrop-blur-sm border-none border-primary/20">
          <CardContent className="p-3">
            {!showPreview ? (
              <form onSubmit={handleSave} className="space-y-6">
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
                <div className="space-y-4">
                  <Label>Scriptures</Label>
                  <div className="flex gap-2">
                    <Input
                      value={scriptureInput}
                      onChange={(e) => setScriptureInput(e.target.value)}
                      placeholder="Add a scripture reference (e.g., John 3:16)..."
                      className="bg-background/50"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddScripture())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddScripture}
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
                            onClick={() => handleRemoveScripture(scripture)}
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
                      onClick={handleAddQuote}
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
                            onClick={() => handleRemoveQuote(index)}
                            className="h-6 w-6 p-0 hover:bg-destructive flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-700 text-white hover:bg-transparent hover:text-black"
                  >
                    <Save className="h-4 w-4  " />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              // Preview Mode
              <div className="space-y-6">
                <div className="text-center space-y-4 p-8">
                  <h1 className="text-3xl font-bold text-foreground">
                    {formData.title}
                  </h1>
                  {formData.subtitle && (
                    <p className="text-lg text-muted-foreground">
                      {formData.subtitle}
                    </p>
                  )}
                  {formData.image && (
                    <div className="flex justify-center">
                      <img
                        src={formData.image}
                        alt="Topic cover"
                        className="w-64 h-40 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {formData.scriptures.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Scriptures
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.scriptures.map((scripture, index) => (
                        <Badge key={index} variant="secondary">
                          {scripture}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.mainExtract && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Main Extract
                    </h3>
                    <div
                      className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: formData.mainExtract,
                      }}
                    />
                  </div>
                )}

                {formData.quotes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Quotes
                    </h3>
                    <div className="space-y-2">
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
