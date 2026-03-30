'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp, MapPin, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AboutPage() {
    const t = useTranslations('aboutPage');
    useScrollAnimation();

    const values = [
        {
            icon: Users,
            title: t('values.customerFirst.title'),
            description: t('values.customerFirst.description')
        },
        {
            icon: TrendingUp,
            title: t('values.innovation.title'),
            description: t('values.innovation.description')
        },
        {
            icon: Award,
            title: t('values.excellence.title'),
            description: t('values.excellence.description')
        },
        {
            icon: MapPin,
            title: t('values.localExpertise.title'),
            description: t('values.localExpertise.description')
        }
    ];

    const stats = [
        { value: '50+', label: t('stats.billboards') },
        { value: '100+', label: t('stats.clients') },
        { value: '5M+', label: t('stats.impressions') },
        { value: '99%', label: t('stats.satisfaction') }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="scroll-animate mb-6 text-5xl font-bold tracking-tight text-slate-900">
                            {t('hero.title')}
                        </h1>
                        <p className="scroll-animate stagger-1 text-xl text-slate-800 leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2 h-full">
                        <Card className="scroll-animate-left border-0 shadow-lg h-full w-full bg-slate-50">
                            <CardContent className="p-8 h-full flex flex-col">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold">{t('mission.title')}</h2>
                                <p className="text-slate-600 leading-relaxed flex-1">
                                    {t('mission.description')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="scroll-animate-right border-0 shadow-lg h-full w-full bg-slate-50">
                            <CardContent className="p-8 h-full flex flex-col">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="mb-4 text-2xl font-bold">{t('vision.title')}</h2>
                                <p className="text-slate-600 leading-relaxed flex-1">
                                    {t('vision.description')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2 items-center">
                        <div>
                            <h2 className="scroll-animate mb-6 text-4xl font-bold">{t('story.title')}</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p className="scroll-animate stagger-1">{t('story.paragraph1')}</p>
                                <p className="scroll-animate stagger-2">{t('story.paragraph2')}</p>
                                <p className="scroll-animate stagger-3">{t('story.paragraph3')}</p>
                            </div>
                        </div>
                        <div className="scroll-animate-scale relative aspect-[4/3] overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                                alt="Team collaboration"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="scroll-animate mb-4 text-4xl font-bold">{t('values.title')}</h2>
                        <p className="scroll-animate stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
                            {t('values.subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <Card key={index} className={`scroll-animate stagger-${index + 1} text-center hover:shadow-lg transition-shadow`}>
                                <CardContent className="p-6">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <value.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
                                    <p className="text-slate-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-4 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className={`scroll-animate stagger-${index + 1}`}>
                                <div className="mb-2 text-5xl font-bold text-primary">{stat.value}</div>
                                <div className="text-slate-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
