
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'nodejs';

// GET all projects for current user
export async function GET(request: NextRequest) {
    try {
        const userId = request.cookies.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });

        // Parse JSON data field
        const parsedProjects = projects.map((p) => {
            const parsedData = JSON.parse(p.data || '{}');
            return {
                id: p.id,
                name: p.name,
                type: p.type,
                userId: p.userId,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString(),
                ...parsedData,
            };
        });

        return NextResponse.json({ projects: parsedProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST new project
export async function POST(request: NextRequest) {
    try {
        const userId = request.cookies.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, data } = body;

        if (!name || !type) {
            return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
        }

        const dataString = JSON.stringify(data || {});

        const project = await prisma.project.create({
            data: {
                name,
                type,
                userId,
                data: dataString,
            },
        });

        const parsedData = JSON.parse(project.data || '{}');

        return NextResponse.json({
            project: {
                id: project.id,
                name: project.name,
                type: project.type,
                userId: project.userId,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                ...parsedData,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
