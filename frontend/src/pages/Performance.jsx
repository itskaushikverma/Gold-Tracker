import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetPerformanceQuery } from '../services/api';
import { PerformanceSkeleton } from '../components/common/Skeleton';
import Header from '../components/layout/Header';
import { MotionDiv } from '@/components/common/MotionWrapper';
import Chart from '@/components/dashboard/Chart';
import { useToast } from 'react-toast-kit-js';

export default function Performance() {
  const toast = useToast();
  const sellPriceOverride = useSelector((state) => state.session.sellPriceOverride);
  const {
    data: getPerformance,
    isLoading,
    isFetching,
    error,
    isError,
  } = useGetPerformanceQuery({ sellPriceOverride });

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError, error]);

  const chartData = getPerformance?.data?.performance || [];

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full min-h-0 flex-col gap-6 overflow-hidden"
    >
      <Header
        title="How My Gold Grew"
        description="See how your money in gold has changed over time."
      />
      {isLoading || isFetching ? (
        <PerformanceSkeleton />
      ) : (
        <div className="h-full min-h-0 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
          {chartData.length === 0 ? (
            <div className="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">
              No growth data available yet.
            </div>
          ) : (
            <Chart
              doubleGraph
              color="#3b82f6"
              id="colorInvested"
              chartData={chartData}
              xDomain={['dataMin', 'dataMax']}
              yDomain={[0, 'auto']}
              name="Money Put In"
              dataKey="invested"
              isAnimationActive={true}
            />
          )}
        </div>
      )}
    </MotionDiv>
  );
}
