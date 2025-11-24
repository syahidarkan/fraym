'use client'

import React from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './PropertyPanel.module.css'

export default function PropertyPanel() {
    const { selectedIds, elements, updateElement, removeElement } = useCanvasStore()

    if (selectedIds.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Select an element to edit properties</p>
            </div>
        )
    }

    const id = selectedIds[0]
    const element = elements[id]

    if (!element) return null

    const handleChange = (key: string, value: any) => {
        updateElement(id, { [key]: value })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Properties</h2>
                <button
                    className={styles.deleteBtn}
                    onClick={() => removeElement(id)}
                >
                    Delete
                </button>
            </div>

            <div className={styles.section}>
                <label>Layout</label>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <span>X</span>
                        <input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span>Y</span>
                        <input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <span>W</span>
                        <input
                            type="number"
                            value={Math.round(element.width)}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span>H</span>
                        <input
                            type="number"
                            value={Math.round(element.height)}
                            onChange={(e) => handleChange('height', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {(element.type === 'text' || element.type === 'button') && (
                <div className={styles.section}>
                    <label>Content</label>
                    <input
                        type="text"
                        className={styles.textInput}
                        value={element.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                    />
                </div>
            )}

            {element.type === 'image' && (
                <div className={styles.section}>
                    <label>Image Source</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                    handleChange('content', reader.result as string)
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
                </div>
            )}

            <div className={styles.section}>
                <label>Layer</label>
                <div className={styles.row}>
                    <button onClick={() => handleChange('zIndex', element.zIndex - 1)}>Send Backward</button>
                    <button onClick={() => handleChange('zIndex', element.zIndex + 1)}>Bring Forward</button>
                </div>
            </div>
        </div>
    )
}
