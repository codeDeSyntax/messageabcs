"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiService,
  BiblicalTopic,
  BiblicalTopicWithCount,
} from "@/services/api";

// Query Keys
export const topicKeys = {
  all: ["topics"] as const,
  lists: () => [...topicKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...topicKeys.lists(), filters] as const,
  details: () => [...topicKeys.all, "detail"] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
  withCounts: (filters: Record<string, unknown>) =>
    [...topicKeys.all, "with-counts", filters] as const,
};

// Queries
export function useTopics(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: topicKeys.list(params || {}),
    queryFn: async () => {
      const response = await apiService.getTopics(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch topics");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTopicsWithQuestionCounts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: topicKeys.withCounts(params || {}),
    queryFn: async () => {
      const response = await apiService.getTopicsWithQuestionCounts(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch topics with counts");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTopic(id: string, enabled = true) {
  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getTopic(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch topic");
      }
      return response.data;
    },
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutations
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      topic: Omit<BiblicalTopic, "id" | "createdAt" | "updatedAt">,
    ) => {
      const response = await apiService.createTopic(topic);
      if (!response.success) {
        throw new Error(response.error || "Failed to create topic");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all topic queries
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: topicKeys.withCounts({}) });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      topic,
    }: {
      id: string;
      topic: Partial<Omit<BiblicalTopic, "id" | "createdAt" | "updatedAt">>;
    }) => {
      const response = await apiService.updateTopic(id, topic);
      if (!response.success) {
        throw new Error(response.error || "Failed to update topic");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific topic and lists
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: topicKeys.withCounts({}) });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteTopic(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete topic");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all topic queries
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: topicKeys.withCounts({}) });
    },
  });
}

// Admin Queries
export function useAdminAllTopics(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [...topicKeys.all, "admin-all", params || {}],
    queryFn: async () => {
      const response = await apiService.adminGetAllTopics(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch all topics");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for admin views)
  });
}

export function useToggleTopicStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.adminToggleTopicStatus(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle topic status");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all topic queries including admin queries
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
    },
  });
}
