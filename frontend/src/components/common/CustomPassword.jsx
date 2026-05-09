import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function CustomPassword({ register, type = 'text', errors, name, label, disabled = false, rules = {}, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
    setTimeout(() => document.getElementById('password')?.focus(), 0);
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>

        <input
          {...register(name, rules)}
          type={showPassword ? 'text' : type}
          id="password"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="new-password"
          className={`peer w-full cursor-pointer rounded-xl border bg-slate-950/50 py-2.5 pl-10 font-sans transition-all duration-300 outline-none placeholder:text-slate-600 focus:pr-10 focus:pl-4 disabled:cursor-not-allowed disabled:opacity-50 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2 ${
            errors?.[name]
              ? 'border-red-500/50 text-red-200 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50'
              : 'border-slate-800 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
          }`}
        />
        <Lock
          className={cn(
            'peer[:not(:placeholder-shown)]:left-[calc(100%-28px)] pointer-events-none absolute top-1/2 left-3 h-5 w-5 translate-y-0.5 text-slate-200 opacity-100 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0',
          )}
        />

        <button
          onMouseDown={(e) => e.preventDefault()}
          type="button"
          onClick={handleToggle}
          className="pointer-events-none absolute top-1/2 left-0 translate-y-0.5 cursor-pointer rounded-full p-0 opacity-0 transition-all duration-500 peer-focus:pointer-events-auto peer-focus:left-[calc(100%-28px)] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:pointer-events-auto peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-100"
        >
          {showPassword ? <EyeOff className="h-5 w-5 cursor-pointer text-slate-200" /> : <Eye className="h-5 w-5 cursor-pointer text-slate-200" />}
        </button>
      </div>

      <span className="absolute mt-0.5 w-full text-right text-xs text-red-500 italic">{errors[name]?.message}</span>
    </div>
  );
}
