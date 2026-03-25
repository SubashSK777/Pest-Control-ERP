"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Alert from "@/components/ui/alert/Alert";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Use requested credentials: dev@aflick.com / 123456
      if (email.toLowerCase() === "dev@aflick.com" && password === "123456") {
        if (typeof window !== "undefined") {
          localStorage.setItem("isAuthenticated", "true");
          router.replace("/");
        }
      } else {
        setError("Invalid credentials. Please use dev@aflick.com / 123456.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-md dark:text-white/90 sm:text-title-lg">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Access the A-Flick CRM Portal
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-5">
                {error && (
                  <Alert 
                    variant="error" 
                    title="Sign In Failed" 
                    message={error} 
                  />
                )}
                
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="dev@aflick.com" 
                    type="email" 
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => !isLoading && setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full h-11 text-base font-semibold" 
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
