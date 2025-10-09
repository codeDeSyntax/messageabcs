import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/TiptapEditor";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { ArrowLeft, Plus, X, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, BiblicalTopic } from "@/services/api";

interface NewTopicForm {
  title: string;
  subtitle: string;
  scriptures: string[];
  mainExtract: string;
  quotes: string[];
  image: string;
}

export default function NewTopic() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<NewTopicForm>({
    title: "",
    subtitle: "",
    scriptures: [],
    mainExtract: "",
    quotes: [],
    image: "",
  });

  // Temporary input states for arrays
  const [scriptureInput, setScriptureInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");

  const handleInputChange = (field: keyof NewTopicForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addScripture = () => {
    if (scriptureInput.trim()) {
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
    if (quoteInput.trim()) {
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
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Image URL is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting topic:", formData);

      const response = await apiService.createTopic(formData);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Topic created successfully",
        });
        router.push("/topics");
      } else {
        throw new Error(response.error || "Failed to create topic");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen pb-20 overflow-hidden relative">
      <AnimatedBackground />

      {/* Mobile Navigation Drawer */}
      <div className="md:hidden p-6 pb-2 relative z-10 flex justify-between items-center">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
        <div
          className="select-none cursor-default text-base font-bold tracking-wider uppercase"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: `0px 0px 0 rgb(59,130,246),
             1px 1px 0 rgb(54,125,241),
             2px 2px 0 rgb(49,120,236),
             3px 3px 0 rgb(44,115,231),
             4px 4px 0 rgb(39,110,226),
             5px 5px 0 rgb(34,105,221)`,
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          MESSAGE
          <span
            className="text-white"
            style={{
              color: "white",
              textShadow: `0px 0px 0 rgb(252, 252, 252),
               1px 1px 0 rgb(253, 253, 253),
               2px 2px 0 rgb(252, 252, 253),
               3px 3px 0 rgb(44,115,231),
               4px 4px 0 rgb(39,110,226),
               5px 5px 0 rgb(249, 249, 249)`,
            }}
          >
            ABCS
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center h-full p-1 sm:p-6 pt-0 md:pt-6 relative z-10">
        <div className="w-full max-w-4xl h-full">
          <Card className="h-full p-0 bg-white/20 dark:bg-black/10 backdrop-blur-sm border-blue-500/20 flex flex-col">
            <CardHeader className="border-b border-blue-500/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/topics")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Topics
                  </Button>
                  <CardTitle className="text-foreground hidden md:flex">
                    {previewMode ? "Preview Topic" : "Create New Topic"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto no-scrollbar flex-1 min-h-0">
              {!previewMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
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
                      placeholder="Enter topic subtitle..."
                      className="bg-background/50"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image URL *</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        handleInputChange("image", e.target.value)
                      }
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
                        placeholder="Add a scripture reference..."
                        className="bg-background/50"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addScripture())
                        }
                      />
                      <Button type="button" onClick={addScripture} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
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
                              className="h-4 w-4 p-0 hover:bg-destructive"
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
                    <div className="flex gap-2">
                      <Textarea
                        value={quoteInput}
                        onChange={(e) => setQuoteInput(e.target.value)}
                        placeholder="Add an inspirational quote..."
                        className="bg-background/50 min-h-[80px]"
                      />
                      <Button
                        type="button"
                        onClick={addQuote}
                        size="sm"
                        className="self-start"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.quotes.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {formData.quotes.map((quote, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-background/30 rounded border"
                          >
                            <div className="flex-1 text-sm italic">
                              "{quote}"
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
                      className="flex items-center gap-2"
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
                      <h3 className="text-lg font-semibold mb-2">
                        Main Extract
                      </h3>
                      <div
                        className=" max-w-none text-foreground whitespace-pre-wrap"
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
                            "{quote}"
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

      <div className="relative z-10">
        <BottomNavigation />
      </div>
    </div>
  );
}
