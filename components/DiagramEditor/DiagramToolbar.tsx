'use client'

import { useState } from 'react'
import {
    Square, Diamond, Circle, User, Hexagon, ArrowRight,
    Triangle, Cloud, Database, FileText, StickyNote,
    Layout, Box, ChevronDown, ChevronRight
} from 'lucide-react'
import styles from './DiagramToolbar.module.css'

interface DiagramToolbarProps {
    onAddNode: (shapeType: string, label: string) => void
}

export default function DiagramToolbar({ onAddNode }: DiagramToolbarProps) {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'General': true,
        'Flowchart': true,
        'UML / Use Case': false,
        'BPMN / Workflow': false
    })

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }))
    }

    const generalShapes = [
        { type: 'rectangle', label: 'Rectangle', icon: Square },
        { type: 'rounded', label: 'Rounded', icon: Square },
        { type: 'ellipse', label: 'Ellipse', icon: Circle },
        { type: 'circle', label: 'Circle', icon: Circle },
        { type: 'triangle', label: 'Triangle', icon: Triangle },
        { type: 'diamond', label: 'Diamond', icon: Diamond },
        { type: 'parallelogram', label: 'Parallelogram', icon: Layout },
        { type: 'hexagon', label: 'Hexagon', icon: Hexagon },
        { type: 'cylinder', label: 'Cylinder', icon: Database },
        { type: 'cloud', label: 'Cloud', icon: Cloud },
        { type: 'note', label: 'Note', icon: StickyNote },
    ]

    const flowchartShapes = [
        { type: 'rectangle', label: 'Process', icon: Square },
        { type: 'diamond', label: 'Decision', icon: Diamond },
        { type: 'rounded', label: 'Terminator', icon: Circle },
        { type: 'parallelogram', label: 'Data', icon: Layout },
        { type: 'document', label: 'Document', icon: FileText },
        { type: 'database', label: 'Database', icon: Database },
        { type: 'hexagon', label: 'Preparation', icon: Hexagon },
    ]

    const umlShapes = [
        { type: 'rectangle', label: 'Class', icon: Box },
        { type: 'rectangle', label: 'Object', icon: Box },
        { type: 'ellipse', label: 'Use Case', icon: Circle },
        { type: 'actor', label: 'Actor', icon: User },
        { type: 'note', label: 'Note', icon: StickyNote },
    ]

    const renderShapeGroup = (title: string, shapes: any[]) => (
        <div className={styles.group}>
            <button
                className={styles.groupHeader}
                onClick={() => toggleCategory(title)}
            >
                {openCategories[title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className={styles.groupTitle}>{title}</span>
            </button>

            {openCategories[title] && (
                <div className={styles.shapes}>
                    {shapes.map((shape, index) => {
                        const Icon = shape.icon
                        return (
                            <button
                                key={`${shape.type}-${index}`}
                                className={styles.shapeBtn}
                                onClick={() => onAddNode(shape.type, shape.label)}
                                title={shape.label}
                            >
                                <div className={styles.shapeIcon}>
                                    <Icon size={20} />
                                </div>
                                <div className={styles.shapeLabel}>
                                    {shape.label}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )

    return (
        <div className={styles.toolbar}>
            <div className={styles.header}>
                <h3>Component Library</h3>
            </div>

            <div className={styles.scrollArea}>
                {renderShapeGroup('General', generalShapes)}
                {renderShapeGroup('Flowchart', flowchartShapes)}
                {renderShapeGroup('UML / Use Case', umlShapes)}
                {renderShapeGroup('BPMN / Workflow', flowchartShapes)}
            </div>

            <div className={styles.section}>
                <h4>Connectors</h4>
                <div className={styles.connector}>
                    <ArrowRight size={20} />
                    <span>Drag from node handles</span>
                </div>
            </div>
        </div>
    )
}
