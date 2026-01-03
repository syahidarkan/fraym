'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#fafafa',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                maxWidth: '500px',
                textAlign: 'center',
                background: 'white',
                padding: '3rem',
                borderRadius: '12px',
                border: '1px solid #e4e4e7',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '1rem'
                }}>⚠️</div>

                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#18181b',
                    marginBottom: '0.5rem'
                }}>
                    Something went wrong!
                </h2>

                <p style={{
                    color: '#71717a',
                    marginBottom: '2rem',
                    fontSize: '14px'
                }}>
                    We're sorry, but something unexpected happened. Please try again.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={reset}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#18181b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#27272a'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#18181b'}
                    >
                        Try again
                    </button>

                    <Link
                        href="/dashboard"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#18181b',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.15s'
                        }}
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <details style={{
                        marginTop: '2rem',
                        textAlign: 'left',
                        fontSize: '12px',
                        color: '#71717a'
                    }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                            Error details
                        </summary>
                        <pre style={{
                            background: '#fafafa',
                            padding: '1rem',
                            borderRadius: '6px',
                            overflow: 'auto',
                            fontSize: '11px'
                        }}>
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
}
