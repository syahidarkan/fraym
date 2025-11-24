'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EditorLayout from '@/components/Layout/EditorLayout'
import { useCanvasStore } from '@/store/canvasStore'
import { useAutoSave } from '@/hooks/useAutoSave'

export default function ProjectPage() {
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)
    const [pageId, setPageId] = useState<string | null>(null)
    const { setElements } = useCanvasStore()

    useEffect(() => {
        fetch(`/api/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.pages && data.pages.length > 0) {
                    const firstPage = data.pages[0]
                    setPageId(firstPage.id)

                    // Parse props from JSON string
                    const loadedElements = firstPage.elements.map((el: any) => ({
                        ...el,
                        props: JSON.parse(el.props || '{}')
                    }))

                    setElements(loadedElements)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id, setElements])

    // Enable auto-save if we have a pageId
    useAutoSave(id, pageId || '')

    if (loading) return <div>Loading...</div>

    return <EditorLayout />
}
