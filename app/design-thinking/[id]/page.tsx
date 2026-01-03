'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Users, Target, Pencil, TestTube } from 'lucide-react'
import { Project } from '@/lib/storage'
import { apiStorage } from '@/lib/apiStorage'
import { DesignThinkingProject } from '@/types/designThinking'
import styles from './DesignThinking.module.css'

// Phase components
import EmpathizePhase from '@/components/DesignThinking/EmpathizePhase'
import DefinePhase from '@/components/DesignThinking/DefinePhase'
import IdeatePhase from '@/components/DesignThinking/IdeatePhase'
import PrototypePhase from '@/components/DesignThinking/PrototypePhase'
import TestPhase from '@/components/DesignThinking/TestPhase'

export default function DesignThinkingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [activePhase, setActivePhase] = useState<DesignThinkingProject['currentPhase']>('empathize')

    useEffect(() => {
        const fetchProject = async () => {
            const loadedProject = await apiStorage.getProject(id)
            if (loadedProject && loadedProject.type === 'DESIGN_THINKING') {
                // Initialize designThinking structure if missing
                if (!loadedProject.designThinking) {
                    loadedProject.designThinking = {
                        id: `dt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        name: loadedProject.name,
                        description: '',
                        interviews: [],
                        personas: [],
                        empathyMaps: [],
                        problemStatements: [],
                        hmwQuestions: [],
                        userJourneys: [],
                        brainstormBoards: [],
                        featurePriorities: [],
                        usabilityTests: [],
                        testResults: [],
                        currentPhase: 'empathize',
                        createdAt: new Date(loadedProject.createdAt).getTime(),
                        updatedAt: new Date(loadedProject.updatedAt).getTime()
                    }
                    // Save initialized project
                    await apiStorage.updateProject(id, loadedProject)
                }
                setProject(loadedProject)
                setActivePhase(loadedProject.designThinking!.currentPhase)
            } else {
                router.push('/dashboard')
            }
        }
        fetchProject()
    }, [id, router])

    // Auto-save project when it changes
    useEffect(() => {
        const saveTimeout = setTimeout(() => {
            if (project) {
                apiStorage.updateProject(project.id, project)
            }
        }, 1000) // Debounce 1s

        return () => clearTimeout(saveTimeout)
    }, [project])

    const handlePhaseUpdate = (updatedDtData: DesignThinkingProject) => {
        if (project) {
            const updatedProject = {
                ...project,
                designThinking: updatedDtData,
            };
            setProject(updatedProject);
        }
    };

    if (!project || !project.designThinking) {
        return <div className={styles.loading}>Loading...</div>
    }

    const phases = [
        { id: 'empathize', name: 'Empathize', icon: Users, description: 'Understand your users' },
        { id: 'define', name: 'Define', icon: Target, description: 'Define the problem' },
        { id: 'ideate', name: 'Ideate', icon: Lightbulb, description: 'Brainstorm solutions' },
        { id: 'prototype', name: 'Prototype', icon: Pencil, description: 'Build wireframes' },
        { id: 'test', name: 'Test', icon: TestTube, description: 'Validate with users' }
    ]

    const renderPhaseContent = () => {
        if (!project.designThinking) return null;

        switch (activePhase) {
            case 'empathize':
                return <EmpathizePhase project={project.designThinking} onUpdate={handlePhaseUpdate} />
            case 'define':
                return <DefinePhase project={project.designThinking} onUpdate={handlePhaseUpdate} />
            case 'ideate':
                return <IdeatePhase project={project.designThinking} onUpdate={handlePhaseUpdate} />
            case 'prototype':
                return <PrototypePhase project={project.designThinking} onUpdate={handlePhaseUpdate} />
            case 'test':
                return <TestPhase project={project.designThinking} onUpdate={handlePhaseUpdate} />
            default:
                return null
        }
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard" className={styles.backButton}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.projectName}>{project.name}</h1>
                        <p className={styles.projectDescription}>{project.designThinking.description || 'Design Thinking Workspace'}</p>
                    </div>
                </div>
            </div>

            {/* Phase Navigation */}
            <div className={styles.phaseNav}>
                {phases.map((phase, index) => {
                    const Icon = phase.icon
                    const isActive = activePhase === phase.id
                    const isCompleted = project.designThinking && phases.findIndex(p => p.id === project.designThinking?.currentPhase) > index

                    return (
                        <div key={phase.id} className={styles.phaseNavItem}>
                            <button
                                className={`${styles.phaseButton} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                                onClick={() => setActivePhase(phase.id as any)}
                            >
                                <div className={styles.phaseIcon}>
                                    <Icon size={24} />
                                </div>
                                <div className={styles.phaseInfo}>
                                    <div className={styles.phaseName}>{phase.name}</div>
                                    <div className={styles.phaseDescription}>{phase.description}</div>
                                </div>
                            </button>
                            {index < phases.length - 1 && (
                                <div className={`${styles.phaseConnector} ${isCompleted ? styles.completed : ''}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Phase Content */}
            <div className={styles.content}>
                {renderPhaseContent()}
            </div>
        </div>
    )
}
