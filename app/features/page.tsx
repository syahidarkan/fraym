'use client'

import React from 'react'
import Navbar from '../../components/Marketing/Navbar'
import Footer from '../../components/Marketing/Footer'
import styles from '../landing/LandingPage.module.css'
import { Layout, Lightbulb, Grid, Smartphone, Download, Sliders, Check, GitBranch } from 'lucide-react'

export default function FeaturesPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.badge}>
                        POWERFUL FEATURES
                    </div>
                    <h1 className={styles.heroTitle}>
                        Everything You Need<br />
                        To Build Fast
                    </h1>
                    <p className={styles.heroSubtitle}>
                        From wireframing to diagrams and design thinking, all the tools you need in one place.
                    </p>
                </section>

                {/* Feature 1: Wireframe Editor */}
                <section className={styles.section}>
                    <FeatureBlock
                        icon={<Layout size={48} />}
                        title="Wireframe Editor"
                        description="Professional canvas with infinite zoom and pan. Build low-fidelity wireframes with precision and speed."
                        features={[
                            "Infinite canvas with smooth pan & zoom",
                            "Drag and drop interface",
                            "Smart guides and alignment",
                            "Multi-select and grouping",
                            "Undo/redo support"
                        ]}
                        imagePosition="right"
                    />
                </section>

                {/* Feature 2: Design Thinking Tools */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <FeatureBlock
                        icon={<Lightbulb size={48} />}
                        title="Design Thinking Workspace"
                        description="Complete design thinking toolkit integrated into your workflow. From empathy to testing, all in one place."
                        features={[
                            "Empathy Maps - Understand your users deeply",
                            "User Personas - Define target audiences",
                            "User Journey Maps - Visualize experiences",
                            "Problem Statements - Frame challenges clearly",
                            "Brainstorming Board - Generate ideas collaboratively",
                            "Usability Testing - Validate your designs"
                        ]}
                        imagePosition="left"
                    />
                </section>

                {/* Feature 2.5: Diagram Editor */}
                <section className={styles.section}>
                    <FeatureBlock
                        icon={<GitBranch size={48} />}
                        title="Diagram Editor"
                        description="Create flowcharts, UML diagrams, and BPMN workflows with professional tools. Perfect for documenting processes and system architecture."
                        features={[
                            "Flowcharts - Visualize processes and logic",
                            "UML Diagrams - Document system architecture",
                            "BPMN Workflows - Map business processes",
                            "Use Case Diagrams - Define system interactions",
                            "Collapsible component categories",
                            "Professional diagram shapes library"
                        ]}
                        imagePosition="right"
                    />
                </section>

                {/* Feature 3: Component Library */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <FeatureBlock
                        icon={<Grid size={48} />}
                        title="Component Library"
                        description="50+ pre-built UI components ready to use. No need to design from scratch."
                        features={[
                            "Layout components (Container, Grid, Stack)",
                            "Form elements (Input, Button, Checkbox, Radio)",
                            "Navigation (Navbar, Sidebar, Tabs)",
                            "Content (Card, List, Table)",
                            "Media (Image, Video placeholders)",
                            "Fully customizable properties"
                        ]}
                        imagePosition="left"
                    />
                </section>

                {/* Feature 4: Device Presets */}
                <section className={styles.section}>
                    <FeatureBlock
                        icon={<Smartphone size={48} />}
                        title="Device Presets"
                        description="Instantly create frames for any device. Design responsive experiences with confidence."
                        features={[
                            "Mobile presets (iPhone, Android)",
                            "Tablet presets (iPad, Android tablets)",
                            "Desktop presets (MacBook, iMac, Windows)",
                            "Custom size frames",
                            "Accurate device dimensions"
                        ]}
                        imagePosition="left"
                    />
                </section>

                {/* Feature 5: Properties & Layers */}
                <section className={styles.section}>
                    <FeatureBlock
                        icon={<Sliders size={48} />}
                        title="Properties & Layers Panel"
                        description="Fine-tune every detail with precision controls. Organize complex designs with ease."
                        features={[
                            "Real-time property editing",
                            "Layout controls (position, size, spacing)",
                            "Appearance customization (colors, borders)",
                            "Layer hierarchy management",
                            "Visibility and lock controls",
                            "Z-index ordering"
                        ]}
                        imagePosition="right"
                    />
                </section>

                {/* Feature 6: Export */}
                <section className={styles.section} style={{ background: '#fafafa' }}>
                    <FeatureBlock
                        icon={<Download size={48} />}
                        title="Export & Share"
                        description="Get your designs out of the tool and into the hands of your team."
                        features={[
                            "High-resolution PNG export",
                            "Export entire canvas or selection",
                            "Transparent backgrounds",
                            "Quick share via download",
                            "Local storage auto-save"
                        ]}
                        imagePosition="left"
                    />
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <h2 className={styles.sectionTitle} style={{ fontSize: '48px', marginBottom: '24px' }}>
                        Ready to try it?
                    </h2>
                    <p className={styles.sectionSubtitle} style={{ marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                        Start building professional wireframes today. No credit card required.
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

function FeatureBlock({ icon, title, description, features, imagePosition }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    features: string[],
    imagePosition: 'left' | 'right'
}) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div style={{ order: imagePosition === 'left' ? 2 : 1 }}>
                <div className={styles.featureIcon} style={{
                    marginBottom: '24px',
                    width: '80px',
                    height: '80px'
                }}>
                    {icon}
                </div>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    color: '#18181b',
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h2>
                <p style={{
                    fontSize: '18px',
                    lineHeight: 1.6,
                    color: '#71717a',
                    marginBottom: '32px'
                }}>
                    {description}
                </p>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {features.map((feature, i) => (
                        <li key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            fontSize: '15px',
                            color: '#18181b'
                        }}>
                            <Check size={20} style={{ color: '#18181b', flexShrink: 0, marginTop: '2px' }} />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{
                order: imagePosition === 'left' ? 1 : 2,
                background: '#ffffff',
                height: '400px',
                border: '1px solid #e4e4e7',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                padding: '48px',
                gap: '24px'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    background: '#f4f4f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e4e4e7'
                }}>
                    <div style={{ color: '#18181b', transform: 'scale(2)' }}>
                        {icon}
                    </div>
                </div>
                <span style={{
                    color: '#18181b',
                    fontSize: '20px',
                    fontWeight: 600,
                    textAlign: 'center',
                    letterSpacing: '-0.01em'
                }}>
                    {title}
                </span>
            </div>
        </div>
    )
}
