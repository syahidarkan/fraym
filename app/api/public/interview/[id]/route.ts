
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DesignThinkingProject, InterviewResponse } from '@/types/designThinking';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Search for the project containing this interview ID
        const allProjects = await prisma.project.findMany({
            where: {
                type: 'DESIGN_THINKING',
                data: {
                    contains: `"id":"${id}"`
                }
            }
        });

        const projectRow = allProjects[0];

        if (!projectRow) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        const projectData: DesignThinkingProject = JSON.parse(projectRow.data || '{}');

        // Find the specific interview within the project
        const interview = projectData.interviews?.find(i => i.id === id);

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found in project' }, { status: 404 });
        }

        return NextResponse.json({
            interview: {
                id: interview.id,
                title: interview.title,
                description: interview.description,
                questions: interview.questions
            }
        });

    } catch (error) {
        console.error('Error fetching interview:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const response: InterviewResponse = body.response;

        if (!response) {
            return NextResponse.json({ error: 'Invalid response data' }, { status: 400 });
        }

        // 1. Find Project
        const allProjects = await prisma.project.findMany({
            where: {
                type: 'DESIGN_THINKING',
                data: {
                    contains: `"id":"${id}"`
                }
            }
        });

        const projectRow = allProjects[0];

        if (!projectRow) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        // 2. Parse Data
        const projectData: DesignThinkingProject = JSON.parse(projectRow.data || '{}');
        const interviewIndex = projectData.interviews?.findIndex(i => i.id === id);

        if (interviewIndex === -1 || interviewIndex === undefined) {
            return NextResponse.json({ error: 'Interview not found in project' }, { status: 404 });
        }

        // 3. Add Response
        if (!projectData.interviews[interviewIndex].responses) {
            projectData.interviews[interviewIndex].responses = [];
        }

        // Avoid duplicate submission if ID exists (optional)
        const exists = projectData.interviews[interviewIndex].responses.some(r => r.id === response.id);
        if (!exists) {
            projectData.interviews[interviewIndex].responses.push(response);
        }

        // 4. Save back to DB
        const updatedDataString = JSON.stringify(projectData);

        await prisma.project.update({
            where: { id: projectRow.id },
            data: {
                data: updatedDataString
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error submitting interview response:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
