import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.register({ email, password });
      setSuccess(
        res.data.message ??
          'Account created! Please check your email to verify.',
      );
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start refining prompts for free — no credit card required."
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
          placeholder="Min. 8 characters"
        />
        <FormField
          id="confirmPassword"
          label="Confirm Password"
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
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="mt-5 border-t border-stone-100 pt-5 text-xs text-stone-500">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-stone-900 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
