'use client'

import { useState } from 'react'
import { DesignThinkingProject } from '@/types/designThinking'
import UsabilityTestBuilder from './UsabilityTestBuilder'
import TestResults from './TestResults'
import styles from './TestPhase.module.css'

interface TestPhaseProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function TestPhase({ project, onUpdate }: TestPhaseProps) {
    const [activeTab, setActiveTab] = useState<'tests' | 'results'>('tests')

    const totalTests = project.usabilityTests?.length || 0
    const activeTests = project.usabilityTests?.filter(t => t.status === 'active').length || 0
    const totalResults = project.testResults?.length || 0

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h2>Test</h2>
                    <p>Validate your designs with real users</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{totalTests}</div>
                        <div className={styles.statLabel}>Tests</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{activeTests}</div>
                        <div className={styles.statLabel}>Active</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{totalResults}</div>
                        <div className={styles.statLabel}>Results</div>
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'tests' ? styles.active : ''}`}
                    onClick={() => setActiveTab('tests')}
                >
                    Usability Tests
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'results' ? styles.active : ''}`}
                    onClick={() => setActiveTab('results')}
                >
                    Test Results
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'tests' && (
                    <UsabilityTestBuilder project={project} onUpdate={onUpdate} />
                )}
                {activeTab === 'results' && (
                    <TestResults project={project} onUpdate={onUpdate} />
                )}
            </div>
        </div>
    )
}
