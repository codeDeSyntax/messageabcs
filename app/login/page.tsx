/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Eye, EyeOff } from "lucide-react";
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
    document.title = "Admin Login - MessageABCs";
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
          title: "Welcome!",
          description: "Login successful",
        });

        // Redirect to admin dashboard or topics page
        router.push("/topics");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
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
    <>
      {/* Medium-style floating label inputs */}
      <style>{`
        /* Field container */
        .field-footprint {
          position: relative;
          border: 1px solid #d4a574;
          border-radius: 9999px;
          background: #faeed1;
          transition: all 0.2s ease;
        }
        
        .field-footprint:hover {
          border-color: #b8845f;
        }
        
        .field-footprint:focus-within {
          border-color: #9a674a;
          box-shadow: 0 0 0 1px #9a674a;
        }
        
        /* Label styling */
        .typeable-label {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .label-text {
          color: #5c3d2a;
          font-size: 1rem;
          line-height: 1;
          background: #faeed1;
          padding: 0 0.25rem;
        }
        
        /* Floating state - label moves to sit ON the border */
        .field-footprint.has-value .typeable-label,
        .field-footprint:focus-within .typeable-label {
          top: 0;
          transform: translateY(-50%);
        }
        
        .field-footprint.has-value .label-text,
        .field-footprint:focus-within .label-text {
          font-size: 0.75rem;
          color: #9a674a;
        }
        
        /* Input styling */
        .field-input {
          width: 100%;
          padding: 1.125rem 1rem 0.625rem 1rem;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: #1c1917;
          outline: none;
        }
        
        .field-input::placeholder {
          opacity: 0;
        }
        
        /* End decoration (for password toggle) */
        .end-decoration {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          pointer-events: all;
          z-index: 2;
        }
        
        .toggle-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          color: #5c3d2a;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .toggle-button:hover {
          color: #9a674a;
        }
      `}</style>

      <div className="min-h-screen bg-background relative flex flex-col">
        <AnimatedBackground />
        <div className="inset-0 absolute bg-background/90" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo className="h-8 mx-auto mb-6" />
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to manage biblical topics and content
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div
                className={`field-footprint ${
                  formData.username ? "has-value" : ""
                }`}
              >
                <label htmlFor="username" className="typeable-label">
                  <div className="label-text">Username</div>
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Username"
                  className="field-input"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div
                className={`field-footprint ${
                  formData.password ? "has-value" : ""
                }`}
              >
                <label htmlFor="password" className="typeable-label">
                  <div className="label-text">Password</div>
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Password"
                  className="field-input pr-12"
                  required
                  autoComplete="current-password"
                />
                <div className="end-decoration">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground hover:bg-foreground/90 text-background py-6 text-base font-medium rounded-full"
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-muted-foreground text-sm">OR</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Back to Topics Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/topics")}
                className="w-full rounded-full py-6 text-base font-medium  border-border hover:bg-muted hover:text-text"
              >
                Back to Topics
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                <a
                  href="/topics"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Use
                </a>
                <span className="mx-2">•</span>
                <a
                  href="/topics"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
