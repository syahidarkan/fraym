'use client'

import { useState } from 'react'
import { DesignThinkingProject } from '@/types/designThinking'
import styles from './DefinePhase.module.css'
import ProblemStatementBuilder from './ProblemStatementBuilder'
import HMWBuilder from './HMWBuilder'
import UserJourneyBuilder from './UserJourneyBuilder'
import InsightsSidebar from './InsightsSidebar'

interface DefinePhaseProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

type Tab = 'problems' | 'hmw' | 'journeys'

export default function DefinePhase({ project, onUpdate }: DefinePhaseProps) {
    const [activeTab, setActiveTab] = useState<Tab>('problems')

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h2>Define Phase</h2>
                    <p>Synthesize your findings and define the core problem.</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{project.problemStatements?.length || 0}</span>
                        <span className={styles.statLabel}>Problems</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{project.hmwQuestions?.length || 0}</span>
                        <span className={styles.statLabel}>HMWs</span>
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'problems' ? styles.active : ''}`}
                    onClick={() => setActiveTab('problems')}
                >
                    Problem Statements
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'hmw' ? styles.active : ''}`}
                    onClick={() => setActiveTab('hmw')}
                >
                    How Might We
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'journeys' ? styles.active : ''}`}
                    onClick={() => setActiveTab('journeys')}
                >
                    User Journeys
                </button>
            </div>

            <div className={styles.workspace}>
                <div className={styles.mainContent}>
                    {activeTab === 'problems' && (
                        <ProblemStatementBuilder project={project} onUpdate={onUpdate} />
                    )}
                    {activeTab === 'hmw' && (
                        <HMWBuilder project={project} onUpdate={onUpdate} />
                    )}
                    {activeTab === 'journeys' && (
                        <UserJourneyBuilder project={project} onUpdate={onUpdate} />
                    )}
                </div>
                <InsightsSidebar project={project} />
            </div>
        </div>
    )
}
