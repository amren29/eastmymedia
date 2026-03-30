"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Share2,
    Download,
    Smartphone,
    Clock,
    Users,
    TrendingUp,
    Target,
    DollarSign,
    Eye,
    Car
} from 'lucide-react';
import { MapboxMap } from '@/components/map/MapboxMap';
import { MOBILE_AD_ZONES, getMobileAdZone, TRAFFIC_COLORS, MobileAdZone } from '@/lib/mobileAds';

export default function MobileAdsDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const zone = getMobileAdZone(id);

    if (!zone) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Zone Not Found</h1>
                <Button asChild className="mt-4">
                    <Link href="/explore">Back to Explore</Link>
                </Button>
            </div>
        );
    }

    const trafficColor = TRAFFIC_COLORS[zone.trafficLevel];

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Left Column: Traffic Visualization & Map (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Traffic Heatmap Visualization */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] w-full overflow-hidden border bg-slate-100 shadow-sm rounded-none flex items-center justify-center"
                                style={{ backgroundColor: `${trafficColor}15` }}>
                                <div className="text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 animate-ping opacity-20 rounded-full"
                                            style={{
                                                backgroundColor: trafficColor,
                                                width: '120px',
                                                height: '120px',
                                                margin: 'auto',
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0
                                            }}
                                        />
                                        <Car className="h-20 w-20 mx-auto relative z-10" style={{ color: trafficColor }} />
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-lg font-bold uppercase px-4 py-2 rounded"
                                            style={{
                                                backgroundColor: trafficColor,
                                                color: 'white'
                                            }}>
                                            {zone.trafficLevel.replace('-', ' ')} Traffic Zone
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600">
                                        {zone.dailyTraffic} people/day
                                    </p>
                                </div>
                            </div>

                            {/* Traffic Level Legend */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#DC262620' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
                                    <span>Very High</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#EF444420' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                                    <span>High</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#F8717120' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F87171' }} />
                                    <span>Medium</span>
                                </div>
                            </div>
                        </div>

                        {/* Mini Map */}
                        <div className="overflow-hidden border bg-slate-50 shadow-sm rounded-none">
                            <div className="h-64 w-full relative">
                                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                    <MapboxMap showTraffic={true} />
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 text-xs text-center text-slate-500 border-t">
                                <MapPin className="inline-block h-3 w-3 mr-1" />
                                {zone.district} District - {zone.area} km²
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details (7 cols) */}
                    <div className="lg:col-span-7">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: trafficColor }}>
                                <Car className="h-4 w-4" />
                                Car & Bus Wrap Advertising Zone
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {zone.name}
                            </h1>
                            <Badge className="border-0 text-sm px-3 py-1 rounded-none text-white"
                                style={{ backgroundColor: trafficColor }}>
                                {zone.trafficLevel.replace('-', ' ').toUpperCase()} TRAFFIC
                            </Badge>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6 border-b pb-2">
                                Zone Metrics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Car className="h-3 w-3" />
                                        Daily Traffic
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {zone.dailyTraffic}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Impressions/Day
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {zone.impressionsPerDay}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Peak Hours
                                    </p>
                                    <p className="font-semibold text-sm" style={{ color: trafficColor }}>
                                        {zone.peakHours}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        District Area
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {zone.area} km²
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Recommended Budget
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {zone.recommendedBudget}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        Demographics
                                    </p>
                                    <p className="font-semibold text-sm" style={{ color: trafficColor }}>
                                        {zone.demographics}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10 space-y-4 text-slate-600 leading-relaxed">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-4 border-b pb-2">
                                Zone Description
                            </h2>
                            <p>{zone.description}</p>

                            <div className="mt-4">
                                <p className="font-semibold text-slate-900 mb-2 underline">Best For:</p>
                                <div className="flex flex-wrap gap-2">
                                    {zone.bestFor.map((item, index) => (
                                        <Badge key={index} variant="outline" className="rounded-none">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold text-slate-900 mb-2 underline">Vehicle Ad Formats Available:</p>
                                <ul className="space-y-2 list-disc pl-5">
                                    <li>Full Car Wraps</li>
                                    <li>Partial Car Wraps</li>
                                    <li>Bus Body Wraps</li>
                                    <li>Rear Window Ads</li>
                                    <li>Fleet Branding</li>
                                    <li>E-Hailing Car Branding</li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                            <Button size="lg" className="text-white font-semibold px-8 h-12 rounded-none"
                                style={{ backgroundColor: trafficColor }}>
                                <Download className="mr-2 h-5 w-5" />
                                Download Media Kit
                            </Button>
                            <Button size="lg" variant="outline" className="font-semibold px-8 h-12 rounded-none"
                                style={{ borderColor: trafficColor, color: trafficColor }}>
                                <Share2 className="mr-2 h-5 w-5" />
                                Share
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Other Zones Section */}
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mt-20 border-t pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Other High-Traffic Zones</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {MOBILE_AD_ZONES
                            .filter(z => z.id !== zone.id)
                            .slice(0, 3)
                            .map((nearbyZone) => (
                                <div key={nearbyZone.id} className="group overflow-hidden border bg-white shadow-sm transition-all hover:shadow-lg rounded-none">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center"
                                        style={{ backgroundColor: `${TRAFFIC_COLORS[nearbyZone.trafficLevel]}15` }}>
                                        <Car className="h-16 w-16" style={{ color: TRAFFIC_COLORS[nearbyZone.trafficLevel] }} />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="border-0 rounded-none text-white"
                                                style={{ backgroundColor: TRAFFIC_COLORS[nearbyZone.trafficLevel] }}>
                                                {nearbyZone.trafficLevel.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg line-clamp-1 mb-1 group-hover:text-red-500 transition-colors">
                                            {nearbyZone.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-slate-500 mb-4">
                                            <Users className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="truncate">{nearbyZone.dailyTraffic}/day</span>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-slate-500">Budget from</p>
                                                <p className="text-lg font-bold" style={{ color: TRAFFIC_COLORS[nearbyZone.trafficLevel] }}>
                                                    {nearbyZone.recommendedBudget.split(' - ')[0]}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="outline" asChild className="rounded-none"
                                                style={{ borderColor: TRAFFIC_COLORS[nearbyZone.trafficLevel], color: TRAFFIC_COLORS[nearbyZone.trafficLevel] }}>
                                                <Link href={`/mobile-ads/${nearbyZone.id}`}>View Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
