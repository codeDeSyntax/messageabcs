import { useState, useEffect, useMemo } from "react";
import { apiService, BiblicalTopic } from "@/services/api";

interface UseTopicsResult {
  topics: BiblicalTopic[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => Promise<void>;
}

interface UseTopicsOptions {
  itemsPerPage?: number;
  initialPage?: number;
  initialSearch?: string;
}

export const useTopics = (options: UseTopicsOptions = {}): UseTopicsResult => {
  const { itemsPerPage = 8, initialPage = 1, initialSearch = "" } = options;

  const [topics, setTopics] = useState<BiblicalTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Filter topics based on search query (client-side filtering for now)
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;

    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.mainExtract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.scriptures?.some((scripture) =>
          scripture.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        topic.quotes?.some((quote) =>
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

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getTopics();

      if (response.success && response.data) {
        setTopics(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch topics");
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Fallback to empty array on error
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Initial fetch
  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics: paginatedTopics,
    loading,
    error,
    totalPages,
    currentPage,
    searchQuery,
    setCurrentPage,
    setSearchQuery: handleSearchChange,
    refetch: fetchTopics,
  };
};
