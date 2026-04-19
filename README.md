# Booking Platform Web Interface

This repository contains the front-end application for the Booking Platform, a comprehensive property rental and reservation system. It provides distinct experiences for minimal-friction guest booking and robust host property management.

The corresponding back-end REST API, built with C# and Entity Framework Core, can be found here: [Booking Platform API](https://github.com/jrc03/booking-platform-api).

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS & Tailwind CSS for utility-class styling
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand
- **HTTP Client**: Axios (with JWT interceptors)
- **UI Components**: 
  - `react-day-picker` for availability calendars
  - `lucide-react` for iconography
  - `sonner` for system toasts and alerts

## Features

### Authentication & Authorization
- Secure JWT-based authentication.
- Role-based access control separating operational domains between Guests and Hosts.
- Protected routes ensuring components are only accessible to authorized users.

### Guest Experience
- **Property Discovery**: Search and browse available properties with active filtering.
- **Booking Flow**: View interactive availability calendars and submit booking requests for open dates.
- **Trip Management**: Dashboard to track upcoming trips and historical reservations.
- **Review System**: Submit ratings and post-stay reviews for completed bookings.

### Host Experience
- **Property Management**: Complete CRUD capabilities for managing property listings, including image uploads and descriptions.
- **Availability Control**: Directly block specific calendar dates to prevent guest reservations.
- **Host Dashboard**: High-level statistical overview tracking monthly earnings, active properties, and upcoming reservations.

### Global Systems
- **Notification Center**: Navbar integration alerting users of system events (e.g., received bookings, trip cancellations) with unread/read state tracking.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd booking-platform-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the root directory and specify the URL for the associated Booking Platform API.
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

The application is structured following feature-based and architectural separation of concerns:
- `/src/api` - Axios configurations, interceptors, and distinct service classes interacting with the backend.
- `/src/components` - Reusable UI components and layout shells.
- `/src/hooks` - Custom React hooks encapsulating complex component logic.
- `/src/pages` - Top-level route components handling page layout and core state.
- `/src/store` - Global state management utilizing Zustand.
- `/src/types` - TypeScript interfaces mapped to backend Data Transfer Objects (DTOs).
