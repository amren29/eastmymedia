"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Share2,
    Download,
    Car,
    Clock,
    Eye,
    TrendingUp,
    Target,
    DollarSign,
    Users,
    CheckCircle2
} from 'lucide-react';
import { getVOOHPackage, VOOH_PACKAGES } from '@/lib/voohPackages';

export default function VOOHPackageDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const pkg = getVOOHPackage(id);

    if (!pkg) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Package Not Found</h1>
                <Button asChild className="mt-4">
                    <Link href="/explore">Back to Explore</Link>
                </Button>
            </div>
        );
    }

    const getTrafficColor = (level: string) => {
        switch (level) {
            case 'very-high': return '#FF0000';
            case 'high': return '#FF6B6B';
            case 'moderate': return '#FFD700';
            case 'low': return '#6BB6FF';
            default: return '#6BB6FF';
        }
    };

    const trafficColor = getTrafficColor(pkg.trafficLevel);

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Left Column: Visual & Info (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Package Visual */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] w-full overflow-hidden border bg-slate-100 shadow-sm flex items-center justify-center"
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
                                            {pkg.carCount}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600">
                                        {pkg.estimatedImpressions} impressions
                                    </p>
                                </div>
                            </div>

                            {/* Traffic Level Legend */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#FF000020' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0000' }} />
                                    <span>Very High</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#FF6B6B20' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
                                    <span>High</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#FFD70020' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFD700' }} />
                                    <span>Moderate</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: '#6BB6FF20' }}>
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6BB6FF' }} />
                                    <span>Low</span>
                                </div>
                            </div>
                        </div>

                        {/* Package Info Card */}
                        <div className="overflow-hidden border bg-slate-50 shadow-sm">
                            <div className="p-4 bg-slate-50 border-b">
                                <h3 className="font-bold text-sm uppercase">Package Information</h3>
                            </div>
                            <div className="p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Coverage:</span>
                                    <span className="font-medium">{pkg.coverage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Duration:</span>
                                    <span className="font-medium">{pkg.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Traffic Level:</span>
                                    <span className="font-medium capitalize">{pkg.trafficLevel.replace('-', ' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details (7 cols) */}
                    <div className="lg:col-span-7">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: trafficColor }}>
                                <Car className="h-4 w-4" />
                                Vehicle Wrap Advertising Package
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                {pkg.name}
                            </h1>
                            <Badge className="border-0 text-sm px-3 py-1 text-white"
                                style={{ backgroundColor: trafficColor }}>
                                {pkg.carCount.toUpperCase()}
                            </Badge>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6 border-b pb-2">
                                Package Metrics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Car className="h-3 w-3" />
                                        Vehicles
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {pkg.carCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Est. Impressions
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {pkg.estimatedImpressions}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Campaign Duration
                                    </p>
                                    <p className="font-semibold text-sm" style={{ color: trafficColor }}>
                                        {pkg.duration}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Coverage Area
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {pkg.coverage}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Package Price
                                    </p>
                                    <p className="font-semibold" style={{ color: trafficColor }}>
                                        {pkg.price}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Traffic Level
                                    </p>
                                    <p className="font-semibold text-sm capitalize" style={{ color: trafficColor }}>
                                        {pkg.trafficLevel.replace('-', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10 space-y-4 text-slate-600 leading-relaxed">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-4 border-b pb-2">
                                Package Description
                            </h2>
                            <p>{pkg.description}</p>

                            <div className="mt-6">
                                <p className="font-semibold text-slate-900 mb-3 underline">What's Included:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>Full vehicle wrap design and installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>GPS tracking and route optimization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>Real-time impression analytics</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>Monthly performance reports</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>Professional photography of wrapped vehicles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: trafficColor }} />
                                        <span>Dedicated account manager</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                            <Button size="lg" className="text-white font-semibold px-8 h-12"
                                style={{ backgroundColor: trafficColor }}>
                                <Download className="mr-2 h-5 w-5" />
                                Download Package Info
                            </Button>
                            <Button size="lg" variant="outline" className="font-semibold px-8 h-12"
                                style={{ borderColor: trafficColor, color: trafficColor }}>
                                <Share2 className="mr-2 h-5 w-5" />
                                Share
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Other Packages Section */}
            {VOOH_PACKAGES.filter(p => p.id !== pkg.id).length > 0 && (
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mt-20 border-t pt-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Other VOOH Packages</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {VOOH_PACKAGES
                                .filter(p => p.id !== pkg.id)
                                .slice(0, 3)
                                .map((otherPkg) => {
                                    const otherColor = getTrafficColor(otherPkg.trafficLevel);
                                    return (
                                        <div key={otherPkg.id} className="group overflow-hidden border bg-white shadow-sm transition-all hover:shadow-lg">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center"
                                                style={{ backgroundColor: `${otherColor}15` }}>
                                                <Car className="h-16 w-16" style={{ color: otherColor }} />
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="border-0 text-white"
                                                        style={{ backgroundColor: otherColor }}>
                                                        {otherPkg.carCount}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg line-clamp-1 mb-1 group-hover:text-red-500 transition-colors">
                                                    {otherPkg.name}
                                                </h3>
                                                <div className="flex items-center text-sm text-slate-500 mb-4">
                                                    <Eye className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">{otherPkg.estimatedImpressions}</span>
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <p className="text-xs text-slate-500">Package Price</p>
                                                        <p className="text-lg font-bold" style={{ color: otherColor }}>
                                                            {otherPkg.price}
                                                        </p>
                                                    </div>
                                                    <Button size="sm" variant="outline" asChild
                                                        style={{ borderColor: otherColor, color: otherColor }}>
                                                        <Link href={`/vooh/${otherPkg.id}`}>View Details</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
