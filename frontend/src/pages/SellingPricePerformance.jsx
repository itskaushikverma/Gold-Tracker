import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  useGetSellingPricePerformanceQuery,
  useGetSellingPricePerformanceAiQuery,
} from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { useToast } from 'react-toast-kit-js';
import { PerformanceSkeleton } from '../components/common/Skeleton';
import Header from '../components/layout/Header';
import { MotionDiv } from '@/components/common/MotionWrapper';

const CHART_MARGIN = { top: 20, right: 10, left: 0, bottom: 0 };

const DEFAULT_DISPLAY_FORMAT = 'MMM yy';
const DEFAULT_TOOLTIP_FORMAT = 'dd MMM yyyy';

const TABS = [
  {
    key: 'actual',
    label: 'Actual',
    seriesName: 'Custom Selling Price',
    color: '#3987e5',
    gradientId: 'colorActual',
  },
  {
    key: 'ai',
    label: 'AI Formatted',
    seriesName: 'AI Formatted Price',
    color: '#d95926',
    gradientId: 'colorAI',
  },
];

function safeFormatDate(date, pattern) {
  try {
    return format(date, pattern);
  } catch {
    return format(date, DEFAULT_DISPLAY_FORMAT);
  }
}

function buildYAxisRange({ suggestedMin, suggestedMax, stepSize } = {}) {
  if (typeof suggestedMin === 'number' && typeof suggestedMax === 'number') {
    if (typeof stepSize === 'number' && stepSize > 0) {
      const ticks = [];
      for (let value = suggestedMin; value <= suggestedMax + stepSize / 2; value += stepSize) {
        ticks.push(Math.round(value * 100) / 100);
      }
      return { domain: [suggestedMin, suggestedMax], ticks };
    }
    return { domain: [suggestedMin, suggestedMax], ticks: undefined };
  }
  return { domain: undefined, ticks: undefined };
}

function formatYAxisTick(value) {
  return Math.abs(value) >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${Math.round(value)}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const point = payload[0];

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <p className="mb-3 text-sm font-medium text-slate-300 md:text-base">
        {point.payload.tooltipDate}
      </p>
      <div className="space-y-2 font-mono text-xs tracking-tight md:text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2" style={{ color: point.color }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: point.color }} />
            {point.name}:
          </span>
          <span className="text-white">{formatCurrency(point.value)}</span>
        </div>
      </div>
    </div>
  );
}

function ChartLoader({ color }) {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-transparent"
        style={{ borderTopColor: color }}
      />
      Generating AI formatted chart…
    </div>
  );
}

export default function SellingPricePerformance() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('actual');

  const {
    data: actualPerformance,
    isLoading: isActualLoading,
    isFetching: isActualFetching,
    isError: isActualError,
    error: actualError,
  } = useGetSellingPricePerformanceQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: aiPerformance,
    isLoading: isAiLoading,
    isFetching: isAiFetching,
    isError: isAiError,
    error: aiError,
  } = useGetSellingPricePerformanceAiQuery(undefined, {
    skip: activeTab !== 'ai',
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isActualError) toast.error(actualError?.data?.message);
    if (isAiError) toast.error(aiError?.data?.message);
  }, [isActualError, actualError, isAiError, aiError]);

  const activeTabConfig = useMemo(() => TABS.find((tab) => tab.key === activeTab), [activeTab]);
  const isAiBusy = isAiLoading || isAiFetching;

  const activePerformance =
    activeTab === 'ai' ? aiPerformance?.data?.performance : actualPerformance?.data?.performance;
  const xAxisMeta = activePerformance?.xAxis;
  const yAxisMeta = activePerformance?.yAxis;
  const datasetMeta = activePerformance?.dataset;

  const displayFormat = xAxisMeta?.displayFormat || DEFAULT_DISPLAY_FORMAT;
  const tooltipFormat = xAxisMeta?.tooltipFormat || DEFAULT_TOOLTIP_FORMAT;

  const chartData = useMemo(() => {
    return (activePerformance?.data || []).map((item) => {
      const dateObj = new Date(item.date);
      return {
        date: safeFormatDate(dateObj, displayFormat),
        tooltipDate: safeFormatDate(dateObj, tooltipFormat),
        value: item.value,
      };
    });
  }, [activePerformance, displayFormat, tooltipFormat]);

  const yAxisRange = useMemo(() => buildYAxisRange(yAxisMeta), [yAxisMeta]);

  const curveType = datasetMeta?.tension === 0 ? 'linear' : 'monotone';
  const dotRadius = datasetMeta?.pointRadius;
  const dotConfig =
    typeof dotRadius === 'number' && dotRadius > 0
      ? { r: dotRadius, fill: activeTabConfig.color, stroke: '#0f172a', strokeWidth: 1 }
      : false;

  if (isActualLoading || isActualFetching) return <PerformanceSkeleton />;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full min-h-0 flex-col gap-6 overflow-hidden"
    >
      <Header
        title="Selling Price Performance"
        description="Visualize your investment growth over time."
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAiBusy={isAiBusy}
      />

      <div className="min-h-100 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
        {activeTab === 'ai' && isAiBusy ? (
          <ChartLoader color={activeTabConfig.color} />
        ) : chartData.length === 0 ? (
          <div className="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">
            No {activeTabConfig.label.toLowerCase()} data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={CHART_MARGIN}>
              <defs>
                {TABS.map((tab) => (
                  <linearGradient
                    key={tab.gradientId}
                    id={tab.gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={tab.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
                domain={yAxisRange.domain}
                ticks={yAxisRange.ticks}
                dx={-10}
                width={60}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type={curveType}
                dataKey="value"
                name={activeTabConfig.seriesName}
                stroke={activeTabConfig.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${activeTabConfig.gradientId})`}
                dot={dotConfig}
                activeDot={{ r: 6, fill: activeTabConfig.color, stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </MotionDiv>
  );
}
