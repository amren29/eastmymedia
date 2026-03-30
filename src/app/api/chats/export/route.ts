import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CHATS_DIR = path.join(process.cwd(), 'data', 'chats');

// GET - Export all chats as CSV/JSON
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const masterFile = path.join(CHATS_DIR, '_all_chats.json');

    let allChats = { chats: [] as any[] };

    try {
      const data = await fs.readFile(masterFile, 'utf-8');
      allChats = JSON.parse(data);
    } catch {
      return NextResponse.json({ chats: [] });
    }

    if (format === 'csv') {
      // Convert to CSV for Excel
      const csvRows = ['Date,User Email,User Name,Session ID,Role,Message'];

      allChats.chats.forEach((chat: any) => {
        chat.messages.forEach((msg: any) => {
          const row = [
            chat.createdAt,
            chat.userEmail,
            chat.userName,
            chat.id,
            msg.role,
            `"${msg.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          ].join(',');
          csvRows.push(row);
        });
      });

      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="oohexpert_chats_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return as JSON
    return NextResponse.json(allChats);
  } catch (error: any) {
    console.error('Error exporting chats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
