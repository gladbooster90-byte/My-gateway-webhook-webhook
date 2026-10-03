import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Clock,
  Crown,
  Wallet,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquareText,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useWallet, VIP_PLANS } from '../../context/WalletContext';

interface FaqItem {
  id: string;
  category: 'general' | 'vip' | 'withdrawals' | 'referrals' | 'security';
  question: string;
  answer: string;
  highlights?: string[];
  importantNotice?: string;
  actionText?: string;
  actionTarget?: 'vip_modal' | 'deposit_modal' | 'withdraw_tab' | 'chat_tab' | 'team_tab';
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is International Beddings & how does the platform work?',
    answer:
      'International Beddings is a premier smart investment platform where users invest in luxury bedding manufacturing & hospitality suites to earn fixed daily cash returns for a 100-day contract cycle. Daily profits are credited to your balance and can be withdrawn directly to MTN Mobile Money or Airtel Money.',
    highlights: [
      'Invest in high-yield VIP bedding contracts for 100 days.',
      'Daily returns credited automatically every 24 hours at 00:00 EAT.',
      'Instant mobile money cashouts directly to your registered Uganda phone number.',
    ],
  },
  {
    id: 'faq-2',
    category: 'vip',
    question: 'What are the VIP tiers, investment costs, and daily returns?',
    answer:
      'The platform features 9 investment tiers ranging from VIP 1 (20,000 UGX) to VIP 9 (2,000,000 UGX). All tiers run on a 100-day contract period offering extraordinary capital growth up to 25X ROI.',
    highlights: [
      'VIP 1: Invest 20,000 UGX → Earn 5,000 UGX/day (500,000 UGX Total / 100 Days)',
      'VIP 2: Invest 30,000 UGX → Earn 7,500 UGX/day (750,000 UGX Total / 100 Days)',
      'VIP 3: Invest 50,000 UGX → Earn 15,000 UGX/day (1,500,000 UGX Total / 100 Days)',
      'VIP 4: Invest 75,000 UGX → Earn 20,000 UGX/day (2,000,000 UGX Total / 100 Days)',
      'VIP 5: Invest 100,000 UGX → Earn 30,000 UGX/day (3,000,000 UGX Total / 100 Days)',
      'VIP 6: Invest 200,000 UGX → Earn 55,000 UGX/day (5,500,000 UGX Total / 100 Days)',
      'VIP 7: Invest 500,000 UGX → Earn 85,000 UGX/day (8,500,000 UGX Total / 100 Days)',
      'VIP 8: Invest 1,000,000 UGX → Earn 170,000 UGX/day (17,000,000 UGX Total / 100 Days)',
      'VIP 9: Invest 2,000,000 UGX → Earn 350,000 UGX/day (35,000,000 UGX Total / 100 Days)',
    ],
    actionText: 'View VIP Suites & Upgrade',
    actionTarget: 'vip_modal',
  },
  {
    id: 'faq-3',
    category: 'withdrawals',
    question: 'What are the withdrawal hours and processing times?',
    answer:
      'Withdrawals are processed every day from Monday to Sunday between 09:00 AM and 08:00 PM (EAT Uganda Time). Requests submitted during business hours are typically dispatched to your MTN MoMo or Airtel Money wallet within 5 to 30 minutes.',
    highlights: [
      'Operating Window: 09:00 – 20:00 (EAT) every day.',
      'Average payout speed: 5 – 30 minutes.',
      'Requests made after 20:00 are queued for first-priority batch execution the next morning at 09:00.',
    ],
    importantNotice:
      'Ensure your registered name matches your registered MTN/Airtel SIM card to avoid gateway verification delays.',
    actionText: 'Go to Cashout Hub',
    actionTarget: 'withdraw_tab',
  },
  {
    id: 'faq-4',
    category: 'withdrawals',
    question: 'What is the withdrawal fee and minimum withdrawal threshold?',
    answer:
      'A standard 15% network and administration charge is applied to each withdrawal. The minimum withdrawal threshold is 5,000 UGX, and the maximum daily withdrawal limit is 5,000,000 UGX.',
    highlights: [
      'Withdrawal Fee: Flat 15% charge across MTN & Airtel.',
      'Minimum Cashout: 5,000 UGX per request.',
      'Maximum Cashout: 5,000,000 UGX per day.',
      'Net calculation: For a 20,000 UGX withdrawal, fee is 3,000 UGX and net arrival is 17,000 UGX.',
    ],
  },
  {
    id: 'faq-5',
    category: 'withdrawals',
    question: 'Why does it say "No Withdraw Without Deposit"?',
    answer:
      'To maintain liquidity security and prevent fraudulent bots, the system requires an active VIP investment deposit before cashouts are enabled. Once you activate any VIP suite starting from VIP 1 (20,000 UGX), full withdrawal access is permanently unlocked.',
    importantNotice:
      'Deposited principal capital is locked into computing contracts to generate daily yields. All daily returns, bonuses, and commissions are 100% withdrawable.',
    actionText: 'Deposit & Activate VIP',
    actionTarget: 'deposit_modal',
  },
  {
    id: 'faq-6',
    category: 'referrals',
    question: 'How does the 3-Tier Referral Commission system work?',
    answer:
      'You can earn passive income by inviting partners using your unique invitation code or referral link. Commissions are paid out across three descending tiers and credited instantly to your withdrawable balance.',
    highlights: [
      'Level 1 (Direct Referrals): 20% commission on every VIP activation.',
      'Level 2 (Sub-referrals): 2% commission when your direct invite brings a friend.',
      'Level 3 (Tier 3 Referrals): 1% commission on third-degree activations.',
      'Example: When your direct invite buys VIP 5 (100,000 UGX), you immediately receive 20,000 UGX cash bonus!',
    ],
    actionText: 'View My Team & Referral Link',
    actionTarget: 'team_tab',
  },
  {
    id: 'faq-7',
    category: 'general',
    question: 'How do I claim the 5,000 UGX Welcome Bonus & 200 UGX Daily Check-in?',
    answer:
      'Every new member is credited with a 5,000 UGX Welcome Bonus upon registration. Additionally, navigate to the Daily Reward section every 24 hours to claim a free 200 UGX daily check-in bonus plus free lucky wheel spins.',
    highlights: [
      'Welcome Bonus: 5,000 UGX credited on first login.',
      'Daily Check-in: +200 UGX credited daily.',
      'Streak Rewards: Maintain a 7-day login streak for bonus spin multipliers.',
    ],
  },
  {
    id: 'faq-8',
    category: 'vip',
    question: 'When is the break-even point for VIP 1?',
    answer:
      'For VIP 1 (20,000 UGX investment), you earn 5,000 UGX every day. You reach complete 100% break-even on Day 4 (20,000 UGX returned). The remaining 96 days provide 480,000 UGX of pure net profit.',
    highlights: [
      'Day 1 to 4: Capital recovery window (20,000 UGX back).',
      'Day 5 to 100: Pure profit window (+480,000 UGX pure gain).',
      'Total Return: 500,000 UGX (2,500% Total Return on Investment).',
    ],
  },
  {
    id: 'faq-9',
    category: 'security',
    question: 'Is my mobile money deposit and account data safe?',
    answer:
      'All transactions are processed through authenticated mobile money API gateways with end-to-end PIN encryption on MTN MoMo and Airtel Money. Your personal account data and transaction logs are securely synced to the Cloud database.',
    highlights: [
      'Direct carrier billing integration with MTN MoMo & Airtel Money.',
      'Server-side cryptographic transaction references (TXID) for every record.',
      'Dedicated 24/7 audit monitoring on all cash inflows and outflows.',
    ],
  },
  {
    id: 'faq-10',
    category: 'security',
    question: 'How do I contact official customer support or join the community?',
    answer:
      'You can reach our dedicated support team 24/7 via the in-app Support Chat, or connect with our official community channels on Telegram and WhatsApp for real-time announcements, payment proofs, and promotions.',
    highlights: [
      'In-App Live Chat: Click the "chats" tab on the bottom bar.',
      'Telegram Channel: t.me/+QOxXNFzICatmNWE0',
      'WhatsApp Community: Official VIP announcement portal.',
    ],
    actionText: 'Open Live Support Chat',
    actionTarget: 'chat_tab',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: HelpCircle },
  { id: 'vip', label: 'VIP Tiers & ROI', icon: Crown },
  { id: 'withdrawals', label: 'Withdrawals & MoMo', icon: Wallet },
  { id: 'referrals', label: 'Referral 20%', icon: Users },
  { id: 'general', label: 'Platform Basics', icon: Sparkles },
  { id: 'security', label: 'Security & Help', icon: ShieldCheck },
] as const;

export const FAQView: React.FC = () => {
  const { setActiveTab, setActiveSubModal } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAction = (target?: FaqItem['actionTarget']) => {
    if (!target) return;
    if (target === 'vip_modal') {
      setActiveSubModal('vip_details');
    } else if (target === 'deposit_modal') {
      setActiveSubModal('deposit');
    } else if (target === 'withdraw_tab') {
      setActiveTab('MyWithdraw');
    } else if (target === 'chat_tab') {
      setActiveTab('chats');
    } else if (target === 'team_tab') {
      setActiveTab('Team');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 px-4 py-5">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-100">Help & FAQ Hub</h2>
                <p className="text-[11px] text-slate-400">Everything you need to know about earnings & cashouts</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              24/7 Verified
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. withdrawal fee, VIP 1, MoMo)..."
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500/60 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Quick Highlights Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-slate-400">Cashout Window</div>
            <div className="font-extrabold text-xs text-slate-100">09:00 - 20:00</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-slate-400">MoMo Charge</div>
            <div className="font-extrabold text-xs text-amber-400">Flat 15%</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 text-center space-y-1">
            <div className="w-6 h-6 mx-auto rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-slate-400">Referral L1</div>
            <div className="font-extrabold text-xs text-cyan-400">20% Bonus</div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-slate-300 font-bold text-sm">No matching questions found</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Try searching for terms like &quot;withdrawal&quot;, &quot;VIP 1&quot;, &quot;MoMo&quot;, or contact live support.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-slate-900 border transition-all rounded-2xl overflow-hidden ${
                    isExpanded
                      ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black ${
                          isExpanded
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Q
                      </div>
                      <h3
                        className={`text-xs font-bold leading-snug ${
                          isExpanded ? 'text-amber-300' : 'text-slate-200'
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
                      <p className="text-slate-300 leading-relaxed">{faq.answer}</p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                          {faq.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {faq.importantNotice && (
                        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2 text-amber-300">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{faq.importantNotice}</span>
                        </div>
                      )}

                      {faq.actionText && (
                        <div className="pt-1">
                          <button
                            onClick={() => handleAction(faq.actionTarget)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                          >
                            <span>{faq.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick VIP Reference Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Quick VIP Returns Matrix (100 Days)
            </h4>
            <button
              onClick={() => setActiveSubModal('vip_details')}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
            >
              Full Plans <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {VIP_PLANS.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[10px] border border-amber-500/30">
                    VIP {plan.id}
                  </span>
                  <span className="font-semibold text-slate-200">{plan.price.toLocaleString()} UGX</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">+{plan.dailyIncome.toLocaleString()} UGX</span>
                  <span className="text-[10px] text-slate-500 block">/ 24 hours</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need More Help / Direct Channels */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-100">Still have questions?</h4>
              <p className="text-[10px] text-slate-400">Our customer managers are available 24/7</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('chats')}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/30 transition-all"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Live Support</span>
            </button>

            <a
              href="https://t.me/+QOxXNFzICatmNWE0"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Group</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
