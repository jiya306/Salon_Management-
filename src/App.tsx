import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { NotificationProvider } from './context/NotificationContext.js';
import { PublicNavbar } from './components/layout/PublicNavbar.js';
import { PublicFooter } from './components/layout/PublicFooter.js';
import { DashboardLayout } from './components/layout/DashboardLayout.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.js';
import { BookingWizardPage } from './pages/public/BookingWizardPage.js';
import { BookingSuccessPage } from './pages/public/BookingSuccessPage.js';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage.js';
import { AppointmentsPage } from './pages/dashboard/AppointmentsPage.js';
import { CustomersPage } from './pages/dashboard/CustomersPage.js';
import { StaffPage } from './pages/dashboard/StaffPage.js';
import { ServicesPage } from './pages/dashboard/ServicesPage.js';
import { BillingPage } from './pages/dashboard/BillingPage.js';
import { InventoryPage } from './pages/dashboard/InventoryPage.js';
import { LoyaltyPage } from './pages/dashboard/LoyaltyPage.js';
import { PromotionsPage } from './pages/dashboard/PromotionsPage.js';
import { ReviewsPage } from './pages/dashboard/ReviewsPage.js';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage.js';
import { SettingsPage } from './pages/dashboard/SettingsPage.js';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F3] text-[#202020]">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/book" element={<BookingWizardPage />} />
              <Route path="/book/success" element={<BookingSuccessPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="loyalty" element={<LoyaltyPage />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
