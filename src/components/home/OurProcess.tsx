"use client";

import { Search, Target, FileText, Rocket, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const STEPS = [
    {
        number: '01',
        icon: Search,
        titleKey: 'step1Title',
        descKey: 'step1Desc'
    },
    {
        number: '02',
        icon: Target,
        titleKey: 'step2Title',
        descKey: 'step2Desc'
    },
    {
        number: '03',
        icon: FileText,
        titleKey: 'step3Title',
        descKey: 'step3Desc'
    },
    {
        number: '04',
        icon: Rocket,
        titleKey: 'step4Title',
        descKey: 'step4Desc'
    }
];

export function OurProcess() {
    const t = useTranslations('home.process');

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="scroll-animate inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold mb-3 rounded-none">
                        {t('badge')}
                    </div>
                    <h2 className="scroll-animate stagger-1 text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                        {t('title')}
                    </h2>
                    <p className="scroll-animate stagger-2 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden lg:block relative">
                    {/* Horizontal Line */}
                    <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-200" />

                    <div className="grid grid-cols-4 gap-6">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.number} className={`scroll-animate stagger-${index + 1} relative text-center`}>
                                    {/* Icon Circle */}
                                    <div className="relative inline-flex items-center justify-center w-24 h-24 bg-white border-2 border-primary rounded-full mb-4 z-10 shadow-sm">
                                        <Icon className="h-10 w-10 text-primary" />
                                    </div>

                                    {/* Connector Dot */}
                                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-white" />

                                    {/* Content */}
                                    <h3 className="text-lg font-bold mb-2 text-slate-900">{t(step.titleKey)}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {t(step.descKey)}
                                    </p>

                                    {/* Check Icon */}
                                    <div className="flex justify-center mt-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile/Tablet View */}
                <div className="lg:hidden grid md:grid-cols-2 gap-6">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className={`scroll-animate stagger-${index + 1} relative bg-slate-50 p-6 rounded-none border border-slate-100`}>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-none flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-1 text-slate-900">{t(step.titleKey)}</h3>
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {t(step.descKey)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
