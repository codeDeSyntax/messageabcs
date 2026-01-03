"use client";

import { NewTopicForm } from "@/components/adminDashboard/forms/NewTopicForm";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

function NewTopicPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check if user has admin role
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You need admin privileges to create topics.
          </p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/admin?direct=true");
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/admin?direct=true");
  };

  return (
    <div className="h-screen pb-20 overflow-hidden relative bg-background/50 backdrop-blur-sm border-primary/20">
      <AnimatedBackground />

      {/* Mobile Navigation Drawer */}
      <div className="md:hidden py-6 px-3 pb-2 relative z-10 flex justify-between items-center">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
        <Logo variant="compact" />
      </div>

      {/* Main Content */}
      <div className="flex justify-center h-full sm:p-6 pt-0 md:pt-6 relative z-10">
        <div className="w-full max-w-4xl h-full ">
          <Card className="h-full bg-background/20 backdrop-blur-sm border-border flex flex-col">
            <CardContent className="p-2  md:p-4 overflow-y-auto no-scrollbar flex-1 min-h-0">
              <NewTopicForm onSuccess={handleSuccess} onCancel={handleCancel} />
            </CardContent>
          </Card>
        </div>
      </div>

     
    </div>
  );
}

// Wrap with ProtectedRoute
export default function ProtectedNewTopicPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <NewTopicPage />
    </ProtectedRoute>
  );
}
