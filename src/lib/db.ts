import { supabase } from './supabase';
import { Billboard } from './data';

export interface Proposal {
    id: string;
    clientName: string;
    clientEmail: string;
    message: string;
    billboards: Billboard[];
    createdAt: string;
    status: 'new' | 'contacted' | 'closed';
}

export async function getProposals(): Promise<Proposal[]> {
    try {
        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            id: row.id,
            clientName: row.client_name,
            clientEmail: row.client_email,
            message: row.message,
            billboards: row.billboards || [],
            createdAt: row.created_at,
            status: row.status,
        }));
    } catch (error) {
        console.error("Error fetching proposals: ", error);
        return [];
    }
}

export async function saveProposal(proposal: Omit<Proposal, 'id' | 'createdAt' | 'status'>): Promise<Proposal> {
    try {
        const { data, error } = await supabase
            .from('proposals')
            .insert({
                client_name: proposal.clientName,
                client_email: proposal.clientEmail,
                message: proposal.message,
                billboards: proposal.billboards,
                status: 'new',
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            clientName: data.client_name,
            clientEmail: data.client_email,
            message: data.message,
            billboards: data.billboards || [],
            createdAt: data.created_at,
            status: data.status,
        };
    } catch (error) {
        console.error("Error adding proposal: ", error);
        throw error;
    }
}
