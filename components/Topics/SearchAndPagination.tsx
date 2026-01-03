import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  GAME_INPUT,
  GAME_NAV_BUTTON,
  GAME_BUTTON_VARIANTS,
  GAME_SHINE_OVERLAY,
  GAME_ROUNDED,
  GAME_Z_INDEX,
} from "@/constants/gameStyles";

interface SearchAndPaginationProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SearchAndPagination({
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}: SearchAndPaginationProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Row: Search and Pagination on mobile, Search + Grid + Pagination on desktop */}
      <div className="flex items-center gap-4 w-full">
        {/* Search Bar */}
        <div className="relative w-full  lg:w-full lg:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-10 w-full border-none bg-background rounded-full focus:shadow-none focus-visible:ring-primary shadow-none ring-0  `}
          />
        </div>

        {/* Pagination - inline on same row */}
      </div>
    </div>
  );
}
