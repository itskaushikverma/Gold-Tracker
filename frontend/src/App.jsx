import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import BackgroundAnimation from './components/common/BackgroundAnimation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ServerWarmup from './components/ServerWarmup';
import SellingPricePerformance from './pages/SellingPricePerformance.jsx';

const Layout = lazy(() => import('./components/Layout'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Performance = lazy(() => import('./pages/Performance'));
const Signup = lazy(() => import('./pages/Signup.jsx'));

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="overflow-x-hidden overflow-y-auto">
        <div className="pointer-events-none fixed inset-0 bg-slate-950" />
        <div className="relative z-10 mb-19 flex h-screen flex-col">
          <BackgroundAnimation />
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
        <div className="fixed bottom-0 z-0 h-18 w-full">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
