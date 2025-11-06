import { useState, useEffect, useMemo } from "react";
import { BiblicalTopicWithCount } from "@/services/api";
import { useTopicsWithQuestionCounts } from "@/hooks/queries";

interface UseTopicsResult {
  topics: BiblicalTopicWithCount[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => void;
}

interface UseTopicsOptions {
  itemsPerPage?: number;
  initialPage?: number;
  initialSearch?: string;
}

export const useTopics = (options: UseTopicsOptions = {}): UseTopicsResult => {
  const { itemsPerPage = 8, initialPage = 1, initialSearch = "" } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

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
  const topics = useMemo(() => data?.data || [], [data]);

  // Filter topics based on search query (client-side filtering)
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;

    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.mainExtract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.scriptures?.some((scripture: string) =>
          scripture.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        topic.quotes?.some((quote: string) =>
          quote.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [topics, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTopics.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTopics, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
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
    loading,
    error,
    totalPages,
    currentPage,
    searchQuery,
    setCurrentPage,
    setSearchQuery: handleSearchChange,
    refetch: () => refetch(),
  };
};
