"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterSidebar() {
    const t = useTranslations('explore.filters');
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div
            className={cn(
                "relative h-full border-r bg-white transition-all duration-300 ease-in-out z-10 flex flex-col",
                isCollapsed ? "w-0 border-none" : "w-80 lg:w-96"
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-8 top-4 z-20 h-8 w-8 rounded-r-md border border-l-0 bg-white shadow-md hover:bg-slate-50"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            {/* Collapsed State - Hidden */}

            {/* Expanded State */}
            <div className={cn("flex-1 overflow-y-auto p-4", isCollapsed && "hidden")}>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t('heading')}</h2>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        {t('reset')}
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">{t('locationLabel')}</Label>
                        <Input id="search" placeholder={t('locationPlaceholder')} />
                    </div>

                    <Separator />

                    {/* Format */}
                    <div className="space-y-3">
                        <Label>{t('formatLabel')}</Label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'digital', label: t('digital') },
                                { key: 'static', label: t('static') },
                                { key: 'led', label: t('led') },
                                { key: 'vooh', label: t('vooh') }
                            ].map((format) => (
                                <Badge
                                    key={format.key}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                                >
                                    {format.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div className="space-y-3">
                        <Label>{t('priceRangeLabel')}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">{t('min')}</span>
                                <Input type="number" placeholder={t('minPlaceholder')} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">{t('max')}</span>
                                <Input type="number" placeholder={t('maxPlaceholder')} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Region */}
                    <div className="space-y-3">
                        <Label>{t('regionLabel')}</Label>
                        <div className="space-y-2">
                            {[
                                { key: 'kotaKinabalu', label: t('kotaKinabalu') },
                                { key: 'sandakan', label: t('sandakan') },
                                { key: 'tawau', label: t('tawau') },
                                { key: 'highways', label: t('highways') },
                                { key: 'malls', label: t('malls') }
                            ].map((region) => (
                                <div key={region.key} className="flex items-center space-x-2">
                                    <input type="checkbox" id={region.key} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <label htmlFor={region.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {region.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Availability */}
                    <div className="space-y-3">
                        <Label>{t('availabilityLabel')}</Label>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="available-now" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="available-now" className="text-sm font-medium leading-none">
                                {t('availableNow')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button className="w-full">{t('applyFilters')}</Button>
                </div>
            </div>
        </div>
    );
}
