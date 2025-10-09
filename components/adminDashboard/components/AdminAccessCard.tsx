import React from "react";
import { Settings, Shield, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminAccessCardProps {
  onAccessAdmin: () => void;
}

const AdminAccessCard: React.FC<AdminAccessCardProps> = ({ onAccessAdmin }) => {
  return (
    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-heading text-foreground">
          Admin Dashboard
        </CardTitle>
        <p className="text-muted-foreground">
          Access the administrative panel to manage content and users
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/10">
            <Settings className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-foreground">Settings</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/10">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-foreground">Users</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/10">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-500/10">
            <Settings className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-foreground">Content</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
          >
            Admin Access Required
          </Badge>
        </div>

        <Button
          onClick={onAccessAdmin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Shield className="h-4 w-4 mr-2" />
          Access Admin Panel
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You must be logged in as an administrator to access this area
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminAccessCard;
