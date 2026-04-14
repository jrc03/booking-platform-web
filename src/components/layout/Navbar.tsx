import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";
import { Bookmark, User } from "lucide-react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link
        to="/"
        className="text-2xl font-bold text-stone-900"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        BookingPlatform.
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {user?.roles.includes("Host") && (
              <Link
                to="/host/dashboard"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
              >
                Host Dashboard
              </Link>
            )}
            <Link
              to="/guest/profile"
              className="hidden sm:flex items-center gap-2 text-sm text-stone-600 font-medium whitespace-nowrap"
            >
              <Bookmark size={16} />
              My Bookings
            </Link>
            <div className="h-4 w-px bg-stone-300 hidden sm:block"></div>
            <span className="hidden sm:flex items-center gap-2 text-sm text-stone-600 font-light">
              <User size={16} />
              {user?.email?.split("@")[0]}
            </span>

            <Button onClick={logout} type="button">
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Sign In
            </Link>
            <Link to="/register">
              <Button type="button">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
