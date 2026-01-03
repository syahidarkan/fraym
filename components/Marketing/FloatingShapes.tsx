'use client'

import React, { useState, useEffect } from 'react'
import styles from './FloatingShapes.module.css'

interface Shape {
    id: number
    size: number
    top: number
    left: number
    type: 'square' | 'circle' | 'triangle' | 'diamond'
    animDelay: number
}

// Generate shapes outside component to avoid hydration mismatch
const generateShapes = (): Shape[] => {
    const shapeTypes: Array<'square' | 'circle' | 'triangle' | 'diamond'> = ['square', 'circle', 'triangle', 'diamond']
    const generated: Shape[] = []

    for (let i = 0; i < 50; i++) {
        generated.push({
            id: i,
            size: 40 + (i % 3) * 10, // Deterministic size
            top: (i * 100) + ((i * 37) % 80), // Deterministic spread
            left: ((i * 17) % 90) + 2, // 2-92% to avoid overflow
            type: shapeTypes[i % 4], // Deterministic type
            animDelay: (i % 10)
        })
    }

    return generated
}

const SHAPES = generateShapes()

export default function FloatingShapes() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX,
                y: e.clientY + window.scrollY
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const getShapeTransform = (shape: Shape) => {
        if (!mounted || typeof window === 'undefined') return 'translate(0, 0) scale(1)'

        const shapeX = (window.innerWidth * shape.left) / 100
        const shapeY = shape.top

        const dx = mousePos.x - shapeX
        const dy = mousePos.y - shapeY
        const distance = Math.sqrt(dx * dx + dy * dy)

        const threshold = 200

        if (distance < threshold && distance > 0) {
            const force = (threshold - distance) / threshold
            const angle = Math.atan2(dy, dx)

            // Push away from cursor
            const pushX = -Math.cos(angle) * force * 50
            const pushY = -Math.sin(angle) * force * 50

            return `translate(${pushX}px, ${pushY}px) scale(${1 + force * 0.2})`
        }

        return 'translate(0, 0) scale(1)'
    }

    // Don't render on server to avoid hydration mismatch
    if (!mounted) return null

    return (
        <div className={styles.container}>
            {SHAPES.map((shape) => (
                <div
                    key={shape.id}
                    className={`${styles.shape} ${styles[shape.type]}`}
                    style={{
                        width: `${shape.size}px`,
                        height: `${shape.size}px`,
                        top: `${shape.top}px`,
                        left: `${shape.left}%`,
                        animationDelay: `${shape.animDelay}s`,
                        transform: getShapeTransform(shape)
                    }}
                />
            ))}
        </div>
    )
}
