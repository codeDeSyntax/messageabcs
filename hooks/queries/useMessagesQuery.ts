"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiService,
  Message,
  ThreadedMessage,
  CreateMessageRequest,
  MessageQuery,
} from "@/services/api";

// Query Keys
export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (filters: MessageQuery) => [...messageKeys.lists(), filters] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
  threads: () => [...messageKeys.all, "thread"] as const,
  thread: (threadId: string) => [...messageKeys.threads(), threadId] as const,
  conversations: (filters: Record<string, unknown>) =>
    [...messageKeys.all, "conversations", filters] as const,
};

// Queries
export function useMessages(params?: MessageQuery) {
  return useQuery({
    queryKey: messageKeys.list(params || {}),
    queryFn: async () => {
      const response = await apiService.getMessages(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch messages");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMessage(id: string, enabled = true) {
  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getMessage(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch message");
      }
      return response.data;
    },
    enabled: !!id && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useThread(threadId: string, enabled = true) {
  return useQuery({
    queryKey: messageKeys.thread(threadId),
    queryFn: async () => {
      const response = await apiService.getThread(threadId);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch thread");
      }
      return response.data || [];
    },
    enabled: !!threadId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useConversations(params?: {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: string;
}) {
  return useQuery({
    queryKey: messageKeys.conversations(params || {}),
    queryFn: async () => {
      const response = await apiService.getConversations(params);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch conversations");
      }
      return {
        data: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Mutations
export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: CreateMessageRequest) => {
      const response = await apiService.createMessage(message);
      if (!response.success) {
        throw new Error(response.error || "Failed to create message");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      // Invalidate conversations
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations({}),
      });
      // If part of a thread, invalidate the thread
      if (data?.threadId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.thread(data.threadId),
        });
      }
    },
  });
}

export function useReplyToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      parentId,
      content,
      author,
    }: {
      parentId: string;
      content: string;
      author?: string;
    }) => {
      const response = await apiService.replyToMessage(
        parentId,
        content,
        author
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to reply to message");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations({}),
      });
      if (data?.threadId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.thread(data.threadId),
        });
      }
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await apiService.updateMessage(id, content);
      if (!response.success) {
        throw new Error(response.error || "Failed to update message");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(data!.id) });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      if (data?.threadId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.thread(data.threadId),
        });
      }
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteMessage(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete message");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations({}),
      });
    },
  });
}

export function useHideMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await apiService.hideMessage(id, reason);
      if (!response.success) {
        throw new Error(response.error || "Failed to hide message");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(data!.id) });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      if (data?.threadId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.thread(data.threadId),
        });
      }
    },
  });
}

export function useUnhideMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.unhideMessage(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to unhide message");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.detail(data!.id) });
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      if (data?.threadId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.thread(data.threadId),
        });
      }
    },
  });
}
