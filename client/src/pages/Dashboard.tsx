import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowUpRight, CircleDollarSign, Wallet, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const investments = trpc.investments.list.useQuery();
  const withdrawals = trpc.withdrawals.list.useQuery();
  const plans = trpc.plans.list.useQuery();
  const categories = trpc.categories.list.useQuery();
  const createWithdrawal = trpc.withdrawals.create.useMutation({
    onSuccess: () => { toast.success("Withdrawal request submitted"); withdrawals.refetch(); },
    onError: error => toast.error(error.message),
  });
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const records = investments.data ?? [];
  const totalInvested = records.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
  const expectedReturn = records.reduce((sum: number, item: any) => sum + Number(item.expectedReturn), 0);

  return <DashboardLayout>
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">Investor portal</p><h1 className="text-3xl font-bold tracking-tight">Your portfolio</h1></div>
        <Button onClick={() => setLocation("/#plans")} className="bg-amber-500 text-slate-950 hover:bg-amber-400">Explore plans <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric title="Total invested" value={`$${totalInvested.toLocaleString()}`} icon={Wallet} />
        <Metric title="Expected return" value={`$${expectedReturn.toLocaleString()}`} icon={TrendingUp} />
        <Metric title="Active positions" value={String(records.filter((item: any) => item.status === "active").length)} icon={CircleDollarSign} />
      </div>
      <Tabs defaultValue="investments" className="space-y-4">
        <TabsList><TabsTrigger value="investments">Investments</TabsTrigger><TabsTrigger value="withdraw">Withdraw funds</TabsTrigger></TabsList>
        <TabsContent value="investments" className="space-y-4">
          <Card><CardHeader><CardTitle>Investment history</CardTitle></CardHeader><CardContent>
            {records.length === 0 ? <p className="py-8 text-center text-muted-foreground">You have no investments yet. Choose a plan to get started.</p> : <div className="space-y-3">{records.map((item: any) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">Investment #{item.id}</p><p className="text-sm text-muted-foreground">{item.status} · {new Date(item.createdAt).toLocaleDateString()}</p></div><div className="text-right"><p className="font-semibold">${Number(item.amount).toLocaleString()}</p><p className="text-sm text-emerald-600">Return ${Number(item.expectedReturn).toLocaleString()}</p></div></div>)}</div>}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="withdraw"><Card><CardHeader><CardTitle>Request a withdrawal</CardTitle></CardHeader><CardContent className="max-w-lg space-y-4"><div className="space-y-2"><Label htmlFor="amount">Amount</Label><Input id="amount" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} placeholder="0.00" /></div><div className="space-y-2"><Label htmlFor="reason">Reason (optional)</Label><Input id="reason" value={reason} onChange={event => setReason(event.target.value)} placeholder="Tell us what this withdrawal is for" /></div><Button disabled={!amount || createWithdrawal.isPending} onClick={() => createWithdrawal.mutate({ amount, reason: reason || undefined })}>Submit request</Button><div className="space-y-2 pt-4">{(withdrawals.data ?? []).map((item: any) => <div key={item.id} className="flex justify-between border-b py-2 text-sm"><span>Request #{item.id}</span><span>{item.status} · ${Number(item.amount).toLocaleString()}</span></div>)}</div></CardContent></Card></TabsContent>
      </Tabs>
      <Card><CardHeader><CardTitle>Available plans</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(plans.data ?? []).map((plan: any) => <div key={plan.id} className="rounded-lg border p-4"><p className="font-semibold">{plan.name}</p><p className="text-sm text-muted-foreground">{plan.roi}% ROI · {plan.duration} days</p><p className="mt-2 text-sm">From ${Number(plan.minAmount).toLocaleString()}</p></div>)}</CardContent></Card>
      {categories.data?.length ? <p className="text-xs text-muted-foreground">Diversify across {categories.data.length} investment categories.</p> : null}
    </div>
  </DashboardLayout>;
}

function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Wallet }) {
  return <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><Icon className="h-5 w-5 text-amber-500" /></CardContent></Card>;
}
