import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', color: '#18181b' }}>
            <Link href="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4b5563', textDecoration: 'none', marginBottom: '32px', fontWeight: 500 }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>Terms of Service</h1>
            <p style={{ color: '#71717a', marginBottom: '32px' }}>Last updated: {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>1. Acceptance of Terms</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    By accessing and using Fraym ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>2. Use of Service</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    You are responsible for maintaining the security of your account and password. The Service is provided "as is" and "as available" without any warranties.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>3. User Content</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    You retain all rights to the wireframes and designs you create using the Service. We claim no intellectual property rights over the material you provide to the Service.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>4. Termination</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </section>
        </div>
    )
}
