"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/lib/supabase';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ClientRegistrationPage() {
    const t = useTranslations('aboutPage'); // Using aboutPage translations for hero text if applicable, or generic
    useScrollAnimation();

    // Hardcoded Hero Text for this specific page since translation keys might not exist yet
    const heroTitle = "Client Registration";
    const heroDescription = "Partner with us to amplify your brand across East Malaysia.";

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        registrationNo: '',
        category: '',
        address: '',
        officeNo: '',
        sst: '',
        personInCharge: '',
        position: '',
        phone: '',
        email: '',
        termsAgreed: false
    });

    const categories = [
        "Food & Beverage (F&B)",
        "Retail & E-commerce",
        "Technology & Software",
        "Healthcare & Wellness",
        "Property & Real Estate",
        "Education & Training",
        "Manufacturing & Industrial",
        "Finance & Insurance",
        "Professional Services",
        "Travel & Hospitality",
        "Government & NGO",
        "Automotive",
        "Others"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.termsAgreed) {
            setError('You must agree to the Terms and Conditions.');
            return;
        }

        setLoading(true);
        try {
            const customerId = formData.email.toLowerCase();

            // Check if customer already exists
            const { data: existing } = await supabase
                .from('customers')
                .select('id')
                .eq('email', customerId)
                .single();

            if (existing) {
                setError('An account with this email already exists.');
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('customers')
                .insert({
                    company_name: formData.companyName,
                    registration_no: formData.registrationNo,
                    category: formData.category,
                    address: formData.address,
                    office_no: formData.officeNo,
                    sst: formData.sst,
                    person_in_charge: formData.personInCharge,
                    position: formData.position,
                    phone: formData.phone,
                    email: customerId,
                    name: formData.personInCharge,
                    total_proposals: 0,
                    source: 'web_registration',
                });

            if (insertError) throw insertError;

            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Registration error:", err);
            setError('Failed to submit registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section - Matching About Us Style */}
                <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                    <div className="container max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                            Registration Successful
                        </h1>
                        <p className="text-xl text-slate-800">
                            Welcome to East My Media!
                        </p>
                    </div>
                </section>

                <div className="container max-w-3xl mx-auto px-4 py-16">
                    <Card className="border-0 shadow-lg text-center p-12">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle2 className="w-16 h-16 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                            Your registration has been submitted successfully. Our team will review your details and get in touch with you shortly.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                        >
                            Back to Home
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section - Matching About Us Style */}
            <section className="relative bg-gradient-to-r from-[#4ec2a6] to-[#c6f4d1] py-20 text-slate-900">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="scroll-animate mb-6 text-5xl font-bold tracking-tight text-slate-900">
                            {heroTitle}
                        </h1>
                        <p className="scroll-animate stagger-1 text-xl text-slate-800 leading-relaxed">
                            {heroDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-16">
                <div className="container max-w-4xl mx-auto px-4">
                    <Card className="border-0 shadow-xl overflow-hidden">
                        <div className="bg-white p-8 md:p-12">
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Company Details</h2>
                                <p className="text-slate-500">Please provide your business information.</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            placeholder="e.g. Acme Sdn Bhd"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration / SSM No.</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                            value={formData.registrationNo}
                                            onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                                            placeholder="e.g. 202301001234"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Business Category</label>
                                        <select
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-white"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Industry</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Enter your full business address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Office Number</label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                            value={formData.officeNo}
                                            onChange={(e) => setFormData({ ...formData, officeNo: e.target.value })}
                                            placeholder="e.g. +60 3-1234 5678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">SST Registration No. (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                            value={formData.sst}
                                            onChange={(e) => setFormData({ ...formData, sst: e.target.value })}
                                            placeholder="e.g. W10-2008-12345678"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8 mt-8">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Person In Charge (PIC)</h2>
                                    <p className="text-slate-500 mb-6">Contact details for the primary representative.</p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                                value={formData.personInCharge}
                                                onChange={(e) => setFormData({ ...formData, personInCharge: e.target.value })}
                                                placeholder="e.g. Jane Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                placeholder="e.g. Marketing Manager"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="e.g. +60 12-345 6789"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="e.g. jane@company.com"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">This will be used as your account login ID.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8 mt-8">
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            required
                                            checked={formData.termsAgreed}
                                            onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                                            I agree to the <a href="#" className="text-primary hover:underline font-medium">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>. I confirm that the details provided are accurate.
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? 'Submitting...' : 'Submit Registration'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
