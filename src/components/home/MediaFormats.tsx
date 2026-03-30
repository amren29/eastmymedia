"use client";

import { Monitor, Image as ImageIcon, Zap, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const FORMATS = [
    {
        icon: Monitor,
        nameKey: 'digitalBillboards',
        descKey: 'digitalDesc',
        color: 'blue',
        locations: 85
    },
    {
        icon: ImageIcon,
        nameKey: 'staticBillboards',
        descKey: 'staticDesc',
        color: 'green',
        locations: 120
    },
    {
        icon: Zap,
        nameKey: 'ledDisplays',
        descKey: 'ledDesc',
        color: 'orange',
        locations: 65
    },
    {
        icon: Radio,
        nameKey: 'transitMedia',
        descKey: 'transitDesc',
        color: 'purple',
        locations: 45
    }
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-100',
        icon: 'text-blue-600',
        badge: 'bg-blue-500'
    },
    green: {
        bg: 'bg-green-100',
        icon: 'text-green-600',
        badge: 'bg-green-500'
    },
    orange: {
        bg: 'bg-orange-100',
        icon: 'text-orange-600',
        badge: 'bg-orange-500'
    },
    purple: {
        bg: 'bg-purple-100',
        icon: 'text-purple-600',
        badge: 'bg-purple-500'
    }
};

export function MediaFormats() {
    const t = useTranslations('home.mediaFormats');

    return (
        <section className="py-24 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="scroll-animate inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold mb-4 rounded-none">
                        {t('badge')}
                    </div>
                    <h2 className="scroll-animate stagger-1 text-4xl font-bold text-slate-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="scroll-animate stagger-2 text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {FORMATS.map((format, index) => {
                        const Icon = format.icon;
                        const colors = colorClasses[format.color as keyof typeof colorClasses];

                        return (
                            <Card key={format.nameKey} className={`scroll-animate stagger-${index + 1} rounded-none border-0 shadow-md hover:shadow-xl transition-all group h-full`}>
                                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                                    <div className={`w-16 h-16 ${colors.bg} rounded-none flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-8 w-8 ${colors.icon}`} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t(format.nameKey)}</h3>



                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {t(format.descKey)}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="scroll-animate text-center">
                    <Button size="lg" className="rounded-none" asChild>
                        <Link href="/media">
                            {t('browseAll')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
