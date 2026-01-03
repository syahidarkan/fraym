'use client'

import React from 'react'
import Navbar from '../../components/Marketing/Navbar'
import Footer from '../../components/Marketing/Footer'
import styles from '../landing/LandingPage.module.css'
import { Target, Zap, Users, Heart, Rocket, Shield, Globe, Award } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.badge}>
                        ABOUT US
                    </div>
                    <h1 className={styles.heroTitle}>
                        Building Better<br />
                        Design Tools
                    </h1>
                    <p className={styles.heroSubtitle}>
                        We're on a mission to make professional wireframing and design thinking accessible to everyone, from solo designers to enterprise teams.
                    </p>
                </section>

                {/* Story */}
                <section className={styles.section}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: '24px', textAlign: 'center' }}>
                            Our Story
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <p className={styles.sectionSubtitle} style={{ textAlign: 'left', margin: 0 }}>
                                Fraym was born from a simple frustration: existing wireframing tools were either too complex for beginners or too limited for professionals. We spent countless hours switching between multiple tools just to complete a single design thinking workshop.
                            </p>
                            <p className={styles.sectionSubtitle} style={{ textAlign: 'left', margin: 0 }}>
                                We wanted to create a tool that combines the simplicity of pen and paper with the power of modern design software. A tool that helps you focus on solving problems, not fighting with the interface. A tool that seamlessly integrates wireframing with design thinking methodologies.
                            </p>
                            <p className={styles.sectionSubtitle} style={{ textAlign: 'left', margin: 0 }}>
                                After months of development and user testing, we're excited to launch Fraym. We're building a platform that designers, product managers, UX researchers, and developers can use to bring their ideas to life faster than ever before.
                            </p>
                            <p className={styles.sectionSubtitle} style={{ textAlign: 'left', margin: 0 }}>
                                We're just getting started. Our roadmap includes real-time collaboration, version history, advanced component libraries, and so much more. Join us on this journey to redefine how teams design products.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Mission & Values</h2>
                        <p className={styles.sectionSubtitle}>
                            What drives us every day to build better tools for designers
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <ValueCard
                            icon={<Target size={24} />}
                            title="User-Focused"
                            description="Every feature is designed with the user experience in mind. We obsess over details that make your workflow smoother."
                        />
                        <ValueCard
                            icon={<Zap size={24} />}
                            title="Speed & Efficiency"
                            description="Build wireframes 10x faster than traditional tools. We optimize for speed without sacrificing quality."
                        />
                        <ValueCard
                            icon={<Users size={24} />}
                            title="Collaboration First"
                            description="Great products are built by teams. We're building features that make teamwork seamless and productive."
                        />
                        <ValueCard
                            icon={<Heart size={24} />}
                            title="Made with Care"
                            description="Crafted by designers for designers. Every pixel, every interaction is thoughtfully considered."
                        />
                        <ValueCard
                            icon={<Rocket size={24} />}
                            title="Innovation"
                            description="We continuously push boundaries, exploring new ways to improve the design process."
                        />
                        <ValueCard
                            icon={<Shield size={24} />}
                            title="Privacy & Security"
                            description="Your designs are yours. We use local storage and never access your private data."
                        />
                    </div>
                </section>

                {/* Stats */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Fraym by the Numbers</h2>
                        <p className={styles.sectionSubtitle}>Built with precision and care</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
                        <StatCard number="3" label="Powerful Tools" description="All in one platform" />
                        <StatCard number="50+" label="UI Components" description="Ready to use" />
                        <StatCard number="Beta" label="Launch Phase" description="Join us early" />
                        <StatCard number="100%" label="Free to Start" description="No credit card needed" />
                    </div>
                </section>

                {/* Team Values */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>How We Work</h2>
                        <p className={styles.sectionSubtitle}>The principles that guide our team every day</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <PrincipleCard
                            icon={<Globe size={24} />}
                            title="Remote-First"
                            description="Our team is distributed across the globe, bringing diverse perspectives to everything we build."
                        />
                        <PrincipleCard
                            icon={<Award size={24} />}
                            title="Quality Over Quantity"
                            description="We ship features when they're ready, not when the calendar says so. Every release is polished."
                        />
                        <PrincipleCard
                            icon={<Users size={24} />}
                            title="User Feedback Driven"
                            description="Our roadmap is shaped by you. We listen, iterate, and improve based on real user needs."
                        />
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <h2 className={styles.sectionTitle} style={{ fontSize: '48px', marginBottom: '24px' }}>
                        Be an Early Adopter
                    </h2>
                    <p className={styles.sectionSubtitle} style={{ marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                        Start building better products today with Fraym.
                    </p>
                    <a href="/register" className={styles.primaryButton} style={{ fontSize: '18px', padding: '16px 40px' }}>
                        Get Started for Free
                    </a>
                </section>
            </main>
            <Footer />
        </div>
    )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{description}</p>
        </div>
    )
}

function PrincipleCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{description}</p>
        </div>
    )
}

function StatCard({ number, label, description }: { number: string, label: string, description: string }) {
    return (
        <div style={{ textAlign: 'center', padding: '32px 24px', background: 'white', border: '1px solid #e4e4e7', borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#18181b', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {number}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#18181b', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '14px', color: '#71717a' }}>
                {description}
            </div>
        </div>
    )
}
