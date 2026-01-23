"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DashboardSection } from "@/components/adminDashboard/types";

interface AdminDashboardContextType {
  // Global search state
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Active section
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

const AdminDashboardContext = createContext<
  AdminDashboardContextType | undefined
>(undefined);

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export function AdminDashboardProvider({
  children,
}: AdminDashboardProviderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");

  const value: AdminDashboardContextType = {
    searchTerm,
    setSearchTerm,
    activeSection,
    setActiveSection,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useAdminDashboard must be used within an AdminDashboardProvider",
    );
  }
  return context;
}
