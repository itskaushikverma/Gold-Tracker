import { TrendingUp, TrendingDown, Wallet, Plus, CheckSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetDetailsQuery } from '../services/api';
import { MotionButton, MotionDiv, MotionTr } from '../components/common/MotionWrapper';
import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../lib/utils';
import { formatDate } from '../utils/formatDate';
import AddEntryModal from '../components/AddEntryModal';
import SellEntryModal from '../components/SellEntryModal';
import { DashboardSkeleton } from '../components/common/Skeleton';

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const user_id = useSelector((state) => state.auth.user_id);

  const { data: getDetails, isLoading, isFetching } = useGetDetailsQuery({ user_id }, { skip: !user_id, refetchOnMountOrArgChange: true });

  if (isLoading || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="overflow-hidden p-4 md:h-screen md:p-8">
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex h-full w-full flex-col space-y-6">
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="h-full w-full space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Overview</h1>
                <p className="text-sm text-slate-400 md:text-base">Track your gold investment portfolio and real-time performance.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge title="Total Weight" value={`${getDetails?.data?.totalInvestedWeight || 0}mg`} color="amber" />
                <Badge title="Current Price (with GST 3%)" value={`${formatCurrency(getDetails?.data?.currentGoldPriceWithGST || 0)}/mg`} color="emerald" />
                <Badge title="Current Price (without GST)" value={`${formatCurrency(getDetails?.data?.currentGoldPriceWithoutGST || 0)}/mg`} color="blue" />
              </div>
            </div>

            <div className="flex gap-3 w-full justify-center md:justify-end">
              <MotionButton
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.95, y: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-medium text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                <Plus className="h-5 w-5" />
                Add Gold
              </MotionButton>

              <MotionButton
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.95, y: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={() => setIsSellModalOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 font-medium text-rose-400 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500/80 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                <Plus className="h-5 w-5" />
                Sell Gold
              </MotionButton>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <Card title="Total Invested" value={formatCurrency(getDetails?.data?.totalInvestmentAmount || 0)} icon={<Wallet className="h-6 w-6" />} />

            <Card title="Current Value" value={formatCurrency(getDetails?.data?.currentTotalAmount || 0)} icon={<TrendingUp className="h-6 w-6" />} />

            <Card
              title="Total Profit / Loss"
              value={formatCurrency(getDetails?.data?.totalProfitLoss || 0)}
              icon={getDetails?.data?.totalProfitLoss >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              trend={true}
              isPositive={getDetails?.data?.totalProfitLoss >= 0}
              percentage={getDetails?.data?.totalInvestmentAmount > 0 ? ((getDetails?.data?.totalProfitLoss / getDetails?.data?.totalInvestmentAmount) * 100).toFixed(2) : '0.00'}
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl backdrop-blur-xs">
            <div className="flex items-center justify-between bg-slate-900/20 p-4">
              <h2 className="text-lg font-semibold text-white md:text-xl">Investment History</h2>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="relative w-full border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-900/95 shadow-sm backdrop-blur-md">
                  <tr className="border-b border-slate-800/60 text-xs font-medium text-slate-400 md:text-sm">
                    <th className="px-4 py-3 text-left tracking-wider text-nowrap uppercase md:px-6 md:py-4">Date</th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">Weight</th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">Invested Amount</th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">Current Value</th>
                    <th className="px-4 py-3 text-right tracking-wider text-nowrap uppercase md:px-6 md:py-4">Profit/Loss</th>
                  </tr>
                </thead>

                {getDetails?.data?.investments?.length > 0 ? (
                  <tbody className="divide-y divide-slate-800/30">
                    {(getDetails?.data?.investments || []).map((item, index) => {
                      const isSale = item.isSell;
                      const profitLoss = (item.currentValue - item.investedValue).toFixed(2);
                      const isPositive = parseFloat(profitLoss) >= 0;
                      const percentage = item.investedValue !== 0 ? ((profitLoss / Math.abs(item.investedValue)) * 100).toFixed(2) : '0.0';

                      return (
                        <MotionTr
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={item._id}
                          className={cn('group cursor-default transition-all duration-300 hover:bg-slate-800/50', isSale && 'bg-rose-500/5')}
                        >
                          <td className="px-4 py-3 text-left text-sm font-medium text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                            <div className="flex flex-col">
                              <span>{formatDate(item.date)}</span>
                              {isSale && <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Sale</span>}
                            </div>
                          </td>
                          <td className={cn('px-4 py-3 text-center font-mono text-sm text-nowrap md:px-6 md:py-4 md:text-base', isSale ? 'text-rose-400' : 'text-amber-400/80')}>
                            {isSale ? '-' : ''}{Math.abs(item.weight)}mg
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                            {formatCurrency(Math.abs(item.investedValue))}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                            <div className="mx-auto flex w-fit items-center justify-center rounded-lg border border-slate-700/50 bg-slate-950/50 shadow-inner transition-all duration-300 group-focus-within:border-blue-500/50 group-hover:border-slate-600">
                              <span className="px-3 py-1.5 text-center text-white md:py-2">{isSale ? '-' : formatCurrency(item.currentValue)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-medium text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                            {!isSale ? (
                              <div className="flex flex-col items-end">
                                <span className={cn(isPositive ? 'text-emerald-400' : 'text-red-400')}>
                                  {isPositive ? '+' : '-'}
                                  {formatCurrency(Math.abs(profitLoss))}
                                </span>
                                <span className={cn('mt-1 rounded-md px-2 py-0.5 text-xs', isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                                  {percentage}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                        </MotionTr>
                      );
                    })}
                  </tbody>
                ) : (
                  <div className="absolute flex h-full w-full items-center justify-center text-slate-500">No active investments found</div>
                )}
              </table>
            </div>
          </div>
        </MotionDiv>
      </div>
      <AddEntryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <SellEntryModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} totalWeight={getDetails?.data?.totalInvestedWeight}/>
    </>
  );
}

const Badge = ({ title, value, color }) => {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300">
      <span className="tracking-wider text-slate-500 uppercase">{title}:</span>
      <span className={`text-${color}-400`}>{value}</span>
    </div>
  );
};

const Card = ({ icon, title, value, percentage, isPositive, trend = false }) => {
  return (
    <div
      className={cn(
        'group relative cursor-default overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 md:p-6',
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
        <h3 className="text-sm font-medium text-slate-400 transition-colors group-hover:text-slate-300">{title}</h3>
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <div className={cn('text-2xl font-bold md:text-3xl', trend ? (isPositive ? 'text-emerald-400' : 'text-red-400') : 'text-slate-100')}>
          {trend && isPositive ? '+' : ''}
          {value}
        </div>
        {percentage !== undefined && <div className="text-sm font-medium text-slate-500">{percentage}%</div>}
      </div>
    </div>
  );
};
