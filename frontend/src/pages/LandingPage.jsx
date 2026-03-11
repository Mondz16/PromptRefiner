import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';

const DEMO_STORAGE_KEY = 'promptrefiner_demo_count';
const FREE_LIMIT = 5;

function getDemoCount() {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  const num = Number(stored);
  return Number.isNaN(num) ? 0 : num;
}

function SpinnerIcon() {
  return (
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
  );
}

const steps = [
  {
    num: '01',
    title: 'Paste your idea',
    body: 'Type or paste any vague request, task, or question as-is.',
  },
  {
    num: '02',
    title: 'We restructure it',
    body: 'PromptRefiner adds goal, context, tone, and format cues automatically.',
  },
  {
    num: '03',
    title: 'Copy & use',
    body: 'Paste the polished prompt into ChatGPT, Claude, or any AI tool.',
  },
];

export default function LandingPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [demoCount, setDemoCountState] = useState(getDemoCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDemoCountState(getDemoCount());
  }, []);

  const remaining = Math.max(FREE_LIMIT - demoCount, 0);

  const handleConvert = async () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter a prompt to refine.');
      return;
    }

    if (demoCount >= FREE_LIMIT) {
      setError('Free demo limit reached. Sign up to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.convertPrompt(
        { prompt: input, isDemo: true },
        demoCount,
      );
      setOutput(res.data.refinedPrompt);
      const next = demoCount + 1;
      localStorage.setItem(DEMO_STORAGE_KEY, String(next));
      setDemoCountState(next);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      {/* ─────────── Hero ─────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="mb-4 inline-block rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-medium tracking-widest text-stone-500 uppercase shadow-sm">
          AI Prompt Assistant
        </span>

        <h1 className="text-4xl font-semibold leading-[1.18] tracking-tight text-stone-900 sm:text-6xl">
          Turn vague ideas into{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative text-amber-700 italic">clear</span>
          </span>
          ,{' '}
          <br className="hidden sm:block" />
          AI‑ready prompts.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-500">
          Paste your rough request and get back a structured, professional
          prompt that AI tools understand instantly — no engineering skills
          required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-700"
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Log in
          </Link>
        </div>

        <p className="mt-4 text-xs tracking-wide text-stone-400">
          {FREE_LIMIT} free demo conversions · No credit card required
        </p>
      </section>

      {/* ─────────── How it works ─────────── */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-stone-400">
          How it works
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map(({ num, title, body }) => (
            <div
              key={num}
              className="rounded-2xl border border-stone-100 bg-white px-6 py-5 shadow-sm"
            >
              <span className="mb-3 block font-mono text-xs font-semibold text-amber-600">
                {num}
              </span>
              <p className="mb-1 text-sm font-semibold text-stone-900">
                {title}
              </p>
              <p className="text-sm leading-relaxed text-stone-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── Live demo ─────────── */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl border border-stone-200 bg-white shadow-sm">
          {/* Demo header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-7 py-5">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Try a quick demo
              </h2>
              <p className="mt-0.5 text-xs text-stone-400">
                No account needed to try.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-stone-100 bg-stone-50 px-3 py-1.5">
              <span className="text-xs text-stone-500">Free conversions</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  remaining === 0
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {remaining} / {FREE_LIMIT}
              </span>
            </div>
          </div>

          {/* Input + output columns */}
          <div className="grid gap-6 p-7 md:grid-cols-2">
            {/* Input */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="demo-input"
                className="text-xs font-semibold uppercase tracking-widest text-stone-400"
              >
                Your rough prompt
              </label>
              <textarea
                id="demo-input"
                rows={7}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                placeholder="e.g. help me write an email to my manager about delaying a project..."
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={loading || remaining === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {loading && <SpinnerIcon />}
                  {loading ? 'Refining…' : 'Refine prompt →'}
                </button>
                {remaining === 0 && !error && (
                  <Link
                    to="/register"
                    className="text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900"
                  >
                    Sign up for more
                  </Link>
                )}
              </div>
              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                  {error}
                </p>
              )}
            </div>

            {/* Output */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="demo-output"
                className="text-xs font-semibold uppercase tracking-widest text-stone-400"
              >
                Refined prompt
              </label>
              <div className="relative flex flex-1 flex-col">
                <textarea
                  id="demo-output"
                  rows={7}
                  readOnly
                  value={output}
                  className="w-full flex-1 resize-none rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none"
                  placeholder="Your polished, AI‑ready prompt will appear here."
                />
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute right-3 bottom-3 rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs text-stone-500 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-stone-400">
          Want unlimited refines?{' '}
          <Link
            to="/register"
            className="font-medium text-stone-700 underline underline-offset-2 transition hover:text-stone-900"
          >
            Create a free account
          </Link>
        </p>
      </section>
    </div>
  );
}
