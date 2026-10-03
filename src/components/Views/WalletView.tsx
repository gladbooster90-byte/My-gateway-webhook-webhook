import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Users,
  UserPlus,
  Coins,
  Cpu,
  Gift,
  Sparkles,
  Download,
  Settings,
  LogOut,
  FileText,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Activity,
  LayoutDashboard,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { RecentActivityTab } from './RecentActivityTab';

export const WalletView: React.FC = () => {
  const { user, setActiveTab, setActiveSubModal, transactionBills, withdrawalRecords } = useWallet();
  const [walletTab, setWalletTab] = useState<'overview' | 'activity'>('overview');

  const totalActivitiesCount = transactionBills.length + withdrawalRecords.length;

  const menuItems = [
    {
      id: 'Deposit',
      label: 'Deposit',
      icon: ArrowDownLeft,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      action: () => setActiveSubModal('deposit'),
    },
    {
      id: 'Withdraw',
      label: 'Withdraw',
      icon: ArrowUpRight,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      action: () => setActiveTab('MyWithdraw'),
    },
    {
      id: 'Activity',
      label: 'Activity',
      icon: Activity,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      action: () => setWalletTab('activity'),
    },
    {
      id: 'Bill',
      label: 'Bill',
      icon: FileText,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      action: () => setActiveSubModal('bill'),
    },
    {
      id: 'Invite',
      label: 'Invite',
      icon: UserPlus,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      action: () => setActiveSubModal('invite'),
    },
    {
      id: 'My team',
      label: 'My team',
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      action: () => setActiveTab('Team'),
    },
    {
      id: 'VIP Task',
      label: 'VIP Task',
      icon: Cpu,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      action: () => setActiveTab('AI'),
    },
    {
      id: 'Reward',
      label: 'Reward',
      icon: Gift,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      action: () => setActiveSubModal('reward'),
    },
    {
      id: 'Raffle',
      label: 'Raffle',
      icon: Sparkles,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      action: () => setActiveTab('Raffle'),
    },
    {
      id: 'Download App',
      label: 'Download App',
      icon: Download,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      action: () => setActiveSubModal('download'),
    },
    {
      id: 'FAQ',
      label: 'Help & FAQ',
      icon: HelpCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      action: () => setActiveTab('FAQ'),
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-slate-400 bg-slate-800 border-slate-700',
      action: () => setActiveSubModal('settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 px-4 pt-4 pb-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-lg text-slate-950 shadow-lg shadow-amber-500/20">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-slate-100">{user.name}</h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-mono">{user.momoNumber}</span>
                  <span>•</span>
                  <button
                    onClick={() => setActiveSubModal('vip_details')}
                    className="text-[11px] font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 underline decoration-amber-500/40"
                  >
                    <span>VIP {user.vipLevel} ({user.vipName})</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveSubModal('settings')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Quick VIP Status Strip */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">Current AI Node: </span>
                <span className="font-bold text-amber-300">Level {user.vipLevel} (Active)</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('AI')}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
            >
              Tasks <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Wallet Sub-Tabs Switcher (Overview vs Recent Activity) */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
            <button
              id="wallet-tab-overview-btn"
              onClick={() => setWalletTab('overview')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                walletTab === 'overview'
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview & Services</span>
            </button>

            <button
              id="wallet-tab-activity-btn"
              onClick={() => setWalletTab('activity')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                walletTab === 'activity'
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recent Activity</span>
              {totalActivitiesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {totalActivitiesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {walletTab === 'activity' ? (
          <RecentActivityTab />
        ) : (
          <>
            {/* Core Prompt Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Wallet */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Wallet</span>
                  <Wallet className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-lg font-black text-slate-100">
                  {user.depositedAmount.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-slate-500">UGX</span>
                </div>
              </div>

              {/* Balance */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-amber-500/30 rounded-2xl p-3 shadow-md">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                  <span>Balance</span>
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-black text-amber-400">
                  {user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-[10px] font-bold text-amber-500">UGX</span>
                </div>
              </div>

              {/* Deposit */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Deposit</span>
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-slate-200">
                  {user.depositedAmount.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-slate-500">UGX</span>
                </div>
              </div>

              {/* Withdraw */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Withdraw</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-base font-bold text-slate-200">
                  {user.totalWithdrawn.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-slate-500">UGX</span>
                </div>
              </div>

              {/* AI Income */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>AI Income</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-base font-bold text-cyan-400">
                  {user.aiIncome.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-slate-500">UGX</span>
                </div>
              </div>

              {/* Today's earnings */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Today&apos;s earnings</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold text-emerald-400">
                  {user.todayEarnings.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-slate-500">UGX</span>
                </div>
              </div>

              {/* Invite Count */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Invite Count</span>
                  <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-base font-bold text-slate-200">
                  {user.inviteCount} <span className="text-[10px] text-slate-500">Users</span>
                </div>
              </div>

              {/* Team Count */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Team Count</span>
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-base font-bold text-slate-200">
                  {user.teamCount} <span className="text-[10px] text-slate-500">Members</span>
                </div>
              </div>
            </div>

            {/* Team Income Full Width Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Team income</div>
                  <div className="text-lg font-black text-slate-100">
                    {user.teamIncome.toFixed(2)} <span className="text-xs font-normal text-slate-400">UGX</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('Team')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 transition-colors"
              >
                Team Details
              </button>
            </div>

            {/* Action Menu Grid */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Account Services & Features
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {menuItems.slice(0, 8).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/60 active:scale-95 group"
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 border transition-transform group-hover:scale-110 ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Utilities Row */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                {menuItems.slice(8).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/60 active:scale-95 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 border transition-transform group-hover:scale-105 ${item.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300 text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction History Filter Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Transaction History
                  </h3>
                </div>
                <button
                  onClick={() => setWalletTab('activity')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Filter Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setWalletTab('activity');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-rose-400">
                      Withdrawals
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-xs font-mono font-black text-rose-400">
                    {user.totalWithdrawn.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setWalletTab('activity');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-400">
                      Deposits
                    </span>
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xs font-mono font-black text-emerald-400">
                    {user.depositedAmount.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setWalletTab('activity');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-purple-400">
                      Earnings
                    </span>
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-xs font-mono font-black text-purple-400">
                    {user.aiIncome.toLocaleString()} <span className="text-[9px] font-normal text-slate-500">UGX</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Withdrawal Quick Jump Banner */}
            <div
              onClick={() => setActiveTab('MyWithdraw')}
              className="cursor-pointer bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-bold">Withdrawable earnings ready</div>
                  <div className="text-base font-extrabold text-slate-100">
                    {user.withdrawableEarnings.toLocaleString()} UGX
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>Cashout</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
