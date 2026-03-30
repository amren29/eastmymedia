"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPackageById, PackageItem } from '@/lib/firestore-data';
import { getBillboardById, Billboard } from '@/lib/firestore-data';
import { ArrowLeft, Check, Share2, MapPin, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillboardListItem } from '@/components/explore/BillboardListItem';

export default function PackageDetailPage() {
    const params = useParams();
    const [pkg, setPkg] = useState<PackageItem | null>(null);
    const [items, setItems] = useState<Billboard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (params.id) {
                const packageData = await getPackageById(params.id as string);
                setPkg(packageData);

                if (packageData && packageData.items?.length) {
                    // Fetch all included billboards
                    // Note: Optimally we would have a 'getBillboardsByIds' bulk fetcher, 
                    // but for <10 items parallel fetching is acceptable.
                    const itemPromises = packageData.items.map(id => getBillboardById(id));
                    const itemData = await Promise.all(itemPromises);
                    setItems(itemData.filter(i => i !== null) as Billboard[]);
                }
                setLoading(false);
            }
        };
        load();
    }, [params.id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!pkg) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <h1 className="text-2xl font-bold text-slate-800">Package Not Found</h1>
            <Link href="/packages">
                <Button variant="outline">Back to Packages</Button>
            </Link>
        </div>
    );

    const whatsappMessage = encodeURIComponent(`Hi, I am interested in the "${pkg.name}" package (RM ${pkg.packagePrice.toLocaleString()}). Could you provide more details?`);
    const whatsappLink = `https://wa.me/60189023676?text=${whatsappMessage}`; // Using updated contact number

    const savings = (pkg.standardTotal - pkg.packagePrice);
    const savingPercent = Math.round((savings / pkg.standardTotal) * 100);

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/packages" className="hover:text-indigo-600 transition-colors">Packages</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium truncate">{pkg.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            {pkg.image && (
                                <div className="mb-6 rounded-2xl overflow-hidden shadow-sm aspect-video relative bg-slate-100">
                                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <h1 className="text-3xl md:text-3xl font-bold text-slate-900 mb-4">{pkg.name}</h1>
                            <p className="text-lg text-slate-600 leading-relaxed">{pkg.description}</p>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium">
                                    <MapPin className="h-4 w-4" />
                                    {items.length} Locations
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Valid until {new Date(pkg.validTo).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Included Locations</h2>
                            <div className="grid gap-4">
                                {items.map(item => (
                                    <div key={item.id} className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <BillboardListItem
                                            billboard={item}
                                            onViewDetails={() => { }} // No-op as link covers it, or could navigate
                                        />
                                        {/* Overlay to link to item detail */}
                                        <Link href={`/billboard/${item.id}`} className="absolute inset-0 z-10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-36">
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-medium">Standard Price</span>
                                    <span className="text-slate-400 line-through decoration-slate-400">RM {pkg.standardTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-900 font-bold text-lg">Package Price</span>
                                    <div className="text-right">
                                        <span className="block text-3xl font-bold text-[#009b4d]">RM {pkg.packagePrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-bold">
                                    <Check className="h-4 w-4" />
                                    You Save RM {savings.toLocaleString()} ({savingPercent}%)
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#009b4d] hover:bg-[#008a44] text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    Book This Package
                                </a>
                                <p className="text-xs text-center text-slate-400">
                                    Clicking allows you to inquire via WhatsApp directly.
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Package Terms</h4>
                                <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                                    <li>Subject to availability of individual slots.</li>
                                    <li>Booking valid for specified validity period only.</li>
                                    <li>Cannot be combined with other ongoing promotions.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
