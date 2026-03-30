"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const t = useTranslations('home.faq');

    // Get FAQ items from translations
    const faqItems = t.raw('items') as Array<{ question: string; answer: string }>;

    return (
        <section className="py-24 bg-white">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="scroll-animate inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold mb-4 rounded-none">
                        {t('badge')}
                    </div>
                    <h2 className="scroll-animate stagger-1 text-4xl font-bold text-slate-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="scroll-animate stagger-2 text-lg text-slate-600">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqItems.map((faq, index) => (
                        <div
                            key={index}
                            className={`scroll-animate stagger-${(index % 6) + 1} border border-slate-200 rounded-none overflow-hidden hover:border-primary/50 transition-colors`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-slate-900 pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 py-4 bg-slate-50 text-slate-600 leading-relaxed border-t border-slate-200">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4">
                        {t('stillHaveQuestions')}
                    </p>
                    <a
                        href="/contact"
                        className="text-primary font-semibold hover:underline"
                    >
                        {t('contactSupport')}
                    </a>
                </div>
            </div>
        </section>
    );
}
