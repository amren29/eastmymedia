'use client';

import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function PrivacyPage() {
    const t = useTranslations('privacy');
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
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.intro.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.intro.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.collect.title')}</h2>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">{t('sections.collect.personal.title')}</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.collect.personal.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.collect.personal.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">{t('sections.collect.chat.title')}</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.collect.chat.content')}
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">{t('sections.collect.usage.title')}</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.collect.usage.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.collect.usage.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.use.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.use.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.use.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.storage.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.storage.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.thirdParty.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.thirdParty.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.thirdParty.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.thirdParty.note')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.sharing.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.sharing.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.sharing.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.rights.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.rights.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.rights.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.cookies.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.cookies.content')}
                        </p>
                        <ul className="list-disc pl-6 my-4 space-y-2">
                            {(t.raw('sections.cookies.items') as string[]).map((item, index) => (
                                <li key={index} className="text-slate-700">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.retention.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.retention.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.children.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.children.content')}
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{t('sections.changes.title')}</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            {t('sections.changes.content')}
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
