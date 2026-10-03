import React from 'react';
import {
  Cpu,
  Play,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Layers,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const AiTaskView: React.FC = () => {
  const { user, aiTasks, startAiTask, claimAiTask, setActiveTab, setActiveSubModal, soundEnabled, toggleSound } = useWallet();

  const totalPossibleDaily = aiTasks.reduce((acc, t) => acc + t.rewardUgx, 0);
  const claimedToday = aiTasks.filter((t) => t.status === 'claimed').reduce((acc, t) => acc + t.rewardUgx, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border-b border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-slate-100">AI Computing Hub</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                  soundEnabled
                    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-400'
                }`}
                title="Toggle Cha-Ching Sound Effects on Task Completion & Rewards"
              >
                {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Cha-Ching FX' : 'Muted'}</span>
              </button>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {user.vipName}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-slate-400">Claimed AI Yield</div>
              <div className="text-lg font-black text-cyan-400">
                {claimedToday.toLocaleString()} <span className="text-xs text-slate-500">UGX</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Daily Task Limit</div>
              <div className="text-lg font-black text-slate-200">
                {totalPossibleDaily.toLocaleString()} <span className="text-xs text-slate-500">UGX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 100-Day Income Cycle Tracker */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-2.5 shadow-lg shadow-amber-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                VIP 1 100-Day Income Cycle
              </h3>
            </div>
            <button
              onClick={() => setActiveSubModal('vip_details')}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
            >
              Cycle Plan <TrendingUp className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Contract Progress: <strong className="text-slate-100">Day {user.vipDaysElapsed || 2} of {user.vipTotalDays || 100} Days</strong>
            </span>
            <span className="font-mono font-bold text-emerald-400">
              5,000 UGX / day
            </span>
          </div>

          {/* Cycle Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (((user.vipDaysElapsed || 2) / (user.vipTotalDays || 100)) * 100))}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">
            <div>
              <span>Earned in Cycle: </span>
              <strong className="text-cyan-400">{((user.vipDaysElapsed || 2) * 5000).toLocaleString()} UGX</strong>
            </div>
            <div className="text-right">
              <span>100-Day Total Target: </span>
              <strong className="text-amber-400">500,000 UGX</strong>
            </div>
          </div>
        </div>

        {/* Status Callout */}
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-purple-300 font-medium">
            <Activity className="w-4 h-4 text-purple-400 shrink-0" />
            <span>AI Inference Cluster Status: </span>
            <span className="text-emerald-400 font-bold">100% Operational</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">1.2 PFLOPS</span>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            Available Computational Workloads
          </h3>

          {aiTasks.map((task) => {
            const isLocked = user.vipLevel < task.vipRequired;
            const isRunning = task.status === 'running';
            const isCompleted = task.status === 'completed';
            const isClaimed = task.status === 'claimed';
            const isIdle = task.status === 'idle';

            return (
              <div
                key={task.id}
                className={`bg-slate-900 border rounded-2xl p-4 transition-all shadow-md ${
                  isRunning
                    ? 'border-purple-500/80 ring-1 ring-purple-500/30'
                    : isCompleted
                    ? 'border-emerald-500/80'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                        VIP {task.vipRequired}+
                      </span>
                      <h4 className="font-bold text-xs text-slate-100">{task.name}</h4>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-500" />
                      <span>{task.algorithm}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-cyan-400">
                      +{task.rewardUgx.toLocaleString()} UGX
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{task.durationSeconds}s runtime</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar if Running */}
                {isRunning && (
                  <div className="my-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-purple-300">
                      <span>Computing Tensors...</span>
                      <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Yield added to Withdrawable balance
                  </div>

                  {isLocked ? (
                    <button
                      onClick={() => setActiveSubModal('deposit')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Upgrade to VIP {task.vipRequired}</span>
                    </button>
                  ) : isIdle ? (
                    <button
                      onClick={() => startAiTask(task.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute Node</span>
                    </button>
                  ) : isRunning ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-purple-300 font-bold text-xs flex items-center gap-1.5 animate-pulse"
                    >
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => claimAiTask(task.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Claim {task.rewardUgx.toLocaleString()} UGX</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Claimed Today
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Withdrawal Notice reminder */}
        <div
          onClick={() => setActiveTab('MyWithdraw')}
          className="cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 flex items-center justify-between text-xs transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Ready to cash out AI profits to MTN/Airtel MoMo?</span>
          </div>
          <span className="font-bold text-amber-400">Withdraw &rarr;</span>
        </div>
      </div>
    </div>
  );
};
