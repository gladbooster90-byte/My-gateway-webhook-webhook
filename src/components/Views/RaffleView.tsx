import React, { useState, useRef } from 'react';
import { Sparkles, Trophy, Gift, ArrowRight, RefreshCw, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { soundEffects } from '../../lib/soundEffects';
import confetti from 'canvas-confetti';

const PRIZES = [
  { label: '500 UGX', reward: 500, color: '#f59e0b' },
  { label: '1,500 UGX', reward: 1500, color: '#3b82f6' },
  { label: '3,000 UGX', reward: 3000, color: '#10b981' },
  { label: '10,000 UGX', reward: 10000, color: '#8b5cf6' },
  { label: '800 UGX', reward: 800, color: '#ec4899' },
  { label: '5,000 UGX', reward: 5000, color: '#f97316' },
  { label: '2,000 UGX', reward: 2000, color: '#06b6d4' },
  { label: '25,000 UGX JACKPOT', reward: 25000, color: '#eab308' },
];

export const RaffleView: React.FC = () => {
  const { user, spinRaffleWheel, setActiveSubModal, setActiveTab, soundEnabled, toggleSound } = useWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winResult, setWinResult] = useState<{ reward: number; label: string } | null>(null);

  const handleSpin = () => {
    if (isSpinning || user.luckySpins <= 0) return;

    setIsSpinning(true);
    setWinResult(null);

    const outcome = spinRaffleWheel();
    const segmentAngle = 360 / PRIZES.length; // 45 deg
    // Calculate target angle to land on outcome.prizeIndex
    const extraRotations = 5 * 360; // 5 full spins
    const targetAngle =
      extraRotations + (360 - outcome.prizeIndex * segmentAngle - segmentAngle / 2);

    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    // Subtle tactile wheel ticking as it spins and slows down
    const tickDelays = [
      80, 160, 250, 350, 460, 580, 710, 860, 1030, 1220, 1430, 1660,
      1910, 2180, 2470, 2780, 3110, 3460, 3750
    ];
    tickDelays.forEach((delay, idx) => {
      setTimeout(() => {
        soundEffects.playSpinTick(1 + (idx % 2) * 0.15);
      }, delay);
    });

    setTimeout(() => {
      setIsSpinning(false);
      setWinResult({ reward: outcome.reward, label: outcome.label });
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      // Trigger triumphant celebratory cha-ching & coin win sound
      soundEffects.playRaffleWin();
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-950/40 border-b border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Lucky Raffle Wheel</h2>
              <p className="text-[11px] text-slate-400">Spin to win up to 25,000 UGX instant cash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                soundEnabled
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'Sound FX Enabled (Cha-Ching on Win)' : 'Sound FX Muted'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
            </button>
            <div className="bg-slate-900 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-300">
              Spins Left: <span className="text-white font-black">{user.luckySpins}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-5 flex flex-col items-center">
        {/* Wheel Container */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
          {/* Wheel Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md" />

          {/* Outer Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-500/30 blur-md pointer-events-none" />

          {/* The Spinning Canvas SVG */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1.0)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {PRIZES.map((prize, idx) => {
                const angle = 360 / PRIZES.length;
                const startAngle = (idx * angle * Math.PI) / 180;
                const endAngle = ((idx + 1) * angle * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const textAngle = idx * angle + angle / 2;

                return (
                  <g key={idx}>
                    <path
                      d={pathData}
                      fill={idx % 2 === 0 ? '#1e293b' : '#0f172a'}
                      stroke="#334155"
                      strokeWidth="0.5"
                    />
                    <text
                      x="50"
                      y="18"
                      transform={`rotate(${textAngle + 90}, 50, 50)`}
                      fill={idx === 7 ? '#facc15' : '#f8fafc'}
                      fontSize={idx === 7 ? '3.8' : '4.2'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Wheel Center Button */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400 flex flex-col items-center justify-center shadow-2xl z-10">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Spin Action CTA */}
        <div className="w-full space-y-2.5">
          <button
            onClick={handleSpin}
            disabled={isSpinning || user.luckySpins <= 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSpinning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Spinning Wheel...</span>
              </>
            ) : user.luckySpins > 0 ? (
              <span>SPIN NOW ({user.luckySpins} Spins Available)</span>
            ) : (
              <span>No Spins Left</span>
            )}
          </button>

          {user.luckySpins <= 0 && (
            <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Want more free spins?</span>
              <button
                onClick={() => setActiveSubModal('invite')}
                className="font-bold text-amber-400 hover:underline"
              >
                Invite Friends &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Win Alert Modal / Banner */}
        {winResult && (
          <div className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 text-center space-y-2 animate-in zoom-in-95">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
            <div className="font-extrabold text-base text-amber-300">
              🎉 Congratulations! You Won {winResult.label}!
            </div>
            <p className="text-xs text-slate-300">
              Prize has been credited to your Withdrawable Balance.
            </p>
            <button
              onClick={() => setActiveTab('MyWithdraw')}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1.5 rounded-lg shadow-sm"
            >
              Go to Withdraw <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Prize List Overview */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-300">Raffle Rules & Prizes:</div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Every invited member awards +1 Free Lucky Spin.</li>
            <li>• Daily login rewards include +1 Free Spin on Day 1, 3, and 7.</li>
            <li>• All cash winnings are 100% withdrawable to MoMo.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
