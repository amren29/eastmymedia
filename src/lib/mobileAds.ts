export interface MobileAdZone {
    id: string;
    name: string;
    district: string;
    dailyTraffic: string;
    impressionsPerDay: string;
    peakHours: string;
    area: string;
    recommendedBudget: string;
    demographics: string;
    description: string;
    bestFor: string[];
    trafficLevel: 'Very-High' | 'High' | 'Medium';
    coordinates: [number, number]; // [lng, lat]
}

export const TRAFFIC_COLORS = {
    'Very-High': '#DC2626', // Red-600
    'High': '#EF4444',      // Red-500
    'Medium': '#F87171'     // Red-400
};

export const MOBILE_AD_ZONES: MobileAdZone[] = [
    {
        id: 'zone-kk-cbd',
        name: 'Kota Kinabalu CBD Loop',
        district: 'Central Business District',
        dailyTraffic: '45,000+',
        impressionsPerDay: '120,000+',
        peakHours: '7AM-9AM, 4PM-7PM',
        area: '5.2',
        recommendedBudget: 'RM 3,500 - RM 5,000',
        demographics: 'Professionals, Tourists, Shoppers',
        description: 'The heart of Kota Kinabalu, covering major financial districts, shopping malls (Imago, Suria Sabah), and government offices. High dwell time due to traffic congestion during peak hours.',
        bestFor: ['Brand Awareness', 'Luxury Products', 'Corporate Branding'],
        trafficLevel: 'Very-High',
        coordinates: [116.0732, 5.9784]
    },
    {
        id: 'zone-lintas',
        name: 'Lintas - Hilltop Connector',
        district: 'Lintas',
        dailyTraffic: '35,000+',
        impressionsPerDay: '95,000+',
        peakHours: '11AM-2PM, 5PM-8PM',
        area: '8.5',
        recommendedBudget: 'RM 2,800 - RM 4,000',
        demographics: 'Affluent Families, Foodies',
        description: 'A key residential and commercial hub known for its dining scene. Connects major residential areas to the city center. Constant flow of traffic throughout the day.',
        bestFor: ['F&B', 'Real Estate', 'Lifestyle Services'],
        trafficLevel: 'High',
        coordinates: [116.0900, 5.9500]
    },
    {
        id: 'zone-penampang',
        name: 'Penampang Bypass',
        district: 'Penampang',
        dailyTraffic: '50,000+',
        impressionsPerDay: '150,000+',
        peakHours: '6AM-8AM, 5PM-7PM',
        area: '12.0',
        recommendedBudget: 'RM 3,000 - RM 4,500',
        demographics: 'Commuters, Residents',
        description: 'One of the busiest highways connecting suburbs to the city. Ideal for mass market reach due to high volume of daily commuters.',
        bestFor: ['Mass Market Consumer Goods', 'Automotive', 'Retail'],
        trafficLevel: 'Very-High',
        coordinates: [116.0700, 5.9400]
    },
    {
        id: 'zone-tuaran',
        name: 'Tuaran Road Corridor',
        district: 'Inanam/Menggatal',
        dailyTraffic: '40,000+',
        impressionsPerDay: '110,000+',
        peakHours: '6:30AM-8:30AM, 4:30PM-7PM',
        area: '15.0',
        recommendedBudget: 'RM 2,500 - RM 3,800',
        demographics: 'Mixed Demographic, Industrial Workers',
        description: 'Major arterial road serving northern suburbs and industrial areas. Long commute times ensure extended ad exposure.',
        bestFor: ['Telecommunications', 'FMCG', 'Banking'],
        trafficLevel: 'High',
        coordinates: [116.0800, 5.9900]
    },
    {
        id: 'zone-tanjung-aru',
        name: 'Tanjung Aru - Airport Route',
        district: 'Tanjung Aru',
        dailyTraffic: '25,000+',
        impressionsPerDay: '70,000+',
        peakHours: '4PM-7PM (Sunset), Flight Times',
        area: '6.0',
        recommendedBudget: 'RM 2,500 - RM 3,500',
        demographics: 'Tourists, Locals, Airport Transfers',
        description: 'Scenic route leading to the popular beach and Kota Kinabalu International Airport. Captures both leisure traffic and travelers.',
        bestFor: ['Tourism', 'Hotels', 'Events'],
        trafficLevel: 'Medium',
        coordinates: [116.0600, 5.9700]
    }
];

export function getMobileAdZone(id: string): MobileAdZone | undefined {
    return MOBILE_AD_ZONES.find(zone => zone.id === id);
}
