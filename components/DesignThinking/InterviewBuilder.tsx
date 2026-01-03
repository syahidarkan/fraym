'use client'

import { useState } from 'react'
import { Plus, Trash2, Copy, ExternalLink, BarChart3, Edit2, Save, X, FileText } from 'lucide-react'
import { DesignThinkingProject, Interview, InterviewQuestion } from '@/types/designThinking'
// import { getInterviewResponses } from '@/lib/designThinkingStorage'
import styles from './InterviewBuilder.module.css'

interface InterviewBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function InterviewBuilder({ project, onUpdate }: InterviewBuilderProps) {
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingInterview, setEditingInterview] = useState<Partial<Interview>>({})

    const handleCreateInterview = () => {
        const newInterview: Interview = {
            id: `interview-${Date.now()}`,
            title: 'New Interview',
            description: '',
            questions: [],
            responses: [],
            shareLink: '',
            targetResponses: 10,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        newInterview.shareLink = `${window.location.origin}/interview/${newInterview.id}`

        setEditingInterview(newInterview)
        setIsEditing(true)
    }

    const handleSaveInterview = () => {
        if (!editingInterview.id) return

        // Validate: must have at least one question
        if (!editingInterview.questions || editingInterview.questions.length === 0) {
            alert('Please add at least one question to the interview.')
            return
        }

        // Validate: all questions must have text
        const hasEmptyQuestion = editingInterview.questions.some(q => !q.question.trim())
        if (hasEmptyQuestion) {
            alert('All questions must have text.')
            return
        }

        const interview = editingInterview as Interview

        const updatedProject = { ...project }
        const index = updatedProject.interviews.findIndex(i => i.id === interview.id)
        if (index >= 0) {
            updatedProject.interviews[index] = interview
        } else {
            updatedProject.interviews.push(interview)
        }

        onUpdate(updatedProject)
        setIsEditing(false)
        setSelectedInterview(interview)
    }

    const handleDeleteInterview = (id: string) => {
        if (!confirm('Delete this interview?')) return

        const updatedProject = {
            ...project,
            interviews: project.interviews.filter(i => i.id !== id)
        }
        onUpdate(updatedProject)
        setSelectedInterview(null)
    }

    const handleAddQuestion = () => {
        if (!editingInterview.questions) {
            setEditingInterview({ ...editingInterview, questions: [] })
        }

        const newQuestion: InterviewQuestion = {
            id: `q-${Date.now()}`,
            type: 'text',
            question: '',
            required: false
        }

        setEditingInterview({
            ...editingInterview,
            questions: [...(editingInterview.questions || []), newQuestion]
        })
    }

    const handleUpdateQuestion = (index: number, updates: Partial<InterviewQuestion>) => {
        const questions = [...(editingInterview.questions || [])]
        questions[index] = { ...questions[index], ...updates }
        setEditingInterview({ ...editingInterview, questions })
    }

    const handleDeleteQuestion = (index: number) => {
        const questions = [...(editingInterview.questions || [])]
        questions.splice(index, 1)
        setEditingInterview({ ...editingInterview, questions })
    }

    const copyShareLink = (link: string) => {
        navigator.clipboard.writeText(link)
        alert('Link copied to clipboard!')
    }

    if (isEditing) {
        return (
            <div className={styles.editor}>
                <div className={styles.editorHeader}>
                    <h3>Edit Interview</h3>
                    <div className={styles.editorActions}>
                        <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>
                            <X size={18} />
                            Cancel
                        </button>
                        <button className={styles.btnPrimary} onClick={handleSaveInterview}>
                            <Save size={18} />
                            Save Interview
                        </button>
                    </div>
                </div>

                <div className={styles.editorContent}>
                    <div className={styles.formGroup}>
                        <label>Interview Title</label>
                        <input
                            type="text"
                            value={editingInterview.title || ''}
                            onChange={(e) => setEditingInterview({ ...editingInterview, title: e.target.value })}
                            placeholder="e.g., User Needs Interview"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={editingInterview.description || ''}
                            onChange={(e) => setEditingInterview({ ...editingInterview, description: e.target.value })}
                            placeholder="Describe the purpose of this interview..."
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Target Responses</label>
                        <input
                            type="number"
                            value={editingInterview.targetResponses || 10}
                            onChange={(e) => setEditingInterview({ ...editingInterview, targetResponses: parseInt(e.target.value) })}
                            className={styles.input}
                            min={1}
                        />
                    </div>

                    <div className={styles.questionsSection}>
                        <div className={styles.sectionHeader}>
                            <h4>Questions</h4>
                            <button className={styles.btnSecondary} onClick={handleAddQuestion}>
                                <Plus size={18} />
                                Add Question
                            </button>
                        </div>

                        {(editingInterview.questions || []).map((question, index) => (
                            <div key={question.id} className={styles.questionCard}>
                                <div className={styles.questionHeader}>
                                    <span className={styles.questionNumber}>Q{index + 1}</span>
                                    <select
                                        value={question.type}
                                        onChange={(e) => handleUpdateQuestion(index, { type: e.target.value as any })}
                                        className={styles.select}
                                    >
                                        <option value="text">Open Text</option>
                                        <option value="multipleChoice">Multiple Choice</option>
                                        <option value="rating">Rating (1-5)</option>
                                        <option value="yesNo">Yes/No</option>
                                    </select>
                                    <button
                                        className={styles.btnIcon}
                                        onClick={() => handleDeleteQuestion(index)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => handleUpdateQuestion(index, { question: e.target.value })}
                                    placeholder="Enter your question..."
                                    className={styles.input}
                                />

                                {question.type === 'multipleChoice' && (
                                    <div className={styles.optionsSection}>
                                        <label className={styles.smallLabel}>Options (one per line)</label>
                                        <textarea
                                            value={(question.options || []).join('\n')}
                                            onChange={(e) => handleUpdateQuestion(index, {
                                                options: e.target.value.split('\n').filter(o => o.trim())
                                            })}
                                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                                            className={styles.textarea}
                                            rows={4}
                                        />
                                    </div>
                                )}

                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={question.required}
                                        onChange={(e) => handleUpdateQuestion(index, { required: e.target.checked })}
                                    />
                                    <span>Required question</span>
                                </label>
                            </div>
                        ))}

                        {(editingInterview.questions || []).length === 0 && (
                            <div className={styles.emptyState}>
                                <p>No questions yet. Click "Add Question" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (selectedInterview) {
        const responses = selectedInterview.responses || []
        const responseRate = selectedInterview.targetResponses > 0
            ? Math.round((responses.length / selectedInterview.targetResponses) * 100)
            : 0

        return (
            <div className={styles.detailView}>
                <div className={styles.detailHeader}>
                    <button className={styles.btnBack} onClick={() => setSelectedInterview(null)}>
                        ← Back to Interviews
                    </button>
                    <div className={styles.detailActions}>
                        <button className={styles.btnSecondary} onClick={() => {
                            setEditingInterview(selectedInterview)
                            setIsEditing(true)
                        }}>
                            <Edit2 size={18} />
                            Edit
                        </button>
                        <button className={styles.btnDanger} onClick={() => handleDeleteInterview(selectedInterview.id)}>
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>

                <div className={styles.detailContent}>
                    <h2>{selectedInterview.title}</h2>
                    <p className={styles.description}>{selectedInterview.description}</p>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{responses.length}</div>
                            <div className={styles.statLabel}>Responses</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{selectedInterview.targetResponses}</div>
                            <div className={styles.statLabel}>Target</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{responseRate}%</div>
                            <div className={styles.statLabel}>Completion</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{selectedInterview.questions.length}</div>
                            <div className={styles.statLabel}>Questions</div>
                        </div>
                    </div>

                    <div className={styles.shareSection}>
                        <h4>Share Interview</h4>
                        <div className={styles.shareLink}>
                            <input
                                type="text"
                                value={selectedInterview.shareLink}
                                readOnly
                                className={styles.input}
                            />
                            <button className={styles.btnPrimary} onClick={() => copyShareLink(selectedInterview.shareLink)}>
                                <Copy size={18} />
                                Copy Link
                            </button>
                            <a
                                href={selectedInterview.shareLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnSecondary}
                            >
                                <ExternalLink size={18} />
                                Open
                            </a>
                        </div>
                    </div>

                    <div className={styles.responsesSection}>
                        <h4>Responses ({responses.length})</h4>
                        {responses.length > 0 ? (
                            <div className={styles.responsesList}>
                                {responses.map((response, index) => (
                                    <div key={response.id} className={styles.responseCard}>
                                        <div className={styles.responseHeader}>
                                            <span className={styles.responseNumber}>Response #{index + 1}</span>
                                            <span className={styles.responseDate}>
                                                {new Date(response.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {response.respondentName && (
                                            <div className={styles.respondentInfo}>
                                                <strong>{response.respondentName}</strong>
                                                {response.respondentEmail && ` (${response.respondentEmail})`}
                                            </div>
                                        )}
                                        <div className={styles.answers}>
                                            {selectedInterview.questions.map(q => (
                                                <div key={q.id} className={styles.answer}>
                                                    <div className={styles.answerQuestion}>{q.question}</div>
                                                    <div className={styles.answerValue}>
                                                        {response.answers[q.id] || <em>No answer</em>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <BarChart3 size={48} />
                                <p>No responses yet</p>
                                <p className={styles.emptyHint}>Share the interview link to start collecting responses</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.listView}>
            <div className={styles.listHeader}>
                <h3>User Interviews</h3>
                <button className={styles.btnPrimary} onClick={handleCreateInterview}>
                    <Plus size={18} />
                    Create Interview
                </button>
            </div>

            {project.interviews.length > 0 ? (
                <div className={styles.interviewGrid}>
                    {project.interviews.map(interview => {
                        const responses = interview.responses || []
                        return (
                            <div
                                key={interview.id}
                                className={styles.interviewCard}
                                onClick={() => setSelectedInterview(interview)}
                            >
                                <h4>{interview.title}</h4>
                                <p className={styles.cardDescription}>{interview.description}</p>
                                <div className={styles.cardStats}>
                                    <span>{responses.length} / {interview.targetResponses} responses</span>
                                    <span>{interview.questions.length} questions</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FileText size={64} />
                    <h3>No interviews yet</h3>
                    <p>Create your first interview to start gathering user insights</p>
                    <button className={styles.btnPrimary} onClick={handleCreateInterview}>
                        <Plus size={18} />
                        Create Interview
                    </button>
                </div>
            )}
        </div>
    )
}
