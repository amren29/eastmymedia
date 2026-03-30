import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from "@/components/layout/Navbar";
import { GlobalCTA } from "@/components/layout/GlobalCTA";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { ProposalProvider } from "@/context/ProposalContext";

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Get messages for the locale
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <ProposalProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <GlobalCTA />
                    <Footer />
                    {/* <WhatsAppButton /> */}
                    <BackToTopButton />
                </div>
            </ProposalProvider>
        </NextIntlClientProvider>
    );
}
