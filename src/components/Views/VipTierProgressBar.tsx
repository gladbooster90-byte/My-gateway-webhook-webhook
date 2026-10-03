import React from 'react';
import { Crown, ArrowRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { VIP_PLANS } from '../../context/WalletContext';
import { UserAccount, VipPlan } from '../../types';

interface VipTierProgressProps {
  user: UserAccount;
  onOpenUpgradeModal: () => void;
}

export const VipTierProgressBar: React.FC<VipTierProgressProps> = ({
  user,
  onOpenUpgradeModal,
}) => {
  const currentPlan = VIP_PLANS.find((p) => p.id === user.vipLevel) || VIP_PLANS[0];
  const nextPlanIndex = VIP_PLANS.findIndex((p) => p.id === user.vipLevel) + 1;
  const isMaxTier = nextPlanIndex >= VIP_PLANS.length;
  const nextPlan: VipPlan | null = isMaxTier ? null : VIP_PLANS[nextPlanIndex];

  // Calculate progress metrics towards the next VIP tier
  // If user is at max VIP, progress is 100%.
  // Otherwise, calculate progress based on deposited amount / total balance vs next tier threshold
  const currentBasePrice = currentPlan.price;
  const nextTierPrice = nextPlan ? nextPlan.price : currentBasePrice;
  const priceGap = Math.max(1, nextTierPrice - currentBasePrice);
  
  // Progress based on total balance + deposited towards the upgrade cost
  const availableFunds = Math.max(0, user.totalBalance);
  const rawProgress = isMaxTier
    ? 100
    : availableFunds <= 0
    ? 0
    : Math.min(
        100,
        Math.max(
          5,
          Math.round((availableFunds / nextTierPrice) * 100)
        )
      );

  const neededUgx = nextPlan ? Math.max(0, nextPlan.price - user.totalBalance) : 0;

  return (
    <div
      id="vip-tier-progress-card"
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/20">
            <Crown className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-100">{currentPlan.name}</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tier {user.vipLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {isMaxTier ? 'Maximum VIP Tier Achieved' : `Next Milestone: ${nextPlan?.name} (V${nextPlan?.id})`}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenUpgradeModal}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-xl border border-amber-500/30 transition-all active:scale-95"
        >
          <span>{isMaxTier ? 'Plan Specs' : 'Upgrade'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Visual Multi-Segment Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Tier Progress</span>
          </span>
          <span className="font-mono font-bold text-amber-300">{rawProgress}%</span>
        </div>

        {/* Outer Bar */}
        <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full p-0.5 relative overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 relative shadow-sm shadow-amber-500/50"
            style={{ width: `${rawProgress}%` }}
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-white/25 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Target Milestone & Incentive Text */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
          <span>{user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UGX Balance</span>
          {nextPlan ? (
            <span className="text-slate-300">
              Target: <strong className="text-amber-400">{nextPlan.price.toLocaleString()} UGX</strong>
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Peak VIP Elite
            </span>
          )}
        </div>
      </div>

      {/* Value Proposition Benefit Row */}
      {nextPlan && (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400">Upgrade Daily Yield Boost</div>
              <div className="font-bold text-[11px] text-emerald-400 truncate">
                +{nextPlan.dailyIncome.toLocaleString()} UGX/day (+
                {(nextPlan.dailyIncome - currentPlan.dailyIncome).toLocaleString()} UGX extra)
              </div>
            </div>
          </div>

          {neededUgx > 0 ? (
            <div className="text-right shrink-0">
              <span className="text-[9.5px] text-slate-400 block">Needs deposit</span>
              <span className="font-black text-[11px] text-amber-300 font-mono">
                {neededUgx.toLocaleString()} UGX
              </span>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ready to Activate
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
