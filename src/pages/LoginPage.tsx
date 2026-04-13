import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { validateLoginField, validateLoginForm } from "../utils/authValidation";
import { authService } from "../api/authService";
import axios from "axios";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Navigate to="/" replace />;

  
  const handleBlur = (field: "email" | "password", value: string) => {
    const message = validateLoginField(field, value);
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      const token = response.token;

      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from server");
      }

      login(token);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle ASP.NET Core ProblemDetails or custom objects
        const backendData = error.response?.data;

        const backendMessage =
          backendData?.message ||
          backendData?.error ||
          backendData?.detail ||
          backendData?.title ||
          (typeof backendData === "string" ? backendData : undefined);

        if (error.response?.status === 401) {
          // If the backend tells us it's an email confirmation issue, show it on the email field
          if (
            backendMessage &&
            backendMessage.toLowerCase().includes("confirm")
          ) {
            setErrors({ email: backendMessage });
          } else {
            // Otherwise, bind the 401 directly to the password field
            setErrors({
              password: backendMessage || "Email or password is incorrect",
            });
          }
        } else if (error.response?.status === 403) {
          // Bind the 403 directly to the email field
          setErrors({
            email:
              backendMessage || "Please confirm your email before logging in",
          });
        } else {
          // Fallback missing data error block
          setErrors({
            general:
              backendMessage ||
              "An unexpected error occurred. Please try again",
          });
        }
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 items-end p-14">
        <div className="space-y-3">
          <p className="text-stone-500 text-xs tracking-[0.2em] uppercase font-light">
            Est. 2026
          </p>
          <h1
            className="text-white text-5xl font-light leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Good to <br />
            <span className="italic text-stone-400">see you again.</span>
          </h1>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-8 py-16 bg-stone-50">
        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div className="space-y-1">
            <h2
              className="text-3xl text-stone-900 font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sign in
            </h2>
            <p className="text-sm text-stone-400 font-light">
              Enter your credentials to continue
            </p>
          </div>

          {/* Global general error, if needed */}
          {errors.general && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md font-light">
              {errors.general}
            </div>
          )}

          {/* Form */}
          {/* noValidate disables the browser's default HTML validation popups */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "", general: "" }));
              }}
              onBlur={(e) => handleBlur("email", e.target.value)}
              error={errors.email}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "", general: "" }));
              }}
              onBlur={(e) => handleBlur("password", e.target.value)}
              error={errors.password}
            />

            <div className="pt-3">
              <Button type="submit" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-xs text-stone-400 font-light">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-stone-600 underline underline-offset-2 hover:text-stone-900 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
