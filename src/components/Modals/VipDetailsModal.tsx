import React, { useState } from 'react';
import {
  X,
  Crown,
  Sparkles,
  CheckCircle2,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Lock,
  Calendar,
} from 'lucide-react';
import { useWallet, VIP_PLANS } from '../../context/WalletContext';

interface VipDetailsModalProps {
  onClose: () => void;
}

export const VipDetailsModal: React.FC<VipDetailsModalProps> = ({ onClose }) => {
  const { user, upgradeVip, setActiveSubModal } = useWallet();
  const [selectedPlanId, setSelectedPlanId] = useState<number>(user.vipLevel);
  const [activeTab, setActiveTab] = useState<'plans' | 'schedule' | 'rules' | 'faq'>('plans');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedPlan = VIP_PLANS.find((p) => p.id === selectedPlanId) || VIP_PLANS[0];

  const handleUpgrade = () => {
    setFeedback(null);
    const res = upgradeVip(selectedPlan);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-100">International Beddings VIP Plans</h3>
              <p className="text-[11px] text-slate-400">100 Days contract • 5,000 UGX Welcome Bonus • 15% Withdrawal Charge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-0 flex gap-4 border-b border-slate-800/80 bg-slate-950/50 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-2 text-xs font-bold transition-all relative shrink-0 ${
              activeTab === 'plans'
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>VIP Suites (1-9)</span>
            {activeTab === 'plans' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-2 text-xs font-bold transition-all relative shrink-0 ${
              activeTab === 'schedule'
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>100-Day Income Cycle</span>
            {activeTab === 'schedule' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2 text-xs font-bold transition-all relative shrink-0 ${
              activeTab === 'rules'
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Rules & Referral</span>
            {activeTab === 'rules' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2 text-xs font-bold transition-all relative shrink-0 ${
              activeTab === 'faq'
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>FAQs</span>
            {activeTab === 'faq' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'plans' && (
            <>
              {/* VIP Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VIP_PLANS.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;
                  const isCurrent = plan.id === user.vipLevel;
                  const totalEst = plan.dailyIncome * plan.validityDays;
                  const roiPercent = Math.round((totalEst / plan.price) * 100);

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                        isSelected
                          ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                          Active Plan
                        </span>
                      )}
                      {!isCurrent && plan.badge && (
                        <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                          {plan.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${plan.color} text-slate-950 font-black text-xs flex items-center justify-center`}
                        >
                          V{plan.id}
                        </div>
                        <h4 className="font-bold text-xs text-slate-100">{plan.name}</h4>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-400 text-[11px]">Investment:</span>
                          <span className="font-extrabold text-slate-100">
                            {plan.price.toLocaleString()} UGX
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-400 text-[11px]">Daily AI Yield:</span>
                          <span className="font-bold text-emerald-400">
                            +{plan.dailyIncome.toLocaleString()} UGX
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <span>{plan.validityDays} Days Validity</span>
                          <span className="font-semibold text-cyan-400">~{roiPercent}% ROI</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Plan Details Deep Dive */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-slate-100">{selectedPlan.name} Highlights</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {selectedPlan.price.toLocaleString()} UGX
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Daily Task Count</div>
                    <div className="font-bold text-slate-200 mt-0.5">{selectedPlan.taskCount} Nodes</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Est. Total Yield</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {(selectedPlan.dailyIncome * selectedPlan.validityDays).toLocaleString()} UGX
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Bonus Spins</div>
                    <div className="font-bold text-yellow-400 mt-0.5">+3 Spins</div>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant automatic daily compute task credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Eligible for 7-day streak multiplication & raffle jackpot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Full withdrawal eligibility with 20% standard MoMo fee</span>
                  </li>
                </ul>

                {feedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold text-center ${
                      feedback.type === 'success'
                        ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      setActiveSubModal('deposit');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    Deposit Funds
                  </button>

                  {user.vipLevel >= selectedPlan.id && user.isVipActive ? (
                    <div className="flex-1 py-2.5 px-3 rounded-xl border-2 border-amber-500 bg-amber-950/60 text-amber-300 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-1.5 cursor-default">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Already Owned</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-bold text-xs text-slate-950 shadow-md shadow-amber-950 transition-transform active:scale-95 flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Activate VIP {selectedPlan.id}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4 text-xs text-slate-300">
              {/* VIP 1 Spotlight Card */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      V1
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">VIP 1 Single Deluxe (100 Days Cycle)</h4>
                      <p className="text-[11px] text-amber-300">Invest in comfort, earn daily returns for 100 days</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    2,500% ROI
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Investment Price</span>
                    <span className="font-bold text-slate-100 text-xs">20,000 UGX</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Daily Return</span>
                    <span className="font-bold text-emerald-400 text-xs">+5,000 UGX/day</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">100-Day Total Return</span>
                    <span className="font-extrabold text-cyan-400 text-xs">500,000 UGX</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Welcome Bonus</span>
                    <span className="font-black text-amber-400 text-xs">+5,000 UGX</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Break-even Threshold:</span>
                    <span className="font-semibold text-emerald-400">Day 4 (20,000 UGX full capital back)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Withdrawal Fee:</span>
                    <span className="font-semibold text-amber-400">15% Charge</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Referral Commission:</span>
                    <span className="font-semibold text-cyan-400">20% (L1) - 2% (L2) - 1% (L3)</span>
                  </div>
                </div>
              </div>

              {/* 100-Day Milestone Roadmap */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    VIP 1 100-Day Income Milestones
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">5,000 UGX / 24h</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                      <div>
                        <div className="font-semibold text-xs text-slate-200">Day 1 — First Return + Bonus</div>
                        <div className="text-[10px] text-slate-400">5,000 UGX + 5,000 UGX bonus credited</div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs">10,000 UGX</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] flex items-center justify-center font-black">
                        4
                      </span>
                      <div>
                        <div className="font-bold text-xs text-emerald-300">Day 4 — 100% Capital Recovered</div>
                        <div className="text-[10px] text-emerald-400/80">20,000 UGX total return (Break-even!)</div>
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 text-xs">20,000 UGX</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        20
                      </span>
                      <div>
                        <div className="font-semibold text-xs text-slate-200">Day 20 — 5X Growth Milestone</div>
                        <div className="text-[10px] text-slate-400">Total 100,000 UGX accumulated</div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs">100,000 UGX</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] flex items-center justify-center font-black">
                        100
                      </span>
                      <div>
                        <div className="font-bold text-xs text-cyan-300">Day 100 — Full Contract Complete</div>
                        <div className="text-[10px] text-cyan-400/80">500,000 UGX total received (25X ROI)</div>
                      </div>
                    </div>
                    <span className="font-black text-cyan-400 text-xs">500,000 UGX</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-200">Ready to invest in VIP 1?</div>
                  <div className="text-[10px] text-slate-400">Deposit 20,000 UGX via MTN MoMo or Airtel Money</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveSubModal('deposit');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Deposit Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>International Beddings Rules & Policy</span>
                </div>
                <p className="leading-relaxed">
                  1. <strong className="text-slate-100">Total Contract Days:</strong> All VIP packages run for an active contract cycle of 100 days.
                </p>
                <p className="leading-relaxed">
                  2. <strong className="text-slate-100">Withdrawal Charge:</strong> Flat 15% charge on all MTN and Airtel mobile money cashouts.
                </p>
                <p className="leading-relaxed">
                  3. <strong className="text-slate-100">No Withdraw Without Deposit:</strong> You must activate a VIP plan deposit to unlock mobile money withdrawals.
                </p>
                <p className="leading-relaxed">
                  4. <strong className="text-slate-100">Welcome Bonus:</strong> 5,000 UGX instant welcome credit on account initialization.
                </p>
                <p className="leading-relaxed">
                  5. <strong className="text-slate-100">Multi-Tier Referral Commission:</strong> 20% on Level 1 direct invites, 2% on Level 2, and 1% on Level 3.
                </p>
                <p className="leading-relaxed">
                  6. <strong className="text-slate-100">Daily Check-In:</strong> Earn 200 UGX free bonus daily by checking in on the app!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>How fast do I get my daily earnings?</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Daily AI tasks take between 15 to 45 seconds to execute. Once complete, click &quot;Claim&quot; to credit your Withdrawable Balance immediately.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Can I upgrade to higher VIP levels anytime?</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Yes! When upgrading to higher tiers (e.g., VIP 2 or VIP 3), higher-yielding tasks unlock instantly while preserving your existing balance.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Which networks support payouts?</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Both MTN Mobile Money and Airtel Money Uganda are supported 7 days a week.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
