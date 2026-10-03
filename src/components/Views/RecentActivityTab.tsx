import React, { useState, useMemo } from 'react';
import {
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Gift,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Copy,
  Check,
  Filter,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Calendar,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { TransactionBill, WithdrawalRecord, AiTask, TeamMember } from '../../types';

export type ActivityCategory = 'all' | 'withdrawals' | 'deposits' | 'earnings';

export interface UnifiedActivityItem {
  id: string;
  category: 'withdrawals' | 'deposits' | 'earnings';
  type:
    | 'deposit'
    | 'withdrawal'
    | 'withdrawal_fee'
    | 'withdrawal_refund'
    | 'ai_income'
    | 'task_completed'
    | 'team_commission'
    | 'raffle_win'
    | 'daily_reward'
    | 'vip_purchase'
    | 'withdrawal_status';
  title: string;
  subtitle: string;
  timestamp: string;
  amount?: number;
  direction?: 'in' | 'out' | 'neutral';
  status: 'success' | 'pending' | 'processing' | 'rejected' | 'completed' | 'claimed';
  referenceId?: string;
  network?: string;
  details?: {
    label: string;
    value: string;
  }[];
}

export const RecentActivityTab: React.FC = () => {
  const {
    transactionBills,
    withdrawalRecords,
    aiTasks,
    teamMembers,
    user,
    setActiveTab,
    setActiveSubModal,
  } = useWallet();

  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Unify and chronologically sort all activities
  const allActivities = useMemo<UnifiedActivityItem[]>(() => {
    const items: UnifiedActivityItem[] = [];

    // 1. Transaction Bills
    transactionBills.forEach((bill: TransactionBill) => {
      let category: UnifiedActivityItem['category'] = 'earnings';
      if (bill.type === 'deposit' || bill.type === 'vip_purchase') {
        category = 'deposits';
      } else if (bill.type === 'withdrawal' || bill.type === 'withdrawal_fee' || bill.type === 'withdrawal_refund') {
        category = 'withdrawals';
      } else {
        category = 'earnings';
      }

      items.push({
        id: `bill-${bill.id}`,
        category,
        type: bill.type as UnifiedActivityItem['type'],
        title: bill.title,
        subtitle: bill.description,
        timestamp: bill.timestamp,
        amount: bill.amount,
        direction: bill.direction,
        status: bill.status === 'success' ? 'success' : bill.status === 'pending' ? 'pending' : 'rejected',
        referenceId: bill.referenceId || bill.id,
        network: user.network,
        details: [
          { label: 'Transaction Type', value: bill.type.replace('_', ' ').toUpperCase() },
          { label: 'Direction', value: bill.direction === 'in' ? 'Incoming Credit' : 'Outgoing Debit' },
          { label: 'Reference TX', value: bill.referenceId || bill.id },
          { label: 'Recorded Date', value: bill.timestamp },
        ],
      });
    });

    // 2. Withdrawal Records & Status Updates
    withdrawalRecords.forEach((record: WithdrawalRecord) => {
      items.push({
        id: `wd-status-${record.id}`,
        category: 'withdrawals',
        type: 'withdrawal_status',
        title: `Withdrawal ${record.status.toUpperCase()} (${record.id})`,
        subtitle: record.note
          ? `${record.note} • Net ${record.arrivalAmount.toLocaleString()} UGX`
          : `Processed to ${record.recipientName} (${record.momoNumber})`,
        timestamp: record.completedAt || record.createdAt,
        amount: record.amount,
        direction: 'out',
        status: record.status,
        referenceId: record.txId || record.id,
        network: user.network,
        details: [
          { label: 'Gross Amount', value: `${record.amount.toLocaleString()} UGX` },
          { label: 'Platform Fee (15%)', value: `${record.fee.toLocaleString()} UGX` },
          { label: 'Net Payout Arrival', value: `${record.arrivalAmount.toLocaleString()} UGX` },
          { label: 'Gateway TXID', value: record.txId },
          { label: 'MoMo Number', value: record.momoNumber },
          { label: 'Created Timestamp', value: record.createdAt },
          ...(record.completedAt ? [{ label: 'Finalized Timestamp', value: record.completedAt }] : []),
        ],
      });
    });

    // 3. AI Tasks Completed & Claimed
    aiTasks
      .filter((t: AiTask) => t.status === 'claimed' || t.status === 'completed')
      .forEach((task: AiTask) => {
        items.push({
          id: `task-act-${task.id}`,
          category: 'earnings',
          type: 'task_completed',
          title: `AI Compute: ${task.name}`,
          subtitle: `Algorithm: ${task.algorithm} (${task.durationSeconds}s compute cycle)`,
          timestamp: '2026-08-28 10:15:00', // standard simulation timestamp
          amount: task.rewardUgx,
          direction: 'in',
          status: task.status === 'claimed' ? 'claimed' : 'completed',
          referenceId: `TASK-NODE-${task.id.toUpperCase()}`,
          details: [
            { label: 'Neural Algorithm', value: task.algorithm },
            { label: 'Execution Duration', value: `${task.durationSeconds} Seconds` },
            { label: 'VIP Required', value: `VIP ${task.vipRequired}` },
            { label: 'Reward Credited', value: `+${task.rewardUgx.toLocaleString()} UGX` },
          ],
        });
      });

    // 4. Team Invites
    teamMembers.forEach((member: TeamMember) => {
      items.push({
        id: `team-act-${member.id}`,
        category: 'earnings',
        type: 'team_commission',
        title: `Team Partner Joined: ${member.name}`,
        subtitle: `Level ${member.level} Referral • Deposit: ${member.depositUgx.toLocaleString()} UGX`,
        timestamp: `${member.joinDate} 12:00:00`,
        amount: member.commissionUgx,
        direction: 'in',
        status: 'success',
        referenceId: member.id,
        details: [
          { label: 'Referral Name', value: member.name },
          { label: 'MoMo Contact', value: member.momoMasked },
          { label: 'Tier Level', value: `Level ${member.level} (20% Direct)` },
          { label: 'Member Investment', value: `${member.depositUgx.toLocaleString()} UGX` },
          { label: 'Commission Earned', value: `+${member.commissionUgx.toLocaleString()} UGX` },
        ],
      });
    });

    // Sort descending by timestamp / id
    return items.sort((a, b) => {
      const dateA = new Date(a.timestamp.replace(' ', 'T')).getTime() || 0;
      const dateB = new Date(b.timestamp.replace(' ', 'T')).getTime() || 0;
      return dateB - dateA;
    });
  }, [transactionBills, withdrawalRecords, aiTasks, teamMembers, user]);

  // Filtered by Category and Search
  const filteredActivities = useMemo(() => {
    return allActivities.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.referenceId && item.referenceId.toLowerCase().includes(q)) ||
        (item.amount && item.amount.toString().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [allActivities, selectedCategory, searchQuery]);

  // Aggregate Metrics & Category Counts
  const categoryCounts = useMemo(() => {
    return {
      all: allActivities.length,
      withdrawals: allActivities.filter((i) => i.category === 'withdrawals').length,
      deposits: allActivities.filter((i) => i.category === 'deposits').length,
      earnings: allActivities.filter((i) => i.category === 'earnings').length,
    };
  }, [allActivities]);

  const stats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    let totalEarnings = 0;

    allActivities.forEach((item) => {
      if (item.amount) {
        if (item.direction === 'in') totalIn += item.amount;
        if (item.direction === 'out') totalOut += item.amount;
        if (item.category === 'earnings') totalEarnings += item.amount;
      }
    });

    return { totalIn, totalOut, totalEarnings, totalEvents: allActivities.length };
  }, [allActivities]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (item: UnifiedActivityItem) => {
    switch (item.type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal':
      case 'withdrawal_fee':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'withdrawal_refund':
        return <RefreshCw className="w-4 h-4 text-cyan-400" />;
      case 'withdrawal_status':
        if (item.status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        if (item.status === 'processing') return <Clock3 className="w-4 h-4 text-amber-400" />;
        if (item.status === 'rejected') return <AlertCircle className="w-4 h-4 text-rose-400" />;
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'ai_income':
      case 'task_completed':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'raffle_win':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'daily_reward':
        return <Gift className="w-4 h-4 text-rose-400" />;
      case 'team_commission':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'vip_purchase':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: UnifiedActivityItem['status']) => {
    switch (status) {
      case 'completed':
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
            Pending
          </span>
        );
      case 'claimed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Claimed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" id="wallet-recent-activity-feed">
      {/* Financial Velocity Summary Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10.5px] text-slate-400">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Deposits</span>
          </div>
          <div className="font-extrabold text-xs text-emerald-400">
            +{stats.totalIn.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">UGX</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10.5px] text-slate-400">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Withdrawals</span>
          </div>
          <div className="font-extrabold text-xs text-rose-400">
            -{stats.totalOut.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">UGX</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10.5px] text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Total Earnings</span>
          </div>
          <div className="font-extrabold text-xs text-purple-300">
            +{stats.totalEarnings.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">UGX</span>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="activity-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions (e.g. Deposit, AI Task, WD-892401)..."
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500/60 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Buttons for Withdrawals, Deposits, and Earnings */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {[
            {
              id: 'all',
              label: 'All',
              icon: Clock,
              count: categoryCounts.all,
              activeColor: 'bg-amber-500 text-slate-950',
            },
            {
              id: 'withdrawals',
              label: 'Withdrawals',
              icon: ArrowUpRight,
              count: categoryCounts.withdrawals,
              activeColor: 'bg-rose-500 text-white',
            },
            {
              id: 'deposits',
              label: 'Deposits',
              icon: ArrowDownLeft,
              count: categoryCounts.deposits,
              activeColor: 'bg-emerald-500 text-slate-950',
            },
            {
              id: 'earnings',
              label: 'Earnings',
              icon: TrendingUp,
              count: categoryCounts.earnings,
              activeColor: 'bg-purple-600 text-white',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`activity-filter-${cat.id}-btn`}
                onClick={() => setSelectedCategory(cat.id as ActivityCategory)}
                className={`py-2 px-1 rounded-lg font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center ${
                  isSelected
                    ? `${cat.activeColor} shadow-md`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] truncate">{cat.label}</span>
                </div>
                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-black/25 text-inherit font-extrabold'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-2.5">
        {filteredActivities.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-slate-300 font-bold text-xs">No matching recent activity found</div>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Your financial transactions, AI compute runs, and payout notifications will appear here automatically.
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredActivities.map((item) => {
            const isExpanded = expandedItemId === item.id;
            return (
              <div
                key={item.id}
                id={`activity-card-${item.id}`}
                className={`bg-slate-900 border transition-all rounded-2xl overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Main Card Header Bar */}
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(item)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-100 truncate">{item.title}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {item.timestamp}
                        </span>
                        {item.referenceId && (
                          <>
                            <span>•</span>
                            <span>Ref: {item.referenceId.slice(0, 14)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount / Direction & Expand Button */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    {item.amount !== undefined && (
                      <div
                        className={`text-xs font-black ${
                          item.direction === 'in'
                            ? 'text-emerald-400'
                            : item.direction === 'out'
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {item.direction === 'in' ? '+' : item.direction === 'out' ? '-' : ''}
                        {item.amount.toLocaleString()} <span className="text-[9px] font-normal">UGX</span>
                      </div>
                    )}
                    <div className="text-slate-500 hover:text-slate-300">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 space-y-2.5 text-xs bg-slate-950/60">
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {item.details?.map((detail, idx) => (
                        <div key={idx} className="bg-slate-900/90 border border-slate-800/70 rounded-xl p-2">
                          <div className="text-[10px] text-slate-400">{detail.label}</div>
                          <div className="text-[11px] font-bold text-slate-200 truncate mt-0.5">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Copy Reference / Fast Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {item.referenceId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.referenceId!, item.id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10.5px] font-medium flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied Ref</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy TX Reference</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 ml-auto">
                        {item.type === 'withdrawal' || item.type === 'withdrawal_status' ? (
                          <button
                            onClick={() => setActiveTab('MyWithdraw')}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10.5px] font-bold transition-colors"
                          >
                            Withdraw Hub
                          </button>
                        ) : item.type === 'ai_income' || item.type === 'task_completed' ? (
                          <button
                            onClick={() => setActiveTab('AI')}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10.5px] font-bold transition-colors"
                          >
                            AI Task Node
                          </button>
                        ) : item.type === 'raffle_win' ? (
                          <button
                            onClick={() => setActiveTab('Raffle')}
                            className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10.5px] font-bold transition-colors"
                          >
                            Spin Wheel
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveSubModal('bill')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10.5px] font-bold transition-colors"
                          >
                            View Full Bill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
