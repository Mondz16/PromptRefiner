import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.resetPassword({ token, password });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          'Failed to reset password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Choose a strong, unique password to keep your account secure."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          id="password"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Min. 8 characters"
        />
        <FormField
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      {message && (
        <div className="mt-5 border-t border-stone-100 pt-5 text-xs text-stone-500">
          <p>
            Password updated!{' '}
            <Link
              to="/login"
              className="font-semibold text-stone-900 hover:underline"
            >
              Log in now →
            </Link>
          </p>
        </div>
      )}
    </AuthCard>
  );
}
