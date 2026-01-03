'use client'

import React, { useState, useRef } from 'react'
import { MousePointer2, Hand, Monitor, Smartphone, Layout, Box, Type, Square, Image as ImageIcon, Minus, Trash2, Circle, AlignLeft, List, CheckSquare, Mail, User, Bell, Settings } from 'lucide-react'
import styles from './Marketing.module.css'

interface CanvasElement {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    text?: string
    backgroundColor?: string
    borderRadius?: number
    fontSize?: number
    fontWeight?: string
}

export default function DemoEditor() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [activeTool, setActiveTool] = useState('move')
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
    const [elements, setElements] = useState<CanvasElement[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

    const components = [
        { type: 'container', name: 'Container', icon: Layout },
        { type: 'heading', name: 'Heading', icon: Type },
        { type: 'text', name: 'Text', icon: AlignLeft },
        { type: 'button', name: 'Button', icon: Box },
        { type: 'image', name: 'Image', icon: ImageIcon },
        { type: 'card', name: 'Card', icon: Square },
        { type: 'input', name: 'Input Field', icon: Minus },
        { type: 'checkbox', name: 'Checkbox', icon: CheckSquare },
        { type: 'list', name: 'List', icon: List },
        { type: 'icon-user', name: 'User Icon', icon: User },
        { type: 'icon-mail', name: 'Mail Icon', icon: Mail },
        { type: 'icon-bell', name: 'Bell Icon', icon: Bell },
        { type: 'icon-settings', name: 'Settings', icon: Settings },
        { type: 'divider', name: 'Divider', icon: Minus },
        { type: 'circle', name: 'Circle', icon: Circle },
    ]

    const getDisplayScale = () => viewMode === 'mobile' ? Math.min(1, 600 / 667) : 1

    const handleDragStart = (e: React.DragEvent, componentType: string) => {
        e.dataTransfer.setData('componentType', componentType)
        e.dataTransfer.effectAllowed = 'copy'
    }

    const handleCanvasDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const componentType = e.dataTransfer.getData('componentType')
        if (!componentType || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const scale = getDisplayScale()
        const x = (e.clientX - rect.left) / scale
        const y = (e.clientY - rect.top) / scale

        const newElement: CanvasElement = { id: `el-${Date.now()}`, type: componentType, x, y, width: 120, height: 40 }

        switch (componentType) {
            case 'container': Object.assign(newElement, { width: 400, height: 300, backgroundColor: '#ffffff', borderRadius: 8 }); break
            case 'heading': Object.assign(newElement, { text: 'Heading', fontSize: 32, fontWeight: 'bold', width: 200, height: 50 }); break
            case 'text': Object.assign(newElement, { text: 'Text content', fontSize: 16, width: 200, height: 30 }); break
            case 'button': Object.assign(newElement, { text: 'Button', backgroundColor: '#18181b', borderRadius: 6 }); break
            case 'image': Object.assign(newElement, { width: 200, height: 200, backgroundColor: '#f4f4f5' }); break
            case 'card': Object.assign(newElement, { width: 300, height: 200, backgroundColor: '#ffffff', borderRadius: 12 }); break
            case 'input': Object.assign(newElement, { text: 'Input field', width: 250, height: 40, backgroundColor: '#ffffff', borderRadius: 6 }); break
            case 'checkbox': Object.assign(newElement, { text: '☑ Checkbox', width: 150, height: 30 }); break
            case 'list': Object.assign(newElement, { text: '• List item\n• List item\n• List item', width: 200, height: 100 }); break
            case 'icon-user':
            case 'icon-mail':
            case 'icon-bell':
            case 'icon-settings': Object.assign(newElement, { text: '👤', fontSize: 32, width: 50, height: 50 }); break
            case 'divider': Object.assign(newElement, { width: 300, height: 2, backgroundColor: '#e4e4e7' }); break
            case 'circle': Object.assign(newElement, { width: 100, height: 100, backgroundColor: '#3b82f6', borderRadius: 50 }); break
        }

        setElements([...elements, newElement])
    }

    const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
        if (activeTool !== 'move' || isEditing) return
        e.stopPropagation()
        const element = elements.find(el => el.id === id)
        if (!element || !canvasRef.current) return

        setSelectedId(id)
        setIsDragging(true)
        const rect = canvasRef.current.getBoundingClientRect()
        const scale = getDisplayScale()
        setDragOffset({
            x: (e.clientX - rect.left) / scale - element.x,
            y: (e.clientY - rect.top) / scale - element.y
        })
    }

    const handleResizeMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        e.preventDefault()
        const element = elements.find(el => el.id === id)
        if (!element) return

        setIsResizing(true)
        setIsDragging(false)
        setSelectedId(id)
        setResizeStart({ x: e.clientX, y: e.clientY, width: element.width, height: element.height })
    }

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const scale = getDisplayScale()

        if (isResizing && selectedId) {
            const dx = (e.clientX - resizeStart.x) / scale
            const dy = (e.clientY - resizeStart.y) / scale
            setElements(elements.map(el =>
                el.id === selectedId ? { ...el, width: Math.max(30, resizeStart.width + dx), height: Math.max(30, resizeStart.height + dy) } : el
            ))
        } else if (isDragging && selectedId && !isResizing) {
            let x = (e.clientX - rect.left) / scale - dragOffset.x
            let y = (e.clientY - rect.top) / scale - dragOffset.y

            // Constrain to canvas boundaries
            const element = elements.find(el => el.id === selectedId)
            if (element) {
                x = Math.max(0, Math.min(x, canvasWidth - element.width))
                y = Math.max(0, Math.min(y, canvasHeight - element.height))
            }

            setElements(elements.map(el => el.id === selectedId ? { ...el, x, y } : el))
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setIsResizing(false)
    }

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only deselect if clicking directly on canvas, not on elements
        if (e.target === e.currentTarget) {
            setSelectedId(null)
            setIsEditing(null)
        }
    }

    const handleDoubleClick = (id: string) => {
        const element = elements.find(el => el.id === id)
        if (element && element.text !== undefined) setIsEditing(id)
    }

    const handleTextChange = (id: string, newText: string) => {
        setElements(elements.map(el => el.id === id ? { ...el, text: newText } : el))
    }

    const handleDelete = () => {
        if (selectedId) {
            setElements(elements.filter(el => el.id !== selectedId))
            setSelectedId(null)
        }
    }

    const canvasWidth = viewMode === 'desktop' ? 1200 : 375
    const canvasHeight = viewMode === 'desktop' ? 800 : 667
    const displayScale = getDisplayScale()

    return (
        <div className={styles.demoContainer}>
            <div className={styles.editorToolbar}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.windowControls}>
                        <div className={`${styles.windowDot} ${styles.red}`}></div>
                        <div className={`${styles.windowDot} ${styles.yellow}`}></div>
                        <div className={`${styles.windowDot} ${styles.green}`}></div>
                    </div>
                    <span className={styles.fileName}>Untitled-1</span>
                </div>

                <div className={styles.toolsGroup}>
                    <ToolButton icon={<MousePointer2 size={18} />} active={activeTool === 'move'} onClick={() => setActiveTool('move')} tooltip="Move" />
                    <ToolButton icon={<Hand size={18} />} active={activeTool === 'hand'} onClick={() => setActiveTool('hand')} tooltip="Pan" />
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className={styles.toolsGroup}>
                        <ToolButton icon={<Monitor size={18} />} active={viewMode === 'desktop'} onClick={() => setViewMode('desktop')} tooltip="Desktop" />
                        <ToolButton icon={<Smartphone size={18} />} active={viewMode === 'mobile'} onClick={() => setViewMode('mobile')} tooltip="Mobile" />
                    </div>
                    {selectedId && (
                        <button onClick={handleDelete} title="Delete" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#ffffff', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.editorContent}>
                <div className={styles.editorSidebar}>
                    <div className={styles.sidebarHeader}>Components</div>
                    <div className={styles.sidebarContent}>
                        {components.map((comp, idx) => {
                            const Icon = comp.icon
                            return <ComponentItem key={idx} icon={<Icon size={16} />} name={comp.name} onDragStart={(e) => handleDragStart(e, comp.type)} />
                        })}
                    </div>
                </div>

                <div className={styles.canvasArea} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', overflow: 'auto' }}>
                    <div
                        ref={canvasRef}
                        onDrop={handleCanvasDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={handleCanvasClick}
                        style={{
                            width: canvasWidth * displayScale,
                            height: canvasHeight * displayScale,
                            backgroundColor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            position: 'relative',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            flexShrink: 0
                        }}
                    >
                        {elements.map(element => (
                            <div key={element.id}>
                                <div
                                    onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                                    onDoubleClick={() => handleDoubleClick(element.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        position: 'absolute',
                                        left: element.x * displayScale,
                                        top: element.y * displayScale,
                                        width: element.width * displayScale,
                                        height: element.height * displayScale,
                                        backgroundColor: element.backgroundColor || 'transparent',
                                        borderRadius: (element.borderRadius || 0) * displayScale,
                                        border: selectedId === element.id ? '2px solid #3b82f6' : '1px solid #e4e4e7',
                                        cursor: activeTool === 'move' ? 'move' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: (element.fontSize || 14) * displayScale,
                                        fontWeight: element.fontWeight || 'normal',
                                        color: element.type === 'button' ? '#ffffff' : '#18181b',
                                        userSelect: 'none',
                                        boxShadow: selectedId === element.id ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : undefined,
                                        padding: '4px',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {isEditing === element.id ? (
                                        <input
                                            autoFocus
                                            value={element.text || ''}
                                            onChange={(e) => handleTextChange(element.id, e.target.value)}
                                            onBlur={() => setIsEditing(null)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', textAlign: 'center', outline: 'none' }}
                                        />
                                    ) : (
                                        element.text || (element.type === 'image' ? '🖼️' : '')
                                    )}
                                </div>
                                {selectedId === element.id && (
                                    <div
                                        onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                                        style={{
                                            position: 'absolute',
                                            left: (element.x + element.width - 8) * displayScale,
                                            top: (element.y + element.height - 8) * displayScale,
                                            width: 16 * displayScale,
                                            height: 16 * displayScale,
                                            background: '#3b82f6',
                                            border: '2px solid #ffffff',
                                            borderRadius: '50%',
                                            cursor: 'nwse-resize',
                                            zIndex: 10
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ToolButton({ icon, active, onClick, tooltip }: { icon: React.ReactNode, active: boolean, onClick: () => void, tooltip: string }) {
    return <button className={`${styles.toolButton} ${active ? styles.active : ''}`} onClick={onClick} title={tooltip}>{icon}</button>
}

function ComponentItem({ icon, name, onDragStart }: { icon: React.ReactNode, name: string, onDragStart: (e: React.DragEvent) => void }) {
    return (
        <div className={styles.componentItem} draggable onDragStart={onDragStart} style={{ cursor: 'grab' }}>
            <span className={styles.componentIcon}>{icon}</span>
            <span className={styles.componentName}>{name}</span>
        </div>
    )
}
