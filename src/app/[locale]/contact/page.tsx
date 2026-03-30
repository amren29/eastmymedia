'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useEffect } from 'react';
import { getSystemSettings } from '@/lib/firestore-data';

export default function ContactPage() {
    const t = useTranslations('contact');
    useScrollAnimation();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        getSystemSettings().then(setSettings);
    }, []);

    // ... (rest of the component until Render)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ... Hero Section ... */}
            <section className="bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-16 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="scroll-animate mb-4 text-5xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
                        <p className="scroll-animate stagger-1 text-xl text-slate-800">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Form - Unchanged */}
                        <div className="lg:col-span-2">
                            <Card className="scroll-animate-left shadow-lg border-0">
                                <CardContent className="p-8">
                                    <h2 className="mb-6 text-2xl font-bold">{t('form.title')}</h2>
                                    <form className="space-y-6" onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const formData = new FormData(form);
                                        const data = Object.fromEntries(formData.entries());

                                        const btn = form.querySelector('button[type="submit"]');
                                        if (btn) {
                                            const originalText = btn.innerHTML;
                                            btn.innerHTML = 'Sending...';
                                            (btn as HTMLButtonElement).disabled = true;

                                            try {
                                                const response = await fetch('/api/contact', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(data),
                                                });

                                                const result = await response.json();

                                                if (!response.ok) {
                                                    throw new Error(result.error || 'Failed to send message');
                                                }

                                                btn.innerHTML = 'Message Sent!';
                                                (btn as HTMLButtonElement).classList.remove('bg-primary');
                                                (btn as HTMLButtonElement).classList.add('bg-green-600');
                                                form.reset();

                                                setTimeout(() => {
                                                    btn.innerHTML = originalText;
                                                    (btn as HTMLButtonElement).disabled = false;
                                                    (btn as HTMLButtonElement).classList.add('bg-primary');
                                                    (btn as HTMLButtonElement).classList.remove('bg-green-600');
                                                    setShowSuccessModal(true);
                                                }, 500);
                                            } catch (error) {
                                                console.error('Error sending message:', error);
                                                btn.innerHTML = 'Failed';
                                                (btn as HTMLButtonElement).classList.add('bg-red-600');
                                                alert('Failed to send message. Please try again later.');

                                                setTimeout(() => {
                                                    btn.innerHTML = originalText;
                                                    (btn as HTMLButtonElement).disabled = false;
                                                    (btn as HTMLButtonElement).classList.remove('bg-red-600');
                                                }, 2000);
                                            }
                                        }
                                    }}>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">{t('form.firstName')} *</Label>
                                                <Input id="firstName" name="firstName" placeholder={t('form.firstNamePlaceholder')} required className="bg-slate-50 border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">{t('form.lastName')} *</Label>
                                                <Input id="lastName" name="lastName" placeholder={t('form.lastNamePlaceholder')} required className="bg-slate-50 border-slate-200" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t('form.email')} *</Label>
                                            <Input id="email" name="email" type="email" placeholder={t('form.emailPlaceholder')} required className="bg-slate-50 border-slate-200" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">{t('form.phone')}</Label>
                                            <Input id="phone" name="phone" type="tel" placeholder={t('form.phonePlaceholder')} className="bg-slate-50 border-slate-200" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company">{t('form.company')}</Label>
                                            <Input id="company" name="company" placeholder={t('form.companyPlaceholder')} className="bg-slate-50 border-slate-200" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{t('form.subject')} *</Label>
                                            <Input id="subject" name="subject" placeholder={t('form.subjectPlaceholder')} required className="bg-slate-50 border-slate-200" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">{t('form.message')} *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder={t('form.messagePlaceholder')}
                                                rows={6}
                                                required
                                                className="bg-slate-50 border-slate-200"
                                            />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 transition-colors">
                                            <Send className="mr-2 h-4 w-4" />
                                            {t('form.submit')}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card className="scroll-animate-right shadow-lg border-0">
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-xl font-bold">{t('info.title')}</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{t('info.address')}</div>
                                                <div className="text-sm text-slate-600 whitespace-pre-wrap">
                                                    {settings.officeAddress || t('info.addressLine1') + '\n' + t('info.addressLine2')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone section hidden as per request */}
                                        {/* <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{t('info.phone')}</div>
                                                <div className="text-sm text-slate-600">
                                                    {settings.officePhone || t('info.phoneNumber')}
                                                </div>
                                            </div>
                                        </div> */}

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{t('info.email')}</div>
                                                <div className="text-sm text-slate-600">
                                                    {settings.officialEmail || 'hello@eastmymedia.my'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Clock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{t('info.hours')}</div>
                                                <div className="text-sm text-slate-600">
                                                    {t('info.mondayFriday')}<br />
                                                    {t('info.saturday')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="scroll-animate stagger-1 bg-slate-900 text-white shadow-lg border-0">
                                <CardContent className="p-6">
                                    <h3 className="mb-2 text-xl font-bold">{t('help.title')}</h3>
                                    <p className="mb-4 text-sm text-slate-300">
                                        {t('help.description')}
                                    </p>
                                    <Button variant="secondary" className="w-full bg-white text-slate-900 hover:bg-slate-100">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {t('help.button')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-8 text-center">
                        <h2 className="scroll-animate mb-2 text-3xl font-bold">{t('map.title')}</h2>
                        <p className="scroll-animate stagger-1 text-slate-600">{t('map.subtitle')}</p>
                    </div>
                    <div className="scroll-animate-scale aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-slate-200">
                        <iframe
                            src={settings.googleMapsEmbed || "https://maps.google.com/maps?q=TT3+SOHO+Commercial+Kuching&t=&z=15&ie=UTF8&iwloc=&output=embed"}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>


            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">{t('success.title')}</DialogTitle>
                        <DialogDescription className="text-center text-slate-600">
                            {t('success.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            {t('success.button')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
