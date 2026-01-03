/* eslint-disable @next/next/no-img-element */
"use client";

import NextImage from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { ArrowLeft, LogIn, Eye, EyeOff } from "lucide-react";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      {/* Custom CSS for inset game-like inputs */}
      <style>{`
        .game-input-inset {
          box-shadow: 
            inset 3px 3px 8px rgba(0, 0, 0, 0.15),
            inset -1px -1px 3px rgba(255, 255, 255, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.3);
          background: linear-gradient(145deg, hsl(39 84% 90%), hsl(39 84% 94%));
          border: 2px solid hsl(32 47% 65%);
          position: relative;
        }
        
        .game-input-inset:focus {
          box-shadow: 
            inset 4px 4px 10px rgba(0, 0, 0, 0.2),
            inset -2px -2px 5px rgba(255, 255, 255, 0.2),
            0 0 0 3px hsl(25 35% 44% / 0.3);
          background: linear-gradient(145deg, hsl(39 84% 88%), hsl(39 84% 92%));
          border-color: hsl(25 35% 44%);
        }
        
        .game-input-inset:hover {
          box-shadow: 
            inset 3px 3px 8px rgba(0, 0, 0, 0.18),
            inset -1px -1px 3px rgba(255, 255, 255, 0.25),
            0 1px 0 rgba(255, 255, 255, 0.3);
          background: linear-gradient(145deg, hsl(39 84% 89%), hsl(39 84% 93%));
        }
        
        /* Dark mode styles - using your cream & brown theme */
        .dark .game-input-inset {
          box-shadow: 
            inset 3px 3px 8px rgba(0, 0, 0, 0.5),
            inset -1px -1px 3px rgba(255, 255, 255, 0.03),
            0 1px 0 rgba(255, 255, 255, 0.05);
          background: linear-gradient(145deg, hsl(30 12% 20%), hsl(30 12% 25%));
          border-color: hsl(30 12% 25%);
        }
        
        .dark .game-input-inset:focus {
          box-shadow: 
            inset 4px 4px 10px rgba(0, 0, 0, 0.6),
            inset -2px -2px 5px rgba(255, 255, 255, 0.04),
            0 0 0 3px hsl(25 35% 44% / 0.4);
          background: linear-gradient(145deg, hsl(30 12% 18%), hsl(30 12% 23%));
          border-color: hsl(25 35% 44%);
        }
        
        .dark .game-input-inset:hover {
          box-shadow: 
            inset 3px 3px 8px rgba(0, 0, 0, 0.55),
            inset -1px -1px 3px rgba(255, 255, 255, 0.05),
            0 1px 0 rgba(255, 255, 255, 0.06);
          background: linear-gradient(145deg, hsl(30 12% 21%), hsl(30 12% 26%));
        }
        
        /* Placeholder styling for game inputs */
        .game-input-inset::placeholder {
          color: hsl(30 12% 50%);
          text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.2);
        }
        
        .dark .game-input-inset::placeholder {
          color: hsl(0 0% 65%);
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
        }
        
        /* Text color matching your theme */
        .game-input-inset {
          color: hsl(30 12% 12%);
        }
        
        .dark .game-input-inset {
          color: hsl(0 0% 95%);
        }
        
        /* Add a subtle pressed effect when typing */
        .game-input-inset:focus:active {
          transform: translateY(1px);
        }
      `}</style>

      <div className="h-screen overflow-hidden relative">
        <AnimatedBackground />
        <div className="inset-0 absolute bg-primary/5 backdrop-blur-sm" />
        {/* Mobile Navigation Drawer */}
        <div className="md:hidden p-6 pb-2 relative z-10 flex justify-between items-center">
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
          <Logo />
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center h-full p-3 pt-0 md:pt-6 relative z-10">
          <div className="w-full max-w-md flex items-center">
            <Card className="w-full bg-background/20 backdrop-blur-sm border-border">
              <CardHeader className="border-b border-border text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <NextImage
                      alt="appicon"
                      src="/mabcs.png"
                      width={64}
                      height={64}
                      className="text-primary-foreground"
                    />
                  </div>
                </div>
                <CardTitle className="text-foreground text-2xl">
                  Admin Login
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  Sign in to manage topics and content
                </p>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => {
                        e.preventDefault();
                        handleInputChange("username", e.target.value);
                      }}
                      placeholder="Enter your username..."
                      className="bg-cream-200  rounded-full h-11 px-4 text-base font-medium transition-all duration-200 focus-visible:ring-0 focus-visible:bg-cream-100 focus-visible:ring-offset-0"
                      required
                      autoComplete="username"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="Enter your password..."
                        className=" bg-muted  border-none rounded-full h-11 px-4 pr-12 text-base font-medium transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-cream-100"
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent hover:scale-110 transition-transform duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-[40%] bg-primary hover:bg-accent text-primary-foreground py-3"
                    >
                      <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/topics")}
                      className="w-[40%] hover:bg-primary/20 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Topics
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
