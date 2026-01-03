'use client'

import { useState } from 'react'
import { Plus, Trash2, Map, Save, ArrowLeft } from 'lucide-react'
import { DesignThinkingProject, UserJourney, JourneyStage } from '@/types/designThinking'
import styles from './UserJourneyBuilder.module.css'

interface UserJourneyBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function UserJourneyBuilder({ project, onUpdate }: UserJourneyBuilderProps) {
    const [activeJourney, setActiveJourney] = useState<UserJourney | null>(null)

    const handleCreateJourney = () => {
        const newJourney: UserJourney = {
            id: `journey-${Date.now()}`,
            stages: [
                {
                    id: `stage-1`,
                    name: 'Awareness',
                    actions: [],
                    thoughts: [],
                    emotions: [],
                    painPoints: [],
                    opportunities: []
                },
                {
                    id: `stage-2`,
                    name: 'Consideration',
                    actions: [],
                    thoughts: [],
                    emotions: [],
                    painPoints: [],
                    opportunities: []
                },
                {
                    id: `stage-3`,
                    name: 'Decision',
                    actions: [],
                    thoughts: [],
                    emotions: [],
                    painPoints: [],
                    opportunities: []
                }
            ],
            createdAt: Date.now()
        }

        const updatedProject = { ...project }
        if (!updatedProject.userJourneys) updatedProject.userJourneys = []
        updatedProject.userJourneys.push(newJourney)

        onUpdate(updatedProject)
        setActiveJourney(newJourney)
    }

    const handleUpdateStage = (stageIndex: number, field: keyof JourneyStage, value: string) => {
        if (!activeJourney) return

        const updatedJourney = { ...activeJourney }
        const stage = updatedJourney.stages[stageIndex]

        if (field === 'name') {
            stage.name = value
        } else {
            // Split by newline for array fields
            (stage[field] as string[]) = value.split('\n')
        }

        // Update local state
        setActiveJourney(updatedJourney)

        // Update project
        const updatedProject = { ...project }
        const journeyIndex = updatedProject.userJourneys.findIndex(j => j.id === activeJourney.id)
        if (journeyIndex >= 0) {
            updatedProject.userJourneys[journeyIndex] = updatedJourney
            onUpdate(updatedProject)
        }
    }

    const handleAddStage = () => {
        if (!activeJourney) return

        const newStage: JourneyStage = {
            id: `stage-${Date.now()}`,
            name: 'New Stage',
            actions: [],
            thoughts: [],
            emotions: [],
            painPoints: [],
            opportunities: []
        }

        const updatedJourney = {
            ...activeJourney,
            stages: [...activeJourney.stages, newStage]
        }

        setActiveJourney(updatedJourney)

        const updatedProject = { ...project }
        const journeyIndex = updatedProject.userJourneys.findIndex(j => j.id === activeJourney.id)
        if (journeyIndex >= 0) {
            updatedProject.userJourneys[journeyIndex] = updatedJourney
            onUpdate(updatedProject)
        }
    }

    const handleDeleteStage = (index: number) => {
        if (!activeJourney || !confirm('Delete this stage?')) return

        const updatedJourney = {
            ...activeJourney,
            stages: activeJourney.stages.filter((_, i) => i !== index)
        }

        setActiveJourney(updatedJourney)

        const updatedProject = { ...project }
        const journeyIndex = updatedProject.userJourneys.findIndex(j => j.id === activeJourney.id)
        if (journeyIndex >= 0) {
            updatedProject.userJourneys[journeyIndex] = updatedJourney
            onUpdate(updatedProject)
        }
    }

    const handleDrop = (e: React.DragEvent, stageIndex: number, field: keyof JourneyStage) => {
        e.preventDefault()
        const text = e.dataTransfer.getData('text/plain')
        if (text && activeJourney) {
            const currentArray = activeJourney.stages[stageIndex][field] as string[]
            const currentValue = currentArray.join('\n')
            const newValue = currentValue ? `${currentValue}\n${text}` : text
            handleUpdateStage(stageIndex, field, newValue)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    // If no journey selected but journeys exist, show list
    if (!activeJourney && project.userJourneys && project.userJourneys.length > 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>User Journeys</h3>
                    <button className={styles.btnPrimary} onClick={handleCreateJourney}>
                        <Plus size={18} />
                        New Journey
                    </button>
                </div>
                <div className={styles.grid} style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {project.userJourneys.map((journey, index) => (
                        <div
                            key={journey.id}
                            className={styles.card}
                            style={{ cursor: 'pointer', padding: '24px', border: '1px solid #dee2e6', borderRadius: '12px' }}
                            onClick={() => setActiveJourney(journey)}
                        >
                            <h4>Journey #{index + 1}</h4>
                            <p>{journey.stages.length} Stages</p>
                            <p style={{ fontSize: '12px', color: '#868e96' }}>Created: {new Date(journey.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // If no journeys exist
    if (!activeJourney) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Map size={48} />
                    <h3>No User Journeys Yet</h3>
                    <p>Map out your user's experience step by step.</p>
                    <button className={styles.btnPrimary} onClick={handleCreateJourney}>
                        <Plus size={18} />
                        Create Journey Map
                    </button>
                </div>
            </div>
        )
    }

    // Detail View (Grid)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className={styles.btnSecondary} onClick={() => setActiveJourney(null)}>
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <h3>User Journey Map</h3>
                </div>
                <button className={styles.btnPrimary} onClick={handleAddStage}>
                    <Plus size={18} />
                    Add Stage
                </button>
            </div>

            <div className={styles.journeyContainer}>
                <div className={styles.journeyGrid} style={{ gridTemplateColumns: `150px repeat(${activeJourney.stages.length}, minmax(200px, 1fr))` }}>
                    {/* Header Row */}
                    <div className={styles.rowHeader}>Stages</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={stage.id} className={styles.stageHeader}>
                            <input
                                value={stage.name}
                                onChange={(e) => handleUpdateStage(index, 'name', e.target.value)}
                                placeholder="Stage Name"
                            />
                            <button
                                className={styles.deleteStageBtn}
                                onClick={() => handleDeleteStage(index)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    {/* Actions Row */}
                    <div className={styles.rowHeader}>Actions</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={`actions-${stage.id}`} className={styles.cell}>
                            <textarea
                                value={stage.actions.join('\n')}
                                onChange={(e) => handleUpdateStage(index, 'actions', e.target.value)}
                                onDrop={(e) => handleDrop(e, index, 'actions')}
                                onDragOver={handleDragOver}
                                placeholder="- User opens app&#10;- User clicks login"
                            />
                        </div>
                    ))}

                    {/* Thoughts Row */}
                    <div className={styles.rowHeader}>Thoughts</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={`thoughts-${stage.id}`} className={styles.cell}>
                            <textarea
                                value={stage.thoughts.join('\n')}
                                onChange={(e) => handleUpdateStage(index, 'thoughts', e.target.value)}
                                onDrop={(e) => handleDrop(e, index, 'thoughts')}
                                onDragOver={handleDragOver}
                                placeholder="Is this secure?&#10;Where do I start?"
                            />
                        </div>
                    ))}

                    {/* Emotions Row */}
                    <div className={styles.rowHeader}>Emotions</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={`emotions-${stage.id}`} className={styles.cell}>
                            <textarea
                                value={stage.emotions.join('\n')}
                                onChange={(e) => handleUpdateStage(index, 'emotions', e.target.value)}
                                onDrop={(e) => handleDrop(e, index, 'emotions')}
                                onDragOver={handleDragOver}
                                placeholder="Confused&#10;Excited"
                            />
                        </div>
                    ))}

                    {/* Pain Points Row */}
                    <div className={styles.rowHeader} style={{ color: '#fa5252' }}>Pain Points</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={`pain-${stage.id}`} className={styles.cell} style={{ borderColor: '#ffc9c9', background: '#fff5f5' }}>
                            <textarea
                                value={stage.painPoints.join('\n')}
                                onChange={(e) => handleUpdateStage(index, 'painPoints', e.target.value)}
                                onDrop={(e) => handleDrop(e, index, 'painPoints')}
                                onDragOver={handleDragOver}
                                placeholder="Loading is slow&#10;Button hard to find"
                                style={{ background: 'transparent' }}
                            />
                        </div>
                    ))}

                    {/* Opportunities Row */}
                    <div className={styles.rowHeader} style={{ color: '#2b8a3e' }}>Opportunities</div>
                    {activeJourney.stages.map((stage, index) => (
                        <div key={`opps-${stage.id}`} className={styles.cell} style={{ borderColor: '#b2f2bb', background: '#ebfbee' }}>
                            <textarea
                                value={stage.opportunities.join('\n')}
                                onChange={(e) => handleUpdateStage(index, 'opportunities', e.target.value)}
                                onDrop={(e) => handleDrop(e, index, 'opportunities')}
                                onDragOver={handleDragOver}
                                placeholder="Add quick login&#10;Show tooltip"
                                style={{ background: 'transparent' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
