'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout, Mail, Lock, ArrowLeft } from 'lucide-react'
import styles from './Auth.module.css'
import FloatingShapes from '@/components/Marketing/FloatingShapes'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            alert('Please fill in all fields!')
            return
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Login failed')
                return
            }

            // Store user info in localStorage (for client state)
            localStorage.setItem('wireframe_user', JSON.stringify(data.user))

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            alert('Something went wrong')
        }
    }

    return (
        <div className={styles.container}>
            <Link href="/landing" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>
            <div className={styles.card}>
                <Link href="/landing" className={styles.logo}>
                    <Layout className={styles.logoIcon} />
                    <span>Fraym</span>
                </Link>

                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Login to continue wireframing</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <Mail className={styles.inputIcon} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock className={styles.inputIcon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account?{' '}
                    <Link href="/register" className={styles.link}>
                        Register
                    </Link>
                </p>
            </div>

            {/* Background */}
            <div className={styles.background}>
                <FloatingShapes />
            </div>
        </div>
    )
}
