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
    <Card className="bg-white/95 backdrop-blur-xl border-none transition-all duration-200 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl  text-foreground">
          Admin Dashboard
        </CardTitle>
        <p className="text-muted-foreground">
          Access the administrative panel to manage content and users
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Settings</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Users</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Analytics</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Content</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Admin Access Required
          </Badge>
        </div>

        <Button
          onClick={onAccessAdmin}
          className="w-full bg-primary hover:bg-accent text-primary-foreground"
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
