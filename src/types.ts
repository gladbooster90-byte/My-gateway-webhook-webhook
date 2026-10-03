export interface UserAccount {
  uid?: string;
  email?: string;
  photoURL?: string;
  name: string;
  momoNumber: string;
  network: 'MTN' | 'AIRTEL';
  vipLevel: number;
  vipName: string;
  isVipActive: boolean;
  totalBalance: number;
  withdrawableEarnings: number;
  depositedAmount: number;
  totalWithdrawn: number;
  aiIncome: number;
  todayEarnings: number;
  inviteCount: number;
  teamCount: number;
  teamIncome: number;
  referralCode: string;
  luckySpins: number;
  dailyRewardStreak: number;
  lastRewardClaimDate: string | null;
  vipDaysElapsed?: number;
  vipTotalDays?: number;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface WithdrawalRecord {
  id: string;
  amount: number;
  fee: number;
  arrivalAmount: number;
  status: WithdrawalStatus;
  createdAt: string;
  completedAt?: string;
  momoNumber: string;
  recipientName: string;
  txId: string;
  note?: string;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'withdrawal_fee'
  | 'withdrawal_refund'
  | 'ai_income'
  | 'team_commission'
  | 'raffle_win'
  | 'daily_reward'
  | 'vip_purchase';

export interface TransactionBill {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  direction: 'in' | 'out';
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  description: string;
  referenceId?: string;
}

export interface VipPlan {
  id: number;
  name: string;
  suiteTitle?: string;
  price: number;
  dailyIncome: number;
  taskCount: number;
  validityDays: number;
  popular?: boolean;
  color: string;
  badge: string;
}

export interface AiTask {
  id: string;
  name: string;
  algorithm: string;
  rewardUgx: number;
  durationSeconds: number;
  status: 'idle' | 'running' | 'completed' | 'claimed';
  progress: number;
  vipRequired: number;
}

export interface TeamMember {
  id: string;
  name: string;
  momoMasked: string;
  level: 1 | 2 | 3;
  joinDate: string;
  depositUgx: number;
  commissionUgx: number;
  vipStatus: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}
