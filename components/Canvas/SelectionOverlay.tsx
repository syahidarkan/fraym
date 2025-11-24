'use client'

import React, { useEffect, useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './SelectionOverlay.module.css'

export default function SelectionOverlay() {
    const { elements, selectedIds, updateElement, moveElement } = useCanvasStore()
    const [isResizing, setIsResizing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })

    if (selectedIds.length === 0) return null

    // For simplicity, we only show resize handles for single selection for now
    // Multi-selection will just show a bounding box in a future iteration
    const primaryId = selectedIds[0]
    const element = elements[primaryId]

    if (!element) return null

    const style = {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDragging(true)
        setStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation()
        setIsResizing(true)
        setStartPos({ x: e.clientX, y: e.clientY })

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startPos.x
            const dy = moveEvent.clientY - startPos.y

            // Simple resize logic (needs refinement for all directions)
            if (direction === 'se') {
                updateElement(primaryId, {
                    width: Math.max(10, element.width + dx),
                    height: Math.max(10, element.height + dy)
                })
            }
            // Implement other directions...
        }

        const handleMouseUp = () => {
            setIsResizing(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    // Global mouse move for dragging elements
    useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x
            const dy = e.clientY - startPos.y
            moveElement(primaryId, dx, dy)
            setStartPos({ x: e.clientX, y: e.clientY })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, startPos, moveElement, primaryId])

    return (
        <div
            className={styles.overlay}
            style={style}
            onMouseDown={handleMouseDown}
        >
            <div className={`${styles.handle} ${styles.nw}`} />
            <div className={`${styles.handle} ${styles.ne}`} />
            <div className={`${styles.handle} ${styles.sw}`} />
            <div
                className={`${styles.handle} ${styles.se}`}
                onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
        </div>
    )
}
