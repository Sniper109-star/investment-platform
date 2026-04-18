import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertUserInvestment, InsertWithdrawalRequest, investmentPlans, investmentCategories, userInvestments, withdrawalRequests } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Investment Plans
export async function getInvestmentPlans() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(investmentPlans).where(eq(investmentPlans.isActive, true)).orderBy(investmentPlans.displayOrder);
}

export async function getInvestmentPlanById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(investmentPlans).where(eq(investmentPlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Investment Categories
export async function getInvestmentCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(investmentCategories).where(eq(investmentCategories.isActive, true)).orderBy(investmentCategories.displayOrder);
}

export async function getInvestmentCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(investmentCategories).where(eq(investmentCategories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// User Investments
export async function getUserInvestments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userInvestments).where(eq(userInvestments.userId, userId)).orderBy(userInvestments.createdAt);
}

export async function createUserInvestment(investment: InsertUserInvestment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userInvestments).values(investment);
  return result;
}

export async function updateUserInvestmentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userInvestments).set({ status: status as any }).where(eq(userInvestments.id, id));
}

// Withdrawal Requests
export async function createWithdrawalRequest(request: InsertWithdrawalRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(withdrawalRequests).values(request);
}

export async function getUserWithdrawalRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId));
}

export async function getPendingWithdrawalRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(withdrawalRequests).where(eq(withdrawalRequests.status, "pending"));
}

export async function approveWithdrawalRequest(id: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(withdrawalRequests).set({ status: "approved", approvedBy: adminId, approvalDate: new Date() }).where(eq(withdrawalRequests.id, id));
}

export async function rejectWithdrawalRequest(id: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(withdrawalRequests).set({ status: "rejected", rejectionReason: reason }).where(eq(withdrawalRequests.id, id));
}


