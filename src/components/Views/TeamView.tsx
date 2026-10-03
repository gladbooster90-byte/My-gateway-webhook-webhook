import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const TeamView: React.FC = () => {
  const { user, teamMembers, addInviteSimulation, setActiveSubModal } = useWallet();
  const [copied, setCopied] = useState(false);
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://aiwealth.ug/register?ref=${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMembers = teamMembers.filter((m) => m.level === activeTier);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-b border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-slate-100">My Team Network</h2>
            </div>
            <button
              onClick={addInviteSimulation}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-sm"
              title="Test invite reward simulation"
            >
              <UserPlus className="w-3 h-3" />
              <span>+ Simulate Invite</span>
            </button>
          </div>

          {/* Team Metric Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
              <div className="text-[10px] text-slate-400">Total Team</div>
              <div className="text-base font-black text-slate-100">{user.teamCount}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
              <div className="text-[10px] text-slate-400">Direct Invites</div>
              <div className="text-base font-black text-indigo-400">{user.inviteCount}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
              <div className="text-[10px] text-slate-400">Commission</div>
              <div className="text-base font-black text-emerald-400">
                {user.teamIncome.toLocaleString()} <span className="text-[9px]">UGX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Referral Code Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Your Invitation Code:</span>
            <span className="font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {user.referralCode}
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`https://aiwealth.ug/register?ref=${user.referralCode}`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 outline-none truncate"
            />
            <button
              onClick={copyLink}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Commission Structure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="text-xs font-bold text-slate-300">Commission Tiers Breakdown</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTier(1)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                activeTier === 1
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px]">Level 1 (Direct)</div>
              <div className="text-sm font-black text-slate-100">20%</div>
            </button>

            <button
              onClick={() => setActiveTier(2)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                activeTier === 2
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px]">Level 2 (Sub)</div>
              <div className="text-sm font-black text-slate-100">2%</div>
            </button>

            <button
              onClick={() => setActiveTier(3)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                activeTier === 3
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px]">Level 3 (Group)</div>
              <div className="text-sm font-black text-slate-100">1%</div>
            </button>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            Level {activeTier} Members ({filteredMembers.length})
          </h3>

          {filteredMembers.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
              No members in Level {activeTier} yet. Share your invite link to build your team!
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{member.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {member.momoMasked} • Joined {member.joinDate}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-400">
                    +{member.commissionUgx.toLocaleString()} UGX
                  </div>
                  <span className="text-[10px] text-amber-400 font-medium">{member.vipStatus}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
