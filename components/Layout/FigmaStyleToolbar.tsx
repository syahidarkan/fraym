'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    MousePointer2, Hand, Square, Type, Image,
    MessageSquare, ChevronDown, Play, ZoomIn, ZoomOut, Download,
    Menu, Settings, FileText, Save, Upload, Code, Image as ImageIcon, X, User, Home,
    AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
    ArrowUpFromLine, ArrowDownFromLine, Layers, Copy, Trash2, MoreHorizontal, ScanLine
} from 'lucide-react'
import { toPng } from 'html-to-image'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './FigmaStyleToolbar.module.css'
import SettingsModal from '../Modals/SettingsModal'
import AccountSettingsModal from '../Modals/AccountSettingsModal'
import WireframeScanner from '../WireframeScanner/WireframeScanner'

interface FigmaStyleToolbarProps {
    zoom?: number
    onZoomIn?: () => void
    onZoomOut?: () => void
    onResetZoom?: () => void
    activeTool?: string
    onToolChange?: (tool: string) => void
    onPreviewToggle?: () => void
}

export default function FigmaStyleToolbar({
    zoom = 1,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    activeTool = 'move',
    onToolChange,
    onPreviewToggle
}: FigmaStyleToolbarProps) {
    const router = useRouter()
    const {
        elements,
        alignElements,
        distributeElements,
        bringToFront,
        sendToBack,
        duplicateElements,
        deleteSelected,
        selectedIds
    } = useCanvasStore()

    const [projectName, setProjectName] = useState('Untitled')
    const [isRenaming, setIsRenaming] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showAccountModal, setShowAccountModal] = useState(false)
    const [showScannerModal, setShowScannerModal] = useState(false)

    const hasSelection = selectedIds.length > 0
    const hasMultipleSelection = selectedIds.length > 1

    const handleRename = (newName: string) => {
        if (newName.trim()) {
            setProjectName(newName.trim())
        }
        setIsRenaming(false)
    }

    const handleExportPNG = async () => {
        const node = document.getElementById('canvas-workspace')
        if (node) {
            try {
                const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: '#f8f9fa' })
                const link = document.createElement('a')
                link.download = `${projectName}-${Date.now()}.png`
                link.href = dataUrl
                link.click()
            } catch (err) {
                console.error('Failed to export PNG', err)
            }
        }
        setExportOpen(false)
    }

    const handleExportHTML = () => {
        const htmlContent = generateHTML(Object.values(elements))
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `${projectName}-${Date.now()}.html`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        setExportOpen(false)
    }

    const handleExportJSON = () => {
        const json = JSON.stringify(elements, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `${projectName}-${Date.now()}.json`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        setExportOpen(false)
    }

    // Menu Actions
    const handleNewFile = () => {
        if (confirm('Create new file? All unsaved changes will be lost.')) {
            localStorage.removeItem('wireframe-project')
            window.location.reload()
        }
        setMenuOpen(false)
    }

    const handleSave = () => {
        const projectData = {
            name: projectName,
            elements,
            lastModified: Date.now()
        }
        localStorage.setItem('wireframe-project', JSON.stringify(projectData))
        alert('Project saved locally!')
        setMenuOpen(false)
    }

    const handleOpen = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        const content = e.target?.result as string
                        const data = JSON.parse(content)
                        localStorage.setItem('wireframe-project', JSON.stringify({
                            name: file.name.replace('.json', ''),
                            elements: data,
                            lastModified: Date.now()
                        }))
                        window.location.reload()
                    } catch (err) {
                        alert('Invalid file format')
                    }
                }
                reader.readAsText(file)
            }
        }
        input.click()
        setMenuOpen(false)
    }

    const handleAccountSettings = () => {
        setShowAccountModal(true)
        setProfileOpen(false)
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('wireframe_user')
            router.push('/login')
        }
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        if (menuOpen || exportOpen || profileOpen) {
            const handleClickOutside = () => {
                setMenuOpen(false)
                setExportOpen(false)
                setProfileOpen(false)
            }
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [menuOpen, exportOpen, profileOpen])

    return (
        <div className={styles.container}>
            {/* Left Section - Menu & Tools */}
            <div className={styles.leftSection}>
                <div className={styles.dropdown}>
                    <button
                        className={styles.menuButton}
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                    >
                        <Menu size={18} />
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={(e) => { e.stopPropagation(); router.push('/dashboard'); }}>
                                <Home size={16} />
                                Back to Dashboard
                            </button>
                            <div className={styles.divider} />
                            <button onClick={(e) => { e.stopPropagation(); handleNewFile(); }}>
                                <FileText size={16} />
                                New File
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleOpen(); }}>
                                <Upload size={16} />
                                Open
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowScannerModal(true); setMenuOpen(false); }}>
                                <ScanLine size={16} />
                                Scan Wireframe
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleSave(); }}>
                                <Save size={16} />
                                Save
                            </button>
                            <div className={styles.divider} />
                            <button onClick={(e) => { e.stopPropagation(); setShowSettingsModal(true); setMenuOpen(false); }}>
                                <Settings size={16} />
                                Settings
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.separator} />

                <div className={styles.tools}>
                    <button
                        className={`${styles.tool} ${activeTool === 'move' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('move')}
                        title="Move (V)"
                    >
                        <MousePointer2 size={18} />
                    </button>
                    <button
                        className={`${styles.tool} ${activeTool === 'hand' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('hand')}
                        title="Hand Tool (H)"
                    >
                        <Hand size={18} />
                    </button>
                    <div className={styles.separator} />
                    <button
                        className={`${styles.tool} ${activeTool === 'frame' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('frame')}
                        title="Frame (F)"
                    >
                        <Square size={18} />
                    </button>
                    <button
                        className={`${styles.tool} ${activeTool === 'text' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('text')}
                        title="Text (T)"
                    >
                        <Type size={18} />
                    </button>
                    <button
                        className={`${styles.tool} ${activeTool === 'image' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('image')}
                        title="Image (I)"
                    >
                        <Image size={18} />
                    </button>
                    <button
                        className={`${styles.tool} ${activeTool === 'comment' ? styles.active : ''}`}
                        onClick={() => onToolChange?.('comment')}
                        title="Comment (C)"
                    >
                        <MessageSquare size={18} />
                    </button>
                </div>
            </div>

            {/* Center Section - Project Name & Actions */}
            <div className={styles.centerSection}>
                {hasSelection ? (
                    <div className={styles.actionToolbar}>
                        <div className={styles.actionGroup}>
                            <button className={styles.actionButton} onClick={() => duplicateElements()} title="Duplicate (Ctrl+D)">
                                <Copy size={16} />
                            </button>
                            <button className={styles.actionButton} onClick={() => deleteSelected()} title="Delete (Del)">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className={styles.separator} />

                        <div className={styles.actionGroup}>
                            <button className={styles.actionButton} onClick={() => bringToFront()} title="Bring to Front">
                                <ArrowUpFromLine size={16} />
                            </button>
                            <button className={styles.actionButton} onClick={() => sendToBack()} title="Send to Back">
                                <ArrowDownFromLine size={16} />
                            </button>
                        </div>

                        {hasMultipleSelection && (
                            <>
                                <div className={styles.separator} />
                                <div className={styles.actionGroup}>
                                    <button className={styles.actionButton} onClick={() => alignElements('left')} title="Align Left">
                                        <AlignLeft size={16} />
                                    </button>
                                    <button className={styles.actionButton} onClick={() => alignElements('center')} title="Align Center">
                                        <AlignCenter size={16} />
                                    </button>
                                    <button className={styles.actionButton} onClick={() => alignElements('right')} title="Align Right">
                                        <AlignRight size={16} />
                                    </button>
                                </div>
                                <div className={styles.separator} />
                                <div className={styles.actionGroup}>
                                    <button className={styles.actionButton} onClick={() => alignElements('top')} title="Align Top">
                                        <AlignVerticalJustifyStart size={16} />
                                    </button>
                                    <button className={styles.actionButton} onClick={() => alignElements('middle')} title="Align Middle">
                                        <AlignVerticalJustifyCenter size={16} />
                                    </button>
                                    <button className={styles.actionButton} onClick={() => alignElements('bottom')} title="Align Bottom">
                                        <AlignVerticalJustifyEnd size={16} />
                                    </button>
                                </div>
                                <div className={styles.separator} />
                                <div className={styles.actionGroup}>
                                    <button className={styles.actionButton} onClick={() => distributeElements('horizontal')} title="Distribute Horizontal">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={styles.projectName}>
                        {isRenaming ? (
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                onBlur={() => handleRename(projectName)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename(projectName)}
                                autoFocus
                                className={styles.renameInput}
                            />
                        ) : (
                            <button onClick={() => setIsRenaming(true)} className={styles.projectButton}>
                                {projectName}
                                <ChevronDown size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Right Section - Export, Preview, Profile, Zoom */}
            <div className={styles.rightSection}>
                <div className={styles.dropdown}>
                    <button
                        className={styles.exportButton}
                        onClick={(e) => { e.stopPropagation(); setExportOpen(!exportOpen); }}
                    >
                        <Download size={16} />
                        Export
                    </button>
                    {exportOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={(e) => { e.stopPropagation(); handleExportPNG(); }}>
                                <ImageIcon size={16} />
                                Export as PNG
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleExportHTML(); }}>
                                <Code size={16} />
                                Export as HTML
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleExportJSON(); }}>
                                <FileText size={16} />
                                Export as JSON
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className={styles.previewButton}
                    onClick={onPreviewToggle}
                    title="Preview Mode"
                >
                    <Play size={16} />
                </button>

                <div className={styles.dropdown}>
                    <button
                        className={styles.profileButton}
                        onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                    >
                        <User size={18} />
                    </button>
                    {profileOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.profileInfo}>
                                <div className={styles.profileName}>User Name</div>
                                <div className={styles.profileEmail}>user@example.com</div>
                            </div>
                            <div className={styles.divider} />
                            <button onClick={(e) => { e.stopPropagation(); handleAccountSettings(); }}>
                                <User size={16} />
                                Account Settings
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                                <X size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.separator} />

                <div className={styles.zoom}>
                    <button onClick={onZoomOut} className={styles.zoomButton}>
                        <ZoomOut size={16} />
                    </button>
                    <button onClick={onResetZoom} className={styles.zoomPercent}>
                        {Math.round(zoom * 100)}%
                    </button>
                    <button onClick={onZoomIn} className={styles.zoomButton}>
                        <ZoomIn size={16} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showSettingsModal && <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />}
            {showAccountModal && <AccountSettingsModal onClose={() => setShowAccountModal(false)} />}
            {showScannerModal && <WireframeScanner onClose={() => setShowScannerModal(false)} />}
        </div>
    )
}

function generateHTML(elements: any[]) {
    const items = elements.map(el => {
        const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; z-index: ${el.zIndex};`
        let content = ''

        switch (el.type) {
            case 'rectangle':
                content = `<div style="${style} background: #e9ecef; border: 2px solid #ced4da; border-radius: 4px;"></div>`
                break
            case 'circle':
                content = `<div style="${style} background: #e9ecef; border: 2px solid #ced4da; border-radius: 50%;"></div>`
                break
            case 'text':
                content = `<div style="${style} display: flex; align-items: center; font-family: sans-serif; color: #333;">${el.content || 'Text'}</div>`
                break
            case 'button':
                content = `<button style="${style} background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: sans-serif;">${el.content || 'Button'}</button>`
                break
            case 'input':
                content = `<input style="${style} border: 1px solid #ced4da; border-radius: 4px; padding: 0 12px; font-family: sans-serif;" placeholder="${el.content || 'Input'}" />`
                break
            default:
                content = `<div style="${style} background: #f0f0f0; border: 1px solid #ddd;"></div>`
        }
        return content
    }).join('\n    ')

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe Export</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:sans-serif;background:#f8f9fa;min-height:100vh}
        .wireframe-container{position:relative;width:100%;min-height:100vh;background:white}
    </style>
</head>
<body>
    <div class="wireframe-container">
        ${items}
    </div>
</body>
</html>`
}
