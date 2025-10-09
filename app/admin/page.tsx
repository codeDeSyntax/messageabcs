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
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard - MessageABCs";

    // Check if user is authenticated and has admin role
    if (isAuthenticated && user?.role === "admin") {
      // Check if direct dashboard access is requested via URL parameter
      if (searchParams.get("direct") === "true") {
        setShowDashboard(true);
      }
    }
  }, [searchParams, isAuthenticated, user]);

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-black dark:to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/30 dark:bg-blue-600/30 rounded-full blur-2xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You need admin privileges to access this area.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-black dark:to-blue-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/30 dark:bg-blue-600/30 rounded-full blur-2xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <AdminAccessCard onAccessAdmin={() => setShowDashboard(true)} />
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

// Wrap the entire admin page with ProtectedRoute
export default function ProtectedAdminPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <AdminPage />
    </ProtectedRoute>
  );
}
