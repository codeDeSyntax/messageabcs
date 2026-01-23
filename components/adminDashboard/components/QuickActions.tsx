import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageCircle, MessageSquare, Settings } from "lucide-react";
import { DashboardSection } from "../types";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  onActionClick: (action: DashboardSection) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
}) => {
  const router = useRouter();

  return (
    <Card className="bg-background rounded-2xl shadow-none border-0">
      <CardContent className="p-4">
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <Button
            onClick={() => router.push("/topics/new")}
            className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all rounded-xl h-10 text-sm md:text-sm"
          >
            <BookOpen className="h-4 w-4" />
            Create Topic
          </Button>
          <Button
            onClick={() => onActionClick("topics")}
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-muted/50 transition-all rounded-xl h-10 text-sm md:text-sm"
          >
            <Settings className="h-4 w-4" />
            Manage Topics
          </Button>
          <Button
            onClick={() => onActionClick("questions")}
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-muted/50 transition-all rounded-xl h-10 text-sm md:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Review Questions
          </Button>
          <Button
            onClick={() => onActionClick("answers")}
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-muted/50 transition-all rounded-xl h-10 text-sm md:text-sm"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Manage Answers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
