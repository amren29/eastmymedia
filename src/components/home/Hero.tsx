"use client";

import { getSystemSettings } from '@/lib/firestore-data';

import Link from 'next/link';
import Image from 'next/image';
import { Typewriter } from '@/components/ui/typewriter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Monitor, Image as ImageIcon, Plane, Bus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';




export function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const t = useTranslations('home.hero');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        getSystemSettings().then(setSettings);
    }, []);

    const handleSearch = () => {
        router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-black py-20 lg:min-h-[700px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0">
                    <Image
                        src="/sliderhero/herosection.png"
                        alt="Eastmy Media Hero"
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                    />
                </div>
            </div>

            <div className="container relative z-20 mx-auto max-w-7xl px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-left">
                        {settings?.heroTitle ? (
                            <h1 className="scroll-animate-left mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-tight">
                                {settings.heroTitle}
                            </h1>
                        ) : (
                            <h1 className="scroll-animate-left mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-tight">
                                East Malaysia&#39;s <br />
                                <span className="text-[#01a981]">
                                    <Typewriter
                                        text={[
                                            "Largest Network of LED Screens & Billboards",
                                            "One-Stop Hub for DOOH, OOH & Signage",
                                            "Top Choice for High-Impact Campaigns"
                                        ]}
                                        speed={50}
                                        deleteSpeed={30}
                                        pause={2000}
                                    />
                                </span>
                            </h1>
                        )}

                        <p className="scroll-animate-left stagger-1 mb-8 text-lg text-slate-200 md:text-xl max-w-xl">
                            {settings?.heroSubtitle || t('description')}
                        </p>

                        {/* Popular Searches */}
                        <div className="scroll-animate-left stagger-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                            <span className="font-medium text-slate-400">{t('popular')}</span>
                            <button onClick={() => setSearchQuery('Kota Kinabalu')} className="bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors text-white rounded-md">Kota Kinabalu</button>
                            <button onClick={() => setSearchQuery('Jalan Lintas')} className="bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors text-white rounded-md">Jalan Lintas</button>
                            <button onClick={() => setSearchQuery('Sandakan')} className="bg-white/10 px-3 py-1 hover:bg-white/20 transition-colors text-white rounded-md">Sandakan</button>
                        </div>
                    </div>

                    {/* Right Column: Search Widget */}
                    <div className="scroll-animate-right stagger-3 w-full max-w-md mx-auto lg:ml-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                {t('exploreMedia')} <span className="text-[#01a981]">{t('exploreMediaHighlight')}</span> {t('exploreMediaEnd')}
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        {t('keyword')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('keywordPlaceholder')}
                                            className="h-14 w-full border-gray-200 bg-white pl-12 text-lg text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#01a981]"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-[#01a981] hover:bg-[#01906d] text-white font-bold text-xl"
                                    onClick={handleSearch}
                                >
                                    {t('search')}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-500">or</span>
                                    </div>
                                </div>

                                <Link href="/explore" className="w-full block">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full h-14 border-2 border-[#01a981] text-[#01a981] hover:bg-[#01a981]/5 font-bold text-xl"
                                    >
                                        Browse Media
                                    </Button>
                                </Link>

                            </div>

                            <div className="mt-10">
                                <h3 className="text-sm font-bold text-gray-900 mb-6">{t('browseByMedia')}</h3>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <Link href="/explore?type=static" className="group flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#01a981] transition-colors group-hover:border-[#01a981] group-hover:bg-[#01a981]/5">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-[#01a981]">{t('staticBillboard')}</span>
                                    </Link>
                                    <Link href="/explore?type=digital" className="group flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#01a981] transition-colors group-hover:border-[#01a981] group-hover:bg-[#01a981]/5">
                                            <Monitor className="h-8 w-8" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-[#01a981]">{t('digitalScreen')}</span>
                                    </Link>
                                    <Link href="/explore?type=airport" className="group flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#01a981] transition-colors group-hover:border-[#01a981] group-hover:bg-[#01a981]/5">
                                            <Plane className="h-8 w-8" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-[#01a981]">{t('airportAds')}</span>
                                    </Link>
                                    <Link href="/explore?type=mobile" className="group flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#01a981] transition-colors group-hover:border-[#01a981] group-hover:bg-[#01a981]/5">
                                            <Bus className="h-8 w-8" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-[#01a981]">{t('mobileAds')}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}
