import { useEffect, useRef } from 'react'
import { useCanvasStore } from '@/store/canvasStore'

export function useAutoSave(projectId: string, pageId: string) {
    const elements = useCanvasStore((state) => state.elements)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const isFirstLoad = useRef(true)

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            return
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            const elementsList = Object.values(elements)
            try {
                await fetch(`/api/projects/${projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageId,
                        elements: elementsList
                    })
                })
                console.log('Auto-saved')
            } catch (error) {
                console.error('Failed to auto-save', error)
            }
        }, 2000) // Debounce 2s

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [elements, projectId, pageId])
}
