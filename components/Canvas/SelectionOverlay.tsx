'use client'

import React, { useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './SelectionOverlay.module.css'

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export default function SelectionOverlay() {
    const { selectedIds, elements, updateElement } = useCanvasStore()
    const [resizing, setResizing] = useState<{ handle: ResizeHandle; startX: number; startY: number; startWidth: number; startHeight: number; startLeft: number; startTop: number } | null>(null)

    React.useEffect(() => {
        if (!resizing) return

        const handleResizeMove = (e: MouseEvent) => {
            const dx = e.clientX - resizing.startX
            const dy = e.clientY - resizing.startY

            let newWidth = resizing.startWidth
            let newHeight = resizing.startHeight
            let newX = resizing.startLeft
            let newY = resizing.startTop

            // Calculate new dimensions based on handle
            if (resizing.handle.includes('e')) newWidth = Math.max(20, resizing.startWidth + dx)
            if (resizing.handle.includes('w')) {
                newWidth = Math.max(20, resizing.startWidth - dx)
                newX = resizing.startLeft + (resizing.startWidth - newWidth)
            }
            if (resizing.handle.includes('s')) newHeight = Math.max(20, resizing.startHeight + dy)
            if (resizing.handle.includes('n')) {
                newHeight = Math.max(20, resizing.startHeight - dy)
                newY = resizing.startTop + (resizing.startHeight - newHeight)
            }

            updateElement(selectedIds[0], {
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            })
        }

        const handleResizeEnd = () => {
            setResizing(null)
        }

        window.addEventListener('mousemove', handleResizeMove)
        window.addEventListener('mouseup', handleResizeEnd)
        return () => {
            window.removeEventListener('mousemove', handleResizeMove)
            window.removeEventListener('mouseup', handleResizeEnd)
        }
    }, [resizing])

    if (selectedIds.length !== 1) return null

    const element = elements[selectedIds[0]]
    if (!element || element.locked) return null

    const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
        e.stopPropagation()
        setResizing({
            handle,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: element.width,
            startHeight: element.height,
            startLeft: element.x,
            startTop: element.y
        })
    }

    const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

    return (
        <div
            className={styles.overlay}
            style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
            }}
        >
            {handles.map(handle => (
                <div
                    key={handle}
                    className={`${styles.handle} ${styles[handle]}`}
                    onMouseDown={(e) => handleResizeStart(e, handle)}
                />
            ))}
        </div>
    )
}
