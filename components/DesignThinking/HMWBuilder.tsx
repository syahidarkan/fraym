'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, HelpCircle } from 'lucide-react'
import { DesignThinkingProject, HMWQuestion } from '@/types/designThinking'
import styles from './HMWBuilder.module.css'

interface HMWBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function HMWBuilder({ project, onUpdate }: HMWBuilderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editingHMW, setEditingHMW] = useState<Partial<HMWQuestion>>({})

    const handleCreate = () => {
        setEditingHMW({
            id: `hmw-${Date.now()}`,
            question: '',
            votes: 0,
            createdAt: Date.now()
        })
        setIsEditing(true)
    }

    const handleSave = () => {
        if (!editingHMW.question) {
            alert('Please enter a question')
            return
        }

        // Ensure it starts with "How might we"
        let questionText = editingHMW.question.trim()
        if (!questionText.toLowerCase().startsWith('how might we')) {
            questionText = 'How might we ' + questionText
        }
        if (!questionText.endsWith('?')) {
            questionText += '?'
        }

        const newHMW: HMWQuestion = {
            ...editingHMW as HMWQuestion,
            question: questionText
        }

        const updatedProject = { ...project }
        if (!updatedProject.hmwQuestions) updatedProject.hmwQuestions = []

        const index = updatedProject.hmwQuestions.findIndex(h => h.id === newHMW.id)
        if (index >= 0) {
            updatedProject.hmwQuestions[index] = newHMW
        } else {
            updatedProject.hmwQuestions.push(newHMW)
        }

        onUpdate(updatedProject)
        setIsEditing(false)
        setEditingHMW({})
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this HMW question?')) return

        const updatedProject = {
            ...project,
            hmwQuestions: project.hmwQuestions.filter(h => h.id !== id)
        }
        onUpdate(updatedProject)
    }

    const handleEdit = (hmw: HMWQuestion) => {
        setEditingHMW(hmw)
        setIsEditing(true)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const text = e.dataTransfer.getData('text/plain')
        if (text) {
            const currentValue = editingHMW.question || ''
            const newValue = currentValue ? `${currentValue} ${text}` : text
            setEditingHMW({ ...editingHMW, question: newValue })
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    if (isEditing) {
        return (
            <div className={styles.formCard}>
                <h3 className={styles.formTitle}>
                    {editingHMW.id && project.hmwQuestions?.find(h => h.id === editingHMW.id)
                        ? 'Edit HMW Question'
                        : 'New HMW Question'}
                </h3>

                <div className={styles.formGroup}>
                    <label>Question</label>
                    <input
                        type="text"
                        value={editingHMW.question || ''}
                        onChange={(e) => setEditingHMW({ ...editingHMW, question: e.target.value })}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        placeholder="e.g., How might we make healthy cooking faster for busy parents?"
                        className={styles.input}
                        autoFocus
                    />
                    <p style={{ fontSize: '12px', color: '#868e96', marginTop: '4px' }}>
                        Tip: Start with "How might we..." to frame the problem as an opportunity.
                    </p>
                </div>

                <div className={styles.formActions}>
                    <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>
                        <X size={18} />
                        Cancel
                    </button>
                    <button className={styles.btnPrimary} onClick={handleSave}>
                        <Save size={18} />
                        Save Question
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>How Might We Questions</h3>
                <button className={styles.btnPrimary} onClick={handleCreate}>
                    <Plus size={18} />
                    New HMW
                </button>
            </div>

            {(!project.hmwQuestions || project.hmwQuestions.length === 0) ? (
                <div className={styles.emptyState}>
                    <HelpCircle size={48} />
                    <h3>No HMW Questions Yet</h3>
                    <p>Turn your problem statements into opportunities for design.</p>
                    <button className={styles.btnPrimary} onClick={handleCreate}>
                        <Plus size={18} />
                        Create HMW
                    </button>
                </div>
            ) : (
                <div className={styles.list}>
                    {project.hmwQuestions.map(hmw => (
                        <div key={hmw.id} className={styles.hmwCard}>
                            <div className={styles.hmwContent}>
                                <span className={styles.hmwPrefix}>HMW</span>
                                <div className={styles.hmwQuestion}>{hmw.question}</div>
                            </div>
                            <div className={styles.hmwActions}>
                                <button
                                    className={styles.btnIcon}
                                    onClick={() => handleEdit(hmw)}
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    className={`${styles.btnIcon} ${styles.delete}`}
                                    onClick={() => handleDelete(hmw.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
