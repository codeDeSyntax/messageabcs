import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export const ReadingEmptyState = () => {
  const router = useRouter();

  const handleBackToTopics = () => {
    router.push("/topics");
  };

  return (
    <Card className="h-full bg-background/20 backdrop-blur-sm border-border flex items-center justify-center border-none">
      <CardContent className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 mx-auto border-none rounded-full flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Ready to Read?</h2>
          <p className="text-muted-foreground">
            Select a topic from the Topics page to begin your spiritual journey
          </p>
        </div>
        <Button
          onClick={handleBackToTopics}
          className="bg-primary/20 hover:bg-primary/30 text-foreground border border-border"
          variant="outline"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Browse Topics
        </Button>
      </CardContent>
    </Card>
  );
};
