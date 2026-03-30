"use client";

import { VOOHPackage } from '@/lib/voohPackages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Eye, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface VOOHPackageListItemProps {
    package: VOOHPackage;
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

const getTrafficLabel = (level: string) => {
    switch (level) {
        case 'very-high': return 'Very High Traffic';
        case 'high': return 'High Traffic';
        case 'moderate': return 'Moderate Traffic';
        case 'low': return 'Low Traffic';
        default: return 'Low Traffic';
    }
};

export function VOOHPackageListItem({ package: pkg }: VOOHPackageListItemProps) {
    const router = useRouter();
    const trafficColor = getTrafficColor(pkg.trafficLevel);
    const trafficLabel = getTrafficLabel(pkg.trafficLevel);

    return (
        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex gap-4">
                {/* Icon Area */}
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${trafficColor}15` }}>
                    <Car className="h-16 w-16" style={{ color: trafficColor }} />
                    <div className="absolute top-2 left-2">
                        <Badge className="border-0 text-white" style={{ backgroundColor: trafficColor }}>
                            {pkg.carCount}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-2">
                        <h3 className="font-bold text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {pkg.name}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground mb-2 gap-2">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {pkg.coverage}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {pkg.duration}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 text-sm mb-3">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Impressions:</span>
                            <span className="font-medium">{pkg.estimatedImpressions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Traffic Level:</span>
                            <span className="font-medium text-xs" style={{ color: trafficColor }}>{trafficLabel}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-muted-foreground">Package Price</div>
                            <div className="text-lg font-bold" style={{ color: trafficColor }}>
                                {pkg.price}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="text-white"
                            style={{ backgroundColor: trafficColor }}
                            onClick={() => router.push(`/vooh/${pkg.id}`)}
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
