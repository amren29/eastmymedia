import { NextRequest, NextResponse } from 'next/server';
import { getProposals, saveProposal } from '@/lib/db';

export async function GET() {
    try {
        const proposals = await getProposals();
        return NextResponse.json(proposals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { clientName, clientEmail, message, billboards } = body;

        if (!clientName || !clientEmail || !billboards || billboards.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProposal = await saveProposal({
            clientName,
            clientEmail,
            message,
            billboards,
        });

        return NextResponse.json(newProposal, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
    }
}
