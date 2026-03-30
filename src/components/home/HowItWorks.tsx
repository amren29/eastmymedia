import { Search, Map, FileText } from 'lucide-react';

const STEPS = [
    {
        icon: Search,
        title: 'Browse & Filter',
        description: 'Search thousands of billboards by location, price, format, and traffic volume.',
    },
    {
        icon: Map,
        title: 'Select Locations',
        description: 'View detailed specs and add your preferred spots to your campaign shortlist.',
    },
    {
        icon: FileText,
        title: 'Request Proposal',
        description: 'Submit your brief and get a comprehensive proposal from our sales team.',
    },
];

export function HowItWorks() {
    return (
        <section className="py-20 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
                    <p className="mt-4 text-lg text-slate-600">Launch your OOH campaign in 3 simple steps.</p>
                </div>

                <div className="grid gap-12 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{step.description}</p>

                            {index < STEPS.length - 1 && (
                                <div className="absolute top-8 left-1/2 hidden w-full -translate-y-1/2 translate-x-1/2 md:block">
                                    <div className="h-0.5 w-full bg-slate-100" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
