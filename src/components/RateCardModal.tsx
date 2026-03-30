"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface RateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    media: any; // Using any for now to avoid circular dependency issues, or import Billboard type
}

export function RateCardModal({ isOpen, onClose, media }: RateCardModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations('rateCardModal');

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/pricing-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ...formData,
                    mediaId: media.id,
                    mediaName: media.name,
                    mediaDetails: media
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || data.details || t('errorFailed'));
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ name: '', company: '', email: '', phone: '' });
            }, 3000);
        } catch (err: any) {
            setError(err.message || t('errorDefault'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t.rich('description', {
                            mediaName: media.name,
                            strong: (chunks) => <strong>{chunks}</strong>
                        })}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{t('successTitle')}</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {t('successMessage')}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('nameLabel')} <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('namePlaceholder')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">{t('companyLabel')}</Label>
                            <Input
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder={t('companyPlaceholder')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('emailLabel')} <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('emailPlaceholder')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phoneLabel')} <span className="text-red-500">*</span></Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={t('phonePlaceholder')}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                {t('cancelButton')}
                            </Button>
                            <Button type="submit" className="bg-[#009b4d] hover:bg-[#008a44]" disabled={loading}>
                                {loading ? t('submittingButton') : t('submitButton')}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
