import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function NoResults({ searchQuery, onClearSearch }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {searchQuery ? `No topics matching "${searchQuery}"` : "No topics found"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        Try checking your spelling or searching for different keywords, scripture references, or themes.
      </p>
      {onClearSearch && (
        <Button
          variant="outline"
          onClick={onClearSearch}
          className="rounded-full text-sm font-medium border-border/60 hover:bg-muted"
        >
          Clear Search Filter
        </Button>
      )}
    </div>
  );
}

