import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { ClaimTypes, type DecodedToken, type User } from "../types/auth";

// 1. We define the "Shape" of our global state.
// This tells TypeScript what variables and functions are available to our React components.
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}
const getInitialState = () => {
  const token = localStorage.getItem("token");

  if (!token) return { token: null, user: null, isAuthenticated: false };

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Check if the token has expired
    // decoded.exp is in seconds, Date.now() is in milliseconds
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return { token: null, user: null, isAuthenticated: false };
    }

    const roleClaim = decoded[ClaimTypes.Role];
    const roles = Array.isArray(roleClaim)
      ? roleClaim
      : roleClaim
        ? [roleClaim]
        : [];

    const user: User = {
      id: decoded[ClaimTypes.NameIdentifier],
      email: decoded[ClaimTypes.Email],
      roles: roles,
    };
    return { token, user, isAuthenticated: true };
  } catch {
    localStorage.removeItem("token"); // Clean up invalid token
    return { token: null, user: null, isAuthenticated: false };
  }
};

const initialState = getInitialState();

// 2. We create the actual store using Zustand's `create` function.
// `set` is used to update the state, `get` is used to read the current state.
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state values
  token: initialState.token,
  user: initialState.user,
  isAuthenticated: initialState.isAuthenticated,

  // The login action
  login: (token: string) => {
    try {
      // Decode the token using the third-party library
      const decoded = jwtDecode<DecodedToken>(token);

      // Safely handle the .NET role format (string or array)
      const roleClaim = decoded[ClaimTypes.Role];
      const roles = Array.isArray(roleClaim)
        ? roleClaim
        : roleClaim
          ? [roleClaim]
          : [];

      // Create our clean User object
      const user: User = {
        id: decoded[ClaimTypes.NameIdentifier],
        email: decoded[ClaimTypes.Email],
        roles: roles,
      };

      // Native Browser API: Save it so we survive page refreshes
      localStorage.setItem("token", token);

      // Update global state
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error("Invalid token", error);
    }
  },

  // The logout action
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },

  // A handy helper for our UI (e.g., checking if we should show the "Host Dashboard" button)
  hasRole: (role: string) => {
    const { user } = get();
    return user?.roles.includes(role) ?? false;
  },
}));
