'use client'

import { useState, useMemo } from 'react'
import { MessageSquare, Search, GripVertical } from 'lucide-react'
import { DesignThinkingProject } from '@/types/designThinking'
// import { getInterviewResponses } from '@/lib/designThinkingStorage'
import styles from './InsightsSidebar.module.css'

interface InsightsSidebarProps {
    project: DesignThinkingProject
}

interface InsightItem {
    id: string
    text: string
    question: string
    source: string
    interviewTitle: string
}

export default function InsightsSidebar({ project }: InsightsSidebarProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const insights = useMemo(() => {
        const items: InsightItem[] = []

        project.interviews?.forEach(interview => {
            // Fetch responses from storage since they are stored separately
            const responses = interview.responses || []

            responses.forEach(response => {
                Object.entries(response.answers).forEach(([questionId, answer]) => {
                    // Find the question text
                    const question = interview.questions.find(q => q.id === questionId)
                    if (!question) return

                    // Only include text-based answers or meaningful values
                    if (typeof answer !== 'string' && typeof answer !== 'number') return
                    const answerText = String(answer).trim()
                    if (!answerText) return

                    items.push({
                        id: `${response.id}-${questionId}`,
                        text: answerText,
                        question: question.question,
                        source: response.respondentName || 'Anonymous',
                        interviewTitle: interview.title
                    })
                })
            })
        })

        return items
    }, [project])

    const filteredInsights = insights.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDragStart = (e: React.DragEvent, text: string) => {
        e.dataTransfer.setData('text/plain', text)
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <h3>
                    <MessageSquare size={16} />
                    Insights Pool
                </h3>
                <p>Drag answers to your define tools</p>
            </div>

            <div className={styles.filterSection}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#adb5bd' }} />
                    <input
                        type="text"
                        placeholder="Search insights..."
                        className={styles.searchInput}
                        style={{ paddingLeft: 32 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.content}>
                {filteredInsights.length > 0 ? (
                    filteredInsights.map(item => (
                        <div
                            key={item.id}
                            className={styles.insightCard}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.text)}
                        >
                            <div className={styles.insightText}>"{item.text}"</div>
                            <div className={styles.insightMeta}>
                                <span className={styles.questionText}>Q: {item.question}</span>
                                <span className={styles.sourceText}>{item.source} • {item.interviewTitle}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No insights found. Conduct interviews in the Empathize phase to see data here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
