"use client";

import { MapPin, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const DISTRICTS = [
    {
        name: 'Kota Kinabalu',
        locations: 150,
        population: '500K+',
        growth: '+25%',
        image: '/district/kk.jpeg'
    },
    {
        name: 'Sandakan',
        locations: 45,
        population: '200K+',
        growth: '+18%',
        image: '/district/sandakan city.jpeg'
    },
    {
        name: 'Tawau',
        locations: 38,
        population: '180K+',
        growth: '+15%',
        image: '/district/tawau city.jpg'
    },
    {
        name: 'Kuching',
        locations: 100,
        population: '700K+',
        growth: '+20%',
        image: '/district/kuching city.jpg'
    },
    {
        name: 'Miri',
        locations: 60,
        population: '350K+',
        growth: '+15%',
        image: '/district/miri city.jpg'
    },
    {
        name: 'Sibu',
        locations: 40,
        population: '250K+',
        growth: '+10%',
        image: '/district/sibu.jpg'
    }
];

const OTHER_DISTRICTS = [
    'Bau', 'Beaufort', 'Beluran', 'Betong', 'Bintulu',
    'Kalabakan', 'Kapit', 'Kinabatangan', 'Kota Belud',
    'Kota Marudu', 'Kuala Penyu', 'Kudat', 'Kunak',
    'Limbang', 'Lundu', 'Mukah', 'Nabawan',
    'Papar', 'Penampang', 'Pitas', 'Putatan',
    'Ranau', 'Samarahan', 'Sarikei', 'Serian',
    'Sipitang', 'Sri Aman', 'Tambunan', 'Telupid',
    'Tenom', 'Tongod', 'Tuaran'
];

export function DistrictsCovered() {
    const t = useTranslations('home.districts');

    return (
        <section className="py-24 bg-slate-50">
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

                {/* Major Districts Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {DISTRICTS.map((district, index) => (
                        <Card key={district.name} className={`scroll-animate stagger-${(index % 3) + 1} group overflow-hidden rounded-none border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}>
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                                    <Image
                                        src={district.image}
                                        alt={district.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-2xl font-bold text-white mb-1">{district.name}</h3>
                                    <div className="flex items-center text-white/90 text-sm">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        {district.locations} {t('locations')}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center text-slate-500 text-xs mb-1">
                                            <Users className="h-3.5 w-3.5 mr-1" />
                                            {t('population')}
                                        </div>
                                        <div className="font-semibold text-slate-900">{district.population}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-slate-500 text-xs mb-1">
                                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                                            {t('growth')}
                                        </div>
                                        <div className="font-semibold text-green-600">{district.growth}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Other Districts List */}
                <div className="scroll-animate bg-white p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        {t('otherDistricts')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {OTHER_DISTRICTS.map((district) => (
                            <div key={district} className="flex items-center text-slate-600 hover:text-primary transition-colors cursor-default">
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3" />
                                {district}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
