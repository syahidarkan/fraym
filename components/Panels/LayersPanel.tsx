'use client'

import React from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { Eye, EyeOff, Lock, Unlock, ChevronRight, ChevronDown, Box } from 'lucide-react'
import styles from './LayersPanel.module.css'

export default function LayersPanel() {
    const { elements, selectedIds, selectElement, updateElement } = useCanvasStore()
    const elementList = Object.values(elements).reverse() // Show newest on top

    const toggleVisibility = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const element = elements[id]
        updateElement(id, { visible: !element.visible })
    }

    const toggleLock = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const element = elements[id]
        updateElement(id, { locked: !element.locked })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>Layers</span>
                <span className={styles.count}>{elementList.length}</span>
            </div>

            <div className={styles.layerList}>
                {elementList.length === 0 ? (
                    <div className={styles.empty}>No layers</div>
                ) : (
                    elementList.map(element => {
                        const isSelected = selectedIds.includes(element.id)
                        const isVisible = element.visible !== false
                        const isLocked = element.locked === true

                        return (
                            <div
                                key={element.id}
                                className={`${styles.layerItem} ${isSelected ? styles.selected : ''}`}
                                onClick={(e) => !isLocked && selectElement(element.id, e.shiftKey)}
                            >
                                <div className={styles.expandIcon}>
                                    {/* Placeholder for nested groups */}
                                </div>
                                <div className={styles.layerIcon}>
                                    <Box size={12} />
                                </div>
                                <span className={styles.layerName}>
                                    {element.content || element.type}
                                </span>
                                <div className={styles.layerActions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => toggleLock(e, element.id)}
                                        title={isLocked ? "Unlock" : "Lock"}
                                    >
                                        {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => toggleVisibility(e, element.id)}
                                        title={isVisible ? "Hide" : "Show"}
                                    >
                                        {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
