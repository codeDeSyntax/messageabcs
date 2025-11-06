"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";

// Query Keys
export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  stats: () => [...adminKeys.dashboard(), "stats"] as const,
  activity: (filters: Record<string, unknown>) =>
    [...adminKeys.dashboard(), "activity", filters] as const,
  topics: (filters: Record<string, unknown>) =>
    [...adminKeys.all, "topics", filters] as const,
  questions: (filters: Record<string, unknown>) =>
    [...adminKeys.all, "questions", filters] as const,
  answers: (filters: Record<string, unknown>) =>
    [...adminKeys.all, "answers", filters] as const,
};

// Dashboard Queries
export function useDashboardStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async () => {
      const response = await apiService.getDashboardStats();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch dashboard stats");
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useRecentActivity(options?: {
  page?: number;
  limit?: number;
  type?: "topic" | "question" | "answer";
  user?: string;
  status?: "pending" | "answered" | "published" | "draft" | "archived";
}) {
  return useQuery({
    queryKey: adminKeys.activity(options || {}),
    queryFn: async () => {
      const response = await apiService.getRecentActivity(options);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch recent activity");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Admin Topics
export function useAdminTopics(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}) {
  return useQuery({
    queryKey: adminKeys.topics(params || {}),
    queryFn: async () => {
      const response = await apiService.adminGetTopics(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch admin topics");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useAdminCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic: {
      title: string;
      subtitle?: string;
      description: string;
      image: string;
      isActive: boolean;
    }) => {
      const response = await apiService.adminCreateTopic(topic);
      if (!response.success) {
        throw new Error(response.error || "Failed to create topic");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.topics({}) });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useAdminUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      topic,
    }: {
      id: number;
      topic: {
        title: string;
        subtitle?: string;
        description: string;
        image: string;
        isActive: boolean;
      };
    }) => {
      const response = await apiService.adminUpdateTopic(id, topic);
      if (!response.success) {
        throw new Error(response.error || "Failed to update topic");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.topics({}) });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useAdminDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.adminDeleteTopic(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete topic");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.topics({}) });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useAdminToggleTopicStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiService.adminToggleTopicStatus(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle topic status");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.topics({}) });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

// Admin Questions
export function useAdminQuestions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "pending" | "answered" | "closed";
  priority?: "all" | "low" | "medium" | "high";
}) {
  return useQuery({
    queryKey: adminKeys.questions(params || {}),
    queryFn: async () => {
      const response = await apiService.adminGetQuestions(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch admin questions");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAdminUpdateQuestionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "pending" | "answered" | "closed";
    }) => {
      const response = await apiService.adminUpdateQuestionStatus(id, status);
      if (!response.success) {
        throw new Error(response.error || "Failed to update question status");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.questions({}) });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useAdminUpdateQuestionPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      priority,
    }: {
      id: number;
      priority: "low" | "medium" | "high";
    }) => {
      const response = await apiService.adminUpdateQuestionPriority(
        id,
        priority
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update question priority");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.questions({}) });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useAdminAnswerQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: { content: string; isOfficial: boolean };
    }) => {
      const response = await apiService.adminAnswerQuestion(questionId, answer);
      if (!response.success) {
        throw new Error(response.error || "Failed to answer question");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.questions({}) });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

// Admin Answers
export function useAdminAnswers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "published" | "draft" | "archived";
  type?: "all" | "official" | "community";
}) {
  return useQuery({
    queryKey: adminKeys.answers(params || {}),
    queryFn: async () => {
      const response = await apiService.adminGetAnswers(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch admin answers");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useAdminUpdateAnswer() {
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
      const response = await apiService.adminUpdateAnswer(
        questionId,
        answerId,
        answer
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update answer");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.answers({}) });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useAdminDeleteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answerId,
    }: {
      questionId: string;
      answerId: string;
    }) => {
      const response = await apiService.adminDeleteAnswer(questionId, answerId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete answer");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.answers({}) });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
