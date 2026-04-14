import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";
import {
  Bookmark,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authService } from "../../api/authService";
import { toast } from "sonner";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBecomeHost = async () => {
    try {
      await authService.becomeHost();
      toast.success("Congratulations! You are now a Host.", {
        description: "Logging you out to refresh your permissions...",
      });
      setIsDropdownOpen(false);
      setTimeout(() => {
        logout();
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upgrade account", {
        description: "Please try again later.",
      });
    }
  };

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
                className="hidden sm:flex items-center gap-2 text-sm text-stone-600 font-medium hover:text-stone-900"
              >
                <LayoutDashboard size={16} />
                Host Dashboard
              </Link>
            )}

            <Link
              to="/guest/profile"
              className="hidden sm:flex items-center gap-2 text-sm text-stone-600 font-medium hover:text-stone-900 whitespace-nowrap"
            >
              <Bookmark size={16} />
              My Bookings
            </Link>

            <div className="h-4 w-px bg-stone-300 hidden sm:block mx-2"></div>
            {/* 👇 NEW DROPDOWN MENU STRUCUTRE 👇 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm text-stone-600 font-medium hover:text-stone-900 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200 transition-colors"
              >
                <User size={16} />
                {user?.email?.split("@")[0]}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white border border-stone-100 rounded-xl shadow-lg py-2 flex flex-col z-50 animate-fade-in">
                  {!user?.roles.includes("Host") && (
                    <button
                      onClick={handleBecomeHost}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 w-full text-left"
                    >
                      <Home size={16} className="text-stone-400" />
                      Become a Host
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
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
