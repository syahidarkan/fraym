import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
    try {
        const users = db.users.getAll();
        // Remove passwords
        const safeUsers = users.map(({ password, ...u }) => u);
        return NextResponse.json({ users: safeUsers });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        db.users.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
