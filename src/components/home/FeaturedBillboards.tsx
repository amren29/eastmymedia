import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Eye, TrendingUp } from 'lucide-react';
import { getFeaturedBillboards } from '@/lib/firestore-data';

export async function FeaturedBillboards() {
    // Fetch from Firestore, fallback to static data if empty (or for initial load speed if desired)
    let featuredBillboards = await getFeaturedBillboards();

    // Use fetched billboards only
    featuredBillboards = featuredBillboards.slice(0, 6);

    return (
        <section className="py-24 bg-slate-50">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Featured Locations</h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                            Explore our hand-picked selection of premium high-traffic billboards across Sabah.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex border-slate-300 hover:bg-white hover:text-primary" asChild>
                        <Link href="/explore">
                            View All Inventory <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredBillboards.map((billboard) => (
                        <Card key={billboard.id} className="group overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                                <Image
                                    src={billboard.image}
                                    alt={billboard.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className={`${billboard.type === 'Digital' ? 'bg-blue-500' :
                                        billboard.type === 'LED' ? 'bg-orange-500' : 'bg-green-500'
                                        } hover:bg-opacity-90 border-0 rounded-none`}>
                                        {billboard.type}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-5">
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                                            {billboard.name}
                                        </h3>
                                        <div className="mt-1 flex items-center text-sm text-slate-500">
                                            <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{billboard.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Daily Traffic</p>
                                        <div className="flex items-center mt-1 font-medium text-slate-900">
                                            <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                                            {billboard.trafficDaily?.toLocaleString() || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Size</p>
                                        <div className="mt-1 font-medium text-slate-900">
                                            {billboard.size}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-2">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                                        <p className="text-xl font-bold text-primary">
                                            RM {billboard.price.toLocaleString()}
                                            <span className="text-sm font-normal text-slate-400">/mo</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0">
                                <Button className="w-full bg-slate-900 hover:bg-primary transition-colors" asChild>
                                    <Link href={`/billboard/${billboard.id}`}>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Button size="lg" className="w-full" asChild>
                        <Link href="/explore">View All Inventory</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
