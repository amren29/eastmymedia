'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Billboard } from '@/lib/data';

interface ProposalContextType {
    selectedBillboards: Billboard[];
    addToProposal: (billboard: Billboard) => void;
    removeFromProposal: (billboardId: string) => void;
    clearProposal: () => void;
    isInProposal: (billboardId: string) => boolean;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export function ProposalProvider({ children }: { children: ReactNode }) {
    const [selectedBillboards, setSelectedBillboards] = useState<Billboard[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('proposal_billboards');
        if (saved) {
            try {
                setSelectedBillboards(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved proposal', e);
            }
        }
    }, []);

    // Save to localStorage whenever selectedBillboards changes
    useEffect(() => {
        localStorage.setItem('proposal_billboards', JSON.stringify(selectedBillboards));
    }, [selectedBillboards]);

    const addToProposal = (billboard: Billboard) => {
        setSelectedBillboards((prev) => {
            if (prev.some((b) => b.id === billboard.id)) return prev;
            return [...prev, billboard];
        });
    };

    const removeFromProposal = (billboardId: string) => {
        setSelectedBillboards((prev) => prev.filter((b) => b.id !== billboardId));
    };

    const clearProposal = () => {
        setSelectedBillboards([]);
    };

    const isInProposal = (billboardId: string) => {
        return selectedBillboards.some((b) => b.id === billboardId);
    };

    return (
        <ProposalContext.Provider
            value={{
                selectedBillboards,
                addToProposal,
                removeFromProposal,
                clearProposal,
                isInProposal,
            }}
        >
            {children}
        </ProposalContext.Provider>
    );
}

export function useProposal() {
    const context = useContext(ProposalContext);
    if (context === undefined) {
        throw new Error('useProposal must be used within a ProposalProvider');
    }
    return context;
}
