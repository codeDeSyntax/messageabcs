"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { BiblicalTopic } from "@/services/api";

interface AppContextType {
  // Topic selection state
  selectedTopic: BiblicalTopic | null;
  setSelectedTopic: (topic: BiblicalTopic | null) => void;

  // Action menu state
  isActionMenuOpen: boolean;
  setIsActionMenuOpen: (open: boolean) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // User/Auth state (for future use)
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;

  // UI states
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;

  // Toast/notification state
  toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    isVisible: boolean;
  } | null;
  setToast: (toast: AppContextType["toast"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [selectedTopic, setSelectedTopic] = useState<BiblicalTopic | null>(
    null
  );
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<AppContextType["toast"]>(null);

  const handleSetSelectedTopic = (topic: BiblicalTopic | null) => {
    setSelectedTopic(topic);
    setIsActionMenuOpen(!!topic);
  };

  return (
    <AppContext.Provider
      value={{
        selectedTopic,
        setSelectedTopic: handleSetSelectedTopic,
        isActionMenuOpen,
        setIsActionMenuOpen,
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        isSidebarOpen,
        setIsSidebarOpen,
        toast,
        setToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
