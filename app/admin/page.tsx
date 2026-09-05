"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AdminDashboard from "@/components/adminDashboard/AdminDashboard";
import AdminAccessCard from "@/components/adminDashboard/components/AdminAccessCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const AdminPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    document.title = "Admin Settings - MessageABCs";
  }, []);

  const isAdmin = isAuthenticated && user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--theme-canvas)] flex items-center justify-center p-4">
        <div className="bg-[var(--theme-surface)] border border-[var(--theme-border-subtle)] rounded-3xl p-8 max-w-md text-center shadow-lg">
          <h1 className="text-xl font-bold text-red-700 mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-[var(--theme-text-secondary)]">
            You need administrator privileges to access this area.
          </p>
        </div>
      </div>
    );
  }

  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-[var(--theme-canvas)] flex items-center justify-center p-4">
        <AdminAccessCard onAccessAdmin={() => setShowDashboard(true)} />
      </div>
    );
  }

  return <AdminDashboard />;
};

export default function ProtectedAdminPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <AdminPage />
    </ProtectedRoute>
  );
}
