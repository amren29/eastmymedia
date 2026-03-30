"use client";

import { Link } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getSystemSettings } from '@/lib/firestore-data';
import { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();
    const t = useTranslations();

    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        getSystemSettings().then(setSettings);
    }, []);

    // Don't show footer on OOH Expert page, Explore page, or Client Form
    if (pathname === '/oohexpert' || pathname === '/explore' || pathname === '/client-form') {
        return null;
    }

    return (
        <footer className="border-t bg-white">
            <div className="container max-w-7xl mx-auto py-12 md:py-16 px-4">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-12 md:gap-x-8">
                    <div className="space-y-4 md:col-span-5">
                        <h3 className="text-lg font-bold text-gray-900">{settings.websiteName || 'Eastmy Media'}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {settings.footerDescription || t('footer.description')}
                        </p>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-4 mt-4">
                            {settings.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {settings.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {settings.tiktokUrl && (
                                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
                                    {/* TikTok Icon replacement or text */}
                                    <span className="font-bold text-xs">TikTok</span>
                                </a>
                            )}
                            {settings.linkedinUrl && (
                                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/explore" className="hover:text-gray-900 transition-colors">{t('common.explore')}</Link></li>
                            <li><Link href="/media" className="hover:text-gray-900 transition-colors">{t('common.browseMedia')}</Link></li>

                            <li><Link href="/blog" className="hover:text-gray-900 transition-colors">{t('common.blog')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900">{t('common.aboutUs')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-gray-900 transition-colors">{t('common.aboutUs')}</Link></li>
                            <li><Link href="/services" className="hover:text-gray-900 transition-colors">{t('common.services')}</Link></li>
                            <li><Link href="/contact" className="hover:text-gray-900 transition-colors">{t('common.contact')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4 md:col-span-3">
                        <h4 className="text-sm font-semibold text-gray-900">{t('common.contact')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="text-gray-900 whitespace-pre-wrap">{settings.officeAddress || 'Sabah, Sarawak & Labuan'}</li>
                            <li className="text-gray-900">{settings.officialEmail || 'hello@eastmymedia.my'}</li>
                            {/* Phone number hidden as per request */}
                            {/* <li className="text-gray-900">{settings.officePhone || '+60 18-902 3676'}</li> */}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                        <p>{settings.copyrightText || t('footer.copyright')}</p>
                        <div className="flex items-center gap-4">
                            <Link href="/terms" className="hover:text-gray-900 transition-colors">{t('footer.terms')}</Link>
                            <Link href="/privacy" className="hover:text-gray-900 transition-colors">{t('footer.privacy')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

