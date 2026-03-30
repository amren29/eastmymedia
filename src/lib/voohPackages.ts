export interface VOOHPackage {
    id: string;
    name: string;
    carCount: string;
    coverage: string;
    duration: string;
    estimatedImpressions: string;
    price: string;
    description: string;
    trafficLevel: 'low' | 'moderate' | 'high' | 'very-high';
}

export const VOOH_PACKAGES: VOOHPackage[] = [];

export function getVOOHPackage(id: string): VOOHPackage | undefined {
    return VOOH_PACKAGES.find(pkg => pkg.id === id);
}
