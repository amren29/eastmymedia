"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Facebook, Mail, MessageCircle, Twitter } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title?: string;
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const t = useTranslations('shareModal');
    const displayTitle = title || t('checkThisOut');
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(displayTitle);

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            alert(t('failedToCopy'));
        });
    };

    const shareLinks = [
        {
            name: 'X (Twitter)',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl">
                <DialogHeader className="flex flex-row items-center justify-between pb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900">{t('title')}</DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <p className="text-sm font-medium text-slate-700 mb-4">{t('shareVia')}</p>
                    <div className="flex justify-between gap-2 px-2">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition-colors group-hover:border-slate-400 group-hover:bg-slate-50">
                                    <link.icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-slate-700 mb-2">{t('pageLink')}</p>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2.5">
                            <div className="flex-1 truncate text-sm text-slate-500 select-all">
                                {url}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                title={t('copyToClipboard')}
                            >
                                {copied ? (
                                    <span className="text-xs font-bold text-green-600">{t('copied')}</span>
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
