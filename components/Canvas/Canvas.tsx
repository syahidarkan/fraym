import React, { useRef, useState, useEffect } from 'react'
import { useCanvasStore, ElementType } from '@/store/canvasStore'
import { getComponentById } from '@/lib/componentLibrary'
import styles from './Canvas.module.css'
import Renderer from './Renderer'
import SelectionOverlay from './SelectionOverlay'

export default function Canvas({ zoom: externalZoom, activeTool }: { zoom?: number; activeTool?: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { elements, selectedIds, clearSelection, selectElement, addElement } = useCanvasStore()
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const { moveElement } = useCanvasStore()

    // Pan & Zoom state
    const [zoom, setZoom] = useState(externalZoom || 1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const panStart = useRef({ x: 0, y: 0 })

    // Refs for event listeners to access latest state
    const zoomRef = useRef(zoom)
    const panRef = useRef(pan)

    useEffect(() => {
        zoomRef.current = zoom
    }, [zoom])

    useEffect(() => {
        panRef.current = pan
    }, [pan])

    // Sync external zoom
    useEffect(() => {
        if (externalZoom !== undefined) {
            setZoom(externalZoom)
        }
    }, [externalZoom])

    // Handle Wheel (Zoom & Pan) with non-passive listener
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()

            if (e.ctrlKey || e.metaKey) {
                const currentZoom = zoomRef.current
                const delta = e.deltaY * -0.01
                const newZoom = Math.min(Math.max(currentZoom + delta, 0.1), 5)
                setZoom(newZoom)
            } else {
                const currentPan = panRef.current
                setPan({
                    x: currentPan.x - e.deltaX,
                    y: currentPan.y - e.deltaY
                })
            }
        }

        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    const handleMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        const element = target.closest('[data-id]') as HTMLElement

        // If clicking on an element in move mode
        if (element && activeTool === 'move') {
            const id = element.dataset.id
            if (id) {
                const canvasElement = elements[id]
                if (canvasElement?.locked) {
                    return
                }
                selectElement(id, e.shiftKey)
                setIsDragging(true)
                dragStart.current = { x: e.clientX, y: e.clientY }
                return
            }
        }

        // If clicking on canvas background
        if (target === containerRef.current || target.classList.contains(styles.gridBackground)) {
            // Tool-based adding
            if (activeTool && activeTool !== 'move' && activeTool !== 'hand') {
                const rect = containerRef.current?.getBoundingClientRect()
                if (rect) {
                    const x = (e.clientX - rect.left - pan.x) / zoom
                    const y = (e.clientY - rect.top - pan.y) / zoom

                    let elementType: ElementType = 'rectangle'
                    let width = 200
                    let height = 100
                    let content = ''

                    switch (activeTool) {
                        case 'frame':
                            elementType = 'rectangle'
                            width = 300
                            height = 200
                            break
                        case 'text':
                            elementType = 'text'
                            width = 150
                            height = 40
                            content = 'New Text'
                            break
                        case 'image':
                            elementType = 'image'
                            width = 200
                            height = 150
                            content = 'Image Placeholder'
                            break
                        case 'comment':
                            elementType = 'text'
                            width = 200
                            height = 80
                            content = '💬 Comment'
                            break
                    }

                    addElement(elementType, x, y, {
                        width,
                        height,
                        content,
                        type: elementType,
                        x,
                        y
                    })
                }
                return
            }

            // Otherwise clear selection or start panning
            clearSelection()
            if (activeTool === 'hand' || !activeTool || activeTool === 'move') {
                setIsPanning(true)
                panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
            }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setPan({
                x: e.clientX - panStart.current.x,
                y: e.clientY - panStart.current.y
            })
            return
        }

        if (!isDragging) return

        const dx = (e.clientX - dragStart.current.x) / zoom
        const dy = (e.clientY - dragStart.current.y) / zoom

        if (dx !== 0 || dy !== 0) {
            selectedIds.forEach(id => moveElement(id, dx, dy))
            dragStart.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setIsPanning(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const componentId = e.dataTransfer.getData('componentId')
        const componentType = e.dataTransfer.getData('componentType')

        // Handle drop from ComponentLibrary (componentId)
        if (componentId) {
            const component = getComponentById(componentId)
            if (component) {
                const rect = containerRef.current?.getBoundingClientRect()
                if (rect) {
                    const x = (e.clientX - rect.left - pan.x) / zoom - (component.defaultProps.width / 2)
                    const y = (e.clientY - rect.top - pan.y) / zoom - (component.defaultProps.height / 2)

                    addElement(component.type as ElementType, x, y, {
                        ...component.defaultProps,
                        type: component.type as ElementType,
                        x,
                        y
                    })
                }
            }
        }
        // Handle drop from DemoEditor (componentType)
        else if (componentType) {
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
                const x = (e.clientX - rect.left - pan.x) / zoom
                const y = (e.clientY - rect.top - pan.y) / zoom

                // Map componentType to ElementType
                let elementType: ElementType = 'button'
                let defaultProps: any = { x, y }

                switch (componentType) {
                    case 'container':
                        elementType = 'container'
                        defaultProps = { x, y, width: 400, height: 300, backgroundColor: '#ffffff', borderRadius: 8 }
                        break
                    case 'heading':
                        elementType = 'text'
                        defaultProps = { x, y, text: 'Heading', fontSize: 32, fontWeight: 'bold' }
                        break
                    case 'button':
                        elementType = 'button'
                        defaultProps = { x, y, text: 'Button', width: 120, height: 40 }
                        break
                    case 'image':
                        elementType = 'image'
                        defaultProps = { x, y, width: 200, height: 200, src: 'https://via.placeholder.com/200' }
                        break
                    case 'card':
                        elementType = 'container'
                        defaultProps = { x, y, width: 300, height: 200, backgroundColor: '#ffffff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                        break
                    case 'divider':
                        elementType = 'container'
                        defaultProps = { x, y, width: 300, height: 2, backgroundColor: '#e4e4e7' }
                        break
                }

                addElement(elementType, x, y, {
                    ...defaultProps,
                    type: elementType
                })
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    // Update cursor based on active tool
    const getCursor = () => {
        if (isPanning) return 'grabbing'
        if (activeTool === 'hand') return 'grab'
        if (activeTool === 'text') return 'text'
        if (activeTool === 'frame' || activeTool === 'image') return 'crosshair'
        if (activeTool === 'comment') return 'help'
        return 'default'
    }

    return (
        <div
            id="canvas-workspace"
            className={styles.canvasContainer}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ cursor: getCursor() }}
        >
            <div className={styles.gridBackground} />
            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
                <Renderer />
                <SelectionOverlay />
            </div>
        </div>
    )
}
