"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Question } from "@/services/api";

// Query Keys
export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
};

// Queries
export function useQuestions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: string;
}) {
  return useQuery({
    queryKey: questionKeys.list(params || {}),
    queryFn: async () => {
      const response = await apiService.getQuestions(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch questions");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useQuestion(id: string, enabled = true) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getQuestion(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch question");
      }
      return response.data;
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutations
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: {
      question: string;
      topicId: string;
      askedBy?: string;
    }) => {
      const response = await apiService.createQuestion(question);
      if (!response.success) {
        throw new Error(response.error || "Failed to create question");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate questions list
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      // Also invalidate topics with counts since question count changed
      queryClient.invalidateQueries({ queryKey: ["topics", "with-counts"] });
    },
  });
}

export function useAddAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: string;
    }) => {
      const response = await apiService.addAnswer(questionId, answer);
      if (!response.success) {
        throw new Error(response.error || "Failed to add answer");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific question and lists
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answerId,
      answer,
    }: {
      questionId: string;
      answerId: string;
      answer: string;
    }) => {
      const response = await apiService.updateAnswer(
        questionId,
        answerId,
        answer
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update answer");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answerId,
    }: {
      questionId: string;
      answerId: string;
    }) => {
      const response = await apiService.deleteAnswer(questionId, answerId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete answer");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
