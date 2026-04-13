import React, { useState } from "react";
import { authService } from "../api/authService";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  type RegisterField,
  validateRegisterField,
  validateRegisterForm,
} from "../utils/authValidation";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isHost: boolean = false;

  const handleBlur = (field: RegisterField, value: string) => {
    const message = validateRegisterField(field, value, password);
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        isHost,
      });

      setSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data?.errors) {
          const backendErrors: Record<string, string[]> =
            error.response.data.errors;
          const formattedErrors: Record<string, string> = {};
          Object.keys(backendErrors).forEach((key) => {
            const normalizedKey =
              key.length > 0 ? key.charAt(0).toLowerCase() + key.slice(1) : key;
            formattedErrors[normalizedKey] = backendErrors[key][0];
          });
          setErrors(formattedErrors);
        } else {
          setErrors({
            general:
              error.response.data?.message ||
              "Registration failed. Please try again.",
          });
        }
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
            Join us <br />
            <span className="italic text-stone-400">and start booking.</span>
          </h1>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-8 py-16 bg-stone-50">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h2
              className="text-3xl text-stone-900 font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sign up
            </h2>
            <p className="text-sm text-stone-400 font-light">
              Create an account to continue
            </p>
          </div>

          {success ? (
            <div className="p-6 text-center space-y-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-medium tracking-wide uppercase text-sm">
                Check your inbox!
              </h3>
              <p className="text-green-700 text-sm font-light">
                We've sent a confirmation link to <strong>{email}</strong>. You
                must confirm your email before you can sign in.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs text-green-800 underline uppercase tracking-widest hover:text-green-900"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errors.general && (
                <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md font-light">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Input
                  id="firstName"
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      firstName: "",
                      general: "",
                    }));
                  }}
                  onBlur={(e) => handleBlur("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <Input
                  id="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      lastName: "",
                      general: "",
                    }));
                  }}
                  onBlur={(e) => handleBlur("lastName", e.target.value)}
                  error={errors.lastName}
                />
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
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                      confirmPassword: "",
                      general: "",
                    }));
                  }}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  error={errors.password}
                />
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                      general: "",
                    }));
                  }}
                  onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                />

                <div className="pt-3">
                  <Button type="submit" isLoading={isLoading}>
                    Create Account
                  </Button>
                </div>
              </form>

              <p className="text-xs text-stone-400 font-light">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-stone-600 underline underline-offset-2 hover:text-stone-900 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
