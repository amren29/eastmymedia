"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Menu, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useProposal } from '@/context/ProposalContext';
import { Badge } from '@/components/ui/badge';

import { usePathname } from 'next/navigation';

import { getSystemSettings } from '@/lib/firestore-data';
import { useEffect, useState } from 'react';

export function Navbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const { selectedBillboards } = useProposal();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    getSystemSettings().then(data => {
      setSettings(data);
    });
  }, []);

  const packagesLabel = settings.packagesMenuLabel || 'Packages';
  const brandName = settings.websiteName || 'Eastmy Media';

  if (pathname?.includes('/client-form')) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            {settings.siteLogo ? (
              <img src={settings.siteLogo} alt={brandName} className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-xl font-bold tracking-tight text-gray-900">{brandName}</span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/explore" className="text-gray-700 transition-colors hover:text-gray-900">{t('explore')}</Link>
            <Link href="/media" className="text-gray-700 transition-colors hover:text-gray-900">{t('browseMedia')}</Link>
            {settings.enablePackages && (
              <Link href="/packages" className="text-gray-700 transition-colors hover:text-gray-900">{packagesLabel}</Link>
            )}

            <Link href="/blog" className="text-gray-700 transition-colors hover:text-gray-900">{t('blog')}</Link>
            <Link href="/contact" className="text-gray-700 transition-colors hover:text-gray-900">{t('contact')}</Link>

          </nav>

          <LanguageSwitcher />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-white border-gray-200">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center">
                  {settings.siteLogo ? (
                    <img src={settings.siteLogo} alt={brandName} className="h-8 w-auto object-contain" />
                  ) : (
                    <span className="text-xl font-bold tracking-tight text-gray-900">{brandName}</span>
                  )}
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/explore"
                      className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {t('explore')}
                    </Link>
                    <Link
                      href="/media"
                      className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {t('browseMedia')}
                    </Link>
                    {settings.enablePackages && (
                      <Link
                        href="/packages"
                        className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {packagesLabel}
                      </Link>
                    )}

                    <Link
                      href="/blog"
                      className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {t('blog')}
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {t('contact')}
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-4 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {t('contact')}
                    </Link>
                  </div>
                </nav>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
