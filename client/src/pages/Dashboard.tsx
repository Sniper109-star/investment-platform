import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpRight, CircleDollarSign, Wallet, TrendingUp, CheckCircle2 } from "lucide-react";

const planArtwork: Record<string, string> = {
  starter: "/plans/starter.png",
  growth: "/plans/growth.png",
  gold: "/plans/gold.png",
  platinum: "/plans/platinum.png",
};

function getPlanArtwork(name: string) {
  return planArtwork[name.toLowerCase()] ?? "/plans/growth.png";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const investments = trpc.investments.list.useQuery();
  const withdrawals = trpc.withdrawals.list.useQuery();
  const plans = trpc.plans.list.useQuery();
  const categories = trpc.categories.list.useQuery();
  const utils = trpc.useUtils();
  const [planId, setPlanId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const createInvestment = trpc.investments.create.useMutation({
    onSuccess: async () => {
      toast.success("Investment submitted for review");
      setInvestmentAmount("");
      await utils.investments.list.invalidate();
    },
    onError: error => toast.error(error.message),
  });
  const createWithdrawal = trpc.withdrawals.create.useMutation({
    onSuccess: async () => {
      toast.success("Withdrawal request submitted");
      setAmount("");
      setReason("");
      await utils.withdrawals.list.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const records = investments.data ?? [];
  const selectedPlan = plans.data?.find((plan: any) => String(plan.id) === planId) as any;
  const totalInvested = records.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
  const expectedReturn = records.reduce((sum: number, item: any) => sum + Number(item.expectedReturn), 0);
  const availableBalance = useMemo(() => records.filter((item: any) => item.status === "active" || item.status === "completed").reduce((sum: number, item: any) => sum + Number(item.actualReturn ?? item.expectedReturn ?? 0), 0), [records]);

  const submitInvestment = () => {
    if (!planId || !categoryId || !investmentAmount) return toast.error("Choose a plan, category, and amount");
    createInvestment.mutate({ planId: Number(planId), categoryId: Number(categoryId), amount: investmentAmount });
  };

  return <DashboardLayout>
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">Investor portal</p><h1 className="text-3xl font-bold tracking-tight">Your portfolio</h1><p className="mt-1 text-muted-foreground">Invest, track progress, and request withdrawals from one place.</p></div>
        <Button onClick={() => setLocation("/#plans")} className="bg-amber-500 text-slate-950 hover:bg-amber-400">Explore plans <ArrowUpRight data-icon="inline-end" /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3"><Metric title="Total invested" value={`$${totalInvested.toLocaleString()}`} icon={Wallet} /><Metric title="Expected return" value={`$${expectedReturn.toLocaleString()}`} icon={TrendingUp} /><Metric title="Active positions" value={String(records.filter((item: any) => item.status === "active").length)} icon={CircleDollarSign} /></div>

      <Card id="invest"><CardHeader><CardTitle>Start an investment</CardTitle><CardDescription>Select a strategy and submit your amount for review.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-4 md:items-end"><div className="flex flex-col gap-2"><Label htmlFor="plan">Investment plan</Label><Select value={planId} onValueChange={setPlanId}><SelectTrigger id="plan"><SelectValue placeholder="Choose a plan" /></SelectTrigger><SelectContent>{(plans.data ?? []).map((plan: any) => <SelectItem key={plan.id} value={String(plan.id)}>{plan.name} · {plan.roi}% ROI</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="category">Category</Label><Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger id="category"><SelectValue placeholder="Choose a category" /></SelectTrigger><SelectContent>{(categories.data ?? []).map((category: any) => <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="investment-amount">Amount</Label><Input id="investment-amount" inputMode="decimal" value={investmentAmount} onChange={event => setInvestmentAmount(event.target.value)} placeholder={selectedPlan ? `Min $${Number(selectedPlan.minAmount).toLocaleString()}` : "0.00"} /></div><Button onClick={submitInvestment} disabled={createInvestment.isPending}>{createInvestment.isPending ? "Submitting..." : "Submit investment"}</Button></CardContent></Card>

      <Tabs defaultValue="investments" className="flex flex-col gap-4"><TabsList><TabsTrigger value="investments">Investments</TabsTrigger><TabsTrigger value="withdraw">Withdraw funds</TabsTrigger></TabsList><TabsContent value="investments" className="flex flex-col gap-4"><Card><CardHeader><CardTitle>Investment history</CardTitle><CardDescription>Track every position from submission through completion.</CardDescription></CardHeader><CardContent>{records.length === 0 ? <p className="py-8 text-center text-muted-foreground">You have no investments yet. Choose a plan above to get started.</p> : <div className="flex flex-col gap-3">{records.map((item: any) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">Investment #{item.id}</p><p className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p></div><div className="flex items-center gap-4"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge><div className="text-right"><p className="font-semibold">${Number(item.amount).toLocaleString()}</p><p className="text-sm text-emerald-600">Return ${Number(item.expectedReturn).toLocaleString()}</p></div></div></div>)}</div>}</CardContent></Card></TabsContent><TabsContent value="withdraw"><Card><CardHeader><CardTitle>Request a withdrawal</CardTitle><CardDescription>Available balance: ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardDescription></CardHeader><CardContent className="flex max-w-lg flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="amount">Amount</Label><Input id="amount" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} placeholder="0.00" /></div><div className="flex flex-col gap-2"><Label htmlFor="reason">Reason (optional)</Label><Input id="reason" value={reason} onChange={event => setReason(event.target.value)} placeholder="Tell us what this withdrawal is for" /></div><Button disabled={!amount || createWithdrawal.isPending} onClick={() => createWithdrawal.mutate({ amount, reason: reason || undefined })}>{createWithdrawal.isPending ? "Submitting..." : "Submit request"}</Button><div className="flex flex-col gap-2 pt-4">{(withdrawals.data ?? []).map((item: any) => <div key={item.id} className="flex items-center justify-between border-b py-2 text-sm"><span>Request #{item.id}</span><span className="flex items-center gap-2"><Badge variant="outline">{item.status}</Badge>${Number(item.amount).toLocaleString()}</span></div>)}{!withdrawals.data?.length && <p className="text-sm text-muted-foreground">No withdrawal requests yet.</p>}</div></CardContent></Card></TabsContent></Tabs>
      <Card><CardHeader><CardTitle>Available plans</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(plans.data ?? []).map((plan: any) => <div key={plan.id} className="overflow-hidden rounded-lg border"><img src={getPlanArtwork(plan.name)} alt={`${plan.name} investment plan artwork`} className="h-24 w-full object-cover" /><div className="p-4"><div className="flex items-start justify-between gap-2"><p className="font-semibold">{plan.name}</p><CheckCircle2 className="text-emerald-600" /></div><p className="text-sm text-muted-foreground">{plan.roi}% ROI · {plan.duration} days</p><p className="mt-2 text-sm">From ${Number(plan.minAmount).toLocaleString()}</p></div></div>)}</CardContent></Card>
    </div>
  </DashboardLayout>;
}

function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Wallet }) { return <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><Icon className="text-amber-500" /></CardContent></Card>; }
