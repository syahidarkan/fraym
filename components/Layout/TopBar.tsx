'use client'

import React from 'react'
import { Download, Code } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './TopBar.module.css'

export default function TopBar() {
    const { elements } = useCanvasStore()

    const handleExportPNG = async () => {
        const canvas = document.querySelector(`.${styles.canvasContainer}`) as HTMLElement
        // We need to target the actual canvas DOM node. 
        // Since TopBar is outside, we might need a better selector or ref.
        // For now, let's assume we can select by a known class from Canvas.module.css
        // But since modules hash classes, we should probably pass a ref or ID.
        // Let's use a data-attribute on the canvas container.
        const node = document.getElementById('canvas-workspace')

        if (node) {
            try {
                const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: '#f8f9fa' })
                const link = document.createElement('a')
                link.download = 'wireframe.png'
                link.href = dataUrl
                link.click()
            } catch (err) {
                console.error('Failed to export PNG', err)
            }
        }
    }

    const handleExportHTML = () => {
        const htmlContent = generateHTML(Object.values(elements))
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'wireframe.html'
        link.href = url
        link.click()
    }

    return (
        <div className={styles.container}>
            <div className={styles.brand}>Wireframe Builder</div>
            <div className={styles.actions}>
                <button onClick={handleExportPNG}>
                    <Download size={16} /> Export PNG
                </button>
                <button onClick={handleExportHTML}>
                    <Code size={16} /> Export HTML
                </button>
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
                content = `<div style="${style} background: #e9ecef; border: 2px solid #ced4da;"></div>`
                break
            case 'circle':
                content = `<div style="${style} background: #e9ecef; border: 2px solid #ced4da; border-radius: 50%;"></div>`
                break
            case 'text':
                content = `<div style="${style} display: flex; align-items: center;">${el.content}</div>`
                break
            case 'button':
                content = `<button style="${style} background: #0d6efd; color: white; border: none; border-radius: 4px;">${el.content}</button>`
                break
            case 'input':
                content = `<input style="${style} border: 1px solid #ced4da; border-radius: 4px; padding: 0 8px;" placeholder="Input" readonly />`
                break
            case 'card':
                content = `<div style="${style} background: white; border: 1px solid #ced4da; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"></div>`
                break
        }
        return content
    }).join('\n')

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: sans-serif; background: #f8f9fa; }
  </style>
</head>
<body>
  <div style="position: relative; width: 100vw; height: 100vh;">
    ${items}
  </div>
</body>
</html>`
}
