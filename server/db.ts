import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  InsertUser,
  InsertUserInvestment,
  InsertWithdrawalRequest,
} from "../drizzle/schema";
import type { User } from "../drizzle/schema";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  client ??= createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const values = {
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    role: user.role ?? (user.openId === process.env.OWNER_OPEN_ID ? "admin" : "user"),
    lastSignedIn: user.lastSignedIn?.toISOString() ?? new Date().toISOString(),
  };
  unwrap(await getDb().from("users").upsert(values, { onConflict: "openId" }));
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const result = unwrap(await getDb().from("users").select("*").eq("openId", openId).maybeSingle());
  return result ?? undefined;
}

export async function getInvestmentPlans() {
  return unwrap(await getDb().from("investment_plans").select("*").eq("isActive", true).order("displayOrder"));
}

export async function getInvestmentPlanById(id: number) {
  return unwrap(await getDb().from("investment_plans").select("*").eq("id", id).maybeSingle());
}

export async function getInvestmentCategories() {
  return unwrap(await getDb().from("investment_categories").select("*").eq("isActive", true).order("displayOrder"));
}

export async function getInvestmentCategoryById(id: number) {
  return unwrap(await getDb().from("investment_categories").select("*").eq("id", id).maybeSingle());
}

export async function getUserInvestments(userId: number) {
  return unwrap(await getDb().from("user_investments").select("*").eq("userId", userId).order("createdAt", { ascending: false }));
}

export async function createUserInvestment(investment: Omit<InsertUserInvestment, "expectedReturn">) {
  const plan = await getInvestmentPlanById(Number(investment.planId)) as any;
  const category = await getInvestmentCategoryById(Number(investment.categoryId)) as any;
  const amount = Number(investment.amount);
  if (!plan || !plan.isActive) throw new Error("The selected investment plan is unavailable");
  if (!category || !category.isActive) throw new Error("The selected investment category is unavailable");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Investment amount must be greater than zero");
  if (amount < Number(plan.minAmount) || (plan.maxAmount && amount > Number(plan.maxAmount))) {
    throw new Error(`Investment amount must be between $${Number(plan.minAmount).toLocaleString()} and ${plan.maxAmount ? `$${Number(plan.maxAmount).toLocaleString()}` : "the plan maximum"}`);
  }
  const expectedReturn = (amount * Number(plan.roi) / 100).toFixed(2);
  return unwrap(await getDb().from("user_investments").insert({ ...investment, expectedReturn }).select().single());
}

export async function createWithdrawalRequest(request: InsertWithdrawalRequest) {
  const amount = Number(request.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Withdrawal amount must be greater than zero");
  const existing = await getUserWithdrawalRequests(Number(request.userId));
  if (existing.some(item => item.status === "pending")) throw new Error("You already have a withdrawal request under review");
  const investments = await getUserInvestments(Number(request.userId));
  const available = investments.filter(item => item.status === "active" || item.status === "completed").reduce((sum, item) => sum + Number(item.actualReturn ?? item.expectedReturn ?? 0), 0);
  if (amount > available) throw new Error("Withdrawal amount exceeds your available balance");
  return unwrap(await getDb().from("withdrawal_requests").insert({ ...request, amount: amount.toFixed(2) }).select().single());
}

export async function getUserWithdrawalRequests(userId: number) {
  return unwrap(await getDb().from("withdrawal_requests").select("*").eq("userId", userId).order("createdAt", { ascending: false }));
}

export async function getPendingWithdrawalRequests() {
  return unwrap(await getDb().from("withdrawal_requests").select("*").eq("status", "pending").order("createdAt"));
}

export async function approveWithdrawalRequest(id: number, adminId: number) {
  return unwrap(await getDb().from("withdrawal_requests").update({ status: "approved", approvedBy: adminId, approvalDate: new Date().toISOString() }).eq("id", id).eq("status", "pending").select().single());
}

export async function rejectWithdrawalRequest(id: number, reason: string) {
  return unwrap(await getDb().from("withdrawal_requests").update({ status: "rejected", rejectionReason: reason }).eq("id", id).eq("status", "pending").select().single());
}

export async function getAdminStats() {
  const db = getDb();
  const [users, investments, withdrawals, plans] = await Promise.all([
    db.from("users").select("id, role, createdAt", { count: "exact" }),
    db.from("user_investments").select("amount, expectedReturn, status"),
    db.from("withdrawal_requests").select("id, amount, status, createdAt, userId").order("createdAt", { ascending: false }),
    db.from("investment_plans").select("id, name, isActive").order("displayOrder"),
  ]);
  const userRows = unwrap(users);
  const investmentRows = unwrap(investments) ?? [];
  const withdrawalRows = unwrap(withdrawals) ?? [];
  return {
    totalUsers: users.count ?? userRows?.length ?? 0,
    totalInvested: investmentRows.reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    totalExpectedReturn: investmentRows.reduce((sum, item) => sum + Number(item.expectedReturn ?? 0), 0),
    activeInvestments: investmentRows.filter(item => item.status === "active").length,
    pendingWithdrawals: withdrawalRows.filter(item => item.status === "pending").length,
    withdrawals: withdrawalRows,
    plans: unwrap(plans) ?? [],
  };
}

export async function getAdminUsers() {
  return unwrap(await getDb().from("users").select("id, openId, name, email, role, totalInvested, totalEarnings, createdAt, lastSignedIn").order("createdAt", { ascending: false }));
}

export async function getAdminInvestments() {
  return unwrap(await getDb().from("user_investments").select("*, users(name, email), investment_plans(name), investment_categories(name)").order("createdAt", { ascending: false }));
}

export async function updateInvestmentStatus(id: number, status: "pending" | "active" | "completed" | "withdrawn") {
  const values = status === "active" ? { status, startDate: new Date().toISOString() } : { status };
  return unwrap(await getDb().from("user_investments").update(values).eq("id", id).select().single());
}

export async function getAdminLogs() {
  return unwrap(await getDb().from("admin_logs").select("*, users(name, email)").order("createdAt", { ascending: false }).limit(100));
}

export async function createAdminLog(log: { adminId: number; action: string; targetUserId?: number; targetInvestmentId?: number; details?: string }) {
  return unwrap(await getDb().from("admin_logs").insert(log).select().single());
}
