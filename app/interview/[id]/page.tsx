'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Interview, InterviewResponse } from '@/types/designThinking'
// import { saveInterviewResponse } from '@/lib/designThinkingStorage'
import styles from './InterviewPage.module.css'

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [interview, setInterview] = useState<Interview | null>(null)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [respondentName, setRespondentName] = useState('')
    const [respondentEmail, setRespondentEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const res = await fetch(`/api/public/interview/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setInterview(data.interview)
                } else {
                    console.error('Failed to load interview')
                    setInterview(null)
                }
            } catch (error) {
                console.error('Error loading interview:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInterview()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!interview) return

        // Validate required questions
        const missingRequired = interview.questions
            .filter(q => q.required)
            .some(q => !answers[q.id] || answers[q.id].toString().trim() === '')

        if (missingRequired) {
            alert('Please answer all required questions')
            return
        }

        const response: InterviewResponse = {
            id: `response-${Date.now()}`,
            interviewId: interview.id,
            respondentName: respondentName.trim() || undefined,
            respondentEmail: respondentEmail.trim() || undefined,
            answers,
            submittedAt: Date.now()
        }

        try {
            const res = await fetch(`/api/public/interview/${interview.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response })
            })

            if (res.ok) {
                setSubmitted(true)
            } else {
                alert('Failed to submit response. Please try again.')
            }
        } catch (error) {
            console.error('Error submitting response:', error)
            alert('Error submitting response. Please checks your connection.')
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading interview...</div>
            </div>
        )
    }

    if (!interview) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Interview Not Found</h2>
                    <p>This interview link may be invalid or expired.</p>
                </div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className={styles.container}>
                <div className={styles.success}>
                    <CheckCircle size={64} className={styles.successIcon} />
                    <h2>Thank You!</h2>
                    <p>Your response has been submitted successfully.</p>
                    <p className={styles.successSubtext}>We appreciate you taking the time to share your thoughts.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>{interview.title}</h1>
                    {interview.description && (
                        <p className={styles.description}>{interview.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Respondent Info */}
                    <div className={styles.section}>
                        <h3>Your Information (Optional)</h3>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                value={respondentName}
                                onChange={(e) => setRespondentName(e.target.value)}
                                placeholder="Your name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={respondentEmail}
                                onChange={(e) => setRespondentEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    <div className={styles.section}>
                        <h3>Questions</h3>
                        {interview.questions.map((question, index) => (
                            <div key={question.id} className={styles.questionBlock}>
                                <label className={styles.questionLabel}>
                                    {index + 1}. {question.question}
                                    {question.required && <span className={styles.required}>*</span>}
                                </label>

                                {question.type === 'text' && (
                                    <textarea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                        className={styles.textarea}
                                        rows={4}
                                        required={question.required}
                                    />
                                )}

                                {question.type === 'multipleChoice' && (
                                    <div className={styles.options}>
                                        {question.options?.map((option, i) => (
                                            <label key={i} className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option}
                                                    checked={answers[question.id] === option}
                                                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                                    required={question.required}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {question.type === 'rating' && (
                                    <div className={styles.rating}>
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <label key={rating} className={styles.ratingLabel}>
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={rating}
                                                    checked={answers[question.id] === rating}
                                                    onChange={(e) => setAnswers({ ...answers, [question.id]: parseInt(e.target.value) })}
                                                    required={question.required}
                                                />
                                                <span className={styles.ratingNumber}>{rating}</span>
                                            </label>
                                        ))}
                                        <div className={styles.ratingLabels}>
                                            <span>Poor</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>
                                )}

                                {question.type === 'yesNo' && (
                                    <div className={styles.options}>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value="yes"
                                                checked={answers[question.id] === 'yes'}
                                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                                required={question.required}
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value="no"
                                                checked={answers[question.id] === 'no'}
                                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                                required={question.required}
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Submit Response
                    </button>
                </form>
            </div>
        </div>
    )
}
