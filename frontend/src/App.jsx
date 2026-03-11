import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';

/** Redirects unauthenticated users to /login. */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Redirects already-authenticated users to /dashboard.
 *  Used for login, register, forgot-password, reset-password, and the landing page. */
function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-stone-100 font-medium text-stone-900'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
      }`}
    >
      {children}
    </Link>
  );
}

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Nav bar ── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-stone-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-xs text-white">
              P
            </span>
            PromptRefiner
          </Link>

          <nav className="flex items-center gap-1">
            {user ? (
              <>
                <span className="mr-2 hidden max-w-[180px] truncate text-xs text-stone-400 sm:inline">
                  {user.email}
                </span>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="ml-1 rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
                >
                  Sign up free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Page content ── */}
      <Routes>
        {/* Landing: redirect to dashboard when already logged in */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          }
        />

        {/* Auth-only routes: redirect to dashboard when already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />

        {/* Email verification is accessible regardless of auth state */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected: redirect to login when not logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} PromptRefiner. All rights reserved.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
