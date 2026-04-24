import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, CollectionDetailPage, PlayerPage, ManagementPage } from '@/pages';
import CollectionEditPage from '@/pages/CollectionEditPage';
import SettingsPage from '@/pages/SettingsPage';
import TrendingPage from '@/pages/TrendingPage';
import RecentPage from '@/pages/RecentPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import UIKitPage from '@/pages/UIKitPage';
import V2ShowcasePage from '@/v2/pages/V2ShowcasePage';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <ScrollToTop />
              <Routes>
                {/* Auth - Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/trending"
                  element={
                    <ProtectedRoute>
                      <TrendingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recent"
                  element={
                    <ProtectedRoute>
                      <RecentPage />
                    </ProtectedRoute>
                  }
                />

                {/* Collections */}
                <Route
                  path="/collections"
                  element={
                    <ProtectedRoute>
                      <ManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collection/:id"
                  element={
                    <ProtectedRoute>
                      <CollectionDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collection/:id/edit"
                  element={
                    <ProtectedRoute>
                      <CollectionEditPage />
                    </ProtectedRoute>
                  }
                />

                {/* Player */}
                <Route
                  path="/player/:videoId"
                  element={
                    <ProtectedRoute>
                      <PlayerPage />
                    </ProtectedRoute>
                  }
                />

                {/* Settings */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* V2 Showcase - Optional, keep public or protect? Let's protect for consistency */}
                <Route
                  path="/v2-showcase"
                  element={
                    <ProtectedRoute>
                      <V2ShowcasePage />
                    </ProtectedRoute>
                  }
                />

                {/* UI Kit - Dev only */}
                <Route path="/ui-kit" element={<UIKitPage />} />

                {/* Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
