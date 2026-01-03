'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EditorLayout from '@/components/Layout/EditorLayout'
import { useCanvasStore } from '@/store/canvasStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import { apiStorage } from '@/lib/apiStorage'

export default function ProjectPage() {
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)
    const [pageId, setPageId] = useState<string | null>(null)
    const { setElements } = useCanvasStore()

    useEffect(() => {
        const fetchProject = async () => {
            // Load project from API
            const project = await apiStorage.getProject(id)

            if (project && project.pages && project.pages.length > 0) {
                const firstPage = project.pages[0]
                setPageId(firstPage.id)
                setElements(firstPage.elements)
            }
            setLoading(false)
        }
        fetchProject()
    }, [id, setElements])

    // Enable auto-save if we have a pageId
    useAutoSave(id, pageId || '')

    if (loading) return <div>Loading...</div>

    return <EditorLayout />
}
