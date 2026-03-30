'use client';

import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Blog post keys that map to translations
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

export default function BlogPage() {
    const t = useTranslations('blog');
    useScrollAnimation();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="scroll-animate mb-4 bg-white/20 text-slate-900 border-white/30 hover:bg-white/30">{t('badge')}</Badge>
                        <h1 className="scroll-animate stagger-1 mb-6 text-5xl font-bold tracking-tight text-slate-900">
                            {t('title')}
                        </h1>
                        <p className="scroll-animate stagger-2 text-xl text-slate-800 leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {BLOG_POST_KEYS.map((post, index) => (
                            <article
                                key={post.key}
                                className={`scroll-animate stagger-${index + 1} group bg-slate-50 rounded-lg overflow-hidden border-0 hover:shadow-xl transition-shadow flex flex-col`}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-slate-100">
                                    <img
                                        src={post.image}
                                        alt={t(`posts.${post.key}.title`)}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
                                        {t(`posts.${post.key}.category`)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {t(`posts.${post.key}.date`)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {t(`posts.${post.key}.readTime`)}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {t(`posts.${post.key}.title`)}
                                    </h2>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {t(`posts.${post.key}.excerpt`)}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{t(`posts.${post.key}.author`)}</span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`}>
                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-semibold">
                                                {t('readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
