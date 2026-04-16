import axios from "axios";

/**
 * Extracts a user-friendly error message from any caught error.
 * Handles ASP.NET Core ProblemDetails, custom error objects,
 * and plain string responses from the backend.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = "An unexpected error occurred.",
): string => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data;

    // Check common backend error fields
    const backendMessage =
      data?.message ||
      data?.error ||
      data?.detail ||
      data?.title ||
      (typeof data === "string" ? data : undefined);

    return backendMessage || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
