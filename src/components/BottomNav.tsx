import React from 'react';
import { motion } from 'motion/react';
import { Home, Sparkles, MessageSquareText, Cpu, TrendingUp, WalletCards, HelpCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user, aiTasks } = useWallet();

  const claimableTasks = aiTasks.filter((t) => t.status === 'completed').length;

  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Raffle', label: 'Raffle', icon: Sparkles, badge: user.luckySpins > 0 ? user.luckySpins : undefined },
    { id: 'chats', label: 'Chats', icon: MessageSquareText },
    { id: 'AI', label: 'AI', icon: Cpu, badge: claimableTasks > 0 ? claimableTasks : undefined },
    { id: 'Income', label: 'Income', icon: TrendingUp },
    { id: 'FAQ', label: 'FAQ', icon: HelpCircle },
    { id: 'Wallet', label: 'Wallet', icon: WalletCards },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-1 py-1.5 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-7 items-center gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (item.id === 'Wallet' && activeTab === 'MyWithdraw');

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-3.5 h-3.5 flex items-center justify-center text-[9px] font-black text-slate-950 bg-amber-400 rounded-full ring-2 ring-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9.5px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-sm shadow-amber-400/80"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
