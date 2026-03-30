"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getActivePackages, PackageItem, getBillboards, Billboard, getSystemSettings } from '@/lib/firestore-data';
import { Package, Check, ArrowRight, MapPin, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PackagesPage() {
    const t = useTranslations('common');
    const [packages, setPackages] = useState<PackageItem[]>([]);
    const [billboards, setBillboards] = useState<Record<string, Billboard>>({});
    const [loading, setLoading] = useState(true);
    const [featureEnabled, setFeatureEnabled] = useState(true);

    useEffect(() => {
        const load = async () => {
            const settings = await getSystemSettings();
            if (!settings.enablePackages) {
                setFeatureEnabled(false);
                setLoading(false);
                return;
            }

            const [pkgData, billboardData] = await Promise.all([
                getActivePackages(),
                getBillboards()
            ]);

            // Map billboards for easy lookup
            const billboardMap: Record<string, Billboard> = {};
            billboardData.forEach(b => billboardMap[b.id] = b);

            setPackages(pkgData);
            setBillboards(billboardMap);
            setLoading(false);
        };
        load();
    }, []);

    if (!loading && !featureEnabled) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-8 w-8 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Feature Unavailable</h1>
                    <p className="text-slate-500 mb-8">
                        The packages feature is currently disabled or undergoing maintenance. Please check back later.
                    </p>
                    <Link href="/">
                        <Button className="bg-[#01a981] hover:bg-[#01906d] text-white">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero */}
            {/* Hero */}
            {/* Hero */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900">
                            Exclusive Media Packages
                        </h1>
                        <p className="text-xl text-slate-800 leading-relaxed">
                            Maximize your reach with our curated bundles. Combine premium locations and save on your advertising campaign.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : packages.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <h3 className="text-xl font-medium text-slate-800">No packages currently available.</h3>
                        <p className="text-slate-500 mt-2">Please check back later or browse our individual media inventory.</p>
                        <div className="mt-6">
                            <Link href="/media">
                                <Button>Browse Media</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => {
                            const savings = (pkg.standardTotal - pkg.packagePrice);
                            const savingPercent = Math.round((savings / pkg.standardTotal) * 100);

                            return (
                                <div key={pkg.id} className="bg-white rounded-none border border-slate-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 relative group">
                                    {/* Badge */}
                                    <div className="absolute top-4 right-4 bg-[#01a981] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                                        Save {savingPercent}%
                                    </div>

                                    {/* Image or Placeholder */}
                                    <div className="h-48 bg-slate-100 relative">
                                        {pkg.image ? (
                                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300">
                                                <Package className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 pt-6 pb-4 flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#01a981] transition-colors">{pkg.name}</h3>
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{pkg.description}</p>

                                        <div className="space-y-3 mb-8">
                                            <div className="text-sm font-bold text-slate-900 mb-3">
                                                {pkg.items.length} Locations Included:
                                            </div>
                                            <ul className="space-y-3">
                                                {pkg.items.map((itemId, idx) => {
                                                    const item = billboards[itemId];
                                                    return (
                                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                                            <CheckCircle2 className="h-5 w-5 text-[#01a981] shrink-0" />
                                                            <span className="leading-5">
                                                                {item ? `${item.code || item.skuId || 'N/A'} - ${item.type}` : 'Loading...'}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 border-t border-slate-100">
                                        <div className="mb-4">
                                            <p className="text-slate-400 text-sm line-through font-medium">Standard: RM {pkg.standardTotal.toLocaleString()}</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-bold text-[#01a981]">MYR</span>
                                                <span className="text-4xl font-bold text-slate-900">{pkg.packagePrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Link href={`/packages/${pkg.id}`} className="block">
                                            <Button className="w-full bg-[#01a981] hover:bg-[#01906d] text-white gap-2 h-11 text-base font-semibold transition-all">
                                                View Details <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
