'use client'

import React, { useRef, useState, useCallback } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './Canvas.module.css'
import Renderer from './Renderer'
import SelectionOverlay from './SelectionOverlay'

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement>(null)
    const {
        elements,
        selectedIds,
        selectElement,
        clearSelection,
        moveElement,
        addElement
    } = useCanvasStore()

    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            clearSelection()
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const type = e.dataTransfer.getData('elementType') as any
        if (type) {
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                addElement(type, x, y)
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return (
        <div
            className={styles.canvasContainer}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div className={styles.gridBackground} />
            <Renderer />
            <SelectionOverlay />
        </div>
    )
}
