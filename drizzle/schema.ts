import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  totalInvested: decimal("totalInvested", { precision: 15, scale: 2 }).default("0").notNull(),
  totalEarnings: decimal("totalEarnings", { precision: 15, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Investment Plans Table
export const investmentPlans = mysqlTable("investment_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // Starter, Silver, Gold, Platinum
  minAmount: decimal("minAmount", { precision: 15, scale: 2 }).notNull(),
  maxAmount: decimal("maxAmount", { precision: 15, scale: 2 }),
  roi: decimal("roi", { precision: 5, scale: 2 }).notNull(), // ROI percentage
  duration: int("duration").notNull(), // Duration in days
  description: text("description"),
  features: text("features"), // JSON array of features
  displayOrder: int("displayOrder").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type InsertInvestmentPlan = typeof investmentPlans.$inferInsert;

// Investment Categories Table
export const investmentCategories = mysqlTable("investment_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // Solana Meme Coins, Agricultural Investments, Car Stocks
  description: text("description"),
  expectedYield: varchar("expectedYield", { length: 50 }).notNull(), // e.g., "45-60% APY"
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"]).notNull(),
  displayOrder: int("displayOrder").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InvestmentCategory = typeof investmentCategories.$inferSelect;
export type InsertInvestmentCategory = typeof investmentCategories.$inferInsert;

// User Investments Table
export const userInvestments = mysqlTable("user_investments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  categoryId: int("categoryId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  expectedReturn: decimal("expectedReturn", { precision: 15, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed", "withdrawn"]).default("pending").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  actualReturn: decimal("actualReturn", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserInvestment = typeof userInvestments.$inferSelect;
export type InsertUserInvestment = typeof userInvestments.$inferInsert;

// Withdrawal Requests Table
export const withdrawalRequests = mysqlTable("withdrawal_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  reason: text("reason"),
  approvedBy: int("approvedBy"), // Admin user ID
  approvalDate: timestamp("approvalDate"),
  rejectionReason: text("rejectionReason"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;

// Admin Logs Table
export const adminLogs = mysqlTable("admin_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  targetUserId: int("targetUserId"),
  targetInvestmentId: int("targetInvestmentId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;