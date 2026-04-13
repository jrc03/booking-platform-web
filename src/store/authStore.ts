import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { ClaimTypes, type DecodedToken, type User } from "../types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

/**
 * Initializes the auth state from localStorage on application load.
 * Validates token expiration and extracts user claims.
 */
const getInitialState = () => {
  const token = localStorage.getItem("token");

  if (!token) return { token: null, user: null, isAuthenticated: false };

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Token 'exp' is in seconds; Date.now() is in milliseconds
    const now = Date.now();
    if (decoded.exp && decoded.exp * 1000 < now) {
      console.warn("Token initially expired, removing...");
      localStorage.removeItem("token");
      return { token: null, user: null, isAuthenticated: false };
    }

    const roleClaim = decoded[ClaimTypes.Role] || decoded.role;
    const roles = Array.isArray(roleClaim)
      ? roleClaim
      : roleClaim
        ? [roleClaim]
        : [];

    const user: User = {
      id: decoded[ClaimTypes.NameIdentifier] || decoded.sub || "",
      email: decoded[ClaimTypes.Email] || decoded.email || "",
      roles: roles,
    };

    return { token, user, isAuthenticated: true };
  } catch (error) {
    console.error("AuthStore getInitialState error:", error);
    localStorage.removeItem("token");
    return { token: null, user: null, isAuthenticated: false };
  }
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: initialState.token,
  user: initialState.user,
  isAuthenticated: initialState.isAuthenticated,

  login: (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const roleClaim = decoded[ClaimTypes.Role] || decoded.role;
      const roles = Array.isArray(roleClaim)
        ? roleClaim
        : roleClaim
          ? [roleClaim]
          : [];

      const user: User = {
        id: decoded[ClaimTypes.NameIdentifier] || decoded.sub || "",
        email: decoded[ClaimTypes.Email] || decoded.email || "",
        roles: roles,
      };

      localStorage.setItem("token", token);
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error("Invalid token during login:", error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },

  hasRole: (role: string) => {
    const { user } = get();
    return user?.roles.includes(role) ?? false;
  },
}));
