import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const CHATS_DIR = path.join(process.cwd(), 'data', 'chats');

// Ensure chats directory exists
async function ensureChatsDir() {
  try {
    await fs.access(CHATS_DIR);
  } catch {
    await fs.mkdir(CHATS_DIR, { recursive: true });
  }
}

// GET - Retrieve user's chat sessions
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureChatsDir();

    const userEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const userChatsFile = path.join(CHATS_DIR, `${userEmail}.json`);

    try {
      const data = await fs.readFile(userChatsFile, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    } catch {
      return NextResponse.json({ sessions: [] });
    }
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Save a chat session
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, messages } = await req.json();

    await ensureChatsDir();

    const userEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const userChatsFile = path.join(CHATS_DIR, `${userEmail}.json`);

    let userData = { sessions: [] as any[] };

    try {
      const existingData = await fs.readFile(userChatsFile, 'utf-8');
      userData = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet
    }

    // Find or create session
    const existingSessionIndex = userData.sessions.findIndex(
      (s: any) => s.id === sessionId
    );

    const chatSession = {
      id: sessionId,
      userEmail: session.user.email,
      userName: session.user.name || 'Unknown',
      messages,
      updatedAt: new Date().toISOString(),
      createdAt: existingSessionIndex >= 0
        ? userData.sessions[existingSessionIndex].createdAt
        : new Date().toISOString(),
    };

    if (existingSessionIndex >= 0) {
      userData.sessions[existingSessionIndex] = chatSession;
    } else {
      userData.sessions.push(chatSession);
    }

    await fs.writeFile(userChatsFile, JSON.stringify(userData, null, 2));

    // Also save to master file for admin viewing
    await saveTOMasterFile(chatSession);

    return NextResponse.json({ success: true, sessionId });
  } catch (error: any) {
    console.error('Error saving chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a chat session
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await ensureChatsDir();

    const userEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const userChatsFile = path.join(CHATS_DIR, `${userEmail}.json`);

    let userData = { sessions: [] as any[] };

    try {
      const existingData = await fs.readFile(userChatsFile, 'utf-8');
      userData = JSON.parse(existingData);
    } catch {
      return NextResponse.json({ error: 'No chats found' }, { status: 404 });
    }

    // Remove the session
    userData.sessions = userData.sessions.filter((s: any) => s.id !== sessionId);

    await fs.writeFile(userChatsFile, JSON.stringify(userData, null, 2));

    // Also remove from master file
    await deleteFromMasterFile(sessionId, session.user.email);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Save to master file that contains all chats for admin viewing
async function saveTOMasterFile(chatSession: any) {
  const masterFile = path.join(CHATS_DIR, '_all_chats.json');

  let allChats = { chats: [] as any[] };

  try {
    const existingData = await fs.readFile(masterFile, 'utf-8');
    allChats = JSON.parse(existingData);
  } catch {
    // File doesn't exist yet
  }

  // Find or update existing
  const existingIndex = allChats.chats.findIndex(
    (c: any) => c.id === chatSession.id && c.userEmail === chatSession.userEmail
  );

  if (existingIndex >= 0) {
    allChats.chats[existingIndex] = chatSession;
  } else {
    allChats.chats.push(chatSession);
  }

  await fs.writeFile(masterFile, JSON.stringify(allChats, null, 2));
}

// Delete from master file
async function deleteFromMasterFile(sessionId: string, userEmail: string) {
  const masterFile = path.join(CHATS_DIR, '_all_chats.json');

  let allChats = { chats: [] as any[] };

  try {
    const existingData = await fs.readFile(masterFile, 'utf-8');
    allChats = JSON.parse(existingData);
  } catch {
    return;
  }

  allChats.chats = allChats.chats.filter(
    (c: any) => !(c.id === sessionId && c.userEmail === userEmail)
  );

  await fs.writeFile(masterFile, JSON.stringify(allChats, null, 2));
}
