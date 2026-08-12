import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { useGetSellingPricePerformanceQuery, useGetSellingPricePerformanceAiQuery } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { useToast } from '../components/common/Toast';

import { PerformanceSkeleton } from '../components/common/Skeleton';

const CHART_MARGIN = { top: 20, right: 10, left: 0, bottom: 0 };

const DEFAULT_DISPLAY_FORMAT = 'MMM yy';
const DEFAULT_TOOLTIP_FORMAT = 'dd MMM yyyy';

const TABS = [
  { key: 'actual', label: 'Actual', seriesName: 'Custom Selling Price', color: '#3987e5', gradientId: 'colorActual' },
  { key: 'ai', label: 'AI Formatted', seriesName: 'AI Formatted Price', color: '#d95926', gradientId: 'colorAI' },
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
      <p className="mb-3 text-sm font-medium text-slate-300 md:text-base">{point.payload.tooltipDate}</p>
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
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-transparent" style={{ borderTopColor: color }} />
      Generating AI formatted chart…
    </div>
  );
}

export default function SellingPricePerformance() {
  const user_id = useSelector((state) => state.auth.user_id);
  const toast = useToast();

  const {
    data: actualPerformance,
    isLoading: isActualLoading,
    isFetching: isActualFetching,
    isError: isActualError,
    error: actualError,
  } = useGetSellingPricePerformanceQuery({ user_id }, { skip: !user_id, refetchOnMountOrArgChange: true });

  const {
    data: aiPerformance,
    isLoading: isAiLoading,
    isFetching: isAiFetching,
    isError: isAiError,
    error: aiError,
  } = useGetSellingPricePerformanceAiQuery({ user_id }, { skip: !user_id, refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isActualError) {
      toast.error(actualError?.data?.message || actualError?.error || 'Failed to load selling price performance');
    }

    if (isAiError) {
      toast.error(aiError?.data?.message || aiError?.error || 'Failed to load AI formatted performance');
    }
  }, [isActualError, actualError, isAiError, aiError]);

  const [activeTab, setActiveTab] = useState('actual');

  const activeTabConfig = useMemo(() => TABS.find((tab) => tab.key === activeTab), [activeTab]);

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
  }, []);

  const isAiBusy = isAiLoading || isAiFetching;

  const activePerformance = activeTab === 'ai' ? aiPerformance?.data?.performance : actualPerformance?.data?.performance;
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
  const dotConfig = typeof dotRadius === 'number' && dotRadius > 0 ? { r: dotRadius, fill: activeTabConfig.color, stroke: '#0f172a', strokeWidth: 1 } : false;

  if (isActualLoading || isActualFetching) {
    return <PerformanceSkeleton />;
  }

  return (
    <div className="mx-auto flex h-full flex-col p-4 pb-20 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-1 flex-col">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
          <div>
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-white md:mb-2 md:text-3xl">Performance History</h1>
            <p className="text-sm text-slate-400 md:text-base">Visualize your investment growth over time.</p>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/60 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="selling-price-tab-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: `${tab.color}26`, boxShadow: `inset 0 0 0 1px ${tab.color}66` }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 ${activeTab === tab.key ? 'text-white' : 'text-slate-400'}`}>
                  {tab.label}
                  {tab.key === 'ai' && isAiBusy && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />}
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="min-h-100 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
          {activeTab === 'ai' && isAiBusy ? (
            <ChartLoader color={activeTabConfig.color} />
          ) : chartData.length === 0 ? (
            <div className="flex h-full min-h-80 items-center justify-center text-sm text-slate-500">No {activeTabConfig.label.toLowerCase()} data available yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={CHART_MARGIN}>
                <defs>
                  {TABS.map((tab) => (
                    <linearGradient key={tab.gradientId} id={tab.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={tab.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
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
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
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
      </motion.div>
    </div>
  );
}
