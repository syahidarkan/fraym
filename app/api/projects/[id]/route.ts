import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                pages: {
                    include: {
                        elements: true
                    }
                }
            }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { elements, pageId } = body

        // Transaction to update elements
        await prisma.$transaction(async (tx) => {
            // Delete existing elements for this page
            await tx.element.deleteMany({
                where: { pageId }
            })

            // Create new elements
            if (elements && elements.length > 0) {
                await tx.element.createMany({
                    data: elements.map((el: any) => ({
                        id: el.id,
                        type: el.type,
                        x: el.x,
                        y: el.y,
                        width: el.width,
                        height: el.height,
                        content: el.content,
                        props: JSON.stringify(el.props || {}),
                        zIndex: el.zIndex,
                        pageId: pageId
                    }))
                })
            }

            // Update project timestamp
            await tx.project.update({
                where: { id: params.id },
                data: { updatedAt: new Date() }
            })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
    }
}
