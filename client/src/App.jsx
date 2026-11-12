import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import OTPVerifyPage from './pages/OTPVerifyPage';
import SetPasswordPage from './pages/SetPasswordPage';
import VerificationLoader from './pages/VerificationLoader';
import Dashboard from './pages/Dashboard';
import ProviderListPage from './pages/ProviderListPage';
import ProviderDetailPage from './pages/ProviderDetailPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import EasyAssistFlow from './pages/EasyAssistFlow';
import AdminPortalPage from './pages/AdminPortalPage';

import './App.css';

export default function App() {
  const location = useLocation();

  // Paths that do not show header, sidebar, or bottom nav
  const authPaths = ['/login', '/verify-otp', '/set-password', '/verifying'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="app-root">
      {!isAuthPage && <Header />}

      <div className={!isAuthPage ? 'app-layout' : ''}>
        <main className={!isAuthPage ? 'app-layout__main' : ''}>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPVerifyPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />
            <Route path="/verifying" element={<VerificationLoader />} />

            {/* Protected Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/providers"
              element={
                <ProtectedRoute>
                  <ProviderListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/providers/:id"
              element={
                <ProtectedRoute>
                  <ProviderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/easy-assist"
              element={
                <ProtectedRoute>
                  <EasyAssistFlow />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminPortalPage />} />

            {/* Fallback redirect */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      {!isAuthPage && <BottomNav />}
    </div>
  );
}