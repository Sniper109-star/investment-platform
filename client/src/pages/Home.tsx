import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  Leaf,
  LockKeyhole,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

const fallbackPlans = [
  { id: 1, name: 'Starter', description: 'A measured first step into diversified investing.', minAmount: '100', roi: '8', duration: 30 },
  { id: 2, name: 'Growth', description: 'A balanced portfolio built for steady momentum.', minAmount: '1,000', roi: '14', duration: 60 },
  { id: 3, name: 'Gold', description: 'Higher potential for investors ready to lean in.', minAmount: '5,000', roi: '22', duration: 90 },
  { id: 4, name: 'Platinum', description: 'Our highest-conviction strategy for larger goals.', minAmount: '10,000', roi: '30', duration: 120 },
];

const planArtwork: Record<string, string> = {
  starter: '/plans/starter.png',
  growth: '/plans/growth.png',
  gold: '/plans/gold.png',
  platinum: '/plans/platinum.png',
};

function getPlanArtwork(name: string) {
  return planArtwork[name.toLowerCase()] ?? '/plans/growth.png';
}

const categoryDetails = [
  { name: 'Solana Meme Coins', icon: TrendingUp, accent: 'from-emerald-500/20 to-cyan-500/10', description: 'Explore high-growth digital assets with disciplined position sizing.', yield: 'Up to 35%', risk: 'High' },
  { name: 'Agricultural Investments', icon: Leaf, accent: 'from-lime-500/20 to-emerald-500/10', description: 'Back real-world production and resilient global food systems.', yield: 'Up to 18%', risk: 'Medium' },
  { name: 'Car Stocks', icon: BarChart3, accent: 'from-amber-500/20 to-orange-500/10', description: 'Gain exposure to the companies shaping the future of mobility.', yield: 'Up to 24%', risk: 'Medium' },
];

const faqs = [
  ['How does investing work?', 'Choose a plan, select an investment category, and fund your position. We track your portfolio and projected returns in one clear dashboard.'],
  ['Is my money safe?', 'We use secure authentication, clear account activity, and risk labels for every category. All investments involve risk, so review each opportunity carefully before committing funds.'],
  ['Can I withdraw my earnings?', 'Yes. Submit a withdrawal request from your dashboard. Requests are reviewed and tracked with a clear status so you always know what happens next.'],
  ['What is the minimum investment?', 'Plans start at $100, so you can begin with an amount that fits your goals and build from there.'],
];

export default function Home() {
  const { t } = useLanguage();
  const { data: plans = [] } = trpc.plans.list.useQuery();
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const visiblePlans = plans.length ? plans : fallbackPlans;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-10 text-white">
        <div className="container flex h-20 items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="Northstar Investments home">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Sparkles /></span>
            <span className="text-lg font-semibold tracking-tight">Northstar<span className="text-primary">.</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
            <a href="#opportunities" className="transition-colors hover:text-foreground">Opportunities</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline" href={'/dashboard'}>Dashboard</a>
            <Button size="sm" asChild><a href={'/dashboard'}>View portfolio <ArrowRight data-icon="inline-end" /></a></Button>
          </div>
        </div>
      </header>

      <section className="relative isolate border-b bg-[radial-gradient(circle_at_75%_20%,oklch(0.82_0.12_160/.22),transparent_34%),linear-gradient(135deg,oklch(0.18_0.03_165),oklch(0.1_0.02_190))] pt-32 text-white sm:pt-40">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(oklch(1_0_0/.08)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/.08)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="container grid items-center gap-16 pb-20 lg:grid-cols-[1.08fr_.92fr] lg:pb-28">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-7 border-white/20 bg-white/10 text-emerald-100"><span className="mr-2 size-1.5 rounded-full bg-emerald-300" /> Built for the long view</Badge>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl">Put your money to work with <span className="text-emerald-300">intention.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">A more thoughtful way to invest across emerging markets, tangible industries, and opportunities that move the world forward.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="bg-emerald-300 text-emerald-950 hover:bg-emerald-200" asChild><a href={'/dashboard'}>Open your dashboard <ArrowRight data-icon="inline-end" /></a></Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild><a href="#opportunities">Explore opportunities</a></Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60"><span className="flex items-center gap-2"><ShieldCheck className="text-emerald-300" /> Secure by design</span><span className="flex items-center gap-2"><LockKeyhole className="text-emerald-300" /> Transparent by default</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
                <div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">Portfolio value</p><p className="mt-2 text-4xl font-semibold tracking-tight">$24,680.00</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">+18.6%</span></div>
                <div className="mt-8 flex h-32 items-end gap-2"><div className="h-[28%] flex-1 rounded-t bg-emerald-100" /><div className="h-[42%] flex-1 rounded-t bg-emerald-200" /><div className="h-[35%] flex-1 rounded-t bg-emerald-200" /><div className="h-[58%] flex-1 rounded-t bg-emerald-300" /><div className="h-[52%] flex-1 rounded-t bg-emerald-300" /><div className="h-[78%] flex-1 rounded-t bg-emerald-400" /><div className="h-full flex-1 rounded-t bg-emerald-500" /></div>
                <div className="mt-5 flex justify-between border-t pt-4 text-xs text-slate-500"><span>Jan 2025</span><span>Today</span></div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-8 hidden rounded-2xl border border-white/15 bg-slate-900/80 p-4 shadow-xl backdrop-blur md:block"><p className="text-xs text-white/50">This month</p><p className="mt-1 text-xl font-semibold text-emerald-300">+$1,240.50</p></div>
          </div>
        </div>
        <div className="container grid grid-cols-2 border-t border-white/10 py-7 text-center text-white sm:grid-cols-4"><div><p className="text-2xl font-semibold">$12.4M</p><p className="mt-1 text-xs uppercase tracking-widest text-white/45">Capital invested</p></div><div><p className="text-2xl font-semibold">8,400+</p><p className="mt-1 text-xs uppercase tracking-widest text-white/45">Active investors</p></div><div><p className="text-2xl font-semibold">14.8%</p><p className="mt-1 text-xs uppercase tracking-widest text-white/45">Avg. projected ROI</p></div><div><p className="text-2xl font-semibold">4.9/5</p><p className="mt-1 text-xs uppercase tracking-widest text-white/45">Investor rating</p></div></div>
      </section>

      <section id="opportunities" className="container py-24 sm:py-32"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">Curated opportunities</p><h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">Invest in what comes next.</h2></div><p className="max-w-xl text-lg leading-8 text-muted-foreground">Skip the noise. Northstar gives you access to focused opportunities with the context and controls to make decisions you feel good about.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{(categories.length ? categories.map((category: any, index: number) => ({ ...category, icon: categoryDetails[index % categoryDetails.length].icon, accent: categoryDetails[index % categoryDetails.length].accent, yield: category.expectedYield, risk: category.riskLevel })) : categoryDetails).map((category: any) => { const Icon = category.icon; return <Card key={category.name} className={`group overflow-hidden border-0 bg-gradient-to-br ${category.accent} shadow-none ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl`}><CardHeader><div className="mb-8 flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-background/80 text-primary shadow-sm"><Icon /></span><Badge variant="secondary">{category.risk || 'Medium'} risk</Badge></div><CardTitle className="text-2xl">{category.name}</CardTitle><CardDescription className="pt-2 text-base leading-7">{category.description}</CardDescription></CardHeader><CardContent><div className="flex items-center justify-between border-t border-border/60 pt-5 text-sm"><span className="text-muted-foreground">Projected yield</span><span className="font-semibold text-primary">{category.yield || category.expectedYield}</span></div></CardContent></Card> })}</div></section>

      <section className="bg-muted/40 py-24 sm:py-32"><div className="container"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Simple by design</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">A plan for every stage.</h2></div><a href="#plans" className="text-sm font-semibold text-primary hover:underline">Compare all plans <ArrowRight className="ml-1 inline" /></a></div><div id="plans" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{visiblePlans.map((plan: any, index: number) => <Card key={plan.id} className={`relative flex flex-col overflow-hidden ${index === 2 ? 'border-primary shadow-xl shadow-primary/10' : ''}`}>{index === 2 && <Badge className="absolute left-6 top-3 z-10">Most popular</Badge>}<div className="relative h-36 overflow-hidden"><img src={getPlanArtwork(plan.name)} alt={`${plan.name} investment plan artwork`} className="size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" /></div><CardHeader className="pt-4"><CardTitle>{plan.name}</CardTitle><CardDescription className="min-h-12">{plan.description}</CardDescription></CardHeader><CardContent className="flex flex-1 flex-col"><div className="mb-6"><span className="text-3xl font-semibold">{plan.roi}%</span><span className="text-sm text-muted-foreground"> projected return</span></div><div className="grid gap-3 border-y py-5 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Minimum</span><span className="font-medium">${plan.minAmount}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Term</span><span className="font-medium">{plan.duration} days</span></div></div><Button className="mt-6 w-full" variant={index === 2 ? 'default' : 'outline'} asChild><a href={'/dashboard'}>Choose {plan.name}</a></Button></CardContent></Card>)}</div></div></section>

      <section id="how-it-works" className="container py-24 sm:py-32"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">How it works</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">From curious to confident.</h2></div><div className="mt-16 grid gap-10 md:grid-cols-3">{[['01', 'Create your account', 'Set up your secure account in minutes and tell us what you are working toward.'], ['02', 'Choose your strategy', 'Explore clear plans and categories, then choose the fit for your goals.'], ['03', 'Track your progress', 'See your portfolio, projected returns, and requests in one simple dashboard.']].map(([number, title, text]) => <div key={number} className="relative border-l-2 border-primary/20 pl-6"><span className="text-sm font-semibold text-primary">{number}</span><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></div>)}</div></section>

      <section className="container pb-24 sm:pb-32"><div className="rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-12 lg:flex lg:items-center lg:justify-between lg:p-16"><div className="max-w-2xl"><Quote className="mb-6 opacity-60" /><blockquote className="text-2xl font-medium leading-9 sm:text-3xl">“Northstar makes investing feel less like guessing and more like building.”</blockquote><p className="mt-5 text-sm text-primary-foreground/70">— Maya R., Northstar investor since 2024</p></div><div className="mt-8 flex items-center gap-3 border-t border-primary-foreground/20 pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"><CircleDollarSign /><span className="text-sm">Invest with clarity.<br />Grow with purpose.</span></div></div></section>

      <section id="faq" className="bg-muted/40 py-24 sm:py-32"><div className="container grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Good questions</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">The details matter.</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Still curious? Our team is here to help you make your next move with confidence.</p></div><div className="divide-y rounded-2xl border bg-background px-6">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pr-8 pt-4 leading-7 text-muted-foreground">{answer}</p></details>)}</div></div></section>

      <section className="container py-24 text-center sm:py-32"><Globe2 className="mx-auto mb-6 text-primary" /><h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Your next chapter starts with one decision.</h2><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Build a portfolio that reflects where you are going, not just where you have been.</p><Button size="lg" className="mt-8" asChild><a href={'/dashboard'}>Go to dashboard <ArrowRight data-icon="inline-end" /></a></Button></section>

      <footer className="border-t"><div className="container flex flex-col gap-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 font-semibold text-foreground"><span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles /></span> Northstar.</div><p>© 2025 Northstar Investments. Invest thoughtfully.</p><div className="flex gap-5"><a href="#faq" className="hover:text-foreground">Help center</a><a href="#opportunities" className="hover:text-foreground">Opportunities</a></div></div></footer>
    </main>
  );
}
