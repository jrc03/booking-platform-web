import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HostDashboard } from "../pages/HostDashboard";
import { GuestProfile } from "../pages/GuestProfile";
import { AppLayout } from "../components/layout/AppLayout";
import { CreatePropertyPage } from "../pages/CreatePropertyPage";
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

      {
        element: <ProtectedRoute requireRole="Host" />,
        children: [{ path: "/host/dashboard", element: <HostDashboard /> }],
      },
      {
        element: <ProtectedRoute requireRole="Guest" />,
        children: [{ path: "/guest/profile", element: <GuestProfile /> }],
      },
      {
        element: <ProtectedRoute requireRole="Host" />,
        children: [
          { path: "/host/dashboard", element: <HostDashboard /> },
          { path: "/host/properties/new", element: <CreatePropertyPage /> },
        ],
      },
    ],
  },
]);
