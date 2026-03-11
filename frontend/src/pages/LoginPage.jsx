import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.login({ email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your account to continue refining prompts."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="mt-5 space-y-2 border-t border-stone-100 pt-5 text-xs text-stone-500">
        <p>
          <Link
            to="/forgot-password"
            className="font-medium text-stone-700 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-stone-900 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
