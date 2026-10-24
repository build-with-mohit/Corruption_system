import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import RegisterComplaint from "./pages/citizen/RegisterComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetail from "./pages/citizen/ComplaintDetail";
import CitizenProfile from "./pages/citizen/CitizenProfile";
import CitizenNotifications from "./pages/citizen/CitizenNotifications";
import CitizenHelp from "./pages/citizen/CitizenHelp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOfficers from "./pages/admin/AdminOfficers";
import AdminTracker from "./pages/admin/AdminTracker";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

function CitizenRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "citizen") return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/portal" replace />;
  return children;
}

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/portal"} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Citizen Portal */}
      <Route path="/portal" element={<CitizenRoute><CitizenDashboard /></CitizenRoute>} />
      <Route path="/portal/new" element={<CitizenRoute><RegisterComplaint /></CitizenRoute>} />
      <Route path="/portal/complaints" element={<CitizenRoute><MyComplaints /></CitizenRoute>} />
      <Route path="/portal/complaints/:id" element={<CitizenRoute><ComplaintDetail /></CitizenRoute>} />
      <Route path="/portal/profile" element={<CitizenRoute><CitizenProfile /></CitizenRoute>} />
      <Route path="/portal/notifications" element={<CitizenRoute><CitizenNotifications /></CitizenRoute>} />
      <Route path="/portal/help" element={<CitizenRoute><CitizenHelp /></CitizenRoute>} />

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/complaints" element={<AdminRoute><AdminComplaints /></AdminRoute>} />
      <Route path="/admin/complaints/:id" element={<AdminRoute><AdminComplaintDetail /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/officers" element={<AdminRoute><AdminOfficers /></AdminRoute>} />
      <Route path="/admin/tracker" element={<AdminRoute><AdminTracker /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
