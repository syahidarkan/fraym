import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', color: '#18181b' }}>
            <Link href="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4b5563', textDecoration: 'none', marginBottom: '32px', fontWeight: 500 }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>Privacy Policy</h1>
            <p style={{ color: '#71717a', marginBottom: '32px' }}>Last updated: {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>1. Information We Collect</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    We collect information you provide directly to us, such as when you create an account, create a project, or communicate with us. This may include your name, email address, and project data.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>2. How We Use Information</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>3. Data Storage</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    Your project data is primarily stored locally on your device (LocalStorage) for performance and privacy. Account information is stored securely on our servers.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>4. Contact Us</h2>
                <p style={{ lineHeight: 1.6, color: '#4b5563' }}>
                    If you have any questions about this Privacy Policy, please contact us at support@wireframebuilder.com.
                </p>
            </section>
        </div>
    )
}
