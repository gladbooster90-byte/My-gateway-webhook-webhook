import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Cpu,
  Gift,
  Users,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  Crown,
  HelpCircle,
} from 'lucide-react';
import { useWallet, VIP_PLANS } from '../../context/WalletContext';
import { VipTierProgressBar } from './VipTierProgressBar';

export const HomeView: React.FC = () => {
  const { user, aiTasks, startAiTask, claimAiTask, setActiveTab, setActiveSubModal } = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Hero Banner with Earnings Highlight */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 px-4 pt-4 pb-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Top User Greeting & Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20 text-sm">
                AI
              </div>
              <div>
                <div className="text-xs text-slate-400">Welcome back,</div>
                <div className="font-bold text-sm text-slate-100">{user.name}</div>
              </div>
            </div>
            <button
              onClick={() => setActiveSubModal('vip_details')}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.vipName}</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          </div>

          {/* Primary Balance Widget */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Available Balance</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MTN MoMo Live
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-400">UGX</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Withdrawable Earnings</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {user.withdrawableEarnings.toLocaleString()} UGX
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Today&apos;s AI Income</span>
                <span className="font-extrabold text-cyan-400 text-sm">
                  {user.todayEarnings.toLocaleString()} UGX
                </span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setActiveSubModal('deposit')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit (MoMo)</span>
              </button>

              <button
                onClick={() => setActiveTab('MyWithdraw')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-bold text-xs text-slate-950 shadow-md shadow-amber-950 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw (15% Fee)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* VIP Tier Progress Bar Indicator */}
        <VipTierProgressBar
          user={user}
          onOpenUpgradeModal={() => setActiveSubModal('vip_details')}
        />

        {/* Quick Functional Hub */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('AI')}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">AI Task</span>
            <span className="text-[9px] text-purple-400 font-medium">Daily Return</span>
          </button>

          <button
            onClick={() => setActiveTab('Raffle')}
            className="bg-slate-900 border border-slate-800 hover:border-yellow-500/50 p-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Raffle</span>
            <span className="text-[9px] text-yellow-400 font-medium">Win 25K UGX</span>
          </button>

          <button
            onClick={() => setActiveSubModal('reward')}
            className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-1">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Reward</span>
            <span className="text-[9px] text-rose-400 font-medium">7-Day Streak</span>
          </button>

          <button
            onClick={() => setActiveSubModal('invite')}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Invite</span>
            <span className="text-[9px] text-indigo-400 font-medium">20% Comm</span>
          </button>
        </div>

        {/* Active AI Compute Tasks Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-slate-100">Today&apos;s AI Computing Tasks</h3>
            </div>
            <button
              onClick={() => setActiveTab('AI')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {aiTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 truncate">{task.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="text-cyan-400 font-bold">+{task.rewardUgx.toLocaleString()} UGX</span>
                    <span>•</span>
                    <span>{task.durationSeconds}s compute</span>
                  </div>
                </div>

                {task.status === 'idle' && (
                  <button
                    onClick={() => startAiTask(task.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run AI</span>
                  </button>
                )}

                {task.status === 'running' && (
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-purple-400 animate-pulse">
                      {Math.round(task.progress)}%
                    </div>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {task.status === 'completed' && (
                  <button
                    onClick={() => claimAiTask(task.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-950 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Claim</span>
                  </button>
                )}

                {task.status === 'claimed' && (
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VIP Packages List with Plan Details Trigger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100">VIP Investment Nodes</h3>
            </div>
            <button
              onClick={() => setActiveSubModal('vip_details')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
            >
              Plan Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {VIP_PLANS.map((plan) => {
              const isCurrent = user.vipLevel === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`bg-slate-950 border rounded-xl p-3.5 transition-all ${
                    isCurrent ? 'border-amber-500/60 shadow-md shadow-amber-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center font-bold text-xs text-slate-950`}
                      >
                        V{plan.id}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-200">{plan.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Price: <span className="text-slate-200 font-semibold">{plan.price.toLocaleString()} UGX</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {plan.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Daily AI Income:</span>
                      <span className="font-bold text-emerald-400">+{plan.dailyIncome.toLocaleString()} UGX/day</span>
                    </div>

                    {isCurrent ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        Current Plan (Active)
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveSubModal('vip_details')}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                      >
                        Details & Upgrade
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Help & FAQ Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">Got Questions on Cashouts or VIP?</div>
              <div className="text-[11px] text-slate-400">Withdrawal times (09:00-20:00), 15% fee & rules</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('FAQ')}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 shadow-md shadow-amber-500/20 transition-all"
          >
            <span>FAQ Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
