import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="w-full bg-stone-900 border-t border-stone-800 text-stone-400 py-12 flex flex-col items-center">
        <p className="text-xs tracking-widest uppercase font-light text-stone-500">
          © {new Date().getFullYear()} BookingPlatform.
        </p>
      </footer>
    </div>
  );
};
