import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HostDashboard } from "../pages/HostDashboard";
import { GuestProfile } from "../pages/GuestProfile";
import { AppLayout } from "../components/layout/AppLayout";
import { CreatePropertyPage } from "../pages/CreatePropertyPage";
import { PropertyPage } from "../pages/PropertyPage";
import { BookingPage } from "../pages/BookingPage";

// 2. THE ROUTER CONFIGURATION
export const router = createBrowserRouter([
  // --- AUTH ROUTES ---
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // --- APP ROUTES ---
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/property/:id", element: <PropertyPage /> },
      {
        element: <ProtectedRoute requireRole="Guest" />,
        children: [
          { path: "/guest/profile", element: <GuestProfile /> },
          { path: "/property/:id/book", element: <BookingPage /> },
        ],
      },
      {
        element: <ProtectedRoute requireRole="Host" />,
        children: [
          { path: "/host/dashboard", element: <HostDashboard /> },
          { path: "/host/properties/new", element: <CreatePropertyPage /> },
          { path: "/host/properties/:id/edit", element: <CreatePropertyPage /> },
        ],
      },
    ],
  },
]);
