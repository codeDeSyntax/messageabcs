import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchAndPaginationProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  placeholder?: string;
}

export function SearchAndPagination({
  searchQuery,
  onSearchChange,
  placeholder = "Search topics, scriptures, or keywords...",
}: SearchAndPaginationProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-9 w-full h-10 text-sm bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/50 rounded-full transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary shadow-none"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

