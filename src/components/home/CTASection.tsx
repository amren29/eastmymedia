import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
    return (
        <section className="py-20 bg-primary">
            <div className="container max-w-7xl mx-auto px-4 text-center">
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to boost your brand visibility?
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
                    Start planning your campaign today with our AI-powered tools or browse our premium inventory.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold" asChild>
                        <Link href="/explore">Start Exploring</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold bg-transparent text-white border-white hover:bg-white/10 hover:text-white" asChild>
                        <Link href="/contact">Contact Sales</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
