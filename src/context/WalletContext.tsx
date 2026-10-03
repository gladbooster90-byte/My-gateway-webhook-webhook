import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { soundEffects } from '../lib/soundEffects';
import {
  UserAccount,
  WithdrawalRecord,
  TransactionBill,
  VipPlan,
  AiTask,
  TeamMember,
} from '../types';

const INITIAL_USER: UserAccount = {
  name: 'Glad booster Eric',
  momoNumber: '+256768912846',
  network: 'MTN',
  vipLevel: 1,
  vipName: 'VIP 1 (Single Deluxe)',
  isVipActive: true,
  totalBalance: 0,
  withdrawableEarnings: 0,
  depositedAmount: 0,
  totalWithdrawn: 0,
  aiIncome: 0,
  todayEarnings: 0,
  inviteCount: 0,
  teamCount: 0,
  teamIncome: 0,
  referralCode: 'UGX89128',
  luckySpins: 3,
  dailyRewardStreak: 0,
  lastRewardClaimDate: null,
  vipDaysElapsed: 0,
  vipTotalDays: 100,
};

export const VIP_PLANS: VipPlan[] = [
  {
    id: 1,
    name: 'VIP 1',
    suiteTitle: 'Single Deluxe Suite',
    price: 20000,
    dailyIncome: 5000,
    taskCount: 2,
    validityDays: 100,
    color: 'from-amber-500 to-yellow-600',
    badge: 'Starter',
  },
  {
    id: 2,
    name: 'VIP 2',
    suiteTitle: 'Queen Comfort Bedding',
    price: 30000,
    dailyIncome: 7500,
    taskCount: 3,
    validityDays: 100,
    popular: true,
    color: 'from-blue-500 to-cyan-600',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'VIP 3',
    suiteTitle: 'King Imperial Luxury',
    price: 50000,
    dailyIncome: 15000,
    taskCount: 4,
    validityDays: 100,
    color: 'from-purple-500 to-indigo-600',
    badge: 'Hot',
  },
  {
    id: 4,
    name: 'VIP 4',
    suiteTitle: 'Emperor Royal Silk',
    price: 75000,
    dailyIncome: 20000,
    taskCount: 5,
    validityDays: 100,
    color: 'from-emerald-500 to-teal-600',
    badge: 'High Yield',
  },
  {
    id: 5,
    name: 'VIP 5',
    suiteTitle: 'Grand Presidential Bedding',
    price: 100000,
    dailyIncome: 30000,
    taskCount: 6,
    validityDays: 100,
    color: 'from-rose-500 to-pink-600',
    badge: 'Pro Suite',
  },
  {
    id: 6,
    name: 'VIP 6',
    suiteTitle: 'Palace Sovereign Suite',
    price: 200000,
    dailyIncome: 55000,
    taskCount: 8,
    validityDays: 100,
    color: 'from-amber-600 to-orange-600',
    badge: 'VIP Premier',
  },
  {
    id: 7,
    name: 'VIP 7',
    suiteTitle: 'Crown Dynasty Suite',
    price: 500000,
    dailyIncome: 85000,
    taskCount: 10,
    validityDays: 100,
    color: 'from-violet-600 to-purple-800',
    badge: 'Executive',
  },
  {
    id: 8,
    name: 'VIP 8',
    suiteTitle: 'Bespoke Diamond Mansion',
    price: 1000000,
    dailyIncome: 170000,
    taskCount: 12,
    validityDays: 100,
    color: 'from-yellow-400 to-amber-600',
    badge: 'Master',
  },
  {
    id: 9,
    name: 'VIP 9',
    suiteTitle: 'Infinity Sovereign Palace',
    price: 2000000,
    dailyIncome: 350000,
    taskCount: 15,
    validityDays: 100,
    color: 'from-cyan-400 to-blue-600',
    badge: 'Ultimate',
  },
];

const INITIAL_TASKS: AiTask[] = [
  {
    id: 'task-1',
    name: 'Gemini NLP Token Validation',
    algorithm: 'BERT-Large Cross-Attention',
    rewardUgx: 900,
    durationSeconds: 15,
    status: 'idle',
    progress: 0,
    vipRequired: 1,
  },
  {
    id: 'task-2',
    name: 'Neural Image Synthesis Batch',
    algorithm: 'Diffusion Tensor Quantization',
    rewardUgx: 900,
    durationSeconds: 20,
    status: 'idle',
    progress: 0,
    vipRequired: 1,
  },
  {
    id: 'task-3',
    name: 'Autonomous High-Frequency Trading Bot',
    algorithm: 'Reinforcement Learning Alpha-6',
    rewardUgx: 2600,
    durationSeconds: 30,
    status: 'idle',
    progress: 0,
    vipRequired: 2,
  },
  {
    id: 'task-4',
    name: 'Quantum Cryptographic Verification Node',
    algorithm: 'Post-Quantum Lattice Zero-Knowledge',
    rewardUgx: 7250,
    durationSeconds: 45,
    status: 'idle',
    progress: 0,
    vipRequired: 3,
  },
];

const INITIAL_RECORDS: WithdrawalRecord[] = [];

const INITIAL_BILLS: TransactionBill[] = [];

interface WalletContextType {
  user: UserAccount;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  updateUserProfileInfo: (updates: { name?: string; momoNumber?: string; network?: 'MTN' | 'AIRTEL' }) => Promise<{ success: boolean; message: string }>;
  withdrawalRecords: WithdrawalRecord[];
  transactionBills: TransactionBill[];
  aiTasks: AiTask[];
  teamMembers: TeamMember[];
  requestWithdrawal: (amount: number) => { success: boolean; message: string };
  depositMoney: (amount: number, network: 'MTN' | 'AIRTEL', senderNumber: string) => void;
  startAiTask: (taskId: string) => void;
  claimAiTask: (taskId: string) => void;
  spinRaffleWheel: () => { prizeIndex: number; reward: number; label: string };
  claimDailyRewardStreak: () => { success: boolean; reward: number; message: string };
  upgradeVip: (plan: VipPlan) => { success: boolean; message: string };
  simulateApproveWithdrawal: (recordId: string) => void;
  simulateRejectWithdrawal: (recordId: string, reason?: string) => void;
  addInviteSimulation: () => void;
  resetAllAccountsToZero: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubModal: string | null;
  setActiveSubModal: (modal: string | null) => void;
  isWithinWithdrawalHours: () => boolean;
  soundEnabled: boolean;
  toggleSound: () => boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [user, setUser] = useState<UserAccount>(() => {
    const hasZeroReset = localStorage.getItem('ugx_zero_balance_migrated_v2');
    const saved = localStorage.getItem('ugx_wallet_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!hasZeroReset) {
          localStorage.setItem('ugx_zero_balance_migrated_v2', 'true');
          return {
            ...parsed,
            totalBalance: 0,
            withdrawableEarnings: 0,
            depositedAmount: 0,
            totalWithdrawn: 0,
            aiIncome: 0,
            todayEarnings: 0,
            teamIncome: 0,
          };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('ugx_zero_balance_migrated_v2', 'true');
    return INITIAL_USER;
  });

  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>(() => {
    const hasZeroReset = localStorage.getItem('ugx_zero_balance_migrated_v2');
    if (!hasZeroReset) {
      localStorage.removeItem('ugx_withdrawal_records');
      return [];
    }
    const saved = localStorage.getItem('ugx_withdrawal_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RECORDS;
  });

  const [transactionBills, setTransactionBills] = useState<TransactionBill[]>(() => {
    const hasZeroReset = localStorage.getItem('ugx_zero_balance_migrated_v2');
    if (!hasZeroReset) {
      localStorage.removeItem('ugx_transaction_bills');
      return [];
    }
    const saved = localStorage.getItem('ugx_transaction_bills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BILLS;
  });

  const [aiTasks, setAiTasks] = useState<AiTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEffects.isEnabled());

  const toggleSound = useCallback(() => {
    const next = soundEffects.toggle();
    setSoundEnabled(next);
    return next;
  }, []);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Sync helper to update Firestore in real-time
  const syncUserToFirestore = useCallback(
    async (updatedUser: UserAccount, _bill?: TransactionBill) => {
      try {
        const uid = firebaseUser?.uid || auth.currentUser?.uid;
        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          await setDoc(
            userDocRef,
            {
              ...updatedUser,
              uid,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (err) {
        console.error('Real-time Firestore sync error:', err);
      }
    },
    [firebaseUser]
  );

  // Listen to Firebase Auth state & attach real-time Firestore listener
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthLoading(false);

      if (fbUser) {
        // Fetch or create Firestore user profile and subscribe to real-time updates
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);

          unsubscribeSnapshot = onSnapshot(
            userDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data() as UserAccount & { zeroBalanceEnforced?: boolean };

                // If Firestore user doc has non-zero legacy balance and hasn't been zero-migrated:
                if (
                  !data.zeroBalanceEnforced &&
                  (data.totalBalance !== 0 ||
                    data.withdrawableEarnings !== 0 ||
                    data.depositedAmount !== 0 ||
                    data.todayEarnings !== 0 ||
                    data.aiIncome !== 0)
                ) {
                  const zeroedData = {
                    totalBalance: 0,
                    withdrawableEarnings: 0,
                    depositedAmount: 0,
                    totalWithdrawn: 0,
                    aiIncome: 0,
                    todayEarnings: 0,
                    teamIncome: 0,
                    zeroBalanceEnforced: true,
                    updatedAt: serverTimestamp(),
                  };
                  setDoc(userDocRef, zeroedData, { merge: true }).catch(console.error);
                  setUser((prev) => ({
                    ...prev,
                    ...data,
                    ...zeroedData,
                    uid: fbUser.uid,
                  }));
                  return;
                }

                setUser((prev) => {
                  if (
                    prev.totalBalance !== data.totalBalance ||
                    prev.withdrawableEarnings !== data.withdrawableEarnings ||
                    prev.todayEarnings !== data.todayEarnings ||
                    prev.aiIncome !== data.aiIncome ||
                    prev.luckySpins !== data.luckySpins ||
                    prev.vipLevel !== data.vipLevel ||
                    prev.depositedAmount !== data.depositedAmount ||
                    prev.name !== data.name ||
                    prev.momoNumber !== data.momoNumber
                  ) {
                    return {
                      ...prev,
                      ...data,
                      uid: fbUser.uid,
                      email: fbUser.email || prev.email,
                      photoURL: fbUser.photoURL || prev.photoURL,
                    };
                  }
                  return prev;
                });
              } else {
                // Seed new user in Firestore with 0.00 balances
                const initialDoc: UserAccount & { zeroBalanceEnforced: boolean } = {
                  ...user,
                  uid: fbUser.uid,
                  name: fbUser.displayName || user.name,
                  email: fbUser.email || undefined,
                  photoURL: fbUser.photoURL || undefined,
                  totalBalance: 0,
                  withdrawableEarnings: 0,
                  depositedAmount: 0,
                  totalWithdrawn: 0,
                  aiIncome: 0,
                  todayEarnings: 0,
                  teamIncome: 0,
                  zeroBalanceEnforced: true,
                };
                setDoc(userDocRef, initialDoc, { merge: true }).catch(console.error);
                setUser(initialDoc);
              }
            },
            (err) => {
              console.error('Firestore real-time subscription error:', err);
            }
          );
        } catch (err) {
          console.error('Firestore init error:', err);
        }
      } else {
        // Sign in anonymously so every user session gets a real-time Firestore sync channel
        signInAnonymously(auth).catch((err) => {
          console.log('Anonymous auth not enabled or failed:', err);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Sync state to local storage & Firestore if logged in
  useEffect(() => {
    localStorage.setItem('ugx_wallet_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ugx_withdrawal_records', JSON.stringify(withdrawalRecords));
  }, [withdrawalRecords]);

  useEffect(() => {
    localStorage.setItem('ugx_transaction_bills', JSON.stringify(transactionBills));
  }, [transactionBills]);

  // Google Sign-in
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign out
  const signOutFirebase = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Update Personal Info (Full Name & MoMo Number)
  const updateUserProfileInfo = async (updates: {
    name?: string;
    momoNumber?: string;
    network?: 'MTN' | 'AIRTEL';
  }) => {
    const updated: UserAccount = {
      ...user,
      name: updates.name || user.name,
      momoNumber: updates.momoNumber || user.momoNumber,
      network: updates.network || user.network,
    };

    setUser(updated);
    syncUserToFirestore(updated);

    return { success: true, message: 'Personal profile and MoMo details updated successfully!' };
  };

  // AI Task progress simulation timer
  useEffect(() => {
    const runningTasks = aiTasks.filter((t) => t.status === 'running');
    if (runningTasks.length === 0) return;

    const interval = setInterval(() => {
      setAiTasks((prev) =>
        prev.map((task) => {
          if (task.status !== 'running') return task;
          const step = 100 / (task.durationSeconds * 2);
          const newProgress = Math.min(100, task.progress + step);
          if (newProgress >= 100) {
            soundEffects.playTaskComplete();
            return { ...task, progress: 100, status: 'completed' };
          }
          return { ...task, progress: newProgress };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [aiTasks]);

  // Check withdrawal hours: Available Sun-Sat 09:00 - 20:00
  const isWithinWithdrawalHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 20;
  };

  // 1. Request Withdrawal Handler
  const requestWithdrawal = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) {
      return { success: false, message: 'Please enter a valid withdrawal amount.' };
    }

    if (!user.isVipActive) {
      return {
        success: false,
        message: 'Deposited money cannot be withdrawn — only your earnings. You must own an active VIP plan.',
      };
    }

    if (amount > user.withdrawableEarnings) {
      return {
        success: false,
        message: `Insufficient withdrawable earnings. Available: ${user.withdrawableEarnings.toLocaleString()} UGX`,
      };
    }

    if (amount < 3000) {
      return {
        success: false,
        message: 'Minimum withdrawal amount is 3,000 UGX.',
      };
    }

    const fee = Math.round(amount * 0.15); // 15% charge
    const arrivalAmount = amount - fee;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const newRecordId = `WD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: WithdrawalRecord = {
      id: newRecordId,
      amount,
      fee,
      arrivalAmount,
      status: 'pending',
      createdAt: formattedDate,
      momoNumber: user.momoNumber,
      recipientName: user.name,
      txId: `MM-PENDING-${Date.now().toString().slice(-6)}`,
      note: 'Awaiting admin gateway approval (15% charge applied)',
    };

    const newBill: TransactionBill = {
      id: `BILL-${Date.now().toString().slice(-6)}`,
      type: 'withdrawal',
      title: `MoMo Cashout Request (${user.momoNumber})`,
      amount: amount,
      direction: 'out',
      status: 'pending',
      timestamp: formattedDate,
      description: `Held for admin review. Net payout: ${arrivalAmount.toLocaleString()} UGX (15% charge: ${fee.toLocaleString()} UGX)`,
      referenceId: newRecordId,
    };

    const updatedUser: UserAccount = {
      ...user,
      totalBalance: Math.max(0, user.totalBalance - amount),
      withdrawableEarnings: Math.max(0, user.withdrawableEarnings - amount),
    };

    setUser(updatedUser);
    syncUserToFirestore(updatedUser, newBill);

    setWithdrawalRecords((prev) => [newRecord, ...prev]);
    setTransactionBills((prev) => [newBill, ...prev]);

    // Trigger celebratory confetti for successful request
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6'],
    });

    // Auto simulate progress from pending -> processing -> completed
    setTimeout(() => {
      setWithdrawalRecords((records) =>
        records.map((r) =>
          r.id === newRecordId ? { ...r, status: 'processing', note: 'MoMo Switch Dispatching...' } : r
        )
      );
    }, 6000);

    return {
      success: true,
      message: `Withdrawal of ${amount.toLocaleString()} UGX submitted! 15% charge (${fee.toLocaleString()} UGX) applied. Net payout: ${arrivalAmount.toLocaleString()} UGX will arrive at ${user.momoNumber}.`,
    };
  };

  // 2. Deposit Simulation
  const depositMoney = (amount: number, network: 'MTN' | 'AIRTEL', senderNumber: string) => {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const billId = `DEP-${Date.now().toString().slice(-6)}`;

    const newBill: TransactionBill = {
      id: billId,
      type: 'deposit',
      title: `${network} Mobile Money Deposit`,
      amount,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: `Received from ${senderNumber}. Ref: UGX-MM-${Date.now().toString().slice(-8)}`,
    };

    const updatedUser: UserAccount = {
      ...user,
      totalBalance: user.totalBalance + amount,
      depositedAmount: user.depositedAmount + amount,
    };

    setUser(updatedUser);
    syncUserToFirestore(updatedUser, newBill);

    setTransactionBills((prev) => [newBill, ...prev]);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // 3. AI Tasks
  const startAiTask = (taskId: string) => {
    setAiTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'running', progress: 0 } : t))
    );
  };

  const claimAiTask = (taskId: string) => {
    const task = aiTasks.find((t) => t.id === taskId);
    if (!task || task.status !== 'completed') return;

    const reward = task.rewardUgx;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newBill: TransactionBill = {
      id: `AI-${Date.now().toString().slice(-6)}`,
      type: 'ai_income',
      title: `AI Compute Reward: ${task.name}`,
      amount: reward,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: `${task.algorithm} execution finalized`,
    };

    const updatedUser: UserAccount = {
      ...user,
      totalBalance: user.totalBalance + reward,
      withdrawableEarnings: user.withdrawableEarnings + reward,
      aiIncome: user.aiIncome + reward,
      todayEarnings: user.todayEarnings + reward,
    };

    // Update local state and instantly sync real-time to Firestore
    setUser(updatedUser);
    syncUserToFirestore(updatedUser, newBill);

    setAiTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'claimed' } : t))
    );

    setTransactionBills((prev) => [newBill, ...prev]);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981'],
    });

    soundEffects.playChaChing();
  };

  // 4. Lucky Spin Raffle
  const spinRaffleWheel = () => {
    if (user.luckySpins <= 0) {
      return { prizeIndex: 0, reward: 0, label: 'No spins left' };
    }

    const prizes = [
      { reward: 500, label: '500 UGX' },
      { reward: 1500, label: '1,500 UGX' },
      { reward: 3000, label: '3,000 UGX' },
      { reward: 10000, label: '10,000 UGX' },
      { reward: 800, label: '800 UGX' },
      { reward: 5000, label: '5,000 UGX' },
      { reward: 2000, label: '2,000 UGX' },
      { reward: 25000, label: '25,000 UGX JACKPOT' },
    ];

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const chosen = prizes[randomIndex];

    const updatedUser: UserAccount = {
      ...user,
      luckySpins: Math.max(0, user.luckySpins - 1),
      totalBalance: user.totalBalance + chosen.reward,
      withdrawableEarnings: user.withdrawableEarnings + chosen.reward,
      todayEarnings: user.todayEarnings + chosen.reward,
    };

    // Update local state and instantly sync real-time to Firestore
    setUser(updatedUser);

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newBill: TransactionBill = {
      id: `RAF-${Date.now().toString().slice(-6)}`,
      type: 'raffle_win',
      title: 'Lucky Raffle Wheel Win',
      amount: chosen.reward,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: `Spun the VIP Fortune Wheel and won ${chosen.label}!`,
    };

    syncUserToFirestore(updatedUser, newBill);
    setTransactionBills((prev) => [newBill, ...prev]);

    return { prizeIndex: randomIndex, reward: chosen.reward, label: chosen.label };
  };

  // 5. Claim Daily Reward
  const claimDailyRewardStreak = () => {
    const today = new Date().toDateString();
    if (user.lastRewardClaimDate === today) {
      return { success: false, reward: 0, message: 'You have already claimed today’s reward! Come back tomorrow.' };
    }

    const nextStreak = (user.dailyRewardStreak % 7) + 1;
    const rewards = [500, 800, 1200, 1800, 2500, 3500, 6000];
    const reward = rewards[nextStreak - 1] || 1000;

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newBill: TransactionBill = {
      id: `REW-${Date.now().toString().slice(-6)}`,
      type: 'daily_reward',
      title: `Day ${nextStreak} Login Reward`,
      amount: reward,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: 'Consecutive check-in streak reward',
    };

    const updatedUser: UserAccount = {
      ...user,
      totalBalance: user.totalBalance + reward,
      withdrawableEarnings: user.withdrawableEarnings + reward,
      todayEarnings: user.todayEarnings + reward,
      dailyRewardStreak: nextStreak,
      lastRewardClaimDate: today,
      luckySpins: user.luckySpins + 1,
    };

    setUser(updatedUser);
    syncUserToFirestore(updatedUser, newBill);

    setTransactionBills((prev) => [newBill, ...prev]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    soundEffects.playChaChing();

    return {
      success: true,
      reward,
      message: `Congratulations! Claimed Day ${nextStreak} reward of ${reward.toLocaleString()} UGX + 1 Free Lucky Spin!`,
    };
  };

  // 6. Upgrade VIP
  const upgradeVip = (plan: VipPlan) => {
    if (user.totalBalance < plan.price) {
      return {
        success: false,
        message: `Insufficient balance (${user.totalBalance.toLocaleString()} UGX). Please deposit ${(plan.price - user.totalBalance).toLocaleString()} UGX first.`,
      };
    }

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newBill: TransactionBill = {
      id: `VIP-${Date.now().toString().slice(-6)}`,
      type: 'vip_purchase',
      title: `VIP Plan Activation: ${plan.name}`,
      amount: plan.price,
      direction: 'out',
      status: 'success',
      timestamp: formattedDate,
      description: `Activated ${plan.name} with ${plan.dailyIncome.toLocaleString()} UGX daily return for ${plan.validityDays} days.`,
    };

    const updatedUser: UserAccount = {
      ...user,
      totalBalance: user.totalBalance - plan.price,
      vipLevel: Math.max(user.vipLevel, plan.id),
      vipName: plan.name,
      isVipActive: true,
      vipDaysElapsed: 1,
      vipTotalDays: plan.validityDays,
      luckySpins: user.luckySpins + 3,
    };

    setUser(updatedUser);
    syncUserToFirestore(updatedUser, newBill);

    setTransactionBills((prev) => [newBill, ...prev]);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    return {
      success: true,
      message: `Successfully activated ${plan.name}! Daily tasks unlocked.`,
    };
  };

  // 7. Simulation: Approve or complete withdrawal
  const simulateApproveWithdrawal = (recordId: string) => {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    setWithdrawalRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            status: 'completed',
            completedAt: formattedDate,
            txId: `MTN-DISPATCH-${Date.now().toString().slice(-8)}`,
            note: `Approved by MoMo admin. Funds sent to ${user.momoNumber}`,
          };
        }
        return r;
      })
    );

    setTransactionBills((prev) =>
      prev.map((b) => {
        if (b.referenceId === recordId) {
          return {
            ...b,
            status: 'success',
            description: 'Payment completed via MTN MoMo Gateway.',
          };
        }
        return b;
      })
    );

    setUser((prev) => {
      const record = withdrawalRecords.find((r) => r.id === recordId);
      if (record) {
        return {
          ...prev,
          totalWithdrawn: prev.totalWithdrawn + record.amount,
        };
      }
      return prev;
    });
  };

  // 8. Simulation: Reject withdrawal & refund
  const simulateRejectWithdrawal = (recordId: string, reason = 'MoMo Account verification error') => {
    const record = withdrawalRecords.find((r) => r.id === recordId);
    if (!record || record.status === 'completed' || record.status === 'rejected') return;

    setWithdrawalRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'rejected', note: `Rejected: ${reason}. Amount refunded.` } : r))
    );

    // Refund held amount
    const updatedUser: UserAccount = {
      ...user,
      totalBalance: user.totalBalance + record.amount,
      withdrawableEarnings: user.withdrawableEarnings + record.amount,
    };
    setUser(updatedUser);

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const refundBill: TransactionBill = {
      id: `REF-${Date.now().toString().slice(-6)}`,
      type: 'withdrawal_refund',
      title: 'Withdrawal Refund',
      amount: record.amount,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: `Refund for rejected withdrawal (${recordId}): ${reason}`,
    };

    syncUserToFirestore(updatedUser, refundBill);
    setTransactionBills((prev) => [refundBill, ...prev]);
  };

  // 9. Simulate new team invite
  const addInviteSimulation = () => {
    const names = ['Tumwesigye Alex', 'Akello Brenda', 'Ochola Emmanuel', 'Namaganda Grace', 'Kizza Patrick'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDeposit = [30000, 80000, 200000][Math.floor(Math.random() * 3)];
    const commission = Math.round(randomDeposit * 0.20); // 20% L1 commission

    const newMember: TeamMember = {
      id: `TM-${Date.now().toString().slice(-4)}`,
      name: randomName,
      momoMasked: `+2567${Math.floor(10 + Math.random() * 89)}****${Math.floor(100 + Math.random() * 899)}`,
      level: 1,
      joinDate: new Date().toISOString().substring(0, 10),
      depositUgx: randomDeposit,
      commissionUgx: commission,
      vipStatus: randomDeposit >= 80000 ? 'VIP 2' : 'VIP 1',
    };

    setTeamMembers((prev) => [newMember, ...prev]);

    const updatedUser: UserAccount = {
      ...user,
      inviteCount: user.inviteCount + 1,
      teamCount: user.teamCount + 1,
      teamIncome: user.teamIncome + commission,
      totalBalance: user.totalBalance + commission,
      withdrawableEarnings: user.withdrawableEarnings + commission,
      todayEarnings: user.todayEarnings + commission,
      luckySpins: user.luckySpins + 1,
    };

    setUser(updatedUser);

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newBill: TransactionBill = {
      id: `COMM-${Date.now().toString().slice(-6)}`,
      type: 'team_commission',
      title: `Referral Commission (20%): ${randomName}`,
      amount: commission,
      direction: 'in',
      status: 'success',
      timestamp: formattedDate,
      description: `Team invite deposit reward of ${randomDeposit.toLocaleString()} UGX`,
    };

    syncUserToFirestore(updatedUser, newBill);
    setTransactionBills((prev) => [newBill, ...prev]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const resetAllAccountsToZero = useCallback(async () => {
    const updated: UserAccount = {
      ...user,
      totalBalance: 0,
      withdrawableEarnings: 0,
      depositedAmount: 0,
      totalWithdrawn: 0,
      aiIncome: 0,
      todayEarnings: 0,
      teamIncome: 0,
    };
    setUser(updated);
    localStorage.setItem('ugx_wallet_user', JSON.stringify(updated));
    localStorage.setItem('ugx_zero_balance_migrated_v2', 'true');
    setWithdrawalRecords([]);
    setTransactionBills([]);
    setTeamMembers([]);
    localStorage.removeItem('ugx_withdrawal_records');
    localStorage.removeItem('ugx_transaction_bills');

    const uid = firebaseUser?.uid || auth.currentUser?.uid;
    if (uid) {
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(
          userDocRef,
          {
            totalBalance: 0,
            withdrawableEarnings: 0,
            depositedAmount: 0,
            totalWithdrawn: 0,
            aiIncome: 0,
            todayEarnings: 0,
            teamIncome: 0,
            zeroBalanceEnforced: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to reset Firestore user balance:', err);
      }
    }
  }, [user, firebaseUser]);

  return (
    <WalletContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthLoading,
        signInWithGoogle,
        signOutFirebase,
        updateUserProfileInfo,
        withdrawalRecords,
        transactionBills,
        aiTasks,
        teamMembers,
        requestWithdrawal,
        depositMoney,
        startAiTask,
        claimAiTask,
        spinRaffleWheel,
        claimDailyRewardStreak,
        upgradeVip,
        simulateApproveWithdrawal,
        simulateRejectWithdrawal,
        addInviteSimulation,
        resetAllAccountsToZero,
        activeTab,
        setActiveTab,
        activeSubModal,
        setActiveSubModal,
        isWithinWithdrawalHours,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
