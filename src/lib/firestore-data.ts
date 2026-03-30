import { supabase } from './supabase';
import { Billboard } from './data';

export type { Billboard };

// Helper to safely process a single billboard row
function processBillboardRow(row: any): Billboard | null {
    try {
        if (!row) return null;

        // Verification Status Check (Default to published for legacy/undefined)
        if (row.verification_status && row.verification_status !== 'published') {
            return null;
        }

        // safe defaults
        const width = row.width || 0;
        const height = row.height || 0;
        const unit = row.unit || 'ft';

        // Safer traffic parsing
        let trafficDaily = 0;
        if (typeof row.traffic === 'number') {
            trafficDaily = row.traffic;
        } else if (typeof row.traffic === 'string') {
            trafficDaily = parseInt(row.traffic.replace(/[^0-9]/g, '') || '0');
        }

        // Safer GPS parsing
        let lat = row.latitude || 0;
        let lng = row.longitude || 0;
        if (!lat && !lng && row.gps && typeof row.gps === 'string') {
            const parts = row.gps.split(',');
            if (parts.length === 2) {
                lat = parseFloat(parts[0].trim());
                lng = parseFloat(parts[1].trim());
            }
        }

        return {
            id: row.id,
            name: row.name || 'Untitled',
            location: row.location || 'Unknown Location',
            type: row.type || 'Static',
            image: row.image || '',
            code: row.sku_id || row.code || 'N/A',
            size: row.size || (width && height ? `${width}${unit} × ${height}${unit}` : 'N/A'),
            price: row.price,
            priceMonthly: row.price ? `RM ${Number(row.price).toLocaleString()}/mo` : 'Contact for Price',
            trafficDaily: trafficDaily,
            region: row.region || 'Sabah',
            traffic: row.traffic || 'N/A',
            latitude: lat,
            longitude: lng,
            width,
            height,
            unit,
            available: row.available ?? true,
            availabilityStatus: row.availability_status,
            featured: row.featured,
            trafficProfile: row.traffic_profile || 'commuter',
            skuId: row.sku_id,
            totalPanel: row.total_panel,
            gps: row.gps,
            landmark: row.landmark,
            targetMarket: row.target_market,
            resolution: row.resolution,
            operatingTime: row.operating_time,
            durationPerAd: row.duration_per_ad,
            noOfAdvertiser: row.no_of_advertiser,
            loopPerHr: row.loop_per_hr,
            minLoopPerDay: row.min_loop_per_day,
            fileFormat: row.file_format,
            description: row.description,
            startPoint: row.start_point || '',
            endPoint: row.end_point || '',
            rentalRates: row.rental_rates || [],
        } as Billboard;
    } catch (err) {
        console.error(`Error processing billboard row ${row?.id}:`, err);
        return null;
    }
}

export async function getBillboards(): Promise<Billboard[]> {
    try {
        const { data, error } = await supabase
            .from('billboards')
            .select('*');

        if (error) throw error;

        const billboards: Billboard[] = [];
        for (const row of data || []) {
            const processed = processBillboardRow(row);
            if (processed) {
                billboards.push(processed);
            }
        }

        return billboards;
    } catch (error) {
        console.error("Error fetching billboards:", error);
        return [];
    }
}

export async function getBillboardById(id: string): Promise<Billboard | null> {
    try {
        const { data, error } = await supabase
            .from('billboards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return processBillboardRow(data);
    } catch (error) {
        console.error("Error fetching billboard:", error);
        return null;
    }
}

export async function getFeaturedBillboards(): Promise<Billboard[]> {
    try {
        const { data, error } = await supabase
            .from('billboards')
            .select('*')
            .eq('featured', true);

        if (error) throw error;

        const billboards: Billboard[] = [];
        for (const row of data || []) {
            const processed = processBillboardRow(row);
            if (processed) {
                billboards.push(processed);
            }
        }

        return billboards;
    } catch (error) {
        console.error("Error fetching featured billboards:", error);
        return [];
    }
}

// Packages Module Logic
export interface PackageItem {
    id: string;
    name: string;
    description: string;
    validFrom: string;
    validTo: string;
    items: string[]; // Array of Billboard IDs
    standardTotal: number;
    packagePrice: number;
    status: 'active' | 'inactive';
    image?: string;
    createdAt: string;
}

export async function getActivePackages(): Promise<PackageItem[]> {
    try {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('status', 'active');

        if (error) throw error;

        return (data || []).map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            validFrom: row.valid_from,
            validTo: row.valid_to,
            items: row.items || [],
            standardTotal: row.standard_total,
            packagePrice: row.package_price,
            status: row.status,
            image: row.image,
            createdAt: row.created_at,
        }));
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
}

export async function getPackageById(id: string): Promise<PackageItem | null> {
    try {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            validFrom: data.valid_from,
            validTo: data.valid_to,
            items: data.items || [],
            standardTotal: data.standard_total,
            packagePrice: data.package_price,
            status: data.status,
            image: data.image,
            createdAt: data.created_at,
        };
    } catch (error) {
        console.error("Error fetching package:", error);
        return null;
    }
}

// System Settings Logic
export interface SystemSettings {
    enablePackages: boolean;
    websiteName?: string;
    siteLogo?: string;
    favicon?: string;
    footerDescription?: string;
    copyrightText?: string;
    officeAddress?: string;
    officialEmail?: string;
    officePhone?: string;
    whatsappNumber?: string;
    googleMapsEmbed?: string;
    packagesMenuLabel?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    linkedinUrl?: string;
    whatsappMessage?: string;
}

export async function getSystemSettings(): Promise<SystemSettings> {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'general')
            .single();

        if (error) throw error;

        return {
            enablePackages: data.enable_packages ?? true,
            websiteName: data.website_name,
            siteLogo: data.site_logo,
            favicon: data.favicon,
            footerDescription: data.footer_description,
            copyrightText: data.copyright_text,
            officeAddress: data.office_address,
            officialEmail: data.official_email,
            officePhone: data.office_phone,
            whatsappNumber: data.whatsapp_number,
            googleMapsEmbed: data.google_maps_embed,
            packagesMenuLabel: data.packages_menu_label,
            heroTitle: data.hero_title,
            heroSubtitle: data.hero_subtitle,
            facebookUrl: data.facebook_url,
            instagramUrl: data.instagram_url,
            tiktokUrl: data.tiktok_url,
            linkedinUrl: data.linkedin_url,
            whatsappMessage: data.whatsapp_message,
        };
    } catch (error) {
        console.error("Error fetching settings:", error);
        return { enablePackages: true };
    }
}
