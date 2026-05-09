import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import DetailsForm from '../components/auth/DetailsForm';
import PasswordForm from '../components/auth/PasswordForm';
import logo from '../assets/gold.svg';

export default function Signup() {
  const [step, setStep] = useState('details');

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden p-4 font-sans">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xs">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-16 w-16">
            <img src={logo} alt="logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-slate-400">Join Gold Tracker to manage your investments.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'details' && <DetailsForm onSuccess={() => setStep('password')} />}

          {step === 'password' && <PasswordForm onBack={() => setStep('details')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
