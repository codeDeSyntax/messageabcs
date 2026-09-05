/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { LogIn, LogOut, LayoutDashboard, ChevronDown, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard({ className = "" }: ProfileCardProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {isAuthenticated ? (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted/40 hover:bg-muted/70 border border-border/70 transition-all duration-150 cursor-pointer group"
          title="Account Menu"
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/80 flex-shrink-0">
            <Image
              src="/mabcs.png"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <span className="hidden sm:inline text-xs font-medium text-foreground max-w-[100px] truncate">
            {user?.username || "Admin"}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 hover:bg-muted/70 border border-border/70 text-xs font-medium text-foreground transition-all duration-150 shadow-2xs group"
          title="Admin Sign In"
        >
          <LogIn className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Sign in</span>
        </button>
      )}

      {/* Portal-based dropdown menu */}
      {isOpen &&
        createPortal(
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 999998 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Card */}
            <div
              className="fixed bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl p-2.5 shadow-xl min-w-[220px] animate-in fade-in-0 zoom-in-95 duration-100"
              style={{
                zIndex: 999999,
                position: "fixed",
                top: buttonPosition.top,
                right: buttonPosition.right,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Header */}
              <div className="flex items-center gap-2.5 p-2 mb-1.5 pb-2.5 border-b border-border/60">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src="/mabcs.png"
                    alt="admin avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {user?.username || "Admin"}
                    </span>
                    <span className="bg-primary/15 text-primary text-[9px] font-semibold px-1 py-0.2 rounded inline-flex items-center gap-0.5">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Admin
                    </span>
                  </div>
                  <span className="text-[10.5px] text-muted-foreground truncate">
                    Administrator Session
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/admin?direct=true");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-foreground/90 hover:text-foreground hover:bg-muted/70 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5 text-destructive" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

