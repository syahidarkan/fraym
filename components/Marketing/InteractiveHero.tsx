'use client'

import React, { useState, useEffect } from 'react'
import { Layout, Lightbulb, Download } from 'lucide-react'
import styles from './InteractiveHero.module.css'

const useCases = [
    "a mobile app wireframe",
    "a landing page design",
    "a dashboard interface",
    "user journey maps",
    "empathy maps for research",
    "design thinking workshops",
    "usability test plans",
    "product prototypes"
]

interface InteractiveHeroProps {
    titlePrefix?: string;
    subtitle?: string;
    useCases?: string[];
}

export default function InteractiveHero({
    titlePrefix = "Build",
    subtitle = "From wireframes to design thinking, create anything you need to bring your ideas to life.",
    useCases = [
        "a mobile app wireframe",
        "a landing page design",
        "a dashboard interface",
        "user journey maps",
        "empathy maps for research",
        "design thinking workshops",
        "usability test plans",
        "product prototypes"
    ]
}: InteractiveHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(true)
    const [charIndex, setCharIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100)
    }, [])

    useEffect(() => {
        const currentText = useCases[currentIndex]

        if (isTyping) {
            if (charIndex < currentText.length) {
                const timeout = setTimeout(() => {
                    setDisplayText(currentText.slice(0, charIndex + 1))
                    setCharIndex(charIndex + 1)
                }, 80)
                return () => clearTimeout(timeout)
            } else {
                const timeout = setTimeout(() => {
                    setIsTyping(false)
                }, 2000)
                return () => clearTimeout(timeout)
            }
        } else {
            if (charIndex > 0) {
                const timeout = setTimeout(() => {
                    setDisplayText(currentText.slice(0, charIndex - 1))
                    setCharIndex(charIndex - 1)
                }, 40)
                return () => clearTimeout(timeout)
            } else {
                setCurrentIndex((currentIndex + 1) % useCases.length)
                setIsTyping(true)
            }
        }
    }, [charIndex, isTyping, currentIndex, useCases])

    return (
        <div className={styles.container}>
            {/* Animated Grid Background */}
            <div className={styles.gridBackground}>
                <div className={styles.gridLines}></div>
            </div>

            {/* Particle Burst Effect */}
            <div className={styles.particleContainer}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
                ))}
            </div>

            <div className={`${styles.heroBox} ${isVisible ? styles.heroBoxVisible : ''}`}>
                <h1 className={styles.title}>
                    <span className={`${styles.titleWord} ${isVisible ? styles.titleWordVisible : ''}`} style={{ '--delay': '0.1s' } as React.CSSProperties}>
                        {titlePrefix}
                    </span>{' '}
                    <span className={styles.typingText}>{displayText}<span className={styles.cursor}>|</span></span>
                </h1>
                <p className={`${styles.subtitle} ${isVisible ? styles.subtitleVisible : ''}`}>
                    {subtitle}
                </p>
                <div className={`${styles.buttons} ${isVisible ? styles.buttonsVisible : ''}`}>
                    <a href="/register" className={styles.primaryButton}>
                        <span>Get Started Free</span>
                        <div className={styles.buttonGlow}></div>
                    </a>
                    <a href="#demo" className={styles.secondaryButton}>
                        See Demo
                    </a>
                </div>
            </div>

            {/* Interactive Preview Cards */}
            <div className={styles.previewCards}>
                <PreviewCard
                    title="Wireframe"
                    icon={<Layout size={40} />}
                    description="Drag & drop components"
                    delay={0.2}
                    isVisible={isVisible}
                />
                <PreviewCard
                    title="Design Thinking"
                    icon={<Lightbulb size={40} />}
                    description="Research & ideation tools"
                    delay={0.4}
                    isVisible={isVisible}
                />
                <PreviewCard
                    title="Export"
                    icon={<Download size={40} />}
                    description="PNG & code ready"
                    delay={0.6}
                    isVisible={isVisible}
                />
            </div>
        </div>
    )
}

function PreviewCard({ title, icon, description, delay, isVisible }: { title: string, icon: React.ReactNode, description: string, delay: number, isVisible: boolean }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={`${styles.previewCard} ${isVisible ? styles.previewCardVisible : ''}`}
            style={{ '--card-delay': `${delay}s` } as React.CSSProperties}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`${styles.cardIcon} ${isHovered ? styles.cardIconHover : ''}`}>
                {icon}
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{description}</p>
            <div className={`${styles.cardIndicator} ${isHovered ? styles.cardIndicatorActive : ''}`}>
                →
            </div>
        </div>
    )
}
