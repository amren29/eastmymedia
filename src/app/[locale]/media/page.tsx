"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    MapPin,
    Eye,
    LayoutGrid,
    List as ListIcon,
    Flag,
    ImageOff
} from 'lucide-react';
import { useBillboards } from '@/hooks/useBillboards';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';



export default function MediaListingPage() {
    const t = useTranslations('media');
    const tCommon = useTranslations('common');
    const { billboards, loading } = useBillboards();
    useScrollAnimation();

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 800);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Geocode when search changes
    useEffect(() => {
        if (!debouncedSearch) {
            setSearchCoords(null);
            return;
        }

        const geocode = async () => {
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            if (!token) return;

            try {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedSearch)}.json?access_token=${token}&country=MY`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;
                    setSearchCoords({ lat, lng });
                } else {
                    setSearchCoords(null);
                }
            } catch (err) {
                console.error("Geocoding failed", err);
                setSearchCoords(null);
            }
        };

        geocode();
    }, [debouncedSearch]);

    // Import distance calc
    const { getDistanceFromLatLonInKm } = require('@/lib/utils');


    // Combine billboards
    const displayBillboards = billboards;
    const allMedia = displayBillboards;

    // Unique values for filters
    const types = Array.from(new Set(allMedia.map(b => b.type)));
    const regions = Array.from(new Set(allMedia.map(b => b.region)));

    // Filter Logic
    const filteredMedia = allMedia.filter(item => {
        const matchesText =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.skuId && item.skuId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()));

        // Check if item is within 20km of search location
        let matchesLocation = false;
        if (searchCoords && item.latitude && item.longitude) {
            const dist = getDistanceFromLatLonInKm(
                searchCoords.lat,
                searchCoords.lng,
                item.latitude,
                item.longitude
            );
            if (dist <= 20) { // 20km radius
                matchesLocation = true;
            }
        }

        const matchesSearch = matchesText || matchesLocation;

        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;

        let matchesPrice = true;
        if (selectedPriceRange === 'under-5k') matchesPrice = item.price < 5000;
        if (selectedPriceRange === '5k-10k') matchesPrice = item.price >= 5000 && item.price <= 10000;
        if (selectedPriceRange === '10k-20k') matchesPrice = item.price > 10000 && item.price <= 20000;
        if (selectedPriceRange === '20k-plus') matchesPrice = item.price > 20000;

        return matchesSearch && matchesType && matchesRegion && matchesPrice;
    }).sort((a, b) => {
        // Sort alphabetically by SKU, then Name
        const skuA = (a.skuId || a.code || a.name || '').toLowerCase();
        const skuB = (b.skuId || b.code || b.name || '').toLowerCase();
        return skuA.localeCompare(skuB);
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b sticky top-16 z-30 shadow-sm">
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="scroll-animate text-2xl font-bold text-slate-900">{t('title')}</h1>
                                <p className="scroll-animate stagger-1 text-sm text-slate-500">
                                    {filteredMedia.length} {t('results')}
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                                {/* Search Bar */}
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder={t('searchPlaceholder')}
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Filters */}
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder={t('filters.mediaType')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
                                        {types.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder={t('filters.region')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('filters.allRegions')}</SelectItem>
                                        {regions.map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                                    <SelectTrigger className="w-full md:w-[160px]">
                                        <SelectValue placeholder={t('filters.priceRange')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('filters.anyPrice')}</SelectItem>
                                        <SelectItem value="under-5k">{t('filters.under5k')}</SelectItem>
                                        <SelectItem value="5k-10k">{t('filters.5kTo10k')}</SelectItem>
                                        <SelectItem value="10k-20k">{t('filters.10kTo20k')}</SelectItem>
                                        <SelectItem value="20k-plus">{t('filters.above20k')}</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Toggle */}
                                <div className="flex border rounded-md bg-card ml-auto md:ml-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-none rounded-l-md ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-none rounded-r-md ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <ListIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 py-8">
                {/* Results Grid */}
                <div className="flex-1">
                    {filteredMedia.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 bg-card rounded-lg border border-dashed">
                            <Search className="h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">{t('noResults')}</h3>
                            <p className="text-slate-500">{t('tryAdjusting')}</p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedType('all');
                                    setSelectedRegion('all');
                                    setSelectedPriceRange('all');
                                }}
                            >
                                {t('clearFilters')}
                            </Button>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "space-y-4"}>
                            {filteredMedia.map((item) => (
                                viewMode === 'grid' ? (
                                    // Grid View Card
                                    <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all rounded-none border-0 shadow-sm ring-1 ring-slate-200">
                                        <div className="relative aspect-[4/3] bg-slate-200">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-slate-400 bg-slate-100">
                                                    <ImageOff className="h-8 w-8" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge className={`${item.type === 'Digital' ? 'bg-blue-500' :
                                                    item.type === 'LED' ? 'bg-orange-500' :
                                                        'bg-green-500'
                                                    } hover:bg-opacity-90 border-0 rounded-none shadow-sm`}>
                                                    {item.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                {item.skuId || item.code || 'NO-SKU'} - {item.type === 'Static' ? 'Static Billboard' : item.type}
                                            </h3>
                                            <div className="flex items-center text-xs text-slate-500 mb-3">
                                                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{item.location}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                                <div>
                                                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">{t('traffic')}</p>
                                                    <p className="font-medium">{item.traffic || item.trafficDaily?.toLocaleString() || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">{t('size')}</p>
                                                    <p className="font-medium">{item.size}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between pt-2 border-t border-slate-100">
                                                <div>
                                                    <p className="text-[10px] text-slate-500">{t('startingFrom')}</p>
                                                    <p className="text-base font-bold text-primary">
                                                        RM {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button className="w-full rounded-none h-9 text-sm" variant="outline" asChild>
                                                <Link href={`/billboard/${item.id}`}>{t('viewDetails')}</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ) : (
                                    // List View Card
                                    <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-all rounded-none border-0 shadow-sm ring-1 ring-slate-200">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto bg-slate-200">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-slate-400 bg-slate-100">
                                                        <ImageOff className="h-8 w-8" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <Badge className={`${item.type === 'Digital' ? 'bg-blue-500' :
                                                        item.type === 'LED' ? 'bg-orange-500' :
                                                            'bg-green-500'
                                                        } hover:bg-opacity-90 border-0 rounded-none`}>
                                                        {item.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                                                {item.skuId || item.code || 'NO-SKU'} - {item.type === 'Static' ? 'Static Billboard' : item.type}
                                                            </h3>
                                                            <div className="flex items-center text-sm text-slate-500 mt-1">
                                                                <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                                                {item.location}
                                                            </div>
                                                        </div>
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-xs text-slate-500">{t('startingFrom')}</p>
                                                            <p className="text-xl font-bold text-primary">
                                                                RM {item.price.toLocaleString()}
                                                                <span className="text-sm font-normal text-slate-400">{t('perMonth')}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-6 mt-4 text-sm">
                                                        <div>
                                                            <p className="text-slate-500 text-xs uppercase font-semibold">{t('dailyTraffic')}</p>
                                                            <p className="font-medium mt-1">{item.traffic || item.trafficDaily?.toLocaleString() || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 text-xs uppercase font-semibold">{t('size')}</p>
                                                            <p className="font-medium mt-1">{item.size}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 text-xs uppercase font-semibold">{t('filters.region')}</p>
                                                            <p className="font-medium mt-1">{item.region}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex items-center justify-between sm:justify-end gap-4">
                                                    <div className="sm:hidden">
                                                        <p className="text-lg font-bold text-primary">
                                                            RM {item.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <Button asChild className="rounded-none">
                                                        <Link href={`/billboard/${item.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" /> {t('viewDetails')}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
