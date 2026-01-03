'use client'

import React, { useState } from 'react'
import Modal from '@/components/UI/Modal'
import { ProjectType } from '@/lib/storage'
import styles from './NewProjectModal.module.css'
import { FileText, BrainCircuit, Network } from 'lucide-react'

interface NewProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string, type: ProjectType) => void
}

export default function NewProjectModal({ isOpen, onClose, onCreate }: NewProjectModalProps) {
    const [name, setName] = useState('')
    const [type, setType] = useState<ProjectType | null>(null)

    const handleCreate = () => {
        if (name.trim() && type) {
            onCreate(name.trim(), type)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a new project">
            <div className={styles.content}>
                <p className={styles.label}>Project Name</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My awesome project"
                    className={styles.input}
                    autoFocus
                />

                <p className={styles.label}>What do you want to create?</p>
                <div className={styles.typeSelector}>
                    <button
                        className={`${styles.typeCard} ${type === 'WIREFRAME' ? styles.selected : ''}`}
                        onClick={() => setType('WIREFRAME')}
                    >
                        <FileText size={40} />
                        <span className={styles.cardTitle}>Wireframe</span>
                        <p className={styles.cardDescription}>Build and iterate on low-fidelity UI designs.</p>
                    </button>
                    <button
                        className={`${styles.typeCard} ${type === 'DESIGN_THINKING' ? styles.selected : ''}`}
                        onClick={() => setType('DESIGN_THINKING')}
                    >
                        <BrainCircuit size={40} />
                        <span className={styles.cardTitle}>Design Thinking</span>
                        <p className={styles.cardDescription}>A structured process for human-centered problem-solving.</p>
                    </button>
                    <button
                        className={`${styles.typeCard} ${type === 'DIAGRAM' ? styles.selected : ''}`}
                        onClick={() => setType('DIAGRAM')}
                    >
                        <Network size={40} />
                        <span className={styles.cardTitle}>Diagram</span>
                        <p className={styles.cardDescription}>Create flowcharts, use cases, and workflow diagrams.</p>
                    </button>
                </div>

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className={styles.createBtn}
                        disabled={!name.trim() || !type}
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </Modal>
    )
}
