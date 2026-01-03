'use client'

import { useState } from 'react'
import { DesignThinkingProject, EmpathyMap } from '@/types/designThinking'
import { Plus, Trash2 } from 'lucide-react'
import styles from './EmpathyMapBuilder.module.css'

interface EmpathyMapBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function EmpathyMapBuilder({ project, onUpdate }: EmpathyMapBuilderProps) {
    const [selectedMap, setSelectedMap] = useState<EmpathyMap | null>(
        project.empathyMaps.length > 0 ? project.empathyMaps[0] : null
    )

    const handleCreateMap = () => {
        const newMap: EmpathyMap = {
            id: `empathy-${Date.now()}`,
            says: [],
            thinks: [],
            does: [],
            feels: [],
            createdAt: Date.now()
        }

        const updatedProject = {
            ...project,
            empathyMaps: [...project.empathyMaps, newMap]
        }

        onUpdate(updatedProject)
        setSelectedMap(newMap)
    }

    const handleAddItem = (quadrant: keyof Pick<EmpathyMap, 'says' | 'thinks' | 'does' | 'feels'>, value: string) => {
        if (!selectedMap || !value.trim()) return

        const updatedMap = {
            ...selectedMap,
            [quadrant]: [...selectedMap[quadrant], value.trim()]
        }

        const updatedProject = {
            ...project,
            empathyMaps: project.empathyMaps.map(m => m.id === selectedMap.id ? updatedMap : m)
        }

        onUpdate(updatedProject)
        setSelectedMap(updatedMap)
    }

    const handleRemoveItem = (quadrant: keyof Pick<EmpathyMap, 'says' | 'thinks' | 'does' | 'feels'>, index: number) => {
        if (!selectedMap) return

        const updatedMap = {
            ...selectedMap,
            [quadrant]: selectedMap[quadrant].filter((_, i) => i !== index)
        }

        const updatedProject = {
            ...project,
            empathyMaps: project.empathyMaps.map(m => m.id === selectedMap.id ? updatedMap : m)
        }

        onUpdate(updatedProject)
        setSelectedMap(updatedMap)
    }

    if (!selectedMap && project.empathyMaps.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h3>No Empathy Maps yet</h3>
                <p>Create an empathy map to understand what users say, think, do, and feel</p>
                <button className={styles.btnPrimary} onClick={handleCreateMap}>
                    <Plus size={18} />
                    Create Empathy Map
                </button>
            </div>
        )
    }

    const QuadrantInput = ({
        title,
        quadrant,
        items,
        placeholder
    }: {
        title: string
        quadrant: keyof Pick<EmpathyMap, 'says' | 'thinks' | 'does' | 'feels'>
        items: string[]
        placeholder: string
    }) => {
        const [input, setInput] = useState('')

        return (
            <div className={styles.quadrant}>
                <h4>{title}</h4>
                <div className={styles.items}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <span>{item}</span>
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemoveItem(quadrant, index)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddItem(quadrant, input)
                                setInput('')
                            }
                        }}
                        placeholder={placeholder}
                        className={styles.input}
                    />
                    <button
                        className={styles.addBtn}
                        onClick={() => {
                            handleAddItem(quadrant, input)
                            setInput('')
                        }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Empathy Map</h3>
                <select
                    className={styles.select}
                    value={selectedMap?.id || ''}
                    onChange={(e) => {
                        const map = project.empathyMaps.find(m => m.id === e.target.value)
                        setSelectedMap(map || null)
                    }}
                >
                    {project.empathyMaps.map((map, index) => (
                        <option key={map.id} value={map.id}>
                            Empathy Map {index + 1}
                        </option>
                    ))}
                </select>
                <button className={styles.btnSecondary} onClick={handleCreateMap}>
                    <Plus size={18} />
                    New Map
                </button>
            </div>

            <div className={styles.grid}>
                <QuadrantInput
                    title="💬 Says"
                    quadrant="says"
                    items={selectedMap?.says || []}
                    placeholder="What does the user say? (Press Enter to add)"
                />
                <QuadrantInput
                    title="💭 Thinks"
                    quadrant="thinks"
                    items={selectedMap?.thinks || []}
                    placeholder="What does the user think? (Press Enter to add)"
                />
                <QuadrantInput
                    title="👋 Does"
                    quadrant="does"
                    items={selectedMap?.does || []}
                    placeholder="What does the user do? (Press Enter to add)"
                />
                <QuadrantInput
                    title="❤️ Feels"
                    quadrant="feels"
                    items={selectedMap?.feels || []}
                    placeholder="What does the user feel? (Press Enter to add)"
                />
            </div>
        </div>
    )
}
