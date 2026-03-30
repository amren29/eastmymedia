"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function AboutSection() {
    const t = useTranslations('home.about');

    return (
        <section className="w-full bg-slate-900">
            <div className="grid lg:grid-cols-2 min-h-[600px] lg:h-[800px]">
                {/* Left - Full Image */}
                <div className="relative h-full w-full min-h-[400px]">
                    <Image
                        src="/aboutus/aboutus.jpg"
                        alt="Team planning outdoor media campaign"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay Gradient for mobile text readability if needed, or just aesthetic */}
                    <div className="absolute inset-0 bg-black/10 lg:bg-transparent" />
                </div>

                {/* Right - Content */}
                <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white text-slate-900">
                    <div className="scroll-animate inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold mb-6 rounded-none w-fit">
                        {t('badge')}
                    </div>
                    <h2 className="scroll-animate stagger-1 text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900">
                        {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                    <p className="scroll-animate stagger-2 text-lg text-slate-600 mb-6 leading-relaxed">
                        {t('description1')}
                    </p>
                    <p className="scroll-animate stagger-3 text-lg text-slate-600 mb-12 leading-relaxed">
                        {t('description2')}
                    </p>

                    {/* Key Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                        <div className="scroll-animate-scale stagger-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-none flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{t('strategicTitle')}</h3>
                            <p className="text-sm text-slate-600">{t('strategicDesc')}</p>
                        </div>
                        <div className="scroll-animate-scale stagger-2">
                            <div className="w-12 h-12 bg-green-100 rounded-none flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{t('dataDrivenTitle')}</h3>
                            <p className="text-sm text-slate-600">{t('dataDrivenDesc')}</p>
                        </div>
                        <div className="scroll-animate-scale stagger-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-none flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{t('expertTitle')}</h3>
                            <p className="text-sm text-slate-600">{t('expertDesc')}</p>
                        </div>
                    </div>

                    <Button size="lg" className="scroll-animate stagger-4 rounded-none w-fit bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg" asChild>
                        <Link href="/about">
                            {t('learnMore')} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

