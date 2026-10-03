import React from 'react';
import {
  TrendingUp,
  Cpu,
  Users,
  Gift,
  ArrowUpRight,
  Sparkles,
  PieChart,
  Calendar,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { EarningsGrowthChart } from './EarningsGrowthChart';

export const IncomeView: React.FC = () => {
  const { user, setActiveTab, setActiveSubModal } = useWallet();

  const totalEarningsEver = user.aiIncome + user.teamIncome;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-b border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-slate-100">Income Overview</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">UGX Currency</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Total Accumulated Earnings</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {totalEarningsEver.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs text-slate-400">UGX</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-slate-800">
              <span>Today&apos;s Return:</span>
              <span className="font-bold text-emerald-400">+{user.todayEarnings.toLocaleString()} UGX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* VIP 1 100-Day Contract Summary */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg shadow-amber-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                VIP 1 100-Day Income Contract
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              5,000 UGX / 100 Days
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Daily Return</span>
              <span className="font-extrabold text-emerald-400">5,000 UGX</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Contract Length</span>
              <span className="font-extrabold text-slate-200">100 Days</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">100-Day Total Yield</span>
              <span className="font-extrabold text-cyan-400">500,000 UGX</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">100-Day Net Profit: <strong className="text-amber-400">+480,000 UGX</strong> (2,500% ROI)</span>
            <button
              onClick={() => setActiveSubModal('vip_details')}
              className="text-amber-400 font-bold hover:text-amber-300 text-xs flex items-center gap-0.5"
            >
              Full Schedule →
            </button>
          </div>
        </div>

        {/* 30-Day Earnings Growth Bar Chart Visualization */}
        <EarningsGrowthChart user={user} />

        {/* Income Sources Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            Revenue Streams
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {/* AI Income */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-200">AI Computing Income</div>
                  <div className="text-[11px] text-slate-400">From VIP tasks & compute nodes</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-purple-400">
                  {user.aiIncome.toLocaleString()} UGX
                </div>
                <div className="text-[10px] text-slate-500">Active Node</div>
              </div>
            </div>

            {/* Team Commission */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-200">Team Referral Commission</div>
                  <div className="text-[11px] text-slate-400">Level 1 (10%), L2 (3%), L3 (1%)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-indigo-400">
                  {user.teamIncome.toLocaleString()} UGX
                </div>
                <div className="text-[10px] text-slate-500">{user.teamCount} Members</div>
              </div>
            </div>

            {/* Daily Streak & Bonuses */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-200">Raffle & Daily Bonuses</div>
                  <div className="text-[11px] text-slate-400">Check-in rewards & wheel prizes</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-rose-400">
                  {(totalEarningsEver - user.aiIncome - user.teamIncome).toLocaleString()} UGX
                </div>
                <div className="text-[10px] text-slate-500">Streak Day {user.dailyRewardStreak}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal CTA */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-300 font-bold">Withdrawable Balance</div>
            <div className="text-lg font-black text-slate-100">
              {user.withdrawableEarnings.toLocaleString()} UGX
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">20% fee applied on payout</div>
          </div>
          <button
            onClick={() => setActiveTab('MyWithdraw')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950 flex items-center gap-1"
          >
            <span>Cashout</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
