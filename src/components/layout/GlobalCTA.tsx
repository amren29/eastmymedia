"use client";

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GlobalCTA() {
    const pathname = usePathname();
    const t = useTranslations('globalCTA');

    // Don't show CTA on these pages
    const excludedPages = ['/media', '/explore', '/oohexpert', '/contact', '/terms', '/privacy', '/client-form'];

    // Check if pathname matches any excluded page (handles locale prefix)
    const shouldHide = excludedPages.some(page => pathname === page || pathname.endsWith(page));
    if (shouldHide) {
        return null;
    }

    return (
        <section className="py-20 bg-[#c6f4d1] text-gray-900">
            <div className="container max-w-7xl mx-auto px-4 text-center">
                <h2 className="mb-6 text-4xl font-bold">{t('title')}</h2>
                <p className="mb-8 text-xl text-gray-700 max-w-2xl mx-auto">
                    {t('description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800" asChild>
                        <Link href="/explore">{t('explore')}</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-gray-900 text-gray-900 hover:bg-white/50" asChild>
                        <Link href="/contact">{t('consultation')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
