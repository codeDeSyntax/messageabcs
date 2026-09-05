"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HomeArtBackground } from "@/components/HomeArtBackground";
import { Eye, EyeOff, ArrowLeft, Lock, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Admin Sign In - MessageABCs";
  }, []);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        toast({
          title: "Welcome Back!",
          description: "Sign in successful",
        });

        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-canvas)] relative flex flex-col justify-between overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background artwork */}
      <HomeArtBackground />

      {/* Top Bar with Back Navigation */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/60 transition-all font-sans"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </button>

        <Logo />
      </header>

      {/* Main Centered Frameless Sign-In Area */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-sm space-y-8 text-center sm:text-left">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wider uppercase font-sans">
              <Lock className="h-3 w-3" />
              <span>Admin Console</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xs mx-auto">
              Enter your credentials to manage scripture topics, questions, and outlines.
            </p>
          </div>

          {/* Form Sitting Directly on Background */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-foreground font-sans"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter username"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-background/70 backdrop-blur-xs border border-border/80 shadow-2xs text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-sans"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-foreground font-sans"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-background/70 backdrop-blur-xs border border-border/80 shadow-2xs text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-sans"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground p-1 transition-colors"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue to Admin Console</span>
                )}
              </Button>
            </div>

            {/* Return / Public links */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => router.push("/topics")}
                className="text-xs text-muted-foreground hover:text-foreground font-medium underline underline-offset-4 transition-colors font-sans"
              >
                Browse Public Studies & Topics
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-muted-foreground font-sans">
        <p className="text-[11px] text-muted-foreground/70">
          MessageABCs &copy; {new Date().getFullYear()} &bull; Biblical Truth & Wisdom
        </p>
      </footer>
    </div>
  );
}
