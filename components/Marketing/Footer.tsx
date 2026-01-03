'use client'

import React from 'react'
import Link from 'next/link'
import styles from '../../app/landing/LandingPage.module.css'

export default function Footer() {
    // Force re-render to fix hydration mismatch
    return (
        <footer style={{
            padding: '80px 24px 40px',
            background: '#ffffff',
            borderTop: '2px solid #1e1b4b'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px'
            }}>
                <div>
                    <h4 style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: '#1e1b4b',
                        textTransform: 'uppercase'
                    }}>Fraym</h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                        The professional wireframing tool built for speed and simplicity.
                    </p>
                </div>
                <div>
                    <h4 style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: '#1e1b4b',
                        textTransform: 'uppercase'
                    }}>Product</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/features" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Features</Link>
                        <Link href="/guide" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Guide</Link>
                    </div>
                </div>
                <div>
                    <h4 style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: '#1e1b4b',
                        textTransform: 'uppercase'
                    }}>Company</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/about" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>About</Link>
                        <Link href="/register" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Sign Up</Link>
                        <Link href="/login" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Log In</Link>
                    </div>
                </div>
                <div>
                    <h4 style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '16px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: '#1e1b4b',
                        textTransform: 'uppercase'
                    }}>Legal</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/privacy" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Privacy</Link>
                        <Link href="/terms" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>Terms</Link>
                    </div>
                </div>
            </div>
            <div style={{
                maxWidth: '1200px',
                margin: '40px auto 0',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
                fontSize: '14px',
                color: '#9ca3af',
                fontFamily: 'JetBrains Mono, monospace'
            }}>
                © 2024 Fraym. All rights reserved.
            </div>
        </footer>
    )
}
