import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
    try {
        const notifications = db.notifications.getAll();
        return NextResponse.json({ notifications });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, message, type } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const notification = db.notifications.create({
            id: `notif_${Date.now()}`,
            title,
            message,
            type: type || 'info',
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ notification });
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

        db.notifications.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
