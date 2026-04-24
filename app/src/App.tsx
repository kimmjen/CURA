import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages';
import ScrollToTop from '@/components/ScrollToTop';
import { LoadingSpinner } from '@/components/common';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy-loaded routes — each becomes its own chunk.
const CollectionDetailPage = lazy(() => import('@/pages/CollectionDetailPage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
const ManagementPage = lazy(() => import('@/pages/ManagementPage'));
const CollectionEditPage = lazy(() => import('@/pages/CollectionEditPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const TrendingPage = lazy(() => import('@/pages/TrendingPage'));
const RecentPage = lazy(() => import('@/pages/RecentPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const UIKitPage = lazy(() => import('@/pages/UIKitPage'));
const V2ShowcasePage = lazy(() => import('@/v2/pages/V2ShowcasePage'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <ScrollToTop />
              <Suspense fallback={<RouteFallback />}>
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

                  {/* V2 Showcase */}
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
              </Suspense>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
