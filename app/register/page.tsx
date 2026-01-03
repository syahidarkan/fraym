'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import styles from './Auth.module.css'
import FloatingShapes from '@/components/Marketing/FloatingShapes'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!')
            return
        }

        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill in all fields!')
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Registration failed')
                return
            }

            // Store user info in localStorage
            localStorage.setItem('wireframe_user', JSON.stringify(data.user))

            // Redirect to dashboard
            router.push('/dashboard')
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

                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Start building beautiful wireframes</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <User className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.input}
                        />
                    </div>

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

                    <div className={styles.inputGroup}>
                        <Lock className={styles.inputIcon} />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Create Account
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Login
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
