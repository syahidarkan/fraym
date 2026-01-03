'use client'

import { useState } from 'react'
import { DesignThinkingProject } from '@/types/designThinking'
import BrainstormBoard from './BrainstormBoard'
import FeaturePrioritization from './FeaturePrioritization'
import styles from './IdeatePhase.module.css'

interface IdeatePhaseProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function IdeatePhase({ project, onUpdate }: IdeatePhaseProps) {
    const [activeTab, setActiveTab] = useState<'brainstorm' | 'prioritize'>('brainstorm')

    const totalIdeas = project.brainstormBoards?.reduce((sum, board) => sum + board.ideas.length, 0) || 0
    const totalVotes = project.brainstormBoards?.reduce((sum, board) =>
        sum + board.ideas.reduce((voteSum, idea) => voteSum + idea.votes, 0), 0
    ) || 0

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h2>Ideate</h2>
                    <p>Generate creative solutions and prioritize features</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{totalIdeas}</div>
                        <div className={styles.statLabel}>Ideas</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{totalVotes}</div>
                        <div className={styles.statLabel}>Votes</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{project.featurePriorities?.length || 0}</div>
                        <div className={styles.statLabel}>Features</div>
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'brainstorm' ? styles.active : ''}`}
                    onClick={() => setActiveTab('brainstorm')}
                >
                    Brainstorm Board
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'prioritize' ? styles.active : ''}`}
                    onClick={() => setActiveTab('prioritize')}
                >
                    Feature Prioritization
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'brainstorm' && (
                    <BrainstormBoard project={project} onUpdate={onUpdate} />
                )}
                {activeTab === 'prioritize' && (
                    <FeaturePrioritization project={project} onUpdate={onUpdate} />
                )}
            </div>
        </div>
    )
}
