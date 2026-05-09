import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { useGetPerformanceQuery } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

import { PerformanceSkeleton } from '../components/common/Skeleton';

export default function Performance() {
  const user_id = useSelector((state) => state.auth.user_id);
  const { data: getPerformance, isLoading } = useGetPerformanceQuery({ user_id });

  const chartData = (getPerformance?.data?.performance || []).map((item) => ({
    date: new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' }).format(new Date(item.date)),
    fullDate: item.date,
    invested: item.invested,
    value: item.value,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
          <p className="mb-3 text-sm font-medium text-slate-300 md:text-base">{label}</p>
          <div className="space-y-2 font-mono text-xs tracking-tight md:text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Invested:
              </span>
              <span className="text-white">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Current Value:
              </span>
              <span className="text-white">{formatCurrency(payload[1].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <PerformanceSkeleton />;
  }

  return (
    <div className="mx-auto flex h-full flex-col p-4 pb-20 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-1 flex-col">
        <header className="mb-6 md:mb-8">
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-white md:mb-2 md:text-3xl">Performance History</h1>
          <p className="text-sm text-slate-400 md:text-base">Visualize your investment growth over time.</p>
        </header>

        <div className="min-h-100 flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md md:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`} dx={-10} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '14px', color: '#cbd5e1' }} />
              <Area
                type="monotone"
                dataKey="invested"
                name="Invested Amount"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorInvested)"
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Current Value"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
