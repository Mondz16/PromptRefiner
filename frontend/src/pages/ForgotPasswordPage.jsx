import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await apiClient.forgotPassword({ email });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          'Failed to send reset email. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we'll send you a secure, time-limited reset link."
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

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-5 border-t border-stone-100 pt-5 text-xs text-stone-500">
        <p>
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-stone-900 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
