'use client'

import { useState, useMemo, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, BarChart3, MessageSquare } from 'lucide-react'
import { DesignThinkingProject, TestResult } from '@/types/designThinking'
import styles from './TestResults.module.css'

interface TestResultsProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function TestResults({ project, onUpdate }: TestResultsProps) {
    const [selectedTestId, setSelectedTestId] = useState<string>('all')

    // Sync results from localStorage to project
    // Results are now loaded directly from the project data (DB)
    // No need to sync from localStorage anymore


    const results = useMemo(() => {
        if (selectedTestId === 'all') {
            return project.testResults || []
        }
        return project.testResults?.filter(r => r.testId === selectedTestId) || []
    }, [project.testResults, selectedTestId])

    const stats = useMemo(() => {
        const totalResults = results.length
        const avgNPS = results.reduce((sum, r) => sum + (r.npsScore || 0), 0) / (totalResults || 1)

        const allTaskResults = results.flatMap(r => r.taskResults)
        const completedTasks = allTaskResults.filter(t => t.completed).length
        const totalTasks = allTaskResults.length
        const successRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0

        const avgTime = allTaskResults.reduce((sum, t) => sum + t.timeSpent, 0) / (totalTasks || 1)

        return {
            totalResults,
            avgNPS: avgNPS.toFixed(1),
            successRate: successRate.toFixed(0),
            avgTime: Math.round(avgTime)
        }
    }, [results])

    if (!project.usabilityTests || project.usabilityTests.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.emptyState}>
                        <BarChart3 size={48} />
                        <h3>No Tests Created Yet</h3>
                        <p>Create a usability test first to start collecting results.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.toolbar}>
                    <div className={styles.filterGroup}>
                        <label>Test:</label>
                        <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
                            <option value="all">All Tests</option>
                            {project.usabilityTests.map(test => (
                                <option key={test.id} value={test.id}>{test.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.emptyState}>
                        <BarChart3 size={48} />
                        <h3>No Results Yet</h3>
                        <p>Share your test link with participants to start collecting results.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.filterGroup}>
                    <label>Test:</label>
                    <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
                        <option value="all">All Tests</option>
                        {project.usabilityTests.map(test => (
                            <option key={test.id} value={test.id}>{test.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.summary}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Participants</div>
                        <div className={styles.summaryValue}>{stats.totalResults}</div>
                        <div className={styles.summarySubtext}>completed tests</div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Success Rate</div>
                        <div className={styles.summaryValue}>{stats.successRate}%</div>
                        <div className={styles.summarySubtext}>tasks completed</div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Avg. NPS Score</div>
                        <div className={styles.summaryValue}>{stats.avgNPS}</div>
                        <div className={styles.summarySubtext}>out of 10</div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Avg. Time</div>
                        <div className={styles.summaryValue}>{stats.avgTime}s</div>
                        <div className={styles.summarySubtext}>per task</div>
                    </div>
                </div>

                <div className={styles.resultsList}>
                    {results.map(result => {
                        const test = project.usabilityTests.find(t => t.id === result.testId)
                        if (!test) return null

                        return (
                            <div key={result.id} className={styles.resultCard}>
                                <div className={styles.resultHeader}>
                                    <div className={styles.participantInfo}>
                                        <h4>{result.participantName}</h4>
                                        <p>{result.participantEmail}</p>
                                        <p style={{ marginTop: '4px', fontSize: '12px' }}>
                                            {new Date(result.completedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className={styles.resultMeta}>
                                        {result.npsScore !== undefined && (
                                            <>
                                                <div style={{ fontSize: '12px', color: '#868e96' }}>NPS Score</div>
                                                <div className={styles.npsScore}>{result.npsScore}/10</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.resultDetails}>
                                    <h4>Task Breakdown</h4>
                                    <table className={styles.tasksTable}>
                                        <thead>
                                            <tr>
                                                <th>Task</th>
                                                <th>Status</th>
                                                <th>Time</th>
                                                <th>Response</th>
                                                <th>Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.taskResults.map((taskResult, index) => {
                                                const task = test.tasks.find(t => t.id === taskResult.taskId)
                                                return (
                                                    <tr key={index}>
                                                        <td>{task?.title || `Task ${index + 1}`}</td>
                                                        <td>
                                                            <span className={taskResult.completed ? styles.success : styles.failure}>
                                                                {taskResult.completed ? 'Completed' : 'Failed'}
                                                            </span>
                                                        </td>
                                                        <td>{taskResult.timeSpent}s</td>
                                                        <td>
                                                            {taskResult.response !== undefined ? (
                                                                <strong>{taskResult.response}</strong>
                                                            ) : (
                                                                taskResult.difficulty ? `${taskResult.difficulty}/5` : '-'
                                                            )}
                                                        </td>
                                                        <td>{taskResult.feedback || '-'}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {result.overallFeedback && (
                                    <div className={styles.feedback}>
                                        <h5>
                                            <MessageSquare size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                            Overall Feedback
                                        </h5>
                                        <p>{result.overallFeedback}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
