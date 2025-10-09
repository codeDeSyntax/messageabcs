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

      const savedToken = localStorage.getItem("authToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");
      const savedUserData = localStorage.getItem("userData");

      if (savedToken && savedUserData) {
        try {
          await apiService.verifyToken();
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          setUser(JSON.parse(savedUserData));
          setIsAuthenticated(true);
        } catch (error) {
          console.log("Token verification failed:", error);
          // Try to refresh if we have a refresh token
          if (savedRefreshToken) {
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
              clearAuthData();
            }
          } else {
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
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
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
        const newRefreshToken = response.refreshToken;

        localStorage.setItem("authToken", newToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(response.user));

        setToken(newToken);
        setRefreshToken(newRefreshToken || null);
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
      const savedRefreshToken = localStorage.getItem("refreshToken");
      if (!savedRefreshToken) {
        return false;
      }

      const response = await apiService.refreshToken(savedRefreshToken);
      if (response.success && response.token && response.refreshToken) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);

        setToken(response.token);
        setRefreshToken(response.refreshToken);
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
      const currentRefreshToken = localStorage.getItem("refreshToken");
      if (currentRefreshToken) {
        await apiService.logout(currentRefreshToken);
      }
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
