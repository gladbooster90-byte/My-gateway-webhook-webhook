import React, { useState } from 'react';
import { X, FileText, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const BillModal: React.FC = () => {
  const { transactionBills, setActiveSubModal } = useWallet();
  const [filter, setFilter] = useState<'all' | 'withdrawals' | 'deposits' | 'earnings'>('all');

  const filteredBills = transactionBills.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return b.type === 'deposit' || b.type === 'vip_purchase';
    if (filter === 'withdrawals') return b.type === 'withdrawal' || b.type === 'withdrawal_refund' || b.type === 'withdrawal_fee';
    if (filter === 'earnings') return b.type === 'ai_income' || b.type === 'daily_reward' || b.type === 'raffle_win' || b.type === 'team_commission';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Bill & Financial Logs</h3>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 pt-3 pb-2 grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All', icon: Clock },
            { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
            { id: 'deposits', label: 'Deposits', icon: ArrowDownLeft },
            { id: 'earnings', label: 'Earnings', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bill list */}
        <div className="flex-1 px-5 py-3 overflow-y-auto space-y-2.5">
          {filteredBills.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No bills recorded in this category.
            </div>
          ) : (
            filteredBills.map((bill) => {
              const isIncome = bill.direction === 'in';
              return (
                <div
                  key={bill.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{bill.title}</span>
                    <span
                      className={`font-black text-sm ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{bill.amount.toLocaleString()} UGX
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 leading-tight">
                    {bill.description}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                    <span>{bill.timestamp}</span>
                    <span className="capitalize text-slate-400">{bill.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
