import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

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
    list: protectedProcedure.query(({ ctx }) => db.getUserInvestments(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        planId: z.number(),
        categoryId: z.number(),
        amount: z.string(),
        expectedReturn: z.string(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createUserInvestment({
          userId: ctx.user.id,
          planId: input.planId,
          categoryId: input.categoryId,
          amount: input.amount as any,
          expectedReturn: input.expectedReturn as any,
          status: "pending",
        });
      }),
  }),
  
  // Withdrawal Requests
  withdrawals: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserWithdrawalRequests(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        amount: z.string(),
        reason: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createWithdrawalRequest({
          userId: ctx.user.id,
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
});

export type AppRouter = typeof appRouter;
