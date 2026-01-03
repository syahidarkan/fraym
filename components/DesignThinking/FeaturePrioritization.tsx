'use client'

import { useState } from 'react'
import { Plus, Grid3x3, List, TrendingUp, Edit2, Trash2, Target } from 'lucide-react'
import { DesignThinkingProject, FeaturePriority } from '@/types/designThinking'
import styles from './FeaturePrioritization.module.css'

interface FeaturePrioritizationProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

type QuadrantType = 'quick-win' | 'major-project' | 'fill-in' | 'thankless-task';

export default function FeaturePrioritization({ project, onUpdate }: FeaturePrioritizationProps) {
    const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix')
    const [showModal, setShowModal] = useState(false)
    const [editingFeature, setEditingFeature] = useState<Partial<FeaturePriority>>({})

    const getQuadrant = (impact: number, effort: number): QuadrantType => {
        if (impact > 5 && effort <= 5) return 'quick-win'
        if (impact > 5 && effort > 5) return 'major-project'
        if (impact <= 5 && effort <= 5) return 'fill-in'
        return 'thankless-task'
    }

    const handleSaveFeature = () => {
        if (!editingFeature.name || editingFeature.impact === undefined || editingFeature.effort === undefined) {
            alert('Please fill in all fields')
            return
        }

        const newFeature: FeaturePriority = {
            id: editingFeature.id || `feature-${Date.now()}`,
            name: editingFeature.name,
            description: editingFeature.description || '',
            impact: editingFeature.impact,
            effort: editingFeature.effort,
            quadrant: getQuadrant(editingFeature.impact, editingFeature.effort),
            createdAt: editingFeature.createdAt || Date.now()
        }

        const updatedProject = { ...project }
        if (!updatedProject.featurePriorities) updatedProject.featurePriorities = []

        const index = updatedProject.featurePriorities.findIndex(f => f.id === newFeature.id)
        if (index >= 0) {
            updatedProject.featurePriorities[index] = newFeature
        } else {
            updatedProject.featurePriorities.push(newFeature)
        }

        onUpdate(updatedProject)
        setEditingFeature({})
        setShowModal(false)
    }

    const handleDeleteFeature = (id: string) => {
        if (!confirm('Delete this feature?')) return

        const updatedProject = {
            ...project,
            featurePriorities: project.featurePriorities.filter(f => f.id !== id)
        }
        onUpdate(updatedProject)
    }

    const getQuadrantLabel = (quadrant: QuadrantType): string => {
        const labels = {
            'quick-win': 'Quick Wins',
            'major-project': 'Major Projects',
            'fill-in': 'Fill-Ins',
            'thankless-task': 'Thankless Tasks'
        }
        return labels[quadrant]
    }

    const features = project.featurePriorities || []
    const quadrants = {
        'quick-win': features.filter(f => getQuadrant(f.impact, f.effort) === 'quick-win'),
        'major-project': features.filter(f => getQuadrant(f.impact, f.effort) === 'major-project'),
        'fill-in': features.filter(f => getQuadrant(f.impact, f.effort) === 'fill-in'),
        'thankless-task': features.filter(f => getQuadrant(f.impact, f.effort) === 'thankless-task')
    }

    if (features.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Target size={48} />
                    <h3>No Features Yet</h3>
                    <p>Add features to prioritize them based on impact and effort.</p>
                    <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Add Feature
                    </button>
                </div>

                {showModal && (
                    <FeatureModal
                        feature={editingFeature}
                        onChange={setEditingFeature}
                        onSave={handleSaveFeature}
                        onCancel={() => {
                            setShowModal(false)
                            setEditingFeature({})
                        }}
                    />
                )}
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.viewBtn} ${viewMode === 'matrix' ? styles.active : ''}`}
                        onClick={() => setViewMode('matrix')}
                    >
                        <Grid3x3 size={16} />
                        Matrix
                    </button>
                    <button
                        className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={16} />
                        List
                    </button>
                </div>
                <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Add Feature
                </button>
            </div>

            <div className={styles.content}>
                {viewMode === 'matrix' ? (
                    <div className={styles.matrix}>
                        {/* Top-left corner */}
                        <div className={styles.axisLabel}></div>

                        {/* Top axis labels */}
                        <div className={styles.axisLabel}>Low Effort</div>
                        <div className={styles.axisLabel}>High Effort</div>

                        {/* Left axis label for high impact */}
                        <div className={`${styles.axisLabel} ${styles.vertical}`}>High Impact</div>

                        {/* Quick Wins (High Impact, Low Effort) */}
                        <div className={`${styles.quadrant} ${styles.quickWins}`}>
                            <div className={styles.quadrantLabel}>
                                🎯 Quick Wins
                                <span className={styles.quadrantBadge}>{quadrants['quick-win'].length}</span>
                            </div>
                            <div className={styles.featureCards}>
                                {quadrants['quick-win'].map(feature => (
                                    <FeatureCard
                                        key={feature.id}
                                        feature={feature}
                                        onEdit={() => {
                                            setEditingFeature(feature)
                                            setShowModal(true)
                                        }}
                                        onDelete={() => handleDeleteFeature(feature.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Major Projects (High Impact, High Effort) */}
                        <div className={`${styles.quadrant} ${styles.majorProjects}`}>
                            <div className={styles.quadrantLabel}>
                                🚀 Major Projects
                                <span className={styles.quadrantBadge}>{quadrants['major-project'].length}</span>
                            </div>
                            <div className={styles.featureCards}>
                                {quadrants['major-project'].map(feature => (
                                    <FeatureCard
                                        key={feature.id}
                                        feature={feature}
                                        onEdit={() => {
                                            setEditingFeature(feature)
                                            setShowModal(true)
                                        }}
                                        onDelete={() => handleDeleteFeature(feature.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Left axis label for low impact */}
                        <div className={`${styles.axisLabel} ${styles.vertical}`}>Low Impact</div>

                        {/* Fill-Ins (Low Impact, Low Effort) */}
                        <div className={`${styles.quadrant} ${styles.fillIns}`}>
                            <div className={styles.quadrantLabel}>
                                📝 Fill-Ins
                                <span className={styles.quadrantBadge}>{quadrants['fill-in'].length}</span>
                            </div>
                            <div className={styles.featureCards}>
                                {quadrants['fill-in'].map(feature => (
                                    <FeatureCard
                                        key={feature.id}
                                        feature={feature}
                                        onEdit={() => {
                                            setEditingFeature(feature)
                                            setShowModal(true)
                                        }}
                                        onDelete={() => handleDeleteFeature(feature.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thankless Tasks (Low Impact, High Effort) */}
                        <div className={`${styles.quadrant} ${styles.thankless}`}>
                            <div className={styles.quadrantLabel}>
                                ⚠️ Thankless Tasks
                                <span className={styles.quadrantBadge}>{quadrants['thankless-task'].length}</span>
                            </div>
                            <div className={styles.featureCards}>
                                {quadrants['thankless-task'].map(feature => (
                                    <FeatureCard
                                        key={feature.id}
                                        feature={feature}
                                        onEdit={() => {
                                            setEditingFeature(feature)
                                            setShowModal(true)
                                        }}
                                        onDelete={() => handleDeleteFeature(feature.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {features
                            .sort((a, b) => b.impact - a.impact)
                            .map(feature => {
                                const quadrant = getQuadrant(feature.impact, feature.effort)
                                return (
                                    <div key={feature.id} className={styles.listItem}>
                                        <div className={styles.listItemContent}>
                                            <h4 className={styles.listItemTitle}>{feature.name}</h4>
                                            {feature.description && <p style={{ margin: '0 0 8px 0', color: '#868e96', fontSize: '14px' }}>{feature.description}</p>}
                                            <div className={styles.listItemMeta}>
                                                <span>Impact: {feature.impact}/10</span>
                                                <span>Effort: {feature.effort}/10</span>
                                            </div>
                                        </div>
                                        <div className={styles.listItemActions}>
                                            <div className={`${styles.priorityBadge} ${styles[quadrant.replace('-', '')]}`}>
                                                {getQuadrantLabel(quadrant)}
                                            </div>
                                            <button
                                                className={styles.btnSecondary}
                                                onClick={() => {
                                                    setEditingFeature(feature)
                                                    setShowModal(true)
                                                }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.btnSecondary}
                                                onClick={() => handleDeleteFeature(feature.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                )}
            </div>

            {showModal && (
                <FeatureModal
                    feature={editingFeature}
                    onChange={setEditingFeature}
                    onSave={handleSaveFeature}
                    onCancel={() => {
                        setShowModal(false)
                        setEditingFeature({})
                    }}
                />
            )}
        </div>
    )
}

interface FeatureCardProps {
    feature: FeaturePriority
    onEdit: () => void
    onDelete: () => void
}

function FeatureCard({ feature, onEdit, onDelete }: FeatureCardProps) {
    return (
        <div className={styles.featureCard}>
            <h5 className={styles.featureTitle}>{feature.name}</h5>
            <div className={styles.featureMeta}>
                <span>
                    <TrendingUp size={12} />
                    Impact: {feature.impact}
                </span>
                <span>
                    Effort: {feature.effort}
                </span>
            </div>
        </div>
    )
}

interface FeatureModalProps {
    feature: Partial<FeaturePriority>
    onChange: (feature: Partial<FeaturePriority>) => void
    onSave: () => void
    onCancel: () => void
}

function FeatureModal({ feature, onChange, onSave, onCancel }: FeatureModalProps) {
    return (
        <div className={styles.modal} onClick={onCancel}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalHeader}>
                    {feature.id ? 'Edit Feature' : 'New Feature'}
                </h3>

                <div className={styles.formGroup}>
                    <label>Feature Name</label>
                    <input
                        type="text"
                        value={feature.name || ''}
                        onChange={(e) => onChange({ ...feature, name: e.target.value })}
                        placeholder="e.g., Dark mode support"
                        autoFocus
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Description (optional)</label>
                    <textarea
                        value={feature.description || ''}
                        onChange={(e) => onChange({ ...feature, description: e.target.value })}
                        placeholder="Brief description of the feature..."
                    />
                </div>

                <div className={styles.sliderGroup}>
                    <label>
                        <span>Impact</span>
                        <span>{feature.impact || 5}/10</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={feature.impact || 5}
                        onChange={(e) => onChange({ ...feature, impact: parseInt(e.target.value) })}
                    />
                </div>

                <div className={styles.sliderGroup}>
                    <label>
                        <span>Effort</span>
                        <span>{feature.effort || 5}/10</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={feature.effort || 5}
                        onChange={(e) => onChange({ ...feature, effort: parseInt(e.target.value) })}
                    />
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.btnSecondary} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={styles.btnPrimary} onClick={onSave}>
                        {feature.id ? 'Save' : 'Add Feature'}
                    </button>
                </div>
            </div>
        </div>
    )
}
