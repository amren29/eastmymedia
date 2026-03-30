'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

interface PricingDownloadFormProps {
    buttonText?: string;
    buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export function PricingDownloadForm({
    buttonText,
    buttonVariant = 'default',
    buttonSize = 'default',
    className,
}: PricingDownloadFormProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/pricing-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            const result = await response.json();

            // Show success message
            alert('Thank you! We have received your request. Our team will review and send you the pricing information shortly.');

            // Reset form and close dialog
            setFormData({ name: '', email: '', phone: '', company: '' });
            setOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} size={buttonSize} className={className}>
                    <Download className="h-4 w-4 mr-2" />
                    {buttonText || 'Download Pricing'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Pricing Information</DialogTitle>
                    <DialogDescription>
                        Please fill in your details below. Our team will review your request and send you the pricing information via email.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+60 12-345 6789"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">
                            Company Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="company"
                            type="text"
                            placeholder="ABC Corporation"
                            value={formData.company}
                            onChange={(e) => handleChange('company', e.target.value)}
                            className={errors.company ? 'border-red-500' : ''}
                        />
                        {errors.company && (
                            <p className="text-sm text-red-500">{errors.company}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
