'use client'

import React from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Layout, Palette, Layers, Trash2 } from 'lucide-react'
import styles from './PropertyPanel.module.css'

export default function PropertyPanel() {
    const { selectedIds, elements, updateElement, removeElement } = useCanvasStore()

    if (selectedIds.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No selection</p>
            </div>
        )
    }

    const id = selectedIds[0]
    const element = elements[id]

    if (!element) return null

    const handleChange = (key: string, value: any) => {
        updateElement(id, { [key]: value })
    }

    const handleStyleChange = (key: string, value: any) => {
        updateElement(id, {
            style: { ...element.style, [key]: value }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.typeLabel}>{element.type}</span>
                <button
                    className={styles.deleteBtn}
                    onClick={() => removeElement(id)}
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Layout size={12} />
                    <span>Layout</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>X</label>
                        <input
                            type="number"
                            value={Number.isFinite(element.x) ? Math.round(element.x) : 0}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Y</label>
                        <input
                            type="number"
                            value={Number.isFinite(element.y) ? Math.round(element.y) : 0}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>W</label>
                        <input
                            type="number"
                            value={Number.isFinite(element.width) ? Math.round(element.width) : 100}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>H</label>
                        <input
                            type="number"
                            value={Number.isFinite(element.height) ? Math.round(element.height) : 100}
                            onChange={(e) => handleChange('height', Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>R</label>
                        <input
                            type="number"
                            placeholder="0"
                            onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Type size={12} />
                    <span>Content</span>
                </div>
                <div className={styles.inputGroupFull}>
                    <textarea
                        className={styles.textArea}
                        value={element.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="Element content..."
                        rows={3}
                    />
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Palette size={12} />
                    <span>Appearance</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroupFull}>
                        <label>Fill</label>
                        <div className={styles.colorPicker}>
                            <div
                                className={styles.colorPreview}
                                style={{ background: element.style?.backgroundColor || '#ffffff' }}
                            />
                            <input
                                type="text"
                                value={element.style?.backgroundColor || '#FFFFFF'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroupFull}>
                        <label>Stroke</label>
                        <div className={styles.colorPicker}>
                            <div
                                className={styles.colorPreview}
                                style={{
                                    background: 'white',
                                    border: `${element.style?.borderWidth || '1'}px solid ${element.style?.borderColor || '#000000'}`
                                }}
                            />
                            <input
                                type="text"
                                value={element.style?.borderColor || '#000000'}
                                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                            />
                            <input
                                type="number"
                                value={parseInt(element.style?.borderWidth) || 1}
                                onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                                className={styles.strokeWidth}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Layers size={12} />
                    <span>Layer</span>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={() => handleChange('zIndex', element.zIndex - 1)}>Backward</button>
                    <button onClick={() => handleChange('zIndex', element.zIndex + 1)}>Forward</button>
                </div>
            </div>
        </div>
    )
}
