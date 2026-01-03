import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(request: Request) {
    try {
        const { project, userId } = await request.json();

        if (!project || !userId) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Check if project exists
        const existing = db.projects.getById(project.id);

        const projectData = {
            id: project.id,
            userId: userId,
            name: project.name,
            type: project.type,
            data: project, // Store full JSON
            createdAt: project.createdAt,
            updatedAt: new Date().toISOString()
        };

        if (existing) {
            db.projects.update(project.id, projectData);
        } else {
            db.projects.create(projectData);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
