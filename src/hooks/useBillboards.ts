import { useState, useEffect } from 'react';
import { getBillboards } from '@/lib/firestore-data';
import { Billboard } from '@/lib/data';

export function useBillboards() {
    const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getBillboards();
                setBillboards(data);
            } catch (error) {
                console.error("Failed to fetch billboards", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { billboards, loading };
}
