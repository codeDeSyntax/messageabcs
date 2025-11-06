"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "@/services/api";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      // Clean up old refreshToken from localStorage (migration cleanup)
      const oldRefreshToken = localStorage.getItem("refreshToken");
      if (oldRefreshToken) {
        console.log("🧹 Cleaning up old refreshToken from localStorage");
        localStorage.removeItem("refreshToken");
      }

      const savedToken = localStorage.getItem("authToken");
      const savedUserData = localStorage.getItem("userData");

      if (savedToken && savedUserData) {
        try {
          await apiService.verifyToken();
          setToken(savedToken);
          setUser(JSON.parse(savedUserData));
          setIsAuthenticated(true);
        } catch (error) {
          console.log("Token verification failed:", error);
          // Try to refresh using HttpOnly cookie (no need to check localStorage)
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            clearAuthData();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearAuthData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      // No need to remove refreshToken - it's in HttpOnly cookie
    }
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await apiService.login(username, password);
      if (response.success && response.token && response.user) {
        const newToken = response.token;

        // Store only access token and user data
        // RefreshToken is now in HttpOnly cookie (more secure!)
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("userData", JSON.stringify(response.user));

        setToken(newToken);
        setRefreshToken(null); // Not stored in frontend anymore
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      // No need to pass refreshToken - it's sent automatically in HttpOnly cookie!
      const response = await apiService.refreshToken();
      if (response.success && response.token) {
        localStorage.setItem("authToken", response.token);

        setToken(response.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // No need to pass refreshToken - it's sent automatically in HttpOnly cookie!
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        refreshToken,
        user,
        login,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
