"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    MapPin,
    Share2,
    Download,
    ArrowLeft,
    CheckCircle2,
    Calendar,
    Maximize2,
    Monitor,
    Navigation,
    BarChart3
} from 'lucide-react';
import { Billboard } from '@/lib/data';
import { getBillboardById } from '@/lib/firestore-data';
import { MapboxMap } from '@/components/map/MapboxMap';
import { useTranslations } from 'next-intl';
import { RateCardModal } from '@/components/RateCardModal';
import { ShareModal } from '@/components/ShareModal';
// Using standard alert for now if sonner is not available
// import { useState, useEffect } from 'react';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function BillboardDetailPage() {
    // useScrollAnimation(); // Disabled - causes content to be invisible on load
    const params = useParams();
    const id = params.id as string;
    const [billboard, setBillboard] = useState<Billboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [debugLog, setDebugLog] = useState<string[]>(['Component mounted']);
    const t = useTranslations('billboard');
    const tCommon = useTranslations('common');

    const [nearbyBillboards, setNearbyBillboards] = useState<Billboard[]>([]);
    const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const addLog = (msg: string) => {
        console.log('[DEBUG]', msg);
        setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };



    useEffect(() => {
        addLog(`useEffect triggered with ID: ${id}`);
        async function fetchBillboard() {
            addLog('fetchBillboard started');
            let foundBillboard: Billboard | null = null;
            let error: string | null = null;

            // Strategy 1: Direct Fetch with Timeout
            try {
                addLog('Strategy 1: Direct fetch starting...');
                const fetchPromise = getBillboardById(id);
                const timeoutPromise = new Promise<Billboard | null>((_, reject) =>
                    setTimeout(() => reject(new Error("Direct fetch timed out")), 2000)
                );
                foundBillboard = await Promise.race([fetchPromise, timeoutPromise]);
                addLog(foundBillboard ? 'Direct fetch SUCCESS' : 'Direct fetch returned null');
            } catch (err: any) {
                addLog(`Strategy 1 FAILED: ${err.message}`);
                error = err.message;
            }

            // Strategy 2: Fallback - Fetch All and Find
            if (!foundBillboard) {
                try {
                    addLog('Strategy 2: Fallback - fetching all billboards...');
                    const { getBillboards } = await import('@/lib/firestore-data');
                    const all = await getBillboards();
                    addLog(`Fetched ${all.length} billboards from fallback`);
                    const match = all.find(b => b.id === id);
                    if (match) {
                        addLog('Found billboard in fallback list!');
                        foundBillboard = match;
                        error = null;
                    } else {
                        addLog('Billboard NOT found in fallback list');
                        if (!error) error = "ID not found in database";
                    }
                } catch (fallbackErr: any) {
                    addLog(`Fallback FAILED: ${fallbackErr.message}`);
                    if (!error) error = fallbackErr.message || "Fallback failed";
                }
            }

            // Render Result
            if (foundBillboard) {
                addLog('Setting billboard state...');
                setBillboard(foundBillboard);
                try {
                    // Fetch nearby data (background)
                    const { getBillboards } = await import('@/lib/firestore-data');
                    const { getDistanceFromLatLonInKm } = await import('@/lib/utils');
                    const all = await getBillboards();

                    const validCoords = all.filter(b => b.id !== id && b.latitude && b.longitude);
                    if (!foundBillboard.latitude || !foundBillboard.longitude) {
                        setNearbyBillboards(validCoords.filter(b => b.region === foundBillboard!.region).slice(0, 3));
                    } else {
                        const withDistances = validCoords.map(b => ({
                            ...b,
                            _distance: getDistanceFromLatLonInKm(foundBillboard!.latitude, foundBillboard!.longitude, b.latitude, b.longitude)
                        })).sort((a, b) => a._distance - b._distance);
                        setNearbyBillboards(withDistances.slice(0, 3));
                    }
                } catch (e) {
                    console.error("Nearby fetch error:", e);
                }
            } else {
                setErrorMsg(error);
            }

            setLoading(false);
        }
        fetchBillboard();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-slate-600">Loading...</p>
            </div>
        );
    }

    if (!billboard) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">{t('details')}</h1>
                <p className="text-red-500 mt-2 font-mono">
                    {errorMsg ? `Error: ${errorMsg}` : `ID not found: ${id}`}
                </p>
                <Button asChild className="mt-4">
                    <Link href="/explore">{tCommon('back')}</Link>
                </Button>
            </div>
        );
    }

    // Mock additional data for the UI to match the screenshot


    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Left Column: Images & Map (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden border bg-slate-100 shadow-sm rounded-none">
                            <Image
                                src={billboard.image || 'https://placehold.co/600x400?text=No+Image'}
                                alt={billboard.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Mini Map */}
                        <div className="overflow-hidden border bg-slate-50 shadow-sm rounded-none">
                            <div className="h-64 w-full relative">
                                <MapboxMap
                                    billboards={[billboard]}
                                />
                            </div>
                            <div className="p-3 bg-slate-50 text-xs text-center text-slate-500 border-t">
                                <MapPin className="inline-block h-3 w-3 mr-1" />
                                Map View: {billboard.location}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details (7 cols) */}
                    <div className="lg:col-span-7">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-[#01a981] text-sm font-medium mb-2">
                                <MapPin className="h-4 w-4" />
                                {t('advertisingSpace')} {billboard.location}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {billboard.skuId ? `${billboard.skuId} - ` : ''}{billboard.name}
                            </h1>
                            <Badge className={`${billboard.type === 'Digital' || billboard.type === 'LED' ? 'bg-blue-600 hover:bg-blue-700' :
                                billboard.type === 'LED Screen' ? 'bg-orange-500 hover:bg-orange-600' :
                                    'bg-[#01a981] hover:bg-[#01906d]'
                                } border-0 text-sm px-3 py-1 rounded-none text-white`}>
                                {billboard.type === 'Static' ? t('typeStatic') : billboard.type}
                            </Badge>
                        </div>

                        {/* Media Information Grid */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6 border-b pb-2">
                                {t('mediaInfo')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{t('mediaPanel')}</p>
                                    <p className="font-semibold text-[#01a981] flex items-center">
                                        {billboard.totalPanel || 1}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{t('displaySize')}</p>
                                    <p className="font-semibold text-[#01a981]">
                                        {billboard.size}
                                    </p>
                                </div>
                                {billboard.resolution && (
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">{t('resolution')}</p>
                                        <p className="font-semibold text-[#01a981]">
                                            {billboard.resolution}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{t('gpsCoordinate')}</p>
                                    <p className="font-semibold text-[#01a981] text-sm font-mono">
                                        {billboard.gps || `${billboard.latitude}, ${billboard.longitude}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{t('trafficVolume')}</p>
                                    <p className="font-semibold text-[#01a981]">
                                        {billboard.traffic || billboard.trafficDaily?.toLocaleString() || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{t('mediaAvailability')}</p>
                                    <p className={`font-semibold ${billboard.available ? 'text-[#01a981]' : 'text-red-600'}`}>
                                        {billboard.available ? t('available') : t('booked')}
                                    </p>
                                </div>
                                {billboard.targetMarket && (
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">{t('targetMarket')}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {billboard.targetMarket.split(',').slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-sm font-semibold text-[#01a981]">
                                                    {tag.trim()}{i < Math.min(billboard.targetMarket!.split(',').length, 3) - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                            {billboard.targetMarket.split(',').length > 3 && (
                                                <span className="text-sm text-[#01a981]">...</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Technical Specifications */}
                        {(billboard.operatingTime || billboard.fileFormat || billboard.durationPerAd) && (
                            <div className="mb-10">
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-4 border-b pb-2">
                                    {t('specification')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-700">
                                    {billboard.operatingTime && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.operatingTime')}</span>
                                            {billboard.operatingTime}
                                        </div>
                                    )}
                                    {billboard.durationPerAd && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.durationPerAd')}</span>
                                            {billboard.durationPerAd}
                                        </div>
                                    )}
                                    {billboard.noOfAdvertiser && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.noOfAdvertisers')}</span>
                                            {billboard.noOfAdvertiser}
                                        </div>
                                    )}
                                    {billboard.loopPerHr && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.loopsPerHour')}</span>
                                            {billboard.loopPerHr}
                                        </div>
                                    )}
                                    {billboard.minLoopPerDay && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.minLoopsPerDay')}</span>
                                            {billboard.minLoopPerDay}
                                        </div>
                                    )}
                                    {billboard.fileFormat && (
                                        <div>
                                            <span className="font-bold uppercase mr-2">{t('specs.fileFormat')}</span>
                                            {billboard.fileFormat}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-10 space-y-4 text-slate-600 leading-relaxed">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-4 border-b pb-2">
                                {t('description')}
                            </h2>
                            <p className="whitespace-pre-wrap">
                                {billboard.description || t('descriptionText', { location: billboard.location })}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                            <Button
                                size="lg"
                                className="bg-[#01a981] hover:bg-[#01906d] text-white font-semibold px-8 h-12 rounded-none"
                                onClick={() => setIsRateCardModalOpen(true)}
                            >
                                <Download className="mr-2 h-5 w-5" />
                                {t('downloadPricing')}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#01a981] text-[#01a981] hover:bg-green-50 font-semibold px-8 h-12 rounded-none"
                                onClick={handleShare}
                            >
                                <Share2 className="mr-2 h-5 w-5" />
                                {t('share')}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 h-12 rounded-none"
                                onClick={() => window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${billboard.latitude},${billboard.longitude}`, '_blank')}
                            >
                                <Navigation className="mr-2 h-5 w-5" />
                                {t('browseStreetView')}
                            </Button>
                        </div>

                        <RateCardModal
                            isOpen={isRateCardModalOpen}
                            onClose={() => setIsRateCardModalOpen(false)}
                            media={billboard}
                        />

                        <ShareModal
                            isOpen={isShareModalOpen}
                            onClose={() => setIsShareModalOpen(false)}
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            title={`${tCommon('checkThisOut')} ${billboard.name} at ${billboard.location}`}
                        />

                    </div>
                </div>
            </div>

            {/* Nearby Media Section */}
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mt-20 border-t pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('nearbyMedia')}</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {nearbyBillboards
                            .map((nearbyBillboard) => (
                                <div key={nearbyBillboard.id} className="group overflow-hidden border bg-white shadow-sm transition-all hover:shadow-lg rounded-none">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                                        <Image
                                            src={nearbyBillboard.image || 'https://placehold.co/600x400?text=No+Image'}
                                            alt={nearbyBillboard.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-[#01a981] hover:bg-[#01906d] border-0 rounded-none text-white">
                                                {nearbyBillboard.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                            {nearbyBillboard.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-slate-500 mb-4">
                                            <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="truncate">{nearbyBillboard.location}</span>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-slate-500">{t('startingFrom')}</p>
                                                <p className="text-lg font-bold text-[#01a981]">
                                                    RM {nearbyBillboard.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="outline" asChild className="rounded-none border-[#01a981] text-[#01a981] hover:bg-green-50">
                                                <Link href={`/billboard/${nearbyBillboard.id}`}>{t('viewDetails')}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
