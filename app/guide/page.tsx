'use client'

import React from 'react'
import Navbar from '../../components/Marketing/Navbar'
import Footer from '../../components/Marketing/Footer'
import styles from '../landing/LandingPage.module.css'
import { MousePointer2, Square, Type, Download, Layers, Move, Zap, Layout, Settings } from 'lucide-react'

export default function GuidePage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.badge}>
                        QUICK START GUIDE
                    </div>
                    <h1 className={styles.heroTitle}>
                        Getting Started with<br />
                        Fraym
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Learn how to create professional wireframes in minutes with our easy-to-follow guide. From your first project to advanced techniques.
                    </p>
                </section>

                {/* Getting Started Steps */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Build Your First Wireframe</h2>
                        <p className={styles.sectionSubtitle}>Follow these simple steps to create your first professional wireframe</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <StepCard
                            number="1"
                            icon={<MousePointer2 size={24} />}
                            title="Create a Project"
                            description="Click 'New Project' from your dashboard. Choose between Wireframe, Design Thinking, or Diagram project types."
                        />
                        <StepCard
                            number="2"
                            icon={<Layout size={24} />}
                            title="Choose Device Frame"
                            description="Select a device preset (Mobile, Tablet, Desktop) or create a custom canvas size for your wireframe."
                        />
                        <StepCard
                            number="3"
                            icon={<Square size={24} />}
                            title="Add Components"
                            description="Drag and drop components from the library onto your canvas. We have 50+ pre-built UI components ready to use."
                        />
                        <StepCard
                            number="4"
                            icon={<Settings size={24} />}
                            title="Customize Properties"
                            description="Use the properties panel to adjust sizes, colors, spacing, borders, and other visual properties of your elements."
                        />
                        <StepCard
                            number="5"
                            icon={<Move size={24} />}
                            title="Arrange & Align"
                            description="Position your elements using smart guides and alignment tools. Use multi-select to group and arrange multiple elements."
                        />
                        <StepCard
                            number="6"
                            icon={<Type size={24} />}
                            title="Add Content"
                            description="Double-click text elements to edit and add your content. Use real or placeholder text to bring your wireframe to life."
                        />
                        <StepCard
                            number="7"
                            icon={<Layers size={24} />}
                            title="Organize Layers"
                            description="Use the layers panel to manage element hierarchy, visibility, and z-index. Lock layers to prevent accidental changes."
                        />
                        <StepCard
                            number="8"
                            icon={<Download size={24} />}
                            title="Export & Share"
                            description="Export your wireframe as a high-resolution PNG image. Share it with your team or stakeholders instantly."
                        />
                    </div>
                </section>

                {/* Tips & Tricks */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Pro Tips & Shortcuts</h2>
                        <p className={styles.sectionSubtitle}>Master these techniques to work faster and more efficiently</p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <TipCard
                            icon={<Zap size={24} />}
                            title="Keyboard Shortcuts"
                            tips={[
                                "Cmd/Ctrl + Z: Undo",
                                "Cmd/Ctrl + D: Duplicate",
                                "Delete/Backspace: Remove",
                                "Cmd/Ctrl + G: Group",
                                "Space + Drag: Pan canvas"
                            ]}
                        />
                        <TipCard
                            icon={<Layout size={24} />}
                            title="Smart Guides"
                            tips={[
                                "Auto-align with nearby elements",
                                "Equal spacing detection",
                                "Center alignment guides",
                                "Snap to grid for precision",
                                "Edge-to-edge alignment"
                            ]}
                        />
                        <TipCard
                            icon={<Layers size={24} />}
                            title="Layer Management"
                            tips={[
                                "Name layers for clarity",
                                "Group related elements",
                                "Lock background elements",
                                "Hide layers while editing",
                                "Use folders for organization"
                            ]}
                        />
                    </div>
                </section>

                {/* Design Thinking Guide */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Using Design Thinking Tools</h2>
                        <p className={styles.sectionSubtitle}>Go beyond wireframes with our integrated design thinking workspace</p>
                    </div>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <GuideSection
                            title="Empathize Phase"
                            description="Start by understanding your users deeply:"
                            items={[
                                "Create User Personas to define target audiences",
                                "Build Empathy Maps to capture user thoughts and feelings",
                                "Conduct User Interviews to gather insights",
                                "Map User Journeys to visualize experiences"
                            ]}
                        />
                        <GuideSection
                            title="Define Phase"
                            description="Frame the problem clearly:"
                            items={[
                                "Write Problem Statements that capture key challenges",
                                "Create 'How Might We' questions to reframe problems",
                                "Synthesize insights from your research"
                            ]}
                        />
                        <GuideSection
                            title="Ideate Phase"
                            description="Generate creative solutions:"
                            items={[
                                "Use the Brainstorming Board for collaborative ideation",
                                "Organize ideas with sticky notes",
                                "Vote and prioritize top ideas",
                                "Build on each other's suggestions"
                            ]}
                        />
                        <GuideSection
                            title="Prototype Phase"
                            description="Build your wireframes:"
                            items={[
                                "Create low-fidelity wireframes quickly",
                                "Test different layout approaches",
                                "Iterate based on feedback",
                                "Add interactive elements"
                            ]}
                        />
                        <GuideSection
                            title="Test Phase"
                            description="Validate your designs:"
                            items={[
                                "Plan Usability Tests with clear objectives",
                                "Record test results and observations",
                                "Analyze findings and identify patterns",
                                "Prioritize improvements for next iteration"
                            ]}
                        />
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <h2 className={styles.sectionTitle} style={{ fontSize: '48px', marginBottom: '24px' }}>
                        Ready to build?
                    </h2>
                    <p className={styles.sectionSubtitle} style={{ marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                        Start creating professional wireframes and running design thinking workshops today.
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

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ position: 'relative' }}>
                {icon}
                <div style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    background: '#18181b',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600
                }}>
                    {number}
                </div>
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{description}</p>
        </div>
    )
}

function TipCard({ icon, title, tips }: { icon: React.ReactNode, title: string, tips: string[] }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#71717a', lineHeight: 1.5 }}>
                        • {tip}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function GuideSection({ title, description, items }: { title: string, description: string, items: string[] }) {
    return (
        <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#18181b', marginBottom: '12px' }}>{title}</h3>
            <p style={{ fontSize: '15px', color: '#71717a', marginBottom: '16px' }}>{description}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item, i) => (
                    <li key={i} style={{ fontSize: '15px', color: '#52525b', paddingLeft: '24px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#18181b', fontWeight: 600 }}>→</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
