import Link from 'next/link'

export default function NotFound() {
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
                    fontSize: '72px',
                    fontWeight: 700,
                    color: '#18181b',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>
                    404
                </div>

                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#18181b',
                    marginBottom: '0.5rem'
                }}>
                    Page Not Found
                </h2>

                <p style={{
                    color: '#71717a',
                    marginBottom: '2rem',
                    fontSize: '14px',
                    lineHeight: 1.6
                }}>
                    Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center'
                }}>
                    <Link
                        href="/dashboard"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#18181b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.15s'
                        }}
                    >
                        Go to Dashboard
                    </Link>

                    <Link
                        href="/landing"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            color: '#18181b',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'all 0.15s'
                        }}
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
