import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Leaf, Car } from 'lucide-react';
import { getLoginUrl } from '@/const';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: plans = [] } = trpc.plans.list.useQuery();
  const { data: categories = [] } = trpc.categories.list.useQuery();

  const categoryIcons: Record<string, React.ReactNode> = {
    'Solana Meme Coins': <TrendingUp className="w-8 h-8" />,
    'Agricultural Investments': <Leaf className="w-8 h-8" />,
    'Car Stocks': <Car className="w-8 h-8" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Badge className="bg-amber-500 text-slate-900">
                {t('hero.title')}
              </Badge>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {isAuthenticated ? (
                <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-600">
                  {t('nav.dashboard')}
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-600" asChild>
                    <a href={getLoginUrl()}>
                      {t('hero.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline">
                    {t('common.help')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('plans.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('plans.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan: any) => (
              <Card
                key={plan.id}
                className={`relative border-2 ${
                  plan.name === 'Gold' || plan.name === 'Platinum'
                    ? 'border-amber-500 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {(plan.name === 'Gold' || plan.name === 'Platinum') && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 px-3 py-1 rounded-bl text-sm font-bold">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-slate-900">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-amber-500">
                    ${plan.minAmount}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('plans.roi')}:</span>
                      <span className="font-semibold text-slate-900">{plan.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('plans.duration')}:</span>
                      <span className="font-semibold text-slate-900">{plan.duration} days</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    disabled={!isAuthenticated}
                  >
                    {t('plans.selectPlan')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category: any) => (
              <Card key={category.id} className="bg-white border-0">
                <CardHeader>
                  <div className="mb-4 text-amber-500">
                    {categoryIcons[category.name]}
                  </div>
                  <CardTitle className="text-slate-900">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{category.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('categories.expectedYield')}:</span>
                      <span className="font-semibold text-amber-500">{category.expectedYield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('categories.riskLevel')}:</span>
                      <Badge
                        variant="outline"
                        className={`${
                          category.riskLevel === 'high'
                            ? 'border-red-500 text-red-700'
                            : category.riskLevel === 'medium'
                            ? 'border-yellow-500 text-yellow-700'
                            : 'border-green-500 text-green-700'
                        }`}
                      >
                        {category.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {t('hero.description')}
          </h2>
          {!isAuthenticated && (
            <Button size="lg" className="bg-amber-500 text-slate-900 hover:bg-amber-600" asChild>
              <a href={getLoginUrl()}>
                {t('nav.login')} <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
