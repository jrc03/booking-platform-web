import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// 1. TEMPORARY PLACEHOLDERS
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { HostDashboard } from '../pages/HostDashboard';
import { GuestProfile } from '../pages/GuestProfile';

// 2. THE ROUTER CONFIGURATION
export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // --- HOST PROTECTED ROUTES ---
  // Notice how we wrap multiple routes inside our Bouncer!
  { 
    element: <ProtectedRoute requireRole="Host" />,
    children: [
      { path: '/host/dashboard', element: <HostDashboard /> },
      // Later: { path: '/host/properties/new', element: <CreateProperty /> }
    ]
  },

  // --- GUEST PROTECTED ROUTES ---
  { 
    element: <ProtectedRoute requireRole="Guest" />,
    children: [
      { path: '/guest/profile', element: <GuestProfile /> },
      // Later: { path: '/guest/bookings', element: <GuestBookings /> }
    ]
  }
]);