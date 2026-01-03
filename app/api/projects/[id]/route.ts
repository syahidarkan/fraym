
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'nodejs';

// GET single project
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.cookies.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const project = await prisma.project.findFirst({
            where: { id, userId }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const parsedData = JSON.parse(project.data || '{}');

        return NextResponse.json({
            project: {
                id: project.id,
                name: project.name,
                type: project.type,
                userId: project.userId,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
                ...parsedData
            }
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT update project
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.cookies.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, data, ...otherUpdates } = body;

        const updateData = data || otherUpdates;

        // Verify ownership and get current data
        const existing = await prisma.project.findFirst({
            where: { id, userId }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const currentData = JSON.parse(existing.data || '{}');
        const mergedData = { ...currentData, ...updateData };

        // Clean internal fields
        delete mergedData.id;
        delete mergedData.name;
        delete mergedData.type;
        delete mergedData.userId;
        delete mergedData.createdAt;
        delete mergedData.updatedAt;

        const dataString = JSON.stringify(mergedData);

        const project = await prisma.project.update({
            where: { id },
            data: {
                name: name || undefined,
                data: dataString,
                updatedAt: new Date()
            }
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
                ...parsedData
            }
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE project
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.cookies.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await prisma.project.deleteMany({
            where: { id, userId }
        });

        if (result.count === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
