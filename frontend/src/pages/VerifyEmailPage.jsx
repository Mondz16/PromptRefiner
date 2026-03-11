import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import AuthCard from '../components/AuthCard';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    apiClient
      .verifyEmail({ token })
      .then((res) => {
        setMessage(res.data.message);
        setStatus('success');
      })
      .catch((err) => {
        setMessage(err.response?.data?.message ?? 'Verification failed.');
        setStatus('error');
      });
  }, [token]);

  return (
    <AuthCard title="Email verification">
      {status === 'verifying' && (
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Verifying your email, please wait…
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {message}
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
          >
            Continue to login →
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {message}
          </p>
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-full border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            ← Back to home
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
