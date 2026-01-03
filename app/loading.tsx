'use client'

export default function Loading() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
            }} />

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #e4e4e7',
                        borderTop: '3px solid #18181b',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto 1rem'
                    }} />

                    <p style={{
                        color: '#71717a',
                        fontSize: '14px'
                    }}>
                        Loading...
                    </p>
                </div>
            </div>
        </>
    )
}
