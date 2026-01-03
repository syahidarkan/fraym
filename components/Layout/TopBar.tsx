'use client'

import React, { useState } from 'react'
import { Menu, ChevronDown, MessageSquare, Download, Play, User, Settings, FileText, Save, Upload, Code, Image as ImageIcon, X } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './TopBar.module.css'

interface TopBarProps {
    onPreviewToggle?: () => void
}

export default function TopBar({ onPreviewToggle }: TopBarProps) {
    const { elements } = useCanvasStore()
    const [projectName, setProjectName] = useState('Untitled')
    const [isRenaming, setIsRenaming] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

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

    return (
        <div className={styles.container}>
            {/* Left Section */}
            <div className={styles.leftSection}>
                {/* Menu Button */}
                <div className={styles.dropdown}>
                    <button
                        className={styles.menuButton}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Menu size={18} />
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => { /* TODO: New file */ setMenuOpen(false) }}>
                                <FileText size={16} />
                                New File
                            </button>
                            <button onClick={() => { /* TODO: Open */ setMenuOpen(false) }}>
                                <Upload size={16} />
                                Open
                            </button>
                            <button onClick={() => { /* TODO: Save */ setMenuOpen(false) }}>
                                <Save size={16} />
                                Save
                            </button>
                            <div className={styles.divider} />
                            <button onClick={() => { /* TODO: Settings */ setMenuOpen(false) }}>
                                <Settings size={16} />
                                Settings
                            </button>
                        </div>
                    )}
                </div>

                {/* Project Name */}
                <div className={styles.projectName}>
                    {isRenaming ? (
                        <input
                            type="text"
                            defaultValue={projectName}
                            autoFocus
                            onBlur={(e) => handleRename(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename(e.currentTarget.value)
                                if (e.key === 'Escape') setIsRenaming(false)
                            }}
                            className={styles.renameInput}
                        />
                    ) : (
                        <button onClick={() => setIsRenaming(true)} className={styles.projectButton}>
                            {projectName}
                            <ChevronDown size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Center Section */}
            <div className={styles.centerSection}>
                <button className={styles.iconButton} title="Add Comment">
                    <MessageSquare size={18} />
                </button>
            </div>

            {/* Right Section */}
            <div className={styles.rightSection}>
                {/* Export Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        className={styles.exportButton}
                        onClick={() => setExportOpen(!exportOpen)}
                    >
                        <Download size={16} />
                        Export
                    </button>
                    {exportOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={handleExportPNG}>
                                <ImageIcon size={16} />
                                Export as PNG
                            </button>
                            <button onClick={handleExportHTML}>
                                <Code size={16} />
                                Export as HTML
                            </button>
                            <button onClick={handleExportJSON}>
                                <FileText size={16} />
                                Export as JSON
                            </button>
                        </div>
                    )}
                </div>

                {/* Preview Button */}
                <button
                    className={styles.previewButton}
                    onClick={onPreviewToggle}
                >
                    <Play size={16} />
                </button>

                {/* Profile Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        className={styles.profileButton}
                        onClick={() => setProfileOpen(!profileOpen)}
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
                            <button onClick={() => { /* TODO: Account */ setProfileOpen(false) }}>
                                <User size={16} />
                                Account Settings
                            </button>
                            <button onClick={() => { /* TODO: Logout */ setProfileOpen(false) }}>
                                <X size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
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
    <title>${elements.length > 0 ? 'Wireframe Export' : 'Empty Wireframe'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; min-height: 100vh; }
        .wireframe-container { position: relative; width: 100%; min-height: 100vh; background: white; }
    </style>
</head>
<body>
    <div class="wireframe-container">
        ${items}
    </div>
</body>
</html>`
}
