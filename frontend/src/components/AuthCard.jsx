import { Link } from 'react-router-dom';

/** Shared wrapper for all auth pages — vertically centred, branded card. */
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Branding mark */}
        <div className="mb-7 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-stone-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-xs text-white">
              P
            </span>
            PromptRefiner
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200 bg-white px-7 py-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-stone-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
