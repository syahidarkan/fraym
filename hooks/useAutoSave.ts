import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { apiStorage } from '@/lib/apiStorage'

export function useAutoSave(projectId: string, pageId: string) {
    const elements = useCanvasStore(state => state.elements)
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const isFirstLoad = useRef(true)

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            return
        }

        if (!pageId || !projectId) return

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            const elementsList = Object.values(elements)
            try {
                // Fetch current project state
                const project = await apiStorage.getProject(projectId)
                if (project) {
                    const pageIndex = project.pages.findIndex((p: any) => p.id === pageId)
                    if (pageIndex !== -1) {
                        project.pages[pageIndex].elements = elementsList
                        // Optimistic update: set updatedAt
                        project.updatedAt = new Date().toISOString()
                        await apiStorage.updateProject(projectId, project)
                        console.log('Auto-saved to database')
                    }
                }
            } catch (error) {
                console.error('Failed to auto-save to database', error)
            }
        }, 1000) // Debounce 1s (reduced from 2s for snappier saves)

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [elements, projectId, pageId])
}
