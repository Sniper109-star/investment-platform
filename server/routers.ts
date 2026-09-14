import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

const DEMO_USER_ID = 1;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  
  // Investment Plans
  plans: router({
    list: publicProcedure.query(() => db.getInvestmentPlans()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getInvestmentPlanById(input.id)),
  }),
  
  // Investment Categories
  categories: router({
    list: publicProcedure.query(() => db.getInvestmentCategories()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getInvestmentCategoryById(input.id)),
  }),
  
  // User Investments
  investments: router({
    list: publicProcedure.query(() => db.getUserInvestments(DEMO_USER_ID)),
    create: publicProcedure
      .input(z.object({
        planId: z.number(),
        categoryId: z.number(),
        amount: z.string(),
            }))
      .mutation(({ ctx, input }) => {
        return db.createUserInvestment({
          userId: DEMO_USER_ID,
          planId: input.planId,
          categoryId: input.categoryId,
          amount: input.amount as any,
                status: "pending",
        });
      }),
  }),
  
  // Withdrawal Requests
  withdrawals: router({
    list: publicProcedure.query(() => db.getUserWithdrawalRequests(DEMO_USER_ID)),
    create: publicProcedure
      .input(z.object({
        amount: z.string(),
        reason: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createWithdrawalRequest({
          userId: DEMO_USER_ID,
          amount: input.amount as any,
          reason: input.reason,
          status: "pending",
        });
      }),
    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return db.getPendingWithdrawalRequests();
    }),
    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.approveWithdrawalRequest(input.id, ctx.user.id);
      }),
    reject: protectedProcedure
      .input(z.object({ id: z.number(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.rejectWithdrawalRequest(input.id, input.reason);
      }),
  }),

  admin: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
      return db.getAdminStats();
    }),
    users: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
      return db.getAdminUsers();
    }),
    investments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
      return db.getAdminInvestments();
    }),
    logs: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
      return db.getAdminLogs();
    }),
    updateInvestment: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "active", "completed", "withdrawn"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized: Admin access required");
        const result = await db.updateInvestmentStatus(input.id, input.status);
        await db.createAdminLog({ adminId: ctx.user.id, action: `investment.${input.status}`, targetInvestmentId: input.id });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
