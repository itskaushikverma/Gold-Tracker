import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../common/Logo';

export default function LegalPageLayout({ title, lastUpdated, children }) {
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);
  const homePath = isAuthenticated ? '/home' : '/auth';
  const homeLabel = isAuthenticated ? 'Back to dashboard' : 'Back to sign in';

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center gap-6 overflow-hidden p-4 md:p-8">
      <div className="flex w-full max-w-5xl shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={homePath}
          className="inline-flex cursor-pointer items-center gap-3 text-slate-200 transition-colors hover:text-white"
        >
          <Logo size={40} />
          <span className="text-lg font-bold tracking-tight">Gold Tracker</span>
        </Link>
        <Link
          to={homePath}
          className="cursor-pointer text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-200"
        >
          {homeLabel}
        </Link>
      </div>

      <article className="flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur-xs md:p-8">
        <header className="mb-6 shrink-0 space-y-2 border-b border-slate-800/60 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
          <p className="text-sm text-slate-400">Last updated: {lastUpdated}</p>
        </header>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto text-sm leading-relaxed text-slate-300 md:text-base [&_a]:cursor-pointer [&_a]:text-blue-400 [&_a]:underline-offset-4 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-slate-800/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-slate-200 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </article>

      <nav
        aria-label="Legal pages"
        className="flex w-full max-w-5xl shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-400"
      >
        <Link
          to="/privacy"
          className="cursor-pointer underline underline-offset-4 transition-colors hover:text-slate-200"
        >
          Privacy Policy
        </Link>
        <span aria-hidden className="text-slate-600">
          ·
        </span>
        <Link
          to="/terms"
          className="cursor-pointer underline underline-offset-4 transition-colors hover:text-slate-200"
        >
          Terms &amp; Conditions
        </Link>
      </nav>
    </div>
  );
}
