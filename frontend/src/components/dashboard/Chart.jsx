import { formatCurrency, formatFullDate } from '@/utils/formatCurrency';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const SECOND_SERIES = {
  dataKey: 'value',
  name: 'What It’s Worth Now',
  color: '#22d3ee',
  id: 'colorValue',
};

export default function Chart({
  doubleGraph = false,
  color,
  id,
  chartData,
  xDomain,
  yDomain,
  name,
  dataKey,
  isAnimationActive,
}) {
  const dateRange =
    chartData.length > 1
      ? (chartData[chartData.length - 1].date - chartData[0].date) / (1000 * 60 * 60 * 24)
      : 0;

  const formatXAxisDate = (timestamp) => {
    const options =
      dateRange > 365
        ? { month: 'short', year: '2-digit' }
        : dateRange > 45
          ? { day: 'numeric', month: 'short' }
          : { day: '2-digit', month: 'short' };

    return new Intl.DateTimeFormat('en-IN', options).format(new Date(timestamp));
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>

          {doubleGraph && (
            <linearGradient id={SECOND_SERIES.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SECOND_SERIES.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={SECOND_SERIES.color} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 12 }}
          domain={xDomain}
          tickFormatter={formatXAxisDate}
          tickCount={6}
          minTickGap={24}
          interval="preserveStartEnd"
        />

        <YAxis
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={formatCurrency}
          domain={yDomain}
          width={60}
        />

        <Tooltip
          content={<CustomTooltip doubleGraph={doubleGraph} color={color} name={name} />}
          cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
        />

        <Legend
          verticalAlign="top"
          iconType="circle"
          wrapperStyle={{ paddingBottom: '10px', fontSize: '14px', color: '#cbd5e1' }}
        />

        <Area
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={2}
          fillOpacity={0.5}
          fill={`url(#${id})`}
          dot
          activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={isAnimationActive}
        />

        {doubleGraph && (
          <Area
            type="monotone"
            dataKey={SECOND_SERIES.dataKey}
            name={SECOND_SERIES.name}
            stroke={SECOND_SERIES.color}
            strokeWidth={2}
            fillOpacity={0.5}
            fill={`url(#${SECOND_SERIES.id})`}
            dot
            activeDot={{
              r: 6,
              fill: SECOND_SERIES.color,
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label, doubleGraph, color, name }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <p className="mb-3 text-sm font-medium text-slate-300 md:text-base">
        {formatFullDate(label)}
      </p>
      <div className="space-y-2 font-mono text-xs tracking-tight md:text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2" style={{ color }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {name}:
          </span>
          <span className="text-white">{formatCurrency(payload[0].value)}</span>
        </div>

        {doubleGraph && payload[1] && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {SECOND_SERIES.name}:
            </span>
            <span className="text-white">{formatCurrency(payload[1].value)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
