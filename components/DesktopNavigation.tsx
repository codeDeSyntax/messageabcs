import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  GAME_CARD_VARIANTS,
  GAME_BUTTON_VARIANTS,
  GAME_SHINE_OVERLAY,
  GAME_ROUNDED,
  GAME_Z_INDEX,
} from "@/constants/gameStyles";

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard({ className = "" }: ProfileCardProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={`hidden md:block fixed top-6 right-6 z-50 ${className}`}>
      <div
        className={`${GAME_CARD_VARIANTS.primary} p-4 backdrop-blur-lg min-w-[200px]`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">
            {isAuthenticated ? "Admin Panel" : "Quick Access"}
          </h3>
        </div>

        {/* Authentication Section */}
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <User className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">
                Logged in as {user?.username || "Admin"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/topics")}
                className="flex-1 h-8 text-xs hover:bg-primary-foreground/10"
              >
                Manage Topics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            className={`${GAME_BUTTON_VARIANTS.primary} w-full h-10 text-sm`}
          >
            <div
              className={`${GAME_SHINE_OVERLAY} ${GAME_ROUNDED.small}`}
            ></div>
            <LogIn className={`h-4 w-4 mr-2 ${GAME_Z_INDEX.overlay}`} />
            <span className={GAME_Z_INDEX.overlay}>Admin Login</span>
          </Button>
        )}
      </div>
    </div>
  );
}
