"use client";

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Blog post keys that map to translations - showing latest 3
const BLOG_POST_KEYS: Array<{ key: string, slug: string, image: string }> = [
    {
        key: "guide2025",
        slug: "outdoor-advertising-sabah-guide-2025",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800"
    },
    {
        key: "whyBillboards",
        slug: "why-billboards-still-matter-2025",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
    },
    {
        key: "oohDigitalWorld",
        slug: "why-ooh-advertising-works-digital-world",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800"
    }
];


export function BlogSection() {
    const t = useTranslations('home.blogSection');
    const blogT = useTranslations('blog');

    return (
        <section className="py-24 bg-slate-50">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="scroll-animate inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold mb-4 rounded-none">
                            {t('badge')}
                        </div>
                        <h2 className="scroll-animate stagger-1 text-4xl font-bold text-slate-900 mb-4">
                            {t('title')}
                        </h2>
                        <p className="scroll-animate stagger-2 text-lg text-slate-600 max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>
                    <Button variant="outline" className="scroll-animate hidden sm:flex rounded-none" asChild>
                        <Link href="/blog">
                            {t('viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {BLOG_POST_KEYS.map((post, index) => (
                        <Card key={post.key} className={`scroll-animate stagger-${index + 1} group overflow-hidden rounded-none border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}>
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={blogT(`posts.${post.key}.title`)}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-none">
                                        {blogT(`posts.${post.key}.category`)}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                    <div className="flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                        {blogT(`posts.${post.key}.date`)}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {blogT(`posts.${post.key}.readTime`)}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {blogT(`posts.${post.key}.title`)}
                                </h3>
                                <p className="text-slate-600 mb-4 line-clamp-2">
                                    {blogT(`posts.${post.key}.excerpt`)}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-sm text-slate-600">{t('by')} {blogT(`posts.${post.key}.author`)}</span>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-primary font-semibold text-sm hover:underline flex items-center"
                                    >
                                        {t('readMore')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center sm:hidden">
                    <Button size="lg" className="w-full rounded-none" asChild>
                        <Link href="/blog">{t('viewAll')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
