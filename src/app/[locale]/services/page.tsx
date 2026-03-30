'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Map,
    Brain,
    BarChart3,
    Megaphone,
    Target,
    Zap,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ServicesPage() {
    const t = useTranslations('servicesPage');
    useScrollAnimation();

    const services = [
        {
            icon: Map,
            key: 'marketplace'
        },
        {
            icon: Brain,
            key: 'oohExpert'
        },
        {
            icon: BarChart3,
            key: 'analytics'
        },
        {
            icon: Megaphone,
            key: 'campaign'
        },
        {
            icon: Target,
            key: 'consulting'
        },
        {
            icon: Zap,
            key: 'digital'
        }
    ];

    const steps = [
        { key: 'discover' },
        { key: 'plan' },
        { key: 'launch' },
        { key: 'optimize' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="scroll-animate mb-4 bg-white/20 text-slate-900 border-white/30 hover:bg-white/30">
                            {t('hero.badge')}
                        </Badge>
                        <h1 className="scroll-animate stagger-1 mb-6 text-5xl font-bold tracking-tight text-slate-900">
                            {t('hero.title')}
                        </h1>
                        <p className="scroll-animate stagger-2 text-xl text-slate-800 leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Services */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="scroll-animate mb-4 text-4xl font-bold">{t('whatWeOffer.title')}</h2>
                        <p className="scroll-animate stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
                            {t('whatWeOffer.subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const features = t.raw(`services.${service.key}.features`) as string[];
                            return (
                                <Card key={index} className={`scroll-animate stagger-${(index % 3) + 1} hover:shadow-xl transition-shadow border-0 bg-slate-50`}>
                                    <CardHeader>
                                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                            <service.icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{t(`services.${service.key}.title`)}</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4 text-slate-600">{t(`services.${service.key}.description`)}</p>
                                        <ul className="space-y-2">
                                            {features.map((feature: string, idx: number) => (
                                                <li key={idx} className="flex items-center text-sm text-slate-600">
                                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="scroll-animate mb-4 text-4xl font-bold">{t('howItWorks.title')}</h2>
                        <p className="scroll-animate stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
                            {t('howItWorks.subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-4">
                        {steps.map((item, index) => (
                            <div key={index} className={`scroll-animate stagger-${index + 1} relative`}>
                                <div className="mb-4 text-6xl font-bold text-primary/10">
                                    {t(`howItWorks.steps.${item.key}.step`)}
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    {t(`howItWorks.steps.${item.key}.title`)}
                                </h3>
                                <p className="text-slate-600">
                                    {t(`howItWorks.steps.${item.key}.description`)}
                                </p>
                                {index < 3 && (
                                    <ArrowRight className="hidden md:block absolute -right-4 top-8 h-6 w-6 text-primary/30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="scroll-animate mb-4 text-4xl font-bold">{t('industries.title')}</h2>
                        <p className="scroll-animate stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
                            {t('industries.subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {(t.raw('industries.list') as string[]).map((industry: string, index: number) => (
                            <Card key={index} className={`scroll-animate stagger-${(index % 4) + 1} text-center hover:shadow-lg transition-shadow cursor-pointer`}>
                                <CardContent className="p-6">
                                    <p className="font-semibold text-slate-700">{industry}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
