import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import Footer from './components/layout/Footer';
import AuthBootstrap from './components/layout/AuthBootstrap';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ServerWarmup from './components/layout/ServerWarmup';

const Layout = lazy(() => import('./components/layout/Layout'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Performance = lazy(() => import('./pages/Performance'));
const SellingPricePerformance = lazy(() => import('./pages/SellingPricePerformance'));

export default function App() {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);

  return (
    <Router>
      <BackgroundAnimation />
      <div className="overflow-y-auto">
        <div className="relative z-10 mb-20 flex h-screen flex-col">
          <div className="absolute bottom-0 h-[50%] w-full bg-[linear-gradient(180deg,#02061800_0%,#020618_90%,#020618_100%)]" />
          <ServerWarmup>
            <AuthBootstrap>
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  </div>
                }
              >
                <Routes>
                  <Route
                    path="/auth"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
                  />

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

                  <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace />}
                  />
                </Routes>
              </Suspense>
            </AuthBootstrap>
          </ServerWarmup>
        </div>
        <div className="fixed bottom-0 z-0 h-20 w-full">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
