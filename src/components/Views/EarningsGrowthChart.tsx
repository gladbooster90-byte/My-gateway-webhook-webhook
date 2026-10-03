import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Calendar, Zap, ArrowUpRight, Award, BarChart3 } from 'lucide-react';
import { UserAccount } from '../../types';

interface EarningsGrowthChartProps {
  user: UserAccount;
}

interface DayEarningsData {
  date: string;
  shortDate: string;
  dayNumber: number;
  aiEarnings: number;
  teamEarnings: number;
  bonusEarnings: number;
  totalEarnings: number;
  cumulativeEarnings: number;
}

export const EarningsGrowthChart: React.FC<EarningsGrowthChartProps> = ({ user }) => {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [viewMode, setViewMode] = useState<'daily' | 'cumulative'>('daily');

  // Compute 30-day simulated chronological data anchored to current local date
  const data30Days = useMemo<DayEarningsData[]>(() => {
    const list: DayEarningsData[] = [];
    const hasActivity =
      user.depositedAmount > 0 ||
      user.totalBalance > 0 ||
      user.todayEarnings > 0 ||
      user.aiIncome > 0 ||
      user.teamIncome > 0;
    const baseDailyYield = hasActivity ? (user.vipLevel >= 1 ? 5000 : 2000) : 0;
    let runningTotal = 0;

    // Generate 30 days up to today
    const now = new Date('2026-08-29T00:00:00');
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDate = d.toISOString().split('T')[0];
      const dayNum = 30 - i;

      // Daily earnings breakdown
      const ai = hasActivity ? Math.round(baseDailyYield * (dayNum >= 5 ? 1 : 0.8) + (dayNum % 4 === 0 ? 500 : 0)) : 0;
      const team = hasActivity && dayNum >= 8 ? Math.round(Math.min(user.teamIncome, 4000) * (dayNum / 30) * 0.4) : 0;
      const bonus = hasActivity && (dayNum % 3 === 0 ? 500 : dayNum % 7 === 0 ? 1000 : 0) || 0;
      const total = ai + team + bonus;

      runningTotal += total;

      list.push({
        date: fullDate,
        shortDate,
        dayNumber: dayNum,
        aiEarnings: ai,
        teamEarnings: team,
        bonusEarnings: bonus,
        totalEarnings: total,
        cumulativeEarnings: runningTotal,
      });
    }

    return list;
  }, [user.vipLevel, user.teamIncome, user.depositedAmount, user.totalBalance, user.todayEarnings, user.aiIncome]);

  // Sliced data according to selected timeframe
  const displayData = useMemo(() => {
    const count = parseInt(timeRange, 10);
    return data30Days.slice(-count);
  }, [data30Days, timeRange]);

  // Aggregate stats over the selected period
  const stats = useMemo(() => {
    const totalPeriodEarnings = displayData.reduce((acc, curr) => acc + curr.totalEarnings, 0);
    const avgDaily = Math.round(totalPeriodEarnings / displayData.length);
    const peakDay = Math.max(...displayData.map((d) => d.totalEarnings));

    return { totalPeriodEarnings, avgDaily, peakDay };
  }, [displayData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DayEarningsData = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl space-y-2 text-xs min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-slate-200">
            <span>{data.shortDate} ({data.date})</span>
            <span className="text-[10px] text-amber-400 font-mono">Day #{data.dayNumber}</span>
          </div>

          {viewMode === 'daily' ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-purple-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-purple-400" />
                  AI Task Yield:
                </span>
                <span className="font-mono font-bold text-slate-200">+{data.aiEarnings.toLocaleString()} UGX</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-indigo-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-indigo-400" />
                  Team Referral:
                </span>
                <span className="font-mono font-bold text-slate-200">+{data.teamEarnings.toLocaleString()} UGX</span>
              </div>

              {data.bonusEarnings > 0 && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-rose-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-rose-400" />
                    Bonus / Check-in:
                  </span>
                  <span className="font-mono font-bold text-slate-200">+{data.bonusEarnings.toLocaleString()} UGX</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 font-extrabold text-emerald-400 text-xs">
                <span>Total Daily Return:</span>
                <span>+{data.totalEarnings.toLocaleString()} UGX</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Day Output:</span>
                <span className="font-mono font-bold">+{data.totalEarnings.toLocaleString()} UGX</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 font-extrabold text-cyan-400 text-xs">
                <span>Cumulative Growth:</span>
                <span>{data.cumulativeEarnings.toLocaleString()} UGX</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="income-growth-chart-card"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xl"
    >
      {/* Top Header & Range Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wider">
              30-Day Earnings Growth
            </h3>
            <p className="text-[10.5px] text-slate-400">Chronological daily yield & revenue trajectory</p>
          </div>
        </div>

        {/* View mode toggle (Daily vs Cumulative) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            id="chart-mode-daily-btn"
            onClick={() => setViewMode('daily')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'daily'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily
          </button>
          <button
            id="chart-mode-cumulative-btn"
            onClick={() => setViewMode('cumulative')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'cumulative'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block truncate">Total ({timeRange}D)</span>
          <span className="font-extrabold text-emerald-400 text-xs">
            +{stats.totalPeriodEarnings.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
          </span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block truncate">Avg / Day</span>
          <span className="font-extrabold text-amber-400 text-xs">
            {stats.avgDaily.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
          </span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 block truncate">Peak Day</span>
          <span className="font-extrabold text-cyan-400 text-xs">
            +{stats.peakDay.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              {/* Gradients for bars */}
              <linearGradient id="aiBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="teamBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4338ca" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="bonusBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="shortDate"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={timeRange === '30' ? 4 : 1}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {viewMode === 'daily' ? (
              <>
                <Bar
                  dataKey="aiEarnings"
                  name="AI Compute"
                  stackId="earnings"
                  fill="url(#aiBarGradient)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="teamEarnings"
                  name="Team Referral"
                  stackId="earnings"
                  fill="url(#teamBarGradient)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="bonusEarnings"
                  name="Daily Bonuses"
                  stackId="earnings"
                  fill="url(#bonusBarGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </>
            ) : (
              <Bar
                dataKey="cumulativeEarnings"
                name="Accumulated Earnings"
                fill="url(#cumulativeGradient)"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Controls & Legend */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
        {/* Legend */}
        {viewMode === 'daily' ? (
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
              <span>AI Tasks</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
              <span>Team</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              <span>Bonuses</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cumulative 30-Day Trajectory</span>
          </div>
        )}

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
          {(['7', '14', '30'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                timeRange === days
                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
