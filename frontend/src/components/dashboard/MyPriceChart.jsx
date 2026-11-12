import { PerformanceSkeleton } from '@/components/common/Skeleton';
import Chart from '@/components/dashboard/Chart';

export default function MyPriceChart({
  data,
  isLoading,
  isError = false,
  name = 'My Prices',
  color = '#3987e5',
  id = 'colorMyPrices',
  errorMessage,
}) {
  if (isLoading) return <PerformanceSkeleton />;

  if (isError) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-2 text-sm text-slate-500">
        <p>Couldn’t load chart data.</p>
        {errorMessage ? <div className="text-sm text-rose-400">{errorMessage}</div> : null}
      </div>
    );
  }

  const chartData = data?.data?.performance?.data || [];

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-2 text-sm text-slate-500">
        No chart data yet.
      </div>
    );
  }

  return (
    <Chart
      color={color}
      id={id}
      chartData={chartData}
      xDomain={['dataMin', 'dataMax']}
      yDomain={['auto', 'auto']}
      name={name}
      dataKey="value"
      isAnimationActive={false}
    />
  );
}
