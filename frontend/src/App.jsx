import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import Footer from './components/layout/Footer';
import AuthBootstrap from './components/layout/AuthBootstrap';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ServerWarmup from './components/layout/ServerWarmup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

const Layout = lazy(() => import('./components/layout/Layout'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Performance = lazy(() => import('./pages/Performance'));
const SellingPricePerformance = lazy(() => import('./pages/SellingPricePerformance'));

const suspenseFallback = (
  <div className="relative z-10 flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
  </div>
);

function WarmupLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ServerWarmup>
        <AuthBootstrap>
          <Suspense fallback={suspenseFallback}>
            <div className="flex h-full min-h-0 flex-col">
              <Outlet />
            </div>
          </Suspense>
        </AuthBootstrap>
      </ServerWarmup>
    </div>
  );
}

function AuthRoute() {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />;
}

function CatchAllRedirect() {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace />;
}

export default function App() {
  return (
    <Router>
      <BackgroundAnimation />
      <div className="overflow-y-auto">
        <div className="relative z-10 mb-20 flex h-screen flex-col">
          <div className="pointer-events-none absolute bottom-0 z-0 h-[50%] w-full bg-[linear-gradient(180deg,#02061800_0%,#020618_90%,#020618_100%)]" />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <Routes>
              <Route element={<WarmupLayout />}>
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/auth" element={<AuthRoute />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route
                      path="/selling-price-performance"
                      element={<SellingPricePerformance />}
                    />
                  </Route>
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<CatchAllRedirect />} />
              </Route>
            </Routes>
          </div>
        </div>
        <div className="fixed bottom-0 z-0 h-20 w-full">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
