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
    <div className="px-6 py-6 flex-shrink-0 border-b border-gray-200/10">
      {/* Search Bar with Ask Button */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            className="pl-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20"
          />
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onAskQuestion}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask Question
        </Button>
      </div>
    </div>
  );
};
