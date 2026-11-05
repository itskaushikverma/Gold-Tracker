export default function Badge({ title, value, valueClassName }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300">
      <span className="tracking-wider text-slate-500 uppercase">{title}:</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
