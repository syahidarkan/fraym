'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Lightbulb } from 'lucide-react'
import { DesignThinkingProject, ProblemStatement } from '@/types/designThinking'
import styles from './ProblemStatementBuilder.module.css'

interface ProblemStatementBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function ProblemStatementBuilder({ project, onUpdate }: ProblemStatementBuilderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editingStatement, setEditingStatement] = useState<Partial<ProblemStatement>>({})

    const handleCreate = () => {
        setEditingStatement({
            id: `ps-${Date.now()}`,
            user: '',
            need: '',
            insight: '',
            priority: 1,
            createdAt: Date.now()
        })
        setIsEditing(true)
    }

    const handleSave = () => {
        if (!editingStatement.user || !editingStatement.need || !editingStatement.insight) {
            alert('Please fill in all fields')
            return
        }

        const statement = `**${editingStatement.user}** needs to **${editingStatement.need}** because **${editingStatement.insight}**`

        const newStatement: ProblemStatement = {
            ...editingStatement as ProblemStatement,
            statement
        }

        const updatedProject = { ...project }
        if (!updatedProject.problemStatements) updatedProject.problemStatements = []

        const index = updatedProject.problemStatements.findIndex(p => p.id === newStatement.id)
        if (index >= 0) {
            updatedProject.problemStatements[index] = newStatement
        } else {
            updatedProject.problemStatements.push(newStatement)
        }

        onUpdate(updatedProject)
        setIsEditing(false)
        setEditingStatement({})
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this problem statement?')) return

        const updatedProject = {
            ...project,
            problemStatements: project.problemStatements.filter(p => p.id !== id)
        }
        onUpdate(updatedProject)
    }

    const handleEdit = (statement: ProblemStatement) => {
        setEditingStatement(statement)
        setIsEditing(true)
    }

    const handleDrop = (e: React.DragEvent, field: keyof ProblemStatement) => {
        e.preventDefault()
        const text = e.dataTransfer.getData('text/plain')
        if (text) {
            const currentValue = editingStatement[field] || ''
            // Add space if appending
            const newValue = currentValue ? `${currentValue} ${text}` : text
            setEditingStatement({ ...editingStatement, [field]: newValue })
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
                    {editingStatement.id && project.problemStatements?.find(p => p.id === editingStatement.id)
                        ? 'Edit Problem Statement'
                        : 'New Problem Statement'}
                </h3>

                <div className={styles.formGroup}>
                    <label>User (Who is experiencing the problem?)</label>
                    <input
                        type="text"
                        value={editingStatement.user || ''}
                        onChange={(e) => setEditingStatement({ ...editingStatement, user: e.target.value })}
                        onDrop={(e) => handleDrop(e, 'user')}
                        onDragOver={handleDragOver}
                        placeholder="e.g., A busy working parent"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Need (What are they trying to do?)</label>
                    <input
                        type="text"
                        value={editingStatement.need || ''}
                        onChange={(e) => setEditingStatement({ ...editingStatement, need: e.target.value })}
                        onDrop={(e) => handleDrop(e, 'need')}
                        onDragOver={handleDragOver}
                        placeholder="e.g., prepare healthy meals quickly"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Insight (Why do they need this?)</label>
                    <textarea
                        value={editingStatement.insight || ''}
                        onChange={(e) => setEditingStatement({ ...editingStatement, insight: e.target.value })}
                        onDrop={(e) => handleDrop(e, 'insight')}
                        onDragOver={handleDragOver}
                        placeholder="e.g., they want to ensure their children have good nutrition but lack time for elaborate cooking"
                        className={styles.textarea}
                        rows={3}
                    />
                </div>

                {(editingStatement.user || editingStatement.need || editingStatement.insight) && (
                    <div className={styles.previewBox}>
                        <span className={styles.previewLabel}>Preview</span>
                        <p className={styles.previewText}>
                            <strong>{editingStatement.user || '...'}</strong> needs to <strong>{editingStatement.need || '...'}</strong> because <strong>{editingStatement.insight || '...'}</strong>
                        </p>
                    </div>
                )}

                <div className={styles.formActions}>
                    <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>
                        <X size={18} />
                        Cancel
                    </button>
                    <button className={styles.btnPrimary} onClick={handleSave}>
                        <Save size={18} />
                        Save Statement
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Problem Statements</h3>
                <button className={styles.btnPrimary} onClick={handleCreate}>
                    <Plus size={18} />
                    New Statement
                </button>
            </div>

            {(!project.problemStatements || project.problemStatements.length === 0) ? (
                <div className={styles.emptyState}>
                    <Lightbulb size={48} />
                    <h3>No Problem Statements Yet</h3>
                    <p>Define your user's core problems to guide your ideation.</p>
                    <button className={styles.btnPrimary} onClick={handleCreate}>
                        <Plus size={18} />
                        Create Statement
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {project.problemStatements.map(statement => (
                        <div key={statement.id} className={styles.card}>
                            <p className={styles.statementText}>
                                <strong>{statement.user}</strong> needs to <strong>{statement.need}</strong> because <strong>{statement.insight}</strong>
                            </p>
                            <div className={styles.cardFooter}>
                                <button
                                    className={styles.btnSecondary}
                                    onClick={() => handleEdit(statement)}
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    className={styles.btnDanger}
                                    onClick={() => handleDelete(statement.id)}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
