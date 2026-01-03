'use client'

import React from 'react'
import Navbar from '../../components/Marketing/Navbar'
import Footer from '../../components/Marketing/Footer'
import styles from '../../components/Marketing/Marketing.module.css'
import { BookOpen, FileText, Video, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ResourcesPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Resources</h1>
                    <p className={styles.subtitle}>Guides, tutorials, and articles to help you build better products.</p>
                </section>

                {/* Featured Guide */}
                <section className={styles.section}>
                    <div style={{ background: '#1e1b4b', color: '#fff', borderRadius: '24px', padding: '64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontFamily: 'monospace', color: '#818cf8', marginBottom: '16px', fontWeight: 700 }}>FEATURED GUIDE</div>
                            <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>The Ultimate Guide to Low-Fidelity Wireframing</h2>
                            <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
                                Learn why starting with low-fidelity saves time, reduces bias, and leads to better user experiences. A comprehensive 10-minute read.
                            </p>
                            <button style={{ padding: '16px 32px', background: '#fff', color: '#1e1b4b', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                READ GUIDE <ArrowRight size={20} />
                            </button>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', height: '300px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={64} />
                        </div>
                    </div>
                </section>

                {/* Latest Articles */}
                <section className={styles.section}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 800, color: '#1e1b4b' }}>LATEST ARTICLES</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                        <ArticleCard
                            category="DESIGN"
                            title="Why Grayscale is Your Best Friend"
                            excerpt="Removing color from your early designs forces you to focus on layout, hierarchy, and functionality."
                            date="Nov 24, 2025"
                        />
                        <ArticleCard
                            category="DEVELOPMENT"
                            title="From Wireframe to React Code"
                            excerpt="A step-by-step tutorial on how to translate your low-fi wireframes into component structures."
                            date="Nov 20, 2025"
                        />
                        <ArticleCard
                            category="PRODUCT"
                            title="Validating Ideas with Zero Budget"
                            excerpt="How to use wireframes to test your assumptions with users before writing a single line of code."
                            date="Nov 15, 2025"
                        />
                    </div>
                </section>

                {/* Documentation */}
                <section className={styles.section} style={{ background: '#f9fafb' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                        <div>
                            <h2 style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: '#1e1b4b' }}>DOCUMENTATION</h2>
                            <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#4b5563', marginBottom: '32px' }}>
                                Need technical help? Our documentation covers everything from keyboard shortcuts to export settings.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <DocLink title="Getting Started" />
                                <DocLink title="Keyboard Shortcuts" />
                                <DocLink title="Component API" />
                                <DocLink title="Export Options" />
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: '#1e1b4b' }}>VIDEO TUTORIALS</h2>
                            <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#4b5563', marginBottom: '32px' }}>
                                Watch and learn. Short, focused videos to help you master the tool.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <VideoLink title="Wireframing 101 (5:00)" />
                                <VideoLink title="Mastering the Grid (3:20)" />
                                <VideoLink title="Responsive Design Tips (4:15)" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

function ArticleCard({ category, title, excerpt, date }: { category: string, title: string, excerpt: string, date: string }) {
    return (
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#4f46e5', marginBottom: '16px', fontWeight: 700 }}>{category}</div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#1e1b4b', lineHeight: 1.3 }}>{title}</h3>
            <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>{excerpt}</p>
            <div style={{ fontSize: '14px', color: '#9ca3af', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>{date}</div>
        </div>
    )
}

function DocLink({ title }: { title: string }) {
    return (
        <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', color: '#1e1b4b', fontWeight: 600, transition: 'all 0.2s' }}>
            <FileText size={20} color="#4f46e5" />
            {title}
        </Link>
    )
}

function VideoLink({ title }: { title: string }) {
    return (
        <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', color: '#1e1b4b', fontWeight: 600, transition: 'all 0.2s' }}>
            <Video size={20} color="#ef4444" />
            {title}
        </Link>
    )
}
