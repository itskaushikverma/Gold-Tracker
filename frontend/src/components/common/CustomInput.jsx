export default function CustomInput({ register, type = 'text', errors, name, label, icon: Icon, disabled = false, rules = {}, placeholder, step }) {
  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>

        <input
          {...register(name, rules)}
          disabled={disabled}
          type={type}
          id={name}
          step={step || (type === 'number' ? 'any' : undefined)}
          autoComplete="off"
          className={`peer w-full cursor-pointer rounded-xl border bg-slate-950/50 py-2.5 pl-10 font-sans transition-all duration-300 outline-none placeholder:text-slate-600 focus:pr-10 focus:pl-4 disabled:cursor-not-allowed disabled:opacity-50 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-4 ${
            errors?.[name]
              ? 'border-red-500/50 text-red-200 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50'
              : 'border-slate-800 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
          }`}
          placeholder={placeholder}
        />

        <Icon
          className={`pointer-events-none absolute top-1/2 left-3 h-5 w-5 translate-y-0.75 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] ${errors?.[name] ? 'text-red-500' : 'text-slate-500 peer-focus:text-blue-500'}`}
        />
      </div>

      <span className="absolute mt-0.5 w-full text-right text-xs text-red-500 italic">{errors[name]?.message}</span>
    </div>
  );
}
