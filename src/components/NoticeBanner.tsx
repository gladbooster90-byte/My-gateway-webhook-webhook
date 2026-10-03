import React, { useState, useEffect } from 'react';
import { Volume2, ChevronRight, ShieldAlert } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const NoticeBanner: React.FC = () => {
  const { setActiveTab } = useWallet();
  const announcements = [
    '• A 20% fee is deducted from every withdrawal. Available 09:00 to 20:00.',
    '🎉 User +25677****882 successfully received 18,400 UGX via MTN Mobile Money.',
    '⚡ New AI GPU Cluster online: VIP 2 daily return increased to 5,200 UGX.',
    '🔔 Glad booster Eric (+256768912846) account verified for instant payouts.',
    '🎁 7-Day Check-in bonus active: Claim up to 6,000 UGX daily reward.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-slate-800/80 border-y border-slate-700/60 px-3 py-1.5 flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
        <span className="text-[11px] uppercase tracking-wider">Notice</span>
      </div>
      <div className="overflow-hidden flex-1 relative h-5">
        <div
          key={currentIndex}
          className="truncate text-slate-300 font-medium transition-all duration-500 transform animate-in fade-in slide-in-from-bottom-2"
        >
          {announcements[currentIndex]}
        </div>
      </div>
      <button
        onClick={() => setActiveTab('MyWithdraw')}
        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center font-bold shrink-0"
      >
        Rules <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
