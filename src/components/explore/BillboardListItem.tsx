import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Plus, Check } from 'lucide-react';
import { Billboard } from '@/lib/data';
import { useProposal } from '@/context/ProposalContext';

interface BillboardListItemProps {
    billboard: Billboard;
    onViewDetails: () => void;
}

export function BillboardListItem({ billboard, onViewDetails }: BillboardListItemProps) {
    const { addToProposal, removeFromProposal, isInProposal } = useProposal();
    const [imageError, setImageError] = useState(false);

    return (
        <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {billboard.image && !imageError ? (
                        <Image
                            src={billboard.image}
                            alt={billboard.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-xs font-medium">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-2 left-2">
                        <Badge className={`${billboard.type === 'Digital' || billboard.type === 'LED' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                            billboard.type === 'LED Screen' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                                'bg-[#009b4d] text-white hover:bg-[#008a44]'
                            } border-0 rounded-sm px-2 py-0.5 font-medium`}>
                            {billboard.type === 'Static' ? 'Static Billboard' : billboard.type}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-2">
                        <h3 className="font-bold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {billboard.skuId || billboard.code || 'NO-SKU'} - {billboard.type === 'Static' ? 'Static Billboard' : billboard.type}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                            <span className="truncate">{billboard.location}</span>
                        </div>
                    </div>

                    <div className="space-y-1 text-sm mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Display Size:</span>
                            <span className="font-medium">{billboard.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Daily Traffic:</span>
                            <span className="font-medium">{billboard.traffic || billboard.trafficDaily?.toLocaleString() || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-muted-foreground">Starting from</div>
                            <div className="text-lg font-bold text-primary">
                                RM {billboard.price.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails();
                            }}
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
