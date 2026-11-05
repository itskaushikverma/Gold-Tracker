import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ServerWarmup from './components/layout/ServerWarmup';

const Layout = lazy(() => import('./components/layout/Layout'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Performance = lazy(() => import('./pages/Performance'));
const SellingPricePerformance = lazy(() => import('./pages/SellingPricePerformance'));
const Signup = lazy(() => import('./pages/Signup'));

export default function App() {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);

  return (
    <Router>
      <BackgroundAnimation />
      <div className="overflow-y-auto">
        <div className="relative z-10 mb-20 flex h-screen flex-col">
          <div className="absolute bottom-0 h-[50%] w-full bg-[linear-gradient(180deg,#02061800_0%,#020618_90%,#020618_100%)]" />
          <ServerWarmup>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              }
            >
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
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
                  element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
                />
              </Routes>
            </Suspense>
          </ServerWarmup>
        </div>
        <div className="fixed bottom-0 z-0 h-20 w-full">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
