'use client'

import { useState } from 'react'
import { Node } from 'reactflow'
import { X, Trash2, Edit3 } from 'lucide-react'
import styles from './DiagramPropertiesPanel.module.css'

interface DiagramPropertiesPanelProps {
    node: Node
    onUpdate: (data: any) => void
    onDelete: () => void
    onClose: () => void
}

export default function DiagramPropertiesPanel({
    node,
    onUpdate,
    onDelete,
    onClose,
}: DiagramPropertiesPanelProps) {
    const [label, setLabel] = useState(node.data.label || '')
    const [description, setDescription] = useState(node.data.description || '')

    const handleSave = () => {
        onUpdate({ label, description })
    }

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <Edit3 size={16} />
                    <span>Properties</span>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={16} />
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.field}>
                    <label>Node Type</label>
                    <div className={styles.value}>{node.type}</div>
                </div>

                <div className={styles.field}>
                    <label>Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onBlur={handleSave}
                        className={styles.input}
                        placeholder="Enter label"
                    />
                </div>

                <div className={styles.field}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={handleSave}
                        className={styles.textarea}
                        placeholder="Add description (optional)"
                        rows={3}
                    />
                </div>

                <div className={styles.field}>
                    <label>Position</label>
                    <div className={styles.positionInfo}>
                        <span>X: {Math.round(node.position.x)}</span>
                        <span>Y: {Math.round(node.position.y)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.deleteBtn} onClick={onDelete}>
                    <Trash2 size={16} />
                    Delete Node
                </button>
            </div>
        </div>
    )
}
