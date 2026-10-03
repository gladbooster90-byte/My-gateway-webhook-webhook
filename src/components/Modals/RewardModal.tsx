import React, { useState } from 'react';
import { X, Gift, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const RewardModal: React.FC = () => {
  const { user, claimDailyRewardStreak, setActiveSubModal } = useWallet();
  const [feedback, setFeedback] = useState<string | null>(null);

  const streakRewards = [
    { day: 1, reward: 500 },
    { day: 2, reward: 800 },
    { day: 3, reward: 1200 },
    { day: 4, reward: 1800 },
    { day: 5, reward: 2500 },
    { day: 6, reward: 3500 },
    { day: 7, reward: 6000 },
  ];

  const handleClaim = () => {
    const res = claimDailyRewardStreak();
    setFeedback(res.message);
  };

  const today = new Date().toDateString();
  const isClaimedToday = user.lastRewardClaimDate === today;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">7-Day Check-in Streak</h3>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-4 gap-2">
          {streakRewards.slice(0, 4).map((s) => {
            const isCompleted = user.dailyRewardStreak > s.day;
            const isCurrent = user.dailyRewardStreak === s.day;
            return (
              <div
                key={s.day}
                className={`p-2.5 rounded-2xl border text-center relative ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                    : isCompleted
                    ? 'bg-slate-950 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold">Day {s.day}</div>
                <div className="text-xs font-black text-amber-300 mt-1">
                  +{s.reward} <span className="text-[9px]">UGX</span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute top-1.5 right-1.5" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {streakRewards.slice(4).map((s) => {
            const isCompleted = user.dailyRewardStreak > s.day;
            const isCurrent = user.dailyRewardStreak === s.day;
            const isDay7 = s.day === 7;
            return (
              <div
                key={s.day}
                className={`p-2.5 rounded-2xl border text-center relative ${
                  isDay7
                    ? 'bg-gradient-to-b from-yellow-500/20 to-amber-600/20 border-yellow-500/60'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-500'
                    : isCompleted
                    ? 'bg-slate-950 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold">
                  {isDay7 ? '🏆 Day 7 Jackpot' : `Day ${s.day}`}
                </div>
                <div className="text-xs font-black text-yellow-300 mt-1">
                  +{s.reward} <span className="text-[9px]">UGX</span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute top-1.5 right-1.5" />
                )}
              </div>
            );
          })}
        </div>

        {feedback && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 text-center">
            {feedback}
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={isClaimedToday}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isClaimedToday
              ? 'Already Claimed for Today (Check Back Tomorrow)'
              : `Claim Day ${user.dailyRewardStreak} Reward`}
          </span>
        </button>
      </div>
    </div>
  );
};
