import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Use requested credentials: dev@aflick.com / 123456
    if (email === "dev@aflick.com" && password === "123456") {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    } else {
      setError("Invalid email address or password. Please try again.");
    }
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
              Enter email dev@aflick.com and password 123456
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/10 text-red-500 text-sm p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                    {error}
                  </div>
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
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="123456"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
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
                  <Button className="w-full h-12 text-base font-semibold" size="sm">
                    Sign in
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
