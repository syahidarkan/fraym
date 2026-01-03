import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
    try {
        const allPages = await db.pages.getAll();
        const pages = allPages.map(p => ({ slug: p.slug, title: p.title }));
        // Ensure 'landing' is always in the list even if not in DB yet (it has defaults)
        if (!pages.find(p => p.slug === 'landing')) {
            pages.unshift({ slug: 'landing', title: 'Landing Page' });
        }
        return NextResponse.json({ pages });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
