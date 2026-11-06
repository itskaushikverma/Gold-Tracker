import {
  RiArrowRightDownLine,
  RiArrowRightUpLine,
  RiMoneyRupeeCircleLine,
  RiPencilLine,
} from '@remixicon/react';
import { useSelector } from 'react-redux';
import { useGetDetailsQuery } from '../services/api';
import { MotionButton, MotionDiv, MotionTr } from '../components/common/MotionWrapper';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../lib/utils';
import { formatDate } from '../utils/formatDate';
import Header from '../components/layout/Header';
import DashboardCard from '../components/dashboard/DashboardCard';
import SellEntryModal from '../components/modals/SellEntryModal';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { useToast } from 'react-toast-kit-js';
import SetCustomSellingPriceModal from '@/components/modals/SetCustomSellingPriceModal';

export default function Dashboard() {
  const toast = useToast();
  const [isCustomSellingPriceModalOpen, setIsCustomSellingPriceModalOpen] = useState(false);

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [itemForSale, setItemForSale] = useState(null);

  const sellPriceOverride = useSelector((state) => state.session.sellPriceOverride);

  const {
    data: { data } = { data: undefined },
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetDetailsQuery({ sellPriceOverride }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError, error]);

  if (isLoading || isFetching) return <DashboardSkeleton />;

  return (
    <>
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex h-full min-h-0 w-full flex-col gap-6 overflow-hidden"
      >
        <Header
          dashboardType="overview"
          details={data}
          title="Overview"
          description="Track your gold investment portfolio and real-time performance."
        />
        <div className="flex w-full gap-4 overflow-x-auto pt-1 pb-2 md:gap-6">
          <div className="w-full min-w-70 flex-1 shrink-0 md:min-w-80">
            <DashboardCard
              title="Total Invested"
              value={formatCurrency(data?.totalInvestedAmount || 0)}
              icon={<RiMoneyRupeeCircleLine className="h-6 w-6" />}
            />
          </div>

          <div className="w-full min-w-70 flex-1 shrink-0 md:min-w-80">
            <DashboardCard
              title="Current Value"
              value={formatCurrency(data?.currentInvestmentValue || 0)}
              icon={<RiArrowRightUpLine className="h-6 w-6" />}
            />
          </div>

          <div className="w-full min-w-70 flex-1 shrink-0 md:min-w-80">
            <DashboardCard
              title="Total Profit / Loss"
              value={formatCurrency(data?.totalProfitLoss || 0)}
              icon={
                data?.isPositive ? (
                  <RiArrowRightUpLine className="h-6 w-6" />
                ) : (
                  <RiArrowRightDownLine className="h-6 w-6" />
                )
              }
              trend
              isPositive={data?.isPositive}
              percentage={data?.totalProfitLossPercentage || '0.00'}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl backdrop-blur-xs">
          <div className="flex items-center justify-between bg-slate-900/20 p-4">
            <h2 className="text-lg font-semibold text-white md:text-xl">Investment History</h2>
            <MotionButton
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={() => setIsCustomSellingPriceModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400 transition-colors duration-300 hover:border-blue-500 hover:bg-blue-500/80 hover:text-white"
            >
              <RiPencilLine className="h-3.5 w-3.5" />
              Set Custom Price
            </MotionButton>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {data?.investments?.length > 0 ? (
              <table className="relative w-full border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-900/95 shadow-sm backdrop-blur-md">
                  <tr className="border-b border-slate-800/60 text-xs font-medium text-slate-400 md:text-sm">
                    <th className="px-4 py-3 text-left tracking-wider text-nowrap uppercase md:px-6 md:py-4">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">
                      Invested Amount
                    </th>
                    <th className="px-4 py-3 text-center tracking-wider text-nowrap uppercase md:px-6 md:py-4">
                      Current Value
                    </th>
                    <th className="px-4 py-3 text-right tracking-wider text-nowrap uppercase md:px-6 md:py-4">
                      Profit/Loss
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/30">
                  {data.investments.map((item, index) => {
                    const isSell = item?.isSell?.status;
                    return (
                      <MotionTr
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={item._id}
                        onClick={() => {
                          if (isSell) return;
                          setIsSellModalOpen(true);
                          setItemForSale(item);
                        }}
                        className={cn(
                          'group transition-all duration-300',
                          isSell
                            ? 'cursor-default bg-rose-500/5'
                            : 'cursor-pointer hover:bg-slate-800/50',
                        )}
                      >
                        <td className="px-4 py-3 text-left text-sm font-medium text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                          <div className="flex flex-col">
                            <span>{formatDate(item.date)}</span>
                            {isSell && (
                              <span className="text-[10px] font-bold tracking-tighter text-rose-400 uppercase">
                                Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className={cn(
                            'px-4 py-3 text-center font-mono text-sm text-nowrap md:px-6 md:py-4 md:text-base',
                            isSell ? 'text-rose-400' : 'text-amber-400/80',
                          )}
                        >
                          {item.weight}mg
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                          {formatCurrency(item.investedValue)}
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                          <div
                            className={cn(
                              'mx-auto flex w-fit items-center justify-center rounded-lg shadow-inner transition-all duration-300 group-hover:border-slate-600',
                              !isSell && 'border border-slate-700/50 bg-slate-950/50',
                            )}
                          >
                            <span className="px-3 py-1.5 text-center text-white md:py-2">
                              {formatCurrency(item.currentValue)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-medium text-nowrap text-slate-300 md:px-6 md:py-4 md:text-base">
                          <div className="flex flex-col items-end">
                            <span
                              className={cn(item?.isPositive ? 'text-emerald-400' : 'text-red-400')}
                            >
                              {item?.isPositive ? '+' : ''}
                              {formatCurrency(item?.profitLoss)}
                            </span>
                            <span
                              className={cn(
                                'mt-1 rounded-md px-2 py-0.5 text-xs',
                                item?.isPositive
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-red-500/10 text-red-500',
                              )}
                            >
                              {item?.percentage}%
                            </span>
                          </div>
                        </td>
                      </MotionTr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex h-full min-h-60 items-center justify-center text-slate-500">
                No active investments found
              </div>
            )}
          </div>
        </div>
      </MotionDiv>
      <SellEntryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        itemForSale={itemForSale}
      />
      <SetCustomSellingPriceModal
        isOpen={isCustomSellingPriceModalOpen}
        onClose={() => setIsCustomSellingPriceModalOpen(false)}
      />
    </>
  );
}
