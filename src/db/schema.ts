// src/db/schema.ts
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users Table (Linked via Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email'),
  name: text('name').notNull().default('Investor'),
  momoNumber: text('momo_number').notNull().default('+256700000000'),
  network: text('network').notNull().default('MTN'),
  totalBalance: numeric('total_balance', { precision: 14, scale: 2 }).notNull().default('0.00'),
  depositedCapital: numeric('deposited_capital', { precision: 14, scale: 2 }).notNull().default('0.00'),
  withdrawableEarnings: numeric('withdrawable_earnings', { precision: 14, scale: 2 }).notNull().default('0.00'),
  todayEarnings: numeric('today_earnings', { precision: 14, scale: 2 }).notNull().default('0.00'),
  totalWithdrawn: numeric('total_withdrawn', { precision: 14, scale: 2 }).notNull().default('0.00'),
  aiIncome: numeric('ai_income', { precision: 14, scale: 2 }).notNull().default('0.00'),
  teamIncome: numeric('team_income', { precision: 14, scale: 2 }).notNull().default('0.00'),
  vipLevel: integer('vip_level').notNull().default(1),
  vipName: text('vip_name').notNull().default('VIP 1'),
  isVipActive: boolean('is_vip_active').notNull().default(true),
  vipDaysElapsed: integer('vip_days_elapsed').notNull().default(1),
  vipTotalDays: integer('vip_total_days').notNull().default(100),
  luckySpins: integer('lucky_spins').notNull().default(3),
  dailyRewardStreak: integer('daily_reward_streak').notNull().default(1),
  lastRewardClaimDate: text('last_reward_claim_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Investment Plans Table (International Beddings & VIP Nodes)
export const investmentPlans = pgTable('investment_plans', {
  id: serial('id').primaryKey(),
  level: integer('level').notNull().unique(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  priceUgx: numeric('price_ugx', { precision: 12, scale: 2 }).notNull(),
  dailyReturnUgx: numeric('daily_return_ugx', { precision: 12, scale: 2 }).notNull(),
  validityDays: integer('validity_days').notNull().default(100),
  welcomeBonusUgx: numeric('welcome_bonus_ugx', { precision: 12, scale: 2 }).notNull().default('5000.00'),
  withdrawalFeePercent: integer('withdrawal_fee_percent').notNull().default(15),
  imageUrl: text('image_url'),
  badge: text('badge'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Withdrawals Table
export const withdrawals = pgTable('withdrawals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  uid: text('uid').notNull(),
  amountUgx: numeric('amount_ugx', { precision: 12, scale: 2 }).notNull(),
  feePercent: integer('fee_percent').notNull().default(15),
  feeAmountUgx: numeric('fee_amount_ugx', { precision: 12, scale: 2 }).notNull(),
  netArrivalUgx: numeric('net_arrival_ugx', { precision: 12, scale: 2 }).notNull(),
  momoNumber: text('momo_number').notNull(),
  network: text('network').notNull(),
  recipientName: text('recipient_name').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'rejected'
  txRef: text('tx_ref').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Deposits Table
export const deposits = pgTable('deposits', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  uid: text('uid').notNull(),
  amountUgx: numeric('amount_ugx', { precision: 12, scale: 2 }).notNull(),
  network: text('network').notNull(),
  momoNumber: text('momo_number').notNull(),
  planLevel: integer('plan_level'),
  status: text('status').notNull().default('completed'),
  txRef: text('tx_ref').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tasks & Earning Logs Table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  uid: text('uid').notNull(),
  taskName: text('task_name').notNull(),
  rewardUgx: numeric('reward_ugx', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('claimed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relational Mappings
export const usersRelations = relations(users, ({ many }) => ({
  withdrawals: many(withdrawals),
  deposits: many(deposits),
  tasks: many(tasks),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(users, {
    fields: [withdrawals.userId],
    references: [users.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  user: one(users, {
    fields: [deposits.userId],
    references: [users.id],
  }),
}));
