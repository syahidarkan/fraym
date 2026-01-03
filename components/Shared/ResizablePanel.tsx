'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './ResizablePanel.module.css'

interface ResizablePanelProps {
    children: React.ReactNode
    defaultWidth?: number
    minWidth?: number
    maxWidth?: number
    storageKey?: string
    className?: string
}

export default function ResizablePanel({
    children,
    defaultWidth = 240,
    minWidth = 200,
    maxWidth = 500,
    storageKey,
    className = ''
}: ResizablePanelProps) {
    const [width, setWidth] = useState(defaultWidth)
    const [isResizing, setIsResizing] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // Load saved width from localStorage
    useEffect(() => {
        if (storageKey && typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const savedWidth = parseInt(saved)
                if (savedWidth >= minWidth && savedWidth <= maxWidth) {
                    setWidth(savedWidth)
                }
            }
        }
    }, [storageKey, minWidth, maxWidth])

    // Save width to localStorage
    useEffect(() => {
        if (storageKey && typeof window !== 'undefined') {
            localStorage.setItem(storageKey, width.toString())
        }
    }, [width, storageKey])

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizing(true)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !panelRef.current) return

            const panelRect = panelRef.current.getBoundingClientRect()
            const newWidth = e.clientX - panelRect.left

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            setIsResizing(false)
        }

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'ew-resize'
            document.body.style.userSelect = 'none'
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isResizing, minWidth, maxWidth])

    return (
        <div
            ref={panelRef}
            className={`${styles.panel} ${className}`}
            style={{ width: `${width}px` }}
        >
            {children}
            <div
                className={styles.resizeHandle}
                onMouseDown={handleMouseDown}
            />
        </div>
    )
}
