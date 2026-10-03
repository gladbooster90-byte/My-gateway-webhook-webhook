import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Crown, Zap, PhoneCall, Sparkles, ShieldCheck, Volume2, VolumeX } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isWithinWithdrawalHours, setActiveTab, setActiveSubModal, soundEnabled, toggleSound } = useWallet();
  const openHours = isWithinWithdrawalHours();

  // Tier specific styling & color mapping
  const getVipRankBadgeTheme = (vipLevel: number) => {
    switch (vipLevel) {
      case 1:
        return {
          badgeBg: 'bg-gradient-to-r from-purple-950/80 to-purple-900/90',
          border: 'border-purple-500/50 hover:border-purple-400',
          text: 'text-purple-300',
          iconColor: 'text-purple-400',
          glow: 'shadow-purple-900/30',
          label: 'V1',
        };
      case 2:
        return {
          badgeBg: 'bg-gradient-to-r from-blue-950/80 to-cyan-950/90',
          border: 'border-cyan-500/50 hover:border-cyan-400',
          text: 'text-cyan-300',
          iconColor: 'text-cyan-400',
          glow: 'shadow-cyan-900/30',
          label: 'V2',
        };
      case 3:
        return {
          badgeBg: 'bg-gradient-to-r from-emerald-950/80 to-teal-950/90',
          border: 'border-emerald-500/50 hover:border-emerald-400',
          text: 'text-emerald-300',
          iconColor: 'text-emerald-400',
          glow: 'shadow-emerald-900/30',
          label: 'V3',
        };
      case 4:
        return {
          badgeBg: 'bg-gradient-to-r from-rose-950/80 to-pink-950/90',
          border: 'border-rose-500/50 hover:border-rose-400',
          text: 'text-rose-300',
          iconColor: 'text-rose-400',
          glow: 'shadow-rose-900/30',
          label: 'V4',
        };
      case 5:
        return {
          badgeBg: 'bg-gradient-to-r from-amber-950/80 to-yellow-950/90',
          border: 'border-amber-400/60 hover:border-yellow-300',
          text: 'text-amber-300',
          iconColor: 'text-yellow-400',
          glow: 'shadow-amber-900/40',
          label: 'V5',
        };
      case 6:
      case 7:
        return {
          badgeBg: 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20',
          border: 'border-amber-300/70 hover:border-amber-200',
          text: 'text-amber-200',
          iconColor: 'text-amber-300',
          glow: 'shadow-amber-500/30',
          label: `V${vipLevel}`,
        };
      default:
        return {
          badgeBg: 'bg-slate-900/90',
          border: 'border-slate-700 hover:border-slate-600',
          text: 'text-slate-300',
          iconColor: 'text-slate-400',
          label: `V${vipLevel || 1}`,
          glow: '',
        };
    }
  };

  const vipTheme = getVipRankBadgeTheme(user.vipLevel);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Network & VIP Rank */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-sm tracking-tighter shrink-0">
            UGX
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-bold text-sm text-slate-100 leading-tight">AI Wealth Pro</h1>

              {/* Prominent Dynamic VIP Rank Badge */}
              <button
                onClick={() => setActiveSubModal('vip_details')}
                title="View VIP Tier Benefits"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px] font-extrabold shadow-sm transition-all active:scale-95 ${vipTheme.badgeBg} ${vipTheme.border} ${vipTheme.text} ${vipTheme.glow}`}
              >
                <Crown className={`w-3 h-3 ${vipTheme.iconColor} stroke-[2.5]`} />
                <span className="tracking-tight">VIP {user.vipLevel}</span>
                {user.vipName && user.vipName !== `VIP ${user.vipLevel}` && user.vipName !== `V${user.vipLevel}` && (
                  <span className="text-[9px] opacity-80 font-normal hidden sm:inline">
                    • {user.vipName.replace(new RegExp(`^VIP\\s*${user.vipLevel}\\s*[-–•]?\\s*`, 'i'), '').trim()}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
              <span className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MTN / Airtel MoMo
              </span>
              <span>•</span>
              <span className={`truncate ${openHours ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}`}>
                {openHours ? 'Cashout Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:text-purple-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-500 border-slate-700'
            }`}
            title={soundEnabled ? 'Sound Effects Active (Cha-Ching) - Click to Mute' : 'Sound Effects Muted - Click to Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setActiveSubModal('deposit')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm shadow-emerald-950 transition-transform active:scale-95"
            title="Deposit Funds"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors relative"
            title="Support & AI Chat"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
