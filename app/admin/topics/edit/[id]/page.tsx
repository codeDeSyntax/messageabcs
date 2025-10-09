"use client";

import { EditTopicForm } from "@/components/adminDashboard/forms/EditTopicForm";
import { useRouter, useParams } from "next/navigation";
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

function EditTopicPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const topicId = params.id as string;

  // Check if user has admin role
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You need admin privileges to edit topics.
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

  if (!topicId) {
    router.push("/admin?direct=true");
    return null;
  }

  return (
    <div className="h-screen  overflow-hidden relative ">
      <AnimatedBackground />
      {/* <div className="inset-0 absolute bg-background/50 backdrop-blur-sm border-primary/20" /> */}
      {/* Mobile Navigation Drawer */}
      <div className="md:hidden p-6 pb-2 relative z-10 flex justify-between items-center">
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
        <Logo variant="compact" />
      </div>

      {/* Main Content */}
      <div className="flex justify-center h-full sm:p-3 pt-0 md:pt-3 relative z-10">
        <div className="w-full max-w-4xl h-full">
          <Card className="h-full p-2 bg-blue-100/30 dark:bg-black/30 backdrop-blur-sm border-none border-blue-500/20 flex flex-col">
            <CardHeader className="border-b border-blue-500/20 flex-shrink-0 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin
                  </Button>
                  <CardTitle className="text-foreground">Edit Topic</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className=" p-2 md:p-6 overflow-y-auto no-scrollbar flex-1 min-h-0">
              <EditTopicForm
                topicId={topicId}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10">
        <BottomNavigation />
      </div>
    </div>
  );
}

// Wrap with ProtectedRoute
export default function ProtectedEditTopicPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <EditTopicPage />
    </ProtectedRoute>
  );
}
