"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface QASearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onAskQuestion: () => void;
}

export const QASearchHeader = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onAskQuestion,
}: QASearchHeaderProps) => {
  return (
    <div className="px-3 md:px-6 py-3 md:py-6 flex-shrink-0 border-b border-border">
      {/* Search Bar with Ask Button */}
      <div className="flex gap-2 md:gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            className="pl-10 text-sm bg-background/20 backdrop-blur-sm border-border"
          />
        </div>
        <Button
          size="sm"
          className="bg-primary hover:bg-accent text-primary-foreground whitespace-nowrap"
          onClick={onAskQuestion}
        >
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden sm:inline">Ask Question</span>
          <span className="sm:hidden">Ask</span>
        </Button>
      </div>
    </div>
  );
};
