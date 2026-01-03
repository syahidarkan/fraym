'use client'

import { useState } from 'react'
import { Plus, Play, Pause, CheckCircle, Copy, Edit2, Trash2, ClipboardList, Users } from 'lucide-react'
import { DesignThinkingProject, UsabilityTest, TestTask } from '@/types/designThinking'
import styles from './UsabilityTestBuilder.module.css'

interface UsabilityTestBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function UsabilityTestBuilder({ project, onUpdate }: UsabilityTestBuilderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editingTest, setEditingTest] = useState<Partial<UsabilityTest>>({})

    const handleCreateTest = () => {
        const newTest: Partial<UsabilityTest> = {
            id: `test-${Date.now()}`,
            name: '',
            description: '',
            tasks: [],
            targetParticipants: 5,
            status: 'draft',
            shareLink: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        setEditingTest(newTest)
        setIsEditing(true)
    }

    const handleEditTest = (test: UsabilityTest) => {
        setEditingTest(test)
        setIsEditing(true)
    }

    const handleSaveTest = () => {
        if (!editingTest.name || !editingTest.description) {
            alert('Please fill in name and description')
            return
        }

        if (!editingTest.tasks || editingTest.tasks.length === 0) {
            alert('Please add at least one task')
            return
        }

        const shareLink = `${window.location.origin}/usability-test/${editingTest.id}`
        const test: UsabilityTest = {
            ...editingTest as UsabilityTest,
            shareLink,
            updatedAt: Date.now()
        }

        const updatedProject = { ...project }
        if (!updatedProject.usabilityTests) updatedProject.usabilityTests = []

        const index = updatedProject.usabilityTests.findIndex(t => t.id === test.id)
        if (index >= 0) {
            updatedProject.usabilityTests[index] = test
        } else {
            updatedProject.usabilityTests.push(test)
        }

        onUpdate(updatedProject)
        setIsEditing(false)
        setEditingTest({})
    }

    const handleDeleteTest = (id: string) => {
        if (!confirm('Delete this test?')) return

        const updatedProject = {
            ...project,
            usabilityTests: project.usabilityTests.filter(t => t.id !== id)
        }
        onUpdate(updatedProject)
    }

    const handleChangeStatus = (id: string, status: UsabilityTest['status']) => {
        const updatedProject = { ...project }
        const test = updatedProject.usabilityTests.find(t => t.id === id)
        if (test) {
            test.status = status
            test.updatedAt = Date.now()
            onUpdate(updatedProject)
        }
    }

    const handleAddTask = () => {
        const newTask: TestTask = {
            id: `task-${Date.now()}`,
            title: '',
            description: '',
            successCriteria: '',
            order: (editingTest.tasks?.length || 0) + 1,
            responseType: 'scale'
        }
        setEditingTest({
            ...editingTest,
            tasks: [...(editingTest.tasks || []), newTask]
        })
    }

    const handleUpdateTask = (index: number, updates: Partial<TestTask>) => {
        const tasks = [...(editingTest.tasks || [])]
        tasks[index] = { ...tasks[index], ...updates }
        setEditingTest({ ...editingTest, tasks })
    }

    const handleDeleteTask = (index: number) => {
        const tasks = [...(editingTest.tasks || [])]
        tasks.splice(index, 1)
        // Reorder
        tasks.forEach((task, i) => {
            task.order = i + 1
        })
        setEditingTest({ ...editingTest, tasks })
    }

    const copyShareLink = (link: string) => {
        navigator.clipboard.writeText(link)
        alert('Link copied to clipboard!')
    }

    if (isEditing) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.editor}>
                        <div className={styles.editorHeader}>
                            <h3>{editingTest.id && project.usabilityTests?.find(t => t.id === editingTest.id) ? 'Edit Test' : 'New Usability Test'}</h3>
                            <p>Create tasks for users to complete and gather feedback</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Test Name</label>
                            <input
                                type="text"
                                value={editingTest.name || ''}
                                onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                                placeholder="e.g., Checkout Flow Test"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                value={editingTest.description || ''}
                                onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                                placeholder="Describe what you're testing and why..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Figma Prototype Link (Optional)</label>
                            <input
                                type="text"
                                value={editingTest.prototypeLink || ''}
                                onChange={(e) => setEditingTest({ ...editingTest, prototypeLink: e.target.value })}
                                placeholder="Paste your Figma prototype link here..."
                            />
                            <p style={{ fontSize: '12px', color: '#868e96', marginTop: '4px' }}>
                                Copy the link from Figma's "Share Prototype" button.
                            </p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Target Participants</label>
                            <input
                                type="number"
                                min="1"
                                value={editingTest.targetParticipants || 5}
                                onChange={(e) => setEditingTest({ ...editingTest, targetParticipants: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className={styles.tasksSection}>
                            <div className={styles.tasksHeader}>
                                <h4>Tasks ({editingTest.tasks?.length || 0})</h4>
                                <button className={styles.btnSecondary} onClick={handleAddTask}>
                                    <Plus size={16} />
                                    Add Task
                                </button>
                            </div>

                            {editingTest.tasks?.map((task, index) => (
                                <div key={task.id} className={styles.taskCard}>
                                    <div className={styles.taskHeader}>
                                        <div className={styles.taskNumber}>{index + 1}</div>
                                        <button className={styles.deleteTaskBtn} onClick={() => handleDeleteTask(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.taskInput}>
                                        <input
                                            type="text"
                                            value={task.title}
                                            onChange={(e) => handleUpdateTask(index, { title: e.target.value })}
                                            placeholder="Task title (e.g., Add item to cart)"
                                        />
                                    </div>

                                    <div className={styles.taskInput}>
                                        <textarea
                                            value={task.description}
                                            onChange={(e) => handleUpdateTask(index, { description: e.target.value })}
                                            placeholder="Detailed instructions for the user..."
                                        />
                                    </div>

                                    <div className={styles.taskInput}>
                                        <input
                                            type="text"
                                            value={task.successCriteria}
                                            onChange={(e) => handleUpdateTask(index, { successCriteria: e.target.value })}
                                            placeholder="Success criteria (e.g., User reaches checkout page)"
                                        />
                                    </div>

                                    <div className={styles.taskInput}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>Response Type</label>
                                        <select
                                            value={task.responseType || 'scale'}
                                            onChange={(e) => handleUpdateTask(index, { responseType: e.target.value as any })}
                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
                                        >
                                            <option value="scale">Difficulty Scale (1-5)</option>
                                            <option value="text">Text Answer</option>
                                            <option value="yes_no">Yes / No</option>
                                            <option value="multiple_choice">Multiple Choice</option>
                                        </select>
                                    </div>

                                    {task.responseType !== 'scale' && (
                                        <div className={styles.taskInput}>
                                            <input
                                                type="text"
                                                value={task.questionText || ''}
                                                onChange={(e) => handleUpdateTask(index, { questionText: e.target.value })}
                                                placeholder="Question text (e.g., Why did you choose that option?)"
                                            />
                                        </div>
                                    )}

                                    {task.responseType === 'multiple_choice' && (
                                        <div className={styles.taskInput}>
                                            <textarea
                                                value={task.options?.join('\n') || ''}
                                                onChange={(e) => handleUpdateTask(index, { options: e.target.value.split('\n') })}
                                                placeholder="Enter options (one per line)"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {(!editingTest.tasks || editingTest.tasks.length === 0) && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#868e96' }}>
                                    <ClipboardList size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                    <p>No tasks yet. Add tasks for users to complete.</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.editorActions}>
                            <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button className={styles.btnPrimary} onClick={handleSaveTest}>
                                Save Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const tests = project.usabilityTests || []

    if (tests.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.emptyState}>
                        <ClipboardList size={48} />
                        <h3>No Usability Tests Yet</h3>
                        <p>Create tests to validate your designs with real users. Define tasks and gather feedback to improve your product.</p>
                        <button className={styles.btnPrimary} onClick={handleCreateTest}>
                            <Plus size={18} />
                            Create Test
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Usability Tests</h3>
                <button className={styles.btnPrimary} onClick={handleCreateTest}>
                    <Plus size={18} />
                    New Test
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.grid}>
                    {tests.map(test => {
                        const results = project.testResults?.filter(r => r.testId === test.id) || []
                        const completionRate = results.length / test.targetParticipants * 100

                        return (
                            <div key={test.id} className={styles.testCard}>
                                <div className={styles.testHeader}>
                                    <div>
                                        <h4 className={styles.testTitle}>{test.name}</h4>
                                        <span className={`${styles.statusBadge} ${styles[test.status]}`}>
                                            {test.status}
                                        </span>
                                    </div>
                                </div>

                                <p className={styles.testDescription}>{test.description}</p>

                                <div className={styles.testMeta}>
                                    <span>
                                        <ClipboardList size={14} />
                                        {test.tasks.length} tasks
                                    </span>
                                    <span>
                                        <Users size={14} />
                                        {results.length}/{test.targetParticipants} completed
                                    </span>
                                </div>

                                {test.status === 'active' && (
                                    <div className={styles.shareLink}>
                                        <input type="text" value={test.shareLink} readOnly />
                                        <button className={styles.copyBtn} onClick={() => copyShareLink(test.shareLink)}>
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                )}

                                <div className={styles.testActions}>
                                    {test.status === 'draft' && (
                                        <button
                                            className={`${styles.btnSecondary} ${styles.btnSuccess}`}
                                            onClick={() => handleChangeStatus(test.id, 'active')}
                                        >
                                            <Play size={16} />
                                            Launch
                                        </button>
                                    )}
                                    {test.status === 'active' && (
                                        <>
                                            <button
                                                className={styles.btnSecondary}
                                                onClick={() => handleChangeStatus(test.id, 'completed')}
                                            >
                                                <CheckCircle size={16} />
                                                Complete
                                            </button>
                                            <button
                                                className={styles.btnSecondary}
                                                onClick={() => handleChangeStatus(test.id, 'draft')}
                                            >
                                                <Pause size={16} />
                                                Pause
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className={styles.btnSecondary}
                                        onClick={() => handleEditTest(test)}
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.btnSecondary} ${styles.btnDanger}`}
                                        onClick={() => handleDeleteTest(test.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
