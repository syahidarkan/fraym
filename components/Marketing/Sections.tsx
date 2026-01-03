import React from 'react'
import Link from 'next/link'
import { Layout, Lightbulb, Grid, Smartphone, Sliders, Download, Terminal, Globe, BookOpen, ChevronDown, GitBranch, Save, Users } from 'lucide-react'
import InteractiveHero from './InteractiveHero'
import DemoEditor from './DemoEditor'
import styles from '../../app/landing/LandingPage.module.css'

// Icon mapper for dynamic icons
const IconMap: any = {
    Layout, Lightbulb, Grid, Smartphone, Sliders, Download, Terminal, Globe, BookOpen, GitBranch, Save, Users
};

export const HeroSection = ({ content }: { content: any }) => {
    return (
        <InteractiveHero
            titlePrefix={content.titlePrefix}
            subtitle={content.subtitle}
            useCases={content.useCases}
        />
    )
}

export const FeaturesSection = ({ content }: { content: any }) => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{content.title}</h2>
                <p className={styles.sectionSubtitle}>{content.subtitle}</p>
            </div>
            <div className={styles.featuresGrid}>
                {content.items?.map((item: any, i: number) => {
                    const Icon = IconMap[item.icon] || Grid;
                    return (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Icon size={24} />
                            </div>
                            <h3 className={styles.featureTitle}>{item.title}</h3>
                            <p className={styles.featureDesc}>{item.description}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export const CTASection = ({ content }: { content: any }) => {
    return (
        <section className={styles.ctaSection}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '48px', marginBottom: '24px' }}>
                {content.title}
            </h2>
            <p className={styles.sectionSubtitle} style={{ marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                {content.subtitle}
            </p>
            <Link href={content.buttonLink || "/register"} className={styles.primaryButton} style={{ fontSize: '18px', padding: '16px 40px' }}>
                {content.buttonText || "Get Started"}
            </Link>
        </section>
    )
}

export const FAQSection = ({ content }: { content: any }) => {
    return (
        <section className={styles.section} style={{ maxWidth: '800px', margin: '0 auto', borderTop: 'none' }}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{content.title || "Common Questions"}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content.items?.map((item: any, i: number) => (
                    <div key={i} style={{ padding: '24px', border: '1px solid #e4e4e7', borderRadius: '12px', background: '#fff' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#18181b' }}>{item.question}</h3>
                        <p style={{ color: '#71717a', lineHeight: 1.6, fontSize: '15px', margin: 0 }}>{item.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export const DemoSection = ({ content }: { content: any }) => {
    return (
        <section id="demo" className={styles.section} style={{ background: '#fafafa' }}>
            <div className={styles.sectionHeader}>
                <div className={styles.badge}>
                    {content.badge || "INTERACTIVE DEMO"}
                </div>
                <h2 className={styles.sectionTitle}>{content.title}</h2>
                <p className={styles.sectionSubtitle}>{content.subtitle}</p>
            </div>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <DemoEditor />
            </div>
        </section>
    )
}

export const TextSection = ({ content }: { content: any }) => {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{content.title}</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', lineHeight: 1.8, color: '#52525b' }} dangerouslySetInnerHTML={{ __html: content.html }} />
            </div>
        </section>
    )
}
