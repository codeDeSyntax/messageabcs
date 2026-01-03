/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
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
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });

  console.log("ProfileCard render - isAuthenticated:", isAuthenticated);

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
    console.log("Login button clicked");
    router.push("/login");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className={`block relative ${className}`}>
      {isAuthenticated ? (
        <div className="relative">
          {/* Profile Icon Trigger */}
          <Button
            ref={buttonRef}
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Profile button clicked, isOpen:", !isOpen);
              setIsOpen(!isOpen);
            }}
            className={`${GAME_BUTTON_VARIANTS.primary}  h-10 w-10 p-0 rounded-full`}
          >
            <div className={`${GAME_SHINE_OVERLAY} rounded-full`}></div>
            <NextImage
              className={` ${GAME_Z_INDEX.overlay} `}
              src="/mabcs.png"
              alt="Profile"
              width={40}
              height={40}
            />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogin}
          className={`${GAME_BUTTON_VARIANTS.primary} bg-primary hover:bg-accent h-10 w-10 p-0 rounded-full`}
          title="Admin Login"
        >
          <div className={`${GAME_SHINE_OVERLAY} rounded-full`}></div>
          <LogIn className={`h-5 w-5 ${GAME_Z_INDEX.overlay}`} />
        </Button>
      )}

      {/* Portal-based dropdown to avoid z-index issues */}
      {isOpen &&
        createPortal(
          <>
            {/* Overlay to catch outside clicks */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 999998 }}
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown Menu - Glass Card Design */}
            <div
              className="fixed bg-background/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl min-w-[200px]"
              style={{
                zIndex: 999999,
                position: "fixed",
                top: buttonPosition.top,
                right: buttonPosition.right,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                  <NextImage
                    src="/mabcs.png"
                    alt="admin"
                    width={16}
                    height={16}
                    className="text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {user?.username || "Admin"}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      console.log("PORTAL BUTTON CLICKED - Dashboard");
                      router.push("/admin?direct=true");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground/90 hover:bg-primary/10 hover:text-foreground rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      console.log("PORTAL BUTTON CLICKED - Logout");
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/20 flex items-center gap-2"
                  >
                    <LogOut className="h-3 w-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
