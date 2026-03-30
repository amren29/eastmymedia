import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, BarChart3, ExternalLink } from 'lucide-react';
import { Billboard } from '@/lib/data';
import Link from 'next/link';

interface BillboardDetailSidebarProps {
    billboard: Billboard | null;
    onClose: () => void;
}

export function BillboardDetailSidebar({ billboard, onClose }: BillboardDetailSidebarProps) {
    if (!billboard) return null;

    return (
        <div className="h-full w-full md:w-96 lg:w-[450px] bg-white shadow-xl border-l overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                <h2 className="text-lg font-bold">Billboard Details</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-4 space-y-6">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image
                        src={billboard.image}
                        alt={billboard.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Title & Location */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Badge>{billboard.type}</Badge>
                        {billboard.available ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Available Now
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Unavailable
                            </Badge>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{billboard.name}</h3>
                    <div className="flex items-center text-slate-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        {billboard.location}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Code: {billboard.code}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 rounded-xl border p-4">
                    <div>
                        <div className="text-sm text-slate-500">Daily Traffic</div>
                        <div className="flex items-center text-xl font-bold">
                            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                            {billboard.trafficDaily?.toLocaleString() || 'N/A'}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Dimensions</div>
                        <div className="text-xl font-bold">{billboard.size}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Format</div>
                        <div className="text-xl font-bold">{billboard.type}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Region</div>
                        <div className="text-xl font-bold">{billboard.region}</div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="rounded-xl bg-slate-50 p-6">
                    <div className="mb-4">
                        <div className="text-sm text-slate-500">Starting from</div>
                        <div className="text-3xl font-bold text-primary">
                            RM {billboard.price.toLocaleString()}
                            <span className="text-base font-normal text-slate-600">/mo</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Button size="lg" className="w-full">
                            Request Proposal
                        </Button>
                        <Button size="lg" variant="outline" className="w-full">
                            Add to Shortlist
                        </Button>
                    </div>
                </div>

                {/* Full Details Link */}
                <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/billboard/${billboard.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Full Details Page
                    </Link>
                </Button>
            </div>
        </div>
    );
}
