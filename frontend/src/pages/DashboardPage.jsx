import { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { useAuth } from '../auth/AuthContext';

const TOKENS_PER_CONVERSION = 1;

const PACKS = [
  { label: '50 tokens', amount: 50, note: 'Starter' },
  { label: '200 tokens', amount: 200, note: 'Popular' },
  { label: '1 000 tokens', amount: 1000, note: 'Power' },
];

function SpinnerIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
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

function StatCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        highlight
          ? 'border-amber-200 bg-amber-50'
          : 'border-stone-200 bg-white'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tracking-tight ${
          highlight ? 'text-amber-800' : 'text-stone-900'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [target, setTarget] = useState('AI assistant');
  const [tone, setTone] = useState('neutral');
  const [format, setFormat] = useState('step-by-step instructions');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenBalance, setTokenBalance] = useState(user?.tokenBalance ?? 0);
  const [purchaseAmount, setPurchaseAmount] = useState(50);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient
      .getTokenBalance()
      .then((res) => setTokenBalance(res.data.tokenBalance))
      .catch(() => setTokenBalance(user?.tokenBalance ?? 0));
  }, [user]);

  const estimatedConversions =
    TOKENS_PER_CONVERSION > 0
      ? Math.floor(tokenBalance / TOKENS_PER_CONVERSION)
      : 0;

  const handleConvert = async () => {
    setError('');
    setOutput('');
    if (!prompt.trim()) {
      setError('Please enter a prompt to refine.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.convertPrompt({
        prompt,
        target,
        tone,
        format,
        isDemo: false,
      });
      setOutput(res.data.refinedPrompt);
      setTokenBalance((prev) =>
        typeof res.data.tokenBalance === 'number'
          ? res.data.tokenBalance
          : prev - TOKENS_PER_CONVERSION,
      );
    } catch (err) {
      setError(
        err.response?.data?.message ??
          'Failed to convert prompt. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (amount) => {
    setError('');
    setPurchaseMessage('');
    setPurchasing(true);
    try {
      const res = await apiClient.purchaseTokens(amount);
      setTokenBalance(res.data.tokenBalance);
      setPurchaseMessage(`+${amount} tokens added successfully.`);
      setTimeout(() => setPurchaseMessage(''), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Failed to purchase tokens.',
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectClass =
    'w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100';
  const labelClass =
    'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-stone-400';

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Token balance" value={tokenBalance} highlight />
        <StatCard
          label="Remaining conversions"
          value={estimatedConversions}
        />
        <div className="col-span-2 sm:col-span-1 flex items-center rounded-2xl border border-stone-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Logged in as
            </p>
            <p className="mt-1 truncate text-sm font-medium text-stone-800">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Token purchase ── */}
      <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5">
        <p className="mb-1 text-sm font-semibold text-stone-900">
          Recharge tokens
        </p>
        <p className="mb-4 text-xs text-stone-400">
          Each prompt conversion costs 1 token. Pick a pack or enter a custom
          amount. (Mock purchase — no real payment for now.)
        </p>

        <div className="flex flex-wrap gap-3">
          {PACKS.map(({ label, amount, note }) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePurchase(amount)}
              disabled={purchasing}
              className="group relative rounded-xl border border-stone-200 bg-stone-50 px-5 py-3 text-left transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {note === 'Popular' && (
                <span className="absolute -top-2 left-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  Popular
                </span>
              )}
              <p className="text-sm font-semibold text-stone-900">{label}</p>
              <p className="text-xs text-stone-400">{note}</p>
            </button>
          ))}

          {/* Custom amount */}
          <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <input
              id="custom-amount"
              type="number"
              min="1"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-20 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            <button
              type="button"
              onClick={() => handlePurchase(purchaseAmount)}
              disabled={purchasing || purchaseAmount <= 0}
              className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {purchasing ? <SpinnerIcon className="h-3.5 w-3.5" /> : 'Add'}
            </button>
          </div>
        </div>

        {purchaseMessage && (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {purchaseMessage}
          </p>
        )}
      </div>

      {/* ── Refiner ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-6">
          <h2 className="mb-4 text-sm font-semibold text-stone-900">
            Your vague prompt
          </h2>

          <label htmlFor="prompt-input" className={labelClass}>
            Prompt
          </label>
          <textarea
            id="prompt-input"
            rows={7}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want the AI to do, even if it's rough or incomplete..."
            className="mb-4 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="target" className={labelClass}>
                AI type
              </label>
              <select
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={selectClass}
              >
                <option value="coding assistant">Coding assistant</option>
                <option value="writer">Writer</option>
                <option value="tutor">Tutor</option>
                <option value="AI assistant">General assistant</option>
              </select>
            </div>
            <div>
              <label htmlFor="tone" className={labelClass}>
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={selectClass}
              >
                <option value="neutral">Neutral</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
              </select>
            </div>
            <div>
              <label htmlFor="format" className={labelClass}>
                Format
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className={selectClass}
              >
                <option value="step-by-step instructions">
                  Step-by-step
                </option>
                <option value="bullet list">Bullet list</option>
                <option value="email draft">Email draft</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConvert}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {loading && <SpinnerIcon />}
            {loading ? 'Refining…' : 'Refine prompt →'}
          </button>

          {error && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </p>
          )}
        </div>

        {/* Output panel */}
        <div className="flex flex-col rounded-2xl border border-stone-200 bg-white px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">
              Refined prompt
            </h2>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            rows={14}
            readOnly
            value={output}
            className="flex-1 resize-none rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none"
            placeholder="Your polished, AI‑ready prompt will appear here after you click Refine."
          />
        </div>
      </div>
    </div>
  );
}
