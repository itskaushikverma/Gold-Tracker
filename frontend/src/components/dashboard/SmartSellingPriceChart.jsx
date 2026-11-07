import Chart from '@/components/dashboard/Chart';

export default function SmartSellingPriceChart({ data, isLoading, errorMessage }) {
  if (isLoading) return <ChartLoader color="#d95926" />;

  const performance = data?.data?.performance;
  const chartData = performance?.data || [];
  const suggestedMin = performance?.yAxis?.suggestedMin;
  const suggestedMax = performance?.yAxis?.suggestedMax;

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-2 text-sm text-slate-500">
        No chart data yet.
        {errorMessage && <div className="text-sm text-rose-400">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <Chart
      color="#d95926"
      id="colorSmartChart"
      chartData={chartData}
      xDomain={['dataMin', 'dataMax']}
      yDomain={[suggestedMin, suggestedMax]}
      name="Smart Chart"
      dataKey="value"
      isAnimationActive={false}
    />
  );
}

function ChartLoader({ color }) {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-transparent"
        style={{ borderTopColor: color }}
      />
      Building your smart chart…
    </div>
  );
}
