'use client';

import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function TermsPage() {
    const t = useTranslations('terms');
    useScrollAnimation();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-16 text-slate-900">
                <div className="container max-w-4xl mx-auto px-4">
                    <Badge className="scroll-animate mb-4 bg-white/20 text-slate-900 border-white/30 hover:bg-white/30">{t('badge')}</Badge>
                    <h1 className="scroll-animate stagger-1 text-4xl md:text-5xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="scroll-animate stagger-2 mt-4 text-lg text-slate-800">
                        {t('lastUpdated')}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="scroll-animate prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.acceptance.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.acceptance.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.description.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.description.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.description.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.accounts.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.accounts.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.ai.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.ai.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.ip.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.ip.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.conduct.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.conduct.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.conduct.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.disclaimer.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.disclaimer.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.liability.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.liability.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.thirdParty.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.thirdParty.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.modifications.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.modifications.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.governing.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.governing.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.contact.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.contact.content')}
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Eastmy Media</strong><br />
                            Email: info@eastmymedia.com<br />
                            Sabah, Malaysia
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
