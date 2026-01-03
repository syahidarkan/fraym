'use client'

import React, { useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { X, Copy, Download, Check } from 'lucide-react'
import styles from './ExportModal.module.css'

interface ExportModalProps {
    onClose: () => void
}

export default function ExportModal({ onClose }: ExportModalProps) {
    const { elements } = useCanvasStore()
    const [activeTab, setActiveTab] = useState<'html' | 'css'>('html')
    const [copied, setCopied] = useState(false)

    const generateHTML = () => {
        const elementsList = Object.values(elements).sort((a, b) => a.zIndex - b.zIndex)

        let html = '<div class="wireframe-container">\n'
        elementsList.forEach(el => {
            const content = el.content || el.type
            html += `  <div class="element element-${el.type}" data-id="${el.id}">\n`
            html += `    ${content}\n`
            html += `  </div>\n`
        })
        html += '</div>'
        return html
    }

    const generateCSS = () => {
        const elementsList = Object.values(elements)

        let css = `.wireframe-container {\n  position: relative;\n  width: 100%;\n  min-height: 100vh;\n}\n\n`
        css += `.element {\n  position: absolute;\n  box-sizing: border-box;\n}\n\n`

        elementsList.forEach(el => {
            css += `.element[data-id="${el.id}"] {\n`
            css += `  left: ${el.x}px;\n`
            css += `  top: ${el.y}px;\n`
            css += `  width: ${el.width}px;\n`
            css += `  height: ${el.height}px;\n`
            css += `  z-index: ${el.zIndex};\n`
            if (el.style?.backgroundColor) css += `  background-color: ${el.style.backgroundColor};\n`
            if (el.style?.borderColor) css += `  border: ${el.style.borderWidth || '1px'} solid ${el.style.borderColor};\n`
            css += `}\n\n`
        })

        return css
    }

    const code = activeTab === 'html' ? generateHTML() : generateCSS()

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `wireframe.${activeTab}`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Export Code</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'html' ? styles.active : ''}`}
                        onClick={() => setActiveTab('html')}
                    >
                        HTML
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'css' ? styles.active : ''}`}
                        onClick={() => setActiveTab('css')}
                    >
                        CSS
                    </button>
                </div>

                <pre className={styles.code}>
                    <code>{code}</code>
                </pre>

                <div className={styles.actions}>
                    <button className={styles.btn} onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button className={styles.btn} onClick={handleDownload}>
                        <Download size={16} />
                        Download
                    </button>
                </div>
            </div>
        </div>
    )
}
