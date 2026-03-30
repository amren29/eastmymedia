"use client";

import { useState } from 'react';
import Image from 'next/image';
import { MapboxMap } from '@/components/map/MapboxMap';
import { BillboardListItem } from '@/components/explore/BillboardListItem';

import { VOOHPackageListItem } from '@/components/explore/VOOHPackageListItem';
import { Billboard } from '@/lib/data';
import { useBillboards } from '@/hooks/useBillboards';
import { VOOH_PACKAGES } from '@/lib/voohPackages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin, Monitor, Eye, Car, Users, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ExplorePage() {
    const router = useRouter();
    const t = useTranslations('explore');
    const { billboards, loading } = useBillboards();
    useScrollAnimation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBillboardId, setSelectedBillboardId] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string>('all');
    const [showMap, setShowMap] = useState(false);
    const [showBillboards, setShowBillboards] = useState(true);
    const [showDigitalBillboards, setShowDigitalBillboards] = useState(true);
    const [showTraffic, setShowTraffic] = useState(false);
    const [showVOOHTraffic, setShowVOOHTraffic] = useState(false);
    const [showCrowdDensity, setShowCrowdDensity] = useState(true);
    const [showRoadsideBunting, setShowRoadsideBunting] = useState(false);


    // Filter billboards based on search, media type, and selection
    // Use fetched billboards if available, otherwise fallback to static (or empty while loading)
    // Use fetched billboards only
    const displayBillboards = billboards;

    let filteredBillboards = displayBillboards.filter(billboard => {
        const matchesSearch = billboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            billboard.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            billboard.region.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by type based on toggles
        const isDigital = billboard.type === 'Digital' || billboard.type === 'LED' || billboard.type === 'LED Screen';
        const isBunting = billboard.type === 'Roadside Bunting';
        let matchesType = false;

        if (isBunting) {
            matchesType = showRoadsideBunting;
        } else if (isDigital) {
            matchesType = showDigitalBillboards;
        } else {
            matchesType = showBillboards;
        }

        // Also respect the dropdown filter if it's used (optional, but good for consistency)
        if (mediaType !== 'all') {
            matchesType = matchesType && billboard.type === mediaType;
        }

        return matchesSearch && matchesType;
    }).sort((a, b) => {
        // Sort alphabetically by SKU, then Name
        const skuA = (a.skuId || a.code || a.name || '').toLowerCase();
        const skuB = (b.skuId || b.code || b.name || '').toLowerCase();
        return skuA.localeCompare(skuB);
    });



    // If a billboard is selected from map, show only that one
    if (selectedBillboardId) {
        filteredBillboards = displayBillboards.filter(b => b.id === selectedBillboardId);
    }

    // Calculate total results
    const totalResults = filteredBillboards.length +
        (showVOOHTraffic ? VOOH_PACKAGES.length : 0);

    const handleViewDetails = (billboardId: string) => {
        router.push(`/billboard/${billboardId}`);
    };

    const handleMarkerClick = (billboard: Billboard) => {
        setSelectedBillboardId(billboard.id);
        // On mobile, switch to list view to show details when a marker is clicked
        if (window.innerWidth < 1024) {
            setShowMap(false);
        }
    };



    const clearSelection = () => {
        setSelectedBillboardId(null);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] relative">
            {/* Map Section */}
            <div className={cn(
                "w-full lg:w-1/2 xl:w-3/5 h-full absolute lg:relative z-0 lg:z-auto bg-slate-100",
                showMap ? "block" : "hidden lg:block"
            )}>
                <MapboxMap
                    billboards={displayBillboards}
                    onBillboardSelect={handleMarkerClick}
                    showBillboards={showBillboards}
                    showDigitalBillboards={showDigitalBillboards}
                    showTraffic={showTraffic}
                    showVOOHTraffic={showVOOHTraffic}
                    showCrowdDensity={showCrowdDensity}
                    showRoadsideBunting={showRoadsideBunting}
                />
            </div>

            {/* List Section */}
            <div className={cn(
                "w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-white border-l h-full absolute lg:relative z-10 lg:z-auto",
                showMap ? "hidden lg:flex" : "flex"
            )}>
                {/* Search Header */}
                <div className="flex-shrink-0 border-b bg-white p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t('filters.location')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                disabled={!!selectedBillboardId}
                            />
                        </div>
                        <Select value={mediaType} onValueChange={setMediaType} disabled={!!selectedBillboardId}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder={t('filters.type')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('filters.all')}</SelectItem>
                                <SelectItem value="Digital">Digital</SelectItem>
                                <SelectItem value="Static">Static</SelectItem>
                                <SelectItem value="LED">LED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Map Layer Filters */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={showBillboards ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowBillboards(!showBillboards)}
                            className={cn(
                                "flex items-center gap-2",
                                showBillboards && "bg-emerald-500 hover:bg-emerald-600"
                            )}
                        >
                            <MapPin className="h-4 w-4" />
                            {showBillboards ? "Billboard" : "Billboard"}
                        </Button>

                        <Button
                            variant={showDigitalBillboards ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowDigitalBillboards(!showDigitalBillboards)}
                            className={cn(
                                "flex items-center gap-2",
                                showDigitalBillboards && "bg-blue-500 hover:bg-blue-600"
                            )}
                        >
                            <Monitor className="h-4 w-4" />
                            {showDigitalBillboards ? "LED Screen" : "LED Screen"}
                        </Button>

                        <Button
                            variant={showRoadsideBunting ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowRoadsideBunting(!showRoadsideBunting)}
                            className={cn(
                                "flex items-center gap-2",
                                showRoadsideBunting && "bg-orange-500 hover:bg-orange-600"
                            )}
                        >
                            <Flag className="h-4 w-4" />
                            {showRoadsideBunting ? "Roadside Bunting" : "Roadside Bunting"}
                        </Button>

                        <Button
                            variant={showVOOHTraffic ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowVOOHTraffic(!showVOOHTraffic)}
                            className={cn(
                                "flex items-center gap-2",
                                showVOOHTraffic && "bg-red-500 hover:bg-red-600"
                            )}
                        >
                            <Car className="h-4 w-4" />
                            {showVOOHTraffic ? "VOOH Traffic" : "VOOH Traffic"}
                        </Button>

                        <Button
                            variant={showTraffic ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowTraffic(!showTraffic)}
                            className={cn(
                                "flex items-center gap-2",
                                showTraffic && "bg-slate-700 hover:bg-slate-800"
                            )}
                        >
                            <Car className="h-4 w-4" />
                            {showTraffic ? "Traffic" : "Traffic"}
                        </Button>

                        <Button
                            variant={showCrowdDensity ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowCrowdDensity(!showCrowdDensity)}
                            className={cn(
                                "flex items-center gap-2",
                                showCrowdDensity && "bg-purple-500 hover:bg-purple-600"
                            )}
                        >
                            <Users className="h-4 w-4" />
                            {showCrowdDensity ? "Crowd" : "Crowd"}
                        </Button>
                    </div>

                    {/* Selection indicator */}
                    {(selectedBillboardId) && (
                        <div className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-md text-sm",
                            "bg-primary/10 text-primary"
                        )}>
                            <span className="font-medium">
                                {t('noResults')}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSelection}
                                className={cn(
                                    "h-6 px-2",
                                    "hover:bg-primary/20"
                                )}
                            >
                                <X className="h-4 w-4 mr-1" />
                                {t('filters.all')}
                            </Button>
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{totalResults}</span> {t('results')}
                    </div>
                </div>

                {/* Billboard List / Bunting Details / Mobile Ad Zone Details - Scrollable */}
                <div className="flex-1 overflow-y-auto">


                    {/* Bunting Point Details */}


                    {/* Combined List */}
                    <div className="divide-y scroll-animate">
                        {/* Billboards */}
                        {filteredBillboards.map((billboard) => (
                            <BillboardListItem
                                key={`billboard-${billboard.id}`}
                                billboard={billboard}
                                onViewDetails={() => handleViewDetails(billboard.id)}
                            />
                        ))}



                        {/* VOOH Packages */}
                        {showVOOHTraffic && VOOH_PACKAGES.map((pkg) => (
                            <VOOHPackageListItem
                                key={`vooh-${pkg.id}`}
                                package={pkg}
                            />
                        ))}

                        {/* No Results State */}
                        {filteredBillboards.length === 0 &&
                            (!showVOOHTraffic || VOOH_PACKAGES.length === 0) && (
                                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">{t('noResults')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('noResults')}
                                    </p>
                                </div>
                            )}
                    </div>

                </div>
            </div>

            {/* Mobile Map Toggle */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                <Button
                    onClick={() => setShowMap(!showMap)}
                    className="shadow-xl rounded-full px-6"
                    size="lg"
                >
                    {showMap ? "View List" : "View Map"}
                </Button>
            </div>
        </div>
    );
}
