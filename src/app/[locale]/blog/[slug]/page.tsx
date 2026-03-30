'use client';

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Optional, for HTML support if needed

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    status: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const t = useTranslations('blog');
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;

                if (data) {
                    setPost(data as BlogPost);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative">
                <div className="h-[400px] w-full overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 pb-12">
                    <div className="container max-w-4xl mx-auto px-4">
                        <Badge className="mb-4 bg-primary text-white">{post.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/80 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {Math.ceil(post.content.split(' ').length / 200)} min read
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container max-w-4xl mx-auto px-4">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-8 -ml-4 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('backToBlog')}
                        </Button>
                    </Link>

                    <article className="prose prose-lg max-w-none text-slate-700">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                h1: ({ node, ...props }) => <h2 className="text-3xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3" {...props} />,
                                p: ({ node, ...props }) => <p className="leading-relaxed mb-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="text-slate-700" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                                        <p className="text-blue-800 m-0 italic font-medium">
                                            {props.children}
                                        </p>
                                    </div>
                                ),
                                a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                                img: ({ node, ...props }) => (
                                    <img className="rounded-xl w-full my-8 shadow-sm" {...props} alt={props.alt || ''} />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </article>
                </div>
            </section>
        </div>
    );
}
