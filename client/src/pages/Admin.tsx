import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Admin() {
  const stats = trpc.admin.stats.useQuery();
  const users = trpc.admin.users.useQuery();
  const investments = trpc.admin.investments.useQuery();
  const logs = trpc.admin.logs.useQuery();
  const updateInvestment = trpc.admin.updateInvestment.useMutation({
    onSuccess: () => { toast.success("Investment updated"); investments.refetch(); stats.refetch(); logs.refetch(); },
    onError: (error) => toast.error(error.message),
  });
  const data = stats.data;

  return <DashboardLayout>
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div><p className="text-sm text-muted-foreground">Operations console</p><h1 className="text-3xl font-bold tracking-tight">Admin workspace</h1><p className="mt-1 text-muted-foreground">Monitor the platform, review investor activity, and manage investment lifecycle states.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Users" value={data?.totalUsers ?? 0} />
        <Metric label="Invested" value={`$${(data?.totalInvested ?? 0).toLocaleString()}`} />
        <Metric label="Expected return" value={`$${(data?.totalExpectedReturn ?? 0).toLocaleString()}`} />
        <Metric label="Active positions" value={data?.activeInvestments ?? 0} />
        <Metric label="Pending withdrawals" value={data?.pendingWithdrawals ?? 0} />
      </div>
      <Tabs defaultValue="investments" className="space-y-4">
        <TabsList><TabsTrigger value="investments">Investments</TabsTrigger><TabsTrigger value="users">Users</TabsTrigger><TabsTrigger value="withdrawals">Withdrawals</TabsTrigger><TabsTrigger value="logs">Activity</TabsTrigger></TabsList>
        <TabsContent value="investments"><Card><CardHeader><CardTitle>Investment lifecycle</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-3">Investor</th><th className="p-3">Plan</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{(investments.data ?? []).map((item: any) => <tr className="border-b last:border-0" key={item.id}><td className="p-3"><p className="font-medium">{item.users?.name ?? "Unknown investor"}</p><p className="text-xs text-muted-foreground">{item.users?.email ?? ""}</p></td><td className="p-3">{item.investment_plans?.name ?? `Plan #${item.planId}`}</td><td className="p-3">${Number(item.amount).toLocaleString()}</td><td className="p-3"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></td><td className="p-3"><div className="flex gap-2">{item.status === "pending" && <Button size="sm" onClick={() => updateInvestment.mutate({ id: item.id, status: "active" })}>Activate</Button>}{item.status === "active" && <Button size="sm" variant="outline" onClick={() => updateInvestment.mutate({ id: item.id, status: "completed" })}>Complete</Button>}</div></td></tr>)}</tbody></table>{!investments.isLoading && !investments.data?.length && <p className="py-10 text-center text-muted-foreground">No investments have been created yet.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="users"><Card><CardHeader><CardTitle>Registered users</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th></tr></thead><tbody>{(users.data ?? []).map((user: any) => <tr className="border-b last:border-0" key={user.id}><td className="p-3 font-medium">{user.name ?? "Unnamed"}</td><td className="p-3">{user.email ?? "—"}</td><td className="p-3"><Badge variant="outline">{user.role}</Badge></td><td className="p-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></CardContent></Card></TabsContent>
        <TabsContent value="withdrawals"><Card><CardHeader><CardTitle>Withdrawal queue</CardTitle></CardHeader><CardContent className="space-y-3">{(data?.withdrawals ?? []).map((item: any) => <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4" key={item.id}><div><p className="font-medium">Request #{item.id}</p><p className="text-sm text-muted-foreground">User #{item.userId} · {new Date(item.createdAt).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><span className="font-semibold">${Number(item.amount).toLocaleString()}</span><Badge variant={item.status === "pending" ? "secondary" : "outline"}>{item.status}</Badge></div></div>)}{!data?.withdrawals?.length && <p className="py-10 text-center text-muted-foreground">The withdrawal queue is clear.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="logs"><Card><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader><CardContent className="space-y-3">{(logs.data ?? []).map((log: any) => <div className="flex justify-between gap-4 border-b pb-3 text-sm last:border-0" key={log.id}><span>{log.action}</span><span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span></div>)}{!logs.data?.length && <p className="py-10 text-center text-muted-foreground">No admin activity recorded yet.</p>}</CardContent></Card></TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>;
}

function Metric({ label, value }: { label: string; value: string | number }) { return <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></CardContent></Card>; }
