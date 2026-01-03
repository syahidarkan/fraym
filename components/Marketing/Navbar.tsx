'use client'

import React from 'react'
import Link from 'next/link'
import { Layout } from 'lucide-react'
import styles from '../../app/landing/LandingPage.module.css'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <div className={styles.navLeft}>
                    <Link href="/landing" className={styles.logo}>
                        <Layout className={styles.logoIcon} />
                        <span>Fraym</span>
                    </Link>
                    <div className={styles.navLinks}>
                        <Link href="/features" className={styles.navLink}>Features</Link>
                        <Link href="/guide" className={styles.navLink}>Guide</Link>
                        <Link href="/about" className={styles.navLink}>About</Link>
                    </div>
                </div>
                <div className={styles.navActions}>
                    <Link href="/login" className={styles.navLink}>Log in</Link>
                    <Link href="/register" className={styles.navButton}>Get started for free</Link>
                </div>
            </div>
        </nav>
    )
}
