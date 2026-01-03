import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const page = await db.pages.getBySlug(slug);
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json({ page });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { title, sections } = body;

        if (!title || !sections) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updatedPage = await db.pages.save({
            slug: slug,
            title,
            sections,
            lastUpdated: new Date().toISOString()
        });

        return NextResponse.json({ page: updatedPage });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const data = await db.getDB();
        data.pages = data.pages.filter(p => p.slug !== slug);
        await db.saveDB(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
