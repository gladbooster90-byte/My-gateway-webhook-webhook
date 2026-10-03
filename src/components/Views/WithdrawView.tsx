import React, { useState } from 'react';
import {
  ArrowLeft,
  Info,
  Clock,
  ShieldCheck,
  Lock,
  Phone,
  UserCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  X,
  ArrowRight,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const WithdrawView: React.FC = () => {
  const {
    user,
    withdrawalRecords,
    requestWithdrawal,
    isWithinWithdrawalHours,
    simulateApproveWithdrawal,
    simulateRejectWithdrawal,
    setActiveTab,
  } = useWallet();

  const [amountInput, setAmountInput] = useState<string>('7200');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');

  const numericAmount = parseFloat(amountInput) || 0;
  const fee15 = Math.round(numericAmount * 0.15);
  const netArrival = Math.max(0, numericAmount - fee15);
  const isOpen = isWithinWithdrawalHours();

  const handleQuickSelect = (val: number) => {
    setAmountInput(val.toString());
    setFeedback(null);
  };

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (numericAmount <= 0 || isNaN(numericAmount)) {
      setFeedback({ type: 'error', message: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (!user.isVipActive) {
      setFeedback({
        type: 'error',
        message: 'No withdraw without deposit. Please activate an International Beddings VIP suite first.',
      });
      return;
    }

    if (numericAmount > user.withdrawableEarnings) {
      setFeedback({
        type: 'error',
        message: `Insufficient withdrawable earnings. Available: ${user.withdrawableEarnings.toLocaleString()} UGX`,
      });
      return;
    }

    if (numericAmount < 3000) {
      setFeedback({
        type: 'error',
        message: 'Minimum withdrawal amount is 3,000 UGX.',
      });
      return;
    }

    // Open confirmation dialog
    setIsConfirmOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      const res = requestWithdrawal(numericAmount);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setAmountInput('');
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 600);
  };

  const filteredRecords = withdrawalRecords.filter((record) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return record.status === 'pending' || record.status === 'processing';
    return record.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('Wallet')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wallet</span>
          </button>
          <h2 className="text-base font-bold text-slate-100">MyWithdraw</h2>
          <div className="flex items-center gap-1 text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>09:00 - 20:00</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Withdrawal Notice Box */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-xl shadow-amber-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Info className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-amber-300">Withdrawal notice</h3>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold leading-relaxed">•</span>
              <p>A 15% charge is deducted from every withdrawal.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold leading-relaxed">•</span>
              <p>Available Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, from 09:00 to 20:00.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold leading-relaxed">•</span>
              <p>Processing time: 2 minutes up to 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Withdrawable earnings</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400 tracking-tight">
              {user.withdrawableEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-400">UGX</span>
            </div>
            <div className="text-[10px] text-emerald-500/80 font-medium mt-0.5">
              Instant MoMo eligible
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Total balance</span>
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold text-slate-100 tracking-tight">
              {user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-400">UGX</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              Wallet + Earnings
            </div>
          </div>
        </div>

        {/* VIP Policy Callout */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
            Deposited money cannot be withdrawn — only your earnings (VIP income, referral commissions, bonuses). You must own an active VIP plan.
          </p>
        </div>

        {/* Account Details & Request Form */}
        <form onSubmit={handleOpenConfirmation} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          {/* Full Name (Locked) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Full name
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Verified KYC
              </span>
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-sm font-semibold text-slate-200">
              <span>{user.name}</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Registered MoMo Number */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                MoMo number (registered)
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                {user.network || 'MTN'} MoMo UG
              </span>
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-sm font-semibold text-slate-200">
              <span className="font-mono">{user.momoNumber}</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-tight flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              Funds are sent to the number you registered with. You cannot change it — only an admin can.
            </p>
          </div>

          {/* Withdrawal Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Withdrawal amount (UGX)
              </label>
              <button
                type="button"
                onClick={() => handleQuickSelect(user.withdrawableEarnings)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Max ({user.withdrawableEarnings.toLocaleString()} UGX)
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                min="3000"
                step="100"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  setFeedback(null);
                }}
                placeholder="Enter amount (min 3,000 UGX)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-3 text-base font-bold text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                UGX
              </span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[3000, 5000, 7200, 15000, 30000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickSelect(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    numericAmount === val
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {val.toLocaleString()} UGX
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Calculation Breakdown Preview */}
          {numericAmount > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Requested Amount:</span>
                <span className="font-semibold text-slate-200">{numericAmount.toLocaleString()} UGX</span>
              </div>
              <div className="flex items-center justify-between text-amber-400">
                <span>MoMo & Admin Charge (15%):</span>
                <span className="font-semibold">-{fee15.toLocaleString()} UGX</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                <span>Expected MoMo Arrival:</span>
                <span>{netArrival.toLocaleString()} UGX</span>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">{feedback.message}</p>
            </div>
          )}

          {/* Request Withdrawal Button */}
          <button
            type="submit"
            disabled={numericAmount <= 0}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Request withdrawal</span>
          </button>

          {/* Disclaimer Prompt Copy */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            A 20% fee is deducted. Amount is held from balance until admin approves. Rejected requests are refunded.
          </p>
        </form>

        {/* Withdrawal Records Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">Withdrawal Records</h3>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
              No withdrawal records found in this view.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredRecords.map((record) => {
                const isPending = record.status === 'pending';
                const isProcessing = record.status === 'processing';
                const isCompleted = record.status === 'completed';
                const isRejected = record.status === 'rejected';

                return (
                  <div
                    key={record.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{record.id}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {record.createdAt}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isProcessing
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                            : isPending
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isCompleted
                          ? '✓ Completed'
                          : isProcessing
                          ? '⚡ MoMo Processing'
                          : isPending
                          ? '⏳ Pending Admin Review'
                          : '✕ Rejected & Refunded'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500">Gross Amount</div>
                        <div className="font-semibold text-slate-200">
                          {record.amount.toLocaleString()} UGX
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">20% Fee</div>
                        <div className="font-semibold text-amber-400">
                          -{record.fee.toLocaleString()} UGX
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">MoMo Net</div>
                        <div className="font-bold text-emerald-400">
                          {record.arrivalAmount.toLocaleString()} UGX
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span className="font-mono">{record.momoNumber}</span>
                        <span className="text-slate-500">({record.recipientName})</span>
                      </div>
                      {record.txId && (
                        <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                          {record.txId}
                        </span>
                      )}
                    </div>

                    {/* Simulation Controls for testing lifecycle */}
                    {(isPending || isProcessing) && (
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 italic">
                          Admin simulator:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => simulateApproveWithdrawal(record.id)}
                            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                          >
                            Approve MoMo Payout
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateRejectWithdrawal(record.id, 'Account verification request')}
                            className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-medium"
                          >
                            Reject & Refund
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 overflow-hidden relative">
            {/* Top header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">Confirm MoMo Cashout</h3>
                  <p className="text-[11px] text-slate-400">Review 20% fee deduction before dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fee Deduction Callout */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  20% Network & Processing Fee Policy
                </span>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                  -20%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                As per Uganda VIP withdrawal terms, 20% is deducted from your requested amount for carrier network gateway charges and node maintenance.
              </p>
            </div>

            {/* Financial Calculation Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Gross Requested Amount:</span>
                <span className="font-bold text-slate-100 font-mono text-sm">
                  {numericAmount.toLocaleString()} UGX
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-amber-400">
                <span className="flex items-center gap-1">
                  <span>Fee Deduction (15% Charge):</span>
                </span>
                <span className="font-bold font-mono text-sm">
                  -{fee15.toLocaleString()} UGX
                </span>
              </div>

              <div className="h-px bg-slate-800 my-1" />

              {/* Net Payout Arrival Highlight */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 block">
                    Final Net Amount You Receive
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Direct MoMo credited
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {netArrival.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-300 ml-1">UGX</span>
                </div>
              </div>
            </div>

            {/* Recipient Account Details */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Payout Destination:</span>
                <span className="font-bold text-slate-200">{user.network || 'MTN'} Mobile Money</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Recipient Name:</span>
                <span className="font-semibold text-slate-200">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Registered Number:</span>
                <span className="font-mono font-bold text-amber-300">{user.momoNumber}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Estimated Delivery:
                </span>
                <span className="font-medium text-cyan-400">2 minutes - 24 hours</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Receive {netArrival.toLocaleString()} UGX</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
              >
                Cancel / Edit Amount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

