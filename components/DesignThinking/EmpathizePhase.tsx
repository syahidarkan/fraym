'use client'

import { useState } from 'react'
import { Plus, FileText, Users, BarChart3, Heart } from 'lucide-react'
import { DesignThinkingProject } from '@/types/designThinking'
import InterviewBuilder from './InterviewBuilder'
import PersonaBuilder from './PersonaBuilder'
import EmpathyMapBuilder from './EmpathyMapBuilder'
import styles from './EmpathizePhase.module.css'

interface EmpathizePhaseProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function EmpathizePhase({ project, onUpdate }: EmpathizePhaseProps) {
    const [activeTab, setActiveTab] = useState<'interviews' | 'personas' | 'empathy-maps'>('interviews')

    const tabs = [
        { id: 'interviews', name: 'Interviews', icon: FileText, count: project.interviews.length },
        { id: 'personas', name: 'Personas', icon: Users, count: project.personas.length },
        { id: 'empathy-maps', name: 'Empathy Maps', icon: Heart, count: project.empathyMaps.length }
    ]

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Empathize</h2>
                    <p className={styles.description}>
                        Understand your users through interviews, create personas, and map their experiences
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            <Icon size={20} />
                            <span>{tab.name}</span>
                            {tab.count > 0 && <span className={styles.count}>{tab.count}</span>}
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <div className={styles.content}>
                {activeTab === 'interviews' && (
                    <InterviewBuilder project={project} onUpdate={onUpdate} />
                )}
                {activeTab === 'personas' && (
                    <PersonaBuilder project={project} onUpdate={onUpdate} />
                )}
                {activeTab === 'empathy-maps' && (
                    <EmpathyMapBuilder project={project} onUpdate={onUpdate} />
                )}
            </div>
        </div>
    )
}
