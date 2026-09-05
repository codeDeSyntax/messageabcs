import { useState, useEffect, useMemo } from "react";
import { BiblicalTopicWithCount } from "@/services/api";
import { useTopicsWithQuestionCounts } from "@/hooks/queries";

export type TopicSortOption = "latest" | "popular" | "alphabetical";

interface UseTopicsResult {
  topics: BiblicalTopicWithCount[];
  allTopics: BiblicalTopicWithCount[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  sortBy: TopicSortOption;
  setSortBy: (sort: TopicSortOption) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => void;
}

interface UseTopicsOptions {
  itemsPerPage?: number;
  initialPage?: number;
  initialSearch?: string;
  initialSort?: TopicSortOption;
}

export const useTopics = (options: UseTopicsOptions = {}): UseTopicsResult => {
  const {
    itemsPerPage = 8,
    initialPage = 1,
    initialSearch = "",
    initialSort = "latest",
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<TopicSortOption>(initialSort);

  // Use TanStack Query for data fetching
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useTopicsWithQuestionCounts({
    page: 1,
    limit: 100, // Get more topics to support client-side filtering
  });

  const error = queryError ? (queryError as Error).message : null;

  // Memoize topics to prevent unnecessary recalculations
  const rawTopics = useMemo(() => data?.data || [], [data]);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    let result = rawTopics;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (topic) =>
          topic.title?.toLowerCase().includes(q) ||
          topic.subtitle?.toLowerCase().includes(q) ||
          topic.mainExtract?.toLowerCase().includes(q) ||
          topic.scriptures?.some((s: string) => s.toLowerCase().includes(q)) ||
          topic.quotes?.some((quote: string) => quote.toLowerCase().includes(q))
      );
    }

    // Sort topics
    const sorted = [...result];
    if (sortBy === "popular") {
      sorted.sort((a, b) => {
        const countA = ("questionsCount" in a ? a.questionsCount : 0) || 0;
        const countB = ("questionsCount" in b ? b.questionsCount : 0) || 0;
        return countB - countA;
      });
    } else if (sortBy === "alphabetical") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // "latest"
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return sorted;
  }, [rawTopics, searchQuery, sortBy]);

  // Calculate pagination
  const totalItems = filteredTopics.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTopics.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTopics, currentPage, itemsPerPage]);

  // Reset to first page when search or sort changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: TopicSortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return {
    topics: paginatedTopics,
    allTopics: filteredTopics,
    totalItems,
    loading,
    error,
    totalPages,
    currentPage,
    searchQuery,
    sortBy,
    setSortBy: handleSortChange,
    setCurrentPage,
    setSearchQuery: handleSearchChange,
    refetch: () => refetch(),
  };
};

