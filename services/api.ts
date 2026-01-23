// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // For production, always use the production server
  if (process.env.NODE_ENV === "production") {
    return "https://messageabcs-server.onrender.com/api";
  }

  // For development, check environment variable or use local server
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

console.log("🔗 Environment:", process.env.NODE_ENV); // Debug log
console.log("🔗 Is Production:", process.env.NODE_ENV === "production"); // Debug log
console.log(
  "🔗 NEXT_PUBLIC_API_BASE_URL:",
  process.env.NEXT_PUBLIC_API_BASE_URL,
); // Debug log
console.log("🔗 Final API Base URL:", API_BASE_URL); // Debug log

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface BiblicalTopic {
  id: string;
  title: string;
  subtitle?: string;
  scriptures?: string[];
  mainExtract?: string;
  quotes?: string[];
  image: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Message Types for Threaded Conversations
type AuthorType = "user" | "admin";

interface Message {
  id: string;
  content: string;
  author: string;
  authorType: AuthorType;
  dateCreated: string;
  parentId: string | null;
  threadId: string;
  topicId: string;
  topicTitle?: string;
  level: number;
  isEdited: boolean;
  editedAt?: string;
  isHidden: boolean;
  hiddenReason?: string;
  replyCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ThreadedMessage extends Message {
  replies?: ThreadedMessage[];
  depth?: number;
}

interface CreateMessageRequest {
  content: string;
  topicId?: string;
  parentId?: string;
  author?: string;
}

interface MessageQuery {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: string;
  threadId?: string;
  parentId?: string;
  authorType?: AuthorType;
  level?: number;
}

// Legacy Question/Answer interfaces (kept for backward compatibility)
interface Answer {
  id: string;
  answer: string;
  dateAnswered: string;
  adminUser: string;
}

interface Question {
  id: string;
  question: string;
  dateAsked: string;
  topicId: string;
  topicTitle?: string;
  askedBy?: string;
  answers: Answer[];
  answerCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Activity {
  id: string;
  type: "topic" | "question" | "answer" | "message";
  action: "created" | "updated" | "deleted" | "answered" | "replied";
  title: string;
  description?: string;
  user: string;
  timestamp: string;
  status: "pending" | "answered" | "published" | "draft" | "archived";
  relatedId?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  // Session expiry callback - can be set by AuthContext
  private onSessionExpired?: () => void;

  setSessionExpiredCallback(callback: () => void) {
    this.onSessionExpired = callback;
  }

  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🌐 API Request:", url); // Debug log

    const makeRequest = async (headers: HeadersInit): Promise<Response> => {
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: "include", // Include cookies for refresh token
      });
    };

    try {
      // First attempt with current token
      let headers = this.getAuthHeaders();
      let response = await makeRequest(headers);

      // If unauthorized and not a refresh/login request, try to refresh token
      if (
        response.status === 401 &&
        !endpoint.includes("/auth/refresh") &&
        !endpoint.includes("/auth/login")
      ) {
        console.log("🔄 Access token expired, attempting refresh...");

        try {
          // No need to check localStorage - refreshToken is in HttpOnly cookie!
          const refreshResponse = await this.refreshToken();

          if (refreshResponse.success && refreshResponse.token) {
            // Update stored access token only
            if (typeof window !== "undefined") {
              localStorage.setItem("authToken", refreshResponse.token);
            }

            // Retry original request with new token
            headers = this.getAuthHeaders();
            response = await makeRequest(headers);
            console.log("✅ Token refreshed, request retried successfully");
          } else {
            // Refresh failed, clear tokens and trigger session expired callback
            console.log("❌ Token refresh failed - session expired");
            if (typeof window !== "undefined") {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
            }

            // Trigger session expired callback to handle UI redirect
            if (this.onSessionExpired) {
              this.onSessionExpired();
            }

            throw new Error("Your session has expired. Please log in again.");
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and trigger session expired callback
          console.log("❌ Token refresh error - session expired");
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
          }

          // Trigger session expired callback to handle UI redirect
          if (this.onSessionExpired) {
            this.onSessionExpired();
          }

          throw new Error("Your session has expired. Please log in again.");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      console.error("Full URL:", url);
      throw error;
    }
  }

  // Auth endpoints
  async login(
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    user?: { username: string; role: string };
    message?: string;
    error?: string;
  }> {
    const url = `${API_BASE_URL}/auth/login`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
        },
        credentials: "include", // Important: Receive HttpOnly cookie!
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: /auth/login`, error);
      throw error;
    }
  }

  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return this.request("/auth/verify");
  }

  async refreshToken(): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    message?: string;
    error?: string;
  }> {
    const url = `${API_BASE_URL}/auth/refresh`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
        },
        credentials: "include", // Important: Send HttpOnly cookies!
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: /auth/refresh`, error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const url = `${API_BASE_URL}/auth/logout`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
        },
        credentials: "include", // Important: Send HttpOnly cookie!
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: /auth/logout`, error);
      throw error;
    }
  }

  // Topic endpoints
  async getTopics(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<BiblicalTopic[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return this.request(`/topics${query ? `?${query}` : ""}`);
  }

  async getTopicsWithQuestionCounts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<(BiblicalTopic & { questionsCount: number })[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return this.request(
      `/topics/with-question-counts${query ? `?${query}` : ""}`,
    );
  }

  async getTopic(id: string): Promise<ApiResponse<BiblicalTopic>> {
    return this.request(`/topics/${id}`);
  }

  async createTopic(
    topic: Omit<BiblicalTopic, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<BiblicalTopic>> {
    return this.request("/topics", {
      method: "POST",
      body: JSON.stringify(topic),
    });
  }

  async updateTopic(
    id: string,
    topic: Partial<Omit<BiblicalTopic, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ApiResponse<BiblicalTopic>> {
    return this.request(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(topic),
    });
  }

  async deleteTopic(id: string): Promise<ApiResponse<null>> {
    return this.request(`/topics/${id}`, {
      method: "DELETE",
    });
  }

  // Question endpoints
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    topicId?: string;
  }): Promise<ApiResponse<Question[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.topicId)
      searchParams.append("topicId", params.topicId.toString());

    const query = searchParams.toString();
    return this.request(`/questions${query ? `?${query}` : ""}`);
  }

  async getQuestion(id: string): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${id}`);
  }

  async createQuestion(question: {
    question: string;
    topicId: string;
    askedBy?: string;
  }): Promise<ApiResponse<Question>> {
    return this.request("/questions", {
      method: "POST",
      body: JSON.stringify(question),
    });
  }

  async addAnswer(
    questionId: string,
    answer: string,
  ): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
  }

  async updateAnswer(
    questionId: string,
    answerId: string,
    answer: string,
  ): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${questionId}/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify({ answer }),
    });
  }

  async deleteAnswer(
    questionId: string,
    answerId: string,
  ): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${questionId}/answers/${answerId}`, {
      method: "DELETE",
    });
  }

  // Admin Dashboard endpoints
  async getDashboardStats(): Promise<
    ApiResponse<{
      totalTopics: number;
      totalQuestions: number;
      totalAnswers: number;
      pendingQuestions: number;
      totalUsers: number;
      monthlyGrowth: number;
      responseTime: number;
      answeredPercentage: number;
    }>
  > {
    return this.request("/admin/dashboard/stats");
  }

  async getRecentActivity(options?: {
    page?: number;
    limit?: number;
    type?: "topic" | "question" | "answer";
    user?: string;
    status?: "pending" | "answered" | "published" | "draft" | "archived";
  }): Promise<ApiResponse<Activity[]>> {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.type) params.append("type", options.type);
    if (options?.user) params.append("user", options.user);
    if (options?.status) params.append("status", options.status);

    const queryString = params.toString();
    const endpoint = `/admin/dashboard/activity${
      queryString ? `?${queryString}` : ""
    }`;

    return this.request(endpoint);
  }

  // Admin Topics endpoints
  async adminGetTopics(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "active" | "inactive";
  }): Promise<
    ApiResponse<
      (BiblicalTopic & {
        questionsCount?: number;
        isActive: boolean;
      })[]
    >
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    const query = searchParams.toString();
    return this.request(`/admin/topics${query ? `?${query}` : ""}`);
  }

  async adminCreateTopic(topic: {
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    isActive: boolean;
  }): Promise<ApiResponse<BiblicalTopic & { isActive: boolean }>> {
    return this.request("/admin/topics", {
      method: "POST",
      body: JSON.stringify(topic),
    });
  }

  async adminUpdateTopic(
    id: number,
    topic: {
      title: string;
      subtitle?: string;
      description: string;
      image: string;
      isActive: boolean;
    },
  ): Promise<ApiResponse<BiblicalTopic & { isActive: boolean }>> {
    return this.request(`/admin/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(topic),
    });
  }

  async adminDeleteTopic(id: string): Promise<ApiResponse<null>> {
    return this.request(`/admin/topics/${id}`, {
      method: "DELETE",
    });
  }

  async adminToggleTopicStatus(
    id: string,
  ): Promise<ApiResponse<BiblicalTopic & { isActive: boolean }>> {
    return this.request(`/topics/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Get all topics for admin (includes inactive topics)
  async adminGetAllTopics(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<
    ApiResponse<
      (BiblicalTopic & { isActive: boolean; questionsCount: number })[]
    >
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    return this.request(
      `/topics/admin/all${queryString ? `?${queryString}` : ""}`,
    );
  }

  // Admin Questions endpoints
  async adminGetQuestions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "pending" | "answered" | "closed";
    priority?: "all" | "low" | "medium" | "high";
  }): Promise<
    ApiResponse<
      (Question & {
        status: "pending" | "answered" | "closed";
        priority: "low" | "medium" | "high";
        views: number;
      })[]
    >
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);

    const query = searchParams.toString();
    return this.request(`/admin/questions${query ? `?${query}` : ""}`);
  }

  async adminUpdateQuestionStatus(
    id: number,
    status: "pending" | "answered" | "closed",
  ): Promise<ApiResponse<Question>> {
    return this.request(`/admin/questions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async adminUpdateQuestionPriority(
    id: number,
    priority: "low" | "medium" | "high",
  ): Promise<ApiResponse<Question>> {
    return this.request(`/admin/questions/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    });
  }

  async adminAnswerQuestion(
    questionId: string,
    answer: {
      content: string;
      isOfficial: boolean;
    },
  ): Promise<ApiResponse<Question>> {
    return this.request(`/admin/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify(answer),
    });
  }

  // Admin Answers endpoints
  async adminGetAnswers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "published" | "draft" | "archived";
    type?: "all" | "official" | "community";
  }): Promise<
    ApiResponse<
      {
        id: number;
        content: string;
        questionId: number;
        questionTitle: string;
        topicTitle: string;
        answeredBy: string;
        answeredAt: string;
        isOfficial: boolean;
        status: "published" | "draft" | "archived";
        upvotes: number;
        downvotes: number;
        views: number;
      }[]
    >
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);

    const query = searchParams.toString();
    return this.request(`/admin/answers${query ? `?${query}` : ""}`);
  }

  async adminUpdateAnswer(
    questionId: string,
    answerId: string,
    answer: string,
  ): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${questionId}/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify({ answer }),
    });
  }

  // Note: Answer status updates are handled through the main update method

  async adminDeleteAnswer(
    questionId: string,
    answerId: string,
  ): Promise<ApiResponse<Question>> {
    return this.request(`/questions/${questionId}/answers/${answerId}`, {
      method: "DELETE",
    });
  }

  // Message endpoints for threaded conversations
  async getMessages(params?: MessageQuery): Promise<ApiResponse<Message[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.topicId) searchParams.append("topicId", params.topicId);
    if (params?.threadId) searchParams.append("threadId", params.threadId);
    if (params?.parentId) searchParams.append("parentId", params.parentId);
    if (params?.authorType)
      searchParams.append("authorType", params.authorType);
    if (params?.level !== undefined)
      searchParams.append("level", params.level.toString());

    const query = searchParams.toString();
    return this.request(`/messages${query ? `?${query}` : ""}`);
  }

  async getMessage(id: string): Promise<ApiResponse<Message>> {
    return this.request(`/messages/${id}`);
  }

  async getThread(threadId: string): Promise<ApiResponse<ThreadedMessage[]>> {
    return this.request(`/messages/thread/${threadId}`);
  }

  async getConversations(params?: {
    page?: number;
    limit?: number;
    search?: string;
    topicId?: string;
  }): Promise<ApiResponse<ThreadedMessage[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.topicId) searchParams.append("topicId", params.topicId);

    const query = searchParams.toString();
    return this.request(`/messages/conversations${query ? `?${query}` : ""}`);
  }

  async createMessage(
    message: CreateMessageRequest,
  ): Promise<ApiResponse<Message>> {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify(message),
    });
  }

  async replyToMessage(
    parentId: string,
    content: string,
    author?: string,
  ): Promise<ApiResponse<Message>> {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify({
        content,
        parentId,
        author: author || "Anonymous",
      }),
    });
  }

  async updateMessage(
    id: string,
    content: string,
  ): Promise<ApiResponse<Message>> {
    return this.request(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(id: string): Promise<ApiResponse<null>> {
    return this.request(`/messages/${id}`, {
      method: "DELETE",
    });
  }

  async hideMessage(
    id: string,
    reason?: string,
  ): Promise<ApiResponse<Message>> {
    return this.request(`/messages/${id}/hide`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async unhideMessage(id: string): Promise<ApiResponse<Message>> {
    return this.request(`/messages/${id}/unhide`, {
      method: "POST",
    });
  }
}

export const apiService = new ApiService();
export type {
  ApiResponse,
  BiblicalTopic,
  Question,
  Answer,
  Activity,
  Message,
  ThreadedMessage,
  CreateMessageRequest,
  MessageQuery,
  AuthorType,
};

// Extended type for topics with question counts
export type BiblicalTopicWithCount = BiblicalTopic & {
  questionsCount: number;
};
