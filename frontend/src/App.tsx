import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard.tsx";
import History from "./pages/History.tsx";
import Statistics from "./pages/Statistics.tsx";
import Login from "./pages/Login.tsx";

// kalau belum login, redirect ke /login
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

// Admin only route
function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return token && role === 'admin' ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <PrivateRoute>
              <Statistics />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute><AdminApp /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminApp() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
    </Routes>
  );
}

// Lazy import admin pages to avoid circular imports
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
