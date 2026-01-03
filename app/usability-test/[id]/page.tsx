'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { UsabilityTest, TestResult, TaskResult } from '@/types/designThinking'
import { apiStorage } from '@/lib/apiStorage'
import { Project } from '@/lib/storage'
import styles from './page.module.css'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function UsabilityTestPage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [test, setTest] = useState<UsabilityTest | null>(null)
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
    const [taskResults, setTaskResults] = useState<TaskResult[]>([])
    const [participantName, setParticipantName] = useState('')
    const [participantEmail, setParticipantEmail] = useState('')
    const [overallFeedback, setOverallFeedback] = useState('')
    const [npsScore, setNpsScore] = useState<number>(7)
    const [isStarted, setIsStarted] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [taskStartTime, setTaskStartTime] = useState<number>(0)

    // Current task being worked on
    const [taskFeedback, setTaskFeedback] = useState('')
    const [taskResponse, setTaskResponse] = useState<string | number>('')

    useEffect(() => {
        const loadTest = async () => {
            try {
                // Find the test from all projects
                // Note: ideally we would have an endpoint to get test by ID directly
                const projects = await apiStorage.getProjects()

                let foundTest: UsabilityTest | null = null
                let foundProject: Project | null = null

                for (const p of projects) {
                    if (p.designThinking?.usabilityTests && p.designThinking.usabilityTests.length > 0) {
                        const testInProject = p.designThinking.usabilityTests.find(t => t.id === id)
                        if (testInProject) {
                            foundTest = testInProject
                            foundProject = p
                            break
                        }
                    }
                }

                if (foundTest && foundProject) {
                    setTest(foundTest)
                    setProject(foundProject)
                    // Initialize task results
                    const initialResults: TaskResult[] = foundTest.tasks.map(task => ({
                        taskId: task.id,
                        completed: false,
                        timeSpent: 0,
                        difficulty: 3,
                        feedback: ''
                    }))
                    setTaskResults(initialResults)
                }
            } catch (error) {
                console.error('Error loading test:', error)
            }
        }

        loadTest()
    }, [id])

    // Reset response when task changes
    useEffect(() => {
        if (test) {
            const currentTask = test.tasks[currentTaskIndex]
            if (currentTask.responseType === 'scale') {
                setTaskResponse(3)
            } else {
                setTaskResponse('')
            }
        }
    }, [currentTaskIndex, test])

    const handleStart = () => {
        if (!participantName.trim() || !participantEmail.trim()) {
            alert('Please enter your name and email')
            return
        }
        setIsStarted(true)
        setTaskStartTime(Date.now())
    }

    const handleCompleteTask = (completed: boolean) => {
        if (!test) return

        const timeSpent = Math.floor((Date.now() - taskStartTime) / 1000)

        const updatedResults = [...taskResults]
        updatedResults[currentTaskIndex] = {
            taskId: test.tasks[currentTaskIndex].id,
            completed,
            timeSpent,
            response: taskResponse,
            feedback: taskFeedback
        }
        setTaskResults(updatedResults)

        // Move to next task or finish
        if (currentTaskIndex < test.tasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1)
            setTaskFeedback('')
            setTaskStartTime(Date.now())
        } else {
            setIsCompleted(true)
        }
    }

    const handleSubmit = async () => {
        if (!test || !project) return

        const result: TestResult = {
            id: `result-${Date.now()}`,
            testId: test.id,
            participantName,
            participantEmail,
            completedAt: Date.now(),
            taskResults,
            overallFeedback,
            npsScore
        }

        // Save to Database via Project Update
        try {
            const updatedProject = { ...project }
            if (!updatedProject.designThinking!.testResults) {
                updatedProject.designThinking!.testResults = []
            }
            updatedProject.designThinking!.testResults!.push(result)
            updatedProject.updatedAt = new Date().toISOString()

            await apiStorage.updateProject(project.id, updatedProject)

            alert('Thank you for your feedback!')
            router.push('/')
        } catch (error) {
            console.error('Failed to submit results:', error)
            alert('Failed to submit results. Please try again.')
        }
    }

    if (!test) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Test Not Found</h1>
                    <p>This test is not available. Please check the link and try again.</p>
                </div>
            </div>
        )
    }

    if (test.status !== 'active') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Test Not Available</h1>
                    <p>This test is currently <strong>{test.status}</strong> and not accepting responses.</p>
                </div>
            </div>
        )
    }

    if (!isStarted) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>{test.name}</h1>
                    <p className={styles.description}>{test.description}</p>

                    <div className={styles.info}>
                        <p><strong>Number of tasks:</strong> {test.tasks.length}</p>
                        <p><strong>Estimated time:</strong> ~{test.tasks.length * 2} minutes</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Your Email</label>
                        <input
                            type="email"
                            value={participantEmail}
                            onChange={(e) => setParticipantEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <button className={styles.btnPrimary} onClick={handleStart}>
                        Start Test
                    </button>
                </div>
            </div>
        )
    }

    if (isCompleted) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.completedIcon}>
                        <CheckCircle size={64} color="#51cf66" />
                    </div>
                    <h1>Almost Done!</h1>
                    <p className={styles.description}>Please provide your overall feedback</p>

                    <div className={styles.formGroup}>
                        <label>Overall Feedback</label>
                        <textarea
                            value={overallFeedback}
                            onChange={(e) => setOverallFeedback(e.target.value)}
                            placeholder="Share your thoughts about the overall experience..."
                            rows={4}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>How likely are you to recommend this product? (0-10)</label>
                        <div className={styles.npsScale}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                <button
                                    key={score}
                                    className={`${styles.npsButton} ${npsScore === score ? styles.active : ''}`}
                                    onClick={() => setNpsScore(score)}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                        <div className={styles.npsLabels}>
                            <span>Not likely</span>
                            <span>Very likely</span>
                        </div>
                    </div>

                    <button className={styles.btnPrimary} onClick={handleSubmit}>
                        Submit Feedback
                    </button>
                </div>
            </div>
        )
    }

    const currentTask = test.tasks[currentTaskIndex]
    const hasPrototype = !!test.prototypeLink

    const renderResponseInput = () => {
        const type = currentTask.responseType || 'scale'

        switch (type) {
            case 'scale':
                return (
                    <div className={styles.formGroup}>
                        <label>{currentTask.questionText || 'How difficult was this task? (1 = Very Easy, 5 = Very Hard)'}</label>
                        <div className={styles.difficultyScale}>
                            {[1, 2, 3, 4, 5].map(level => (
                                <button
                                    key={level}
                                    className={`${styles.difficultyButton} ${taskResponse === level ? styles.active : ''}`}
                                    onClick={() => setTaskResponse(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            case 'text':
                return (
                    <div className={styles.formGroup}>
                        <label>{currentTask.questionText || 'Your answer:'}</label>
                        <textarea
                            value={taskResponse as string}
                            onChange={(e) => setTaskResponse(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={3}
                        />
                    </div>
                )
            case 'yes_no':
                return (
                    <div className={styles.formGroup}>
                        <label>{currentTask.questionText || 'Did you succeed?'}</label>
                        <div className={styles.difficultyScale}>
                            {['Yes', 'No'].map(option => (
                                <button
                                    key={option}
                                    className={`${styles.difficultyButton} ${taskResponse === option ? styles.active : ''}`}
                                    onClick={() => setTaskResponse(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            case 'multiple_choice':
                return (
                    <div className={styles.formGroup}>
                        <label>{currentTask.questionText || 'Select an option:'}</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {currentTask.options?.map((option, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.difficultyButton} ${taskResponse === option ? styles.active : ''}`}
                                    style={{ textAlign: 'left' }}
                                    onClick={() => setTaskResponse(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const TaskContent = () => (
        <>
            <div className={styles.progress}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentTaskIndex + 1) / test.tasks.length) * 100}%` }}
                    />
                </div>
                <p className={styles.progressText}>
                    Task {currentTaskIndex + 1} of {test.tasks.length}
                </p>
            </div>

            <h2 className={styles.taskTitle}>{currentTask.title}</h2>
            <p className={styles.taskDescription}>{currentTask.description}</p>

            {currentTask.successCriteria && (
                <div className={styles.successCriteria}>
                    <strong>Success criteria:</strong> {currentTask.successCriteria}
                </div>
            )}

            {renderResponseInput()}

            <div className={styles.formGroup}>
                <label>Any additional feedback? (optional)</label>
                <textarea
                    value={taskFeedback}
                    onChange={(e) => setTaskFeedback(e.target.value)}
                    placeholder="Share any issues or thoughts..."
                    rows={3}
                />
            </div>

            <div className={styles.taskActions}>
                <button
                    className={styles.btnSecondary}
                    onClick={() => handleCompleteTask(false)}
                >
                    I couldn't complete this
                </button>
                <button
                    className={styles.btnPrimary}
                    onClick={() => handleCompleteTask(true)}
                    disabled={!taskResponse && currentTask.responseType !== 'text'}
                >
                    Task Completed
                </button>
            </div>
        </>
    )

    if (hasPrototype) {
        return (
            <div className={`${styles.container} ${styles.hasPrototype}`}>
                <div className={styles.splitLayout}>
                    <div className={styles.taskPanel}>
                        <TaskContent />
                    </div>
                    <div className={styles.prototypePanel}>
                        <iframe
                            className={styles.prototypeFrame}
                            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(test.prototypeLink!)}`}
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <TaskContent />
            </div>
        </div>
    )
}
