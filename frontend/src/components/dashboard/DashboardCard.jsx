import { cn } from '../../lib/utils';

export default function DashboardCard({
  icon,
  title,
  value,
  percentage,
  isPositive,
  trend = false,
}) {
  return (
    <div
      className={cn(
        'group relative w-full cursor-default overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 md:p-6',
        trend
          ? isPositive
            ? 'hover:border-emerald-700/80 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)]'
            : 'hover:border-rose-700/80 hover:shadow-[0_8px_30px_rgb(244,63,94,0.1)]'
          : 'hover:border-slate-700/80 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)]',
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 mb-4 flex items-center gap-4">
        <div
          className={cn(
            'rounded-xl p-3 transition-all duration-300 group-hover:scale-110',
            trend
              ? isPositive
                ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
              : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
          )}
        >
          {icon}
        </div>
        <h3 className="text-sm text-nowrap font-medium text-slate-400 transition-colors group-hover:text-slate-300">
          {title}
        </h3>
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <div
          className={cn(
            'text-2xl font-bold md:text-3xl text-nowrap',
            trend ? (isPositive ? 'text-emerald-400' : 'text-red-400') : 'text-slate-100',
          )}
        >
          {trend && isPositive ? '+' : ''}
          {value}
        </div>
        {percentage !== undefined && (
          <div className="text-sm font-medium text-slate-500">{percentage}%</div>
        )}
      </div>
    </div>
  );
}
