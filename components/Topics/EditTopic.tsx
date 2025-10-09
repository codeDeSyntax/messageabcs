import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiService, BiblicalTopic } from "@/services/api";

interface EditTopicForm {
  title: string;
  subtitle: string;
  scriptures: string[];
  mainExtract: string;
  quotes: string[];
  image: string;
}

export function EditTopicContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<EditTopicForm>({
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
    if (!id) {
      navigate("/topics");
      return;
    }

    console.log("Trying to load topic with ID:", id, "Type:", typeof id);

    const loadTopic = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getTopic(id);

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
          navigate("/topics");
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
  }, [id, navigate, toast]);

  const handleInputChange = (
    field: keyof EditTopicForm,
    value: string | number | string[]
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
    if (!id) return;

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

      const response = await apiService.updateTopic(id, updateData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Topic updated successfully!",
        });
        navigate("/topics");
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
      <div className="h-screen  overflow-hidden relative">
        <AnimatedBackground />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-muted-foreground">
              Loading topic...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="flex justify-center h-full  sm:p-6 pt-0 md:pt-6 relative z-10 ">
        <div className="w-full max-w-4xl h-full ">
          <Card className="h-full bg-white/20 dark:bg-black/10 backdrop-blur-sm border-blue-500/20 flex flex-col sm:pb-20">
            <CardHeader className="border-b border-blue-500/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/topics")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Topics
                  </Button>
                  <CardTitle className="text-foreground">
                    {showPreview ? "Preview" : "Edit"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="md:p-6 overflow-y-auto no-scrollbar flex-1 min-h-0">
              {!showPreview ? (
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-foreground"
                    >
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter topic title..."
                      className="bg-white/30 dark:bg-black/20 border-blue-500/30 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="subtitle"
                      className="text-sm font-medium text-foreground"
                    >
                      Subtitle
                    </Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) =>
                        handleInputChange("subtitle", e.target.value)
                      }
                      placeholder="Enter topic subtitle..."
                      className="bg-white/30 dark:bg-black/20 border-blue-500/30 focus:border-blue-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="text-sm font-medium text-foreground"
                    >
                      Cover Image URL *
                    </Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        handleInputChange("image", e.target.value)
                      }
                      placeholder="Enter image URL..."
                      className="bg-white/30 dark:bg-black/20 border-blue-500/30 focus:border-blue-500"
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
                    <Label className="text-sm font-medium text-foreground">
                      Scriptures
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={scriptureInput}
                        onChange={(e) => setScriptureInput(e.target.value)}
                        placeholder="e.g., John 3:16"
                        className="bg-white/30 dark:bg-black/20 border-blue-500/30 focus:border-blue-500"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddScripture())
                        }
                      />
                      <Button
                        type="button"
                        onClick={handleAddScripture}
                        className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-foreground border border-blue-500/30"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    {formData.scriptures.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.scriptures.map((scripture, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 bg-blue-500/20 text-foreground border border-blue-500/30 flex items-center gap-1"
                            onClick={() => handleRemoveScripture(scripture)}
                          >
                            {scripture}
                            <X className="h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Main Extract */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Main Extract
                    </Label>
                    <div className="min-h-[200px] rounded-md border border-blue-500/30 bg-white/30 dark:bg-black/20">
                      <TiptapEditor
                        content={formData.mainExtract}
                        onChange={(content) =>
                          handleInputChange("mainExtract", content)
                        }
                        placeholder="Enter the main content..."
                      />
                    </div>
                  </div>

                  {/* Quotes */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">
                      Quotes
                    </Label>
                    <div className="flex gap-2">
                      <textarea
                        value={quoteInput}
                        onChange={(e) => setQuoteInput(e.target.value)}
                        placeholder="Add an inspirational quote..."
                        className="flex-1 min-h-[80px] rounded-md bg-white/30 dark:bg-black/20 border border-blue-500/30 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                      />
                      <Button
                        type="button"
                        onClick={handleAddQuote}
                        className="self-start bg-blue-500/20 hover:bg-blue-500/30 text-foreground border border-blue-500/30"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {formData.quotes.length > 0 && (
                      <div className="space-y-2">
                        {formData.quotes.map((quote, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-white/20 dark:bg-black/10 rounded border border-blue-500/20"
                          >
                            <div className="flex-1 text-sm italic text-foreground">
                              "{quote}"
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveQuote(index)}
                              className="h-6 w-6 p-0 hover:bg-destructive/20 flex-shrink-0"
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
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-foreground border border-blue-500/30"
                      variant="outline"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
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
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-500/20 text-foreground border border-blue-500/30"
                          >
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
                            className="border-l-4 border-blue-500/30 pl-4 italic text-foreground"
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

// Wrap with ProtectedRoute
export default function EditTopic() {
  return (
    <ProtectedRoute>
      <EditTopicContent />
    </ProtectedRoute>
  );
}
