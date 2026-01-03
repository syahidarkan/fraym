'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { DesignThinkingProject } from '@/types/designThinking'
import styles from './PrototypePhase.module.css'

interface PrototypePhaseProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function PrototypePhase({ project, onUpdate }: PrototypePhaseProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Prototype</h2>
                <p>Build wireframes and create interactive prototypes</p>
            </div>
            <div className={styles.content}>
                <div className={styles.card}>
                    <Pencil size={48} />
                    <h3>Wireframe Editor</h3>
                    <p>Use the wireframe editor to create your prototypes</p>
                    <Link href="/dashboard" className={styles.btnPrimary}>
                        Go to Projects
                    </Link>
                </div>
            </div>
        </div>
    )
}
