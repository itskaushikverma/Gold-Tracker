import { Link } from 'react-router-dom';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import Logo from '../components/common/Logo';

export default function Auth() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xs">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo size={64} className="justify-center" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to Gold Tracker</h1>
          <p className="text-sm text-slate-400">Continue with Google to access your portfolio</p>
        </div>

        <GoogleAuthButton />

        <p className="text-center text-xs leading-relaxed text-slate-500">
          By continuing, you agree to our{' '}
          <Link
            to="/terms"
            className="text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
