'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, User } from 'lucide-react'
import { DesignThinkingProject, Persona } from '@/types/designThinking'
import styles from './PersonaBuilder.module.css'

interface PersonaBuilderProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

export default function PersonaBuilder({ project, onUpdate }: PersonaBuilderProps) {
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingPersona, setEditingPersona] = useState<Partial<Persona>>({})

    const handleCreatePersona = () => {
        const newPersona: Persona = {
            id: `persona-${Date.now()}`,
            name: '',
            demographics: '',
            goals: [],
            painPoints: [],
            behaviors: [],
            createdAt: Date.now()
        }

        setEditingPersona(newPersona)
        setIsEditing(true)
    }

    const handleSavePersona = () => {
        if (!editingPersona.id || !editingPersona.name) return

        const persona = editingPersona as Persona
        
        const updatedProject = { ...project }
        const index = updatedProject.personas.findIndex(p => p.id === persona.id)
        if (index >= 0) {
            updatedProject.personas[index] = persona
        } else {
            updatedProject.personas.push(persona)
        }

        onUpdate(updatedProject)
        setIsEditing(false)
        setSelectedPersona(persona)
    }

    const handleDeletePersona = (id: string) => {
        if (!confirm('Delete this persona?')) return

        const updatedProject = {
            ...project,
            personas: project.personas.filter(p => p.id !== id)
        }
        onUpdate(updatedProject)
        setSelectedPersona(null)
    }

    const handleArrayInput = (field: 'goals' | 'painPoints' | 'behaviors', value: string) => {
        setEditingPersona({
            ...editingPersona,
            [field]: value.split('\n').filter(item => item.trim())
        })
    }

    if (isEditing) {
        return (
            <div className={styles.editor}>
                <div className={styles.editorHeader}>
                    <h3>Edit Persona</h3>
                    <div className={styles.editorActions}>
                        <button className={styles.btnSecondary} onClick={() => setIsEditing(false)}>
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={handleSavePersona}
                            disabled={!editingPersona.name}
                        >
                            <Save size={18} />
                            Save Persona
                        </button>
                    </div>
                </div>

                <div className={styles.editorContent}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Name *</label>
                            <input
                                type="text"
                                value={editingPersona.name || ''}
                                onChange={(e) => setEditingPersona({ ...editingPersona, name: e.target.value })}
                                placeholder="e.g., Sarah the Student"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Age</label>
                            <input
                                type="number"
                                value={editingPersona.age || ''}
                                onChange={(e) => setEditingPersona({ ...editingPersona, age: parseInt(e.target.value) || undefined })}
                                placeholder="e.g., 25"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Occupation</label>
                            <input
                                type="text"
                                value={editingPersona.occupation || ''}
                                onChange={(e) => setEditingPersona({ ...editingPersona, occupation: e.target.value })}
                                placeholder="e.g., College Student"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Demographics & Background</label>
                        <textarea
                            value={editingPersona.demographics || ''}
                            onChange={(e) => setEditingPersona({ ...editingPersona, demographics: e.target.value })}
                            placeholder="Describe their background, lifestyle, tech-savviness, etc."
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Quote</label>
                        <input
                            type="text"
                            value={editingPersona.quote || ''}
                            onChange={(e) => setEditingPersona({ ...editingPersona, quote: e.target.value })}
                            placeholder="A quote that represents this persona"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Goals (one per line)</label>
                        <textarea
                            value={(editingPersona.goals || []).join('\n')}
                            onChange={(e) => handleArrayInput('goals', e.target.value)}
                            placeholder="What are they trying to achieve?&#10;Example:&#10;- Save time on daily tasks&#10;- Learn new skills&#10;- Stay organized"
                            className={styles.textarea}
                            rows={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Pain Points (one per line)</label>
                        <textarea
                            value={(editingPersona.painPoints || []).join('\n')}
                            onChange={(e) => handleArrayInput('painPoints', e.target.value)}
                            placeholder="What frustrates them?&#10;Example:&#10;- Too many apps to manage&#10;- Confusing interfaces&#10;- Slow customer support"
                            className={styles.textarea}
                            rows={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Behaviors (one per line)</label>
                        <textarea
                            value={(editingPersona.behaviors || []).join('\n')}
                            onChange={(e) => handleArrayInput('behaviors', e.target.value)}
                            placeholder="How do they behave?&#10;Example:&#10;- Checks phone frequently&#10;- Prefers mobile over desktop&#10;- Shares on social media"
                            className={styles.textarea}
                            rows={5}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (selectedPersona) {
        return (
            <div className={styles.detailView}>
                <div className={styles.detailHeader}>
                    <button className={styles.btnBack} onClick={() => setSelectedPersona(null)}>
                        ← Back to Personas
                    </button>
                    <div className={styles.detailActions}>
                        <button className={styles.btnSecondary} onClick={() => {
                            setEditingPersona(selectedPersona)
                            setIsEditing(true)
                        }}>
                            <Edit2 size={18} />
                            Edit
                        </button>
                        <button className={styles.btnDanger} onClick={() => handleDeletePersona(selectedPersona.id)}>
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>

                <div className={styles.personaCard}>
                    <div className={styles.personaHeader}>
                        <div className={styles.avatar}>
                            <User size={48} />
                        </div>
                        <div className={styles.personaInfo}>
                            <h2>{selectedPersona.name}</h2>
                            <div className={styles.personaMeta}>
                                {selectedPersona.age && <span>{selectedPersona.age} years old</span>}
                                {selectedPersona.occupation && <span>{selectedPersona.occupation}</span>}
                            </div>
                        </div>
                    </div>

                    {selectedPersona.quote && (
                        <div className={styles.quote}>
                            <div className={styles.quoteIcon}>"</div>
                            <div className={styles.quoteText}>{selectedPersona.quote}</div>
                        </div>
                    )}

                    {selectedPersona.demographics && (
                        <div className={styles.section}>
                            <h4>Background</h4>
                            <p>{selectedPersona.demographics}</p>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h4>Goals</h4>
                        {selectedPersona.goals.length > 0 ? (
                            <ul className={styles.list}>
                                {selectedPersona.goals.map((goal, i) => (
                                    <li key={i}>{goal}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.emptyText}>No goals defined</p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h4>Pain Points</h4>
                        {selectedPersona.painPoints.length > 0 ? (
                            <ul className={styles.list}>
                                {selectedPersona.painPoints.map((pain, i) => (
                                    <li key={i}>{pain}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.emptyText}>No pain points defined</p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h4>Behaviors</h4>
                        {selectedPersona.behaviors.length > 0 ? (
                            <ul className={styles.list}>
                                {selectedPersona.behaviors.map((behavior, i) => (
                                    <li key={i}>{behavior}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.emptyText}>No behaviors defined</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.listView}>
            <div className={styles.listHeader}>
                <h3>User Personas</h3>
                <button className={styles.btnPrimary} onClick={handleCreatePersona}>
                    <Plus size={18} />
                    Create Persona
                </button>
            </div>

            {project.personas.length > 0 ? (
                <div className={styles.personaGrid}>
                    {project.personas.map(persona => (
                        <div
                            key={persona.id}
                            className={styles.personaCardSmall}
                            onClick={() => setSelectedPersona(persona)}
                        >
                            <div className={styles.avatarSmall}>
                                <User size={32} />
                            </div>
                            <div className={styles.personaContent}>
                                <h4>{persona.name}</h4>
                                <p className={styles.personaMetaSmall}>
                                    {persona.age && `${persona.age} years`}
                                    {persona.age && persona.occupation && ' • '}
                                    {persona.occupation}
                                </p>
                                <div className={styles.personaStats}>
                                    <span>{persona.goals.length} goals</span>
                                    <span>{persona.painPoints.length} pain points</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <User size={64} />
                    <h3>No personas yet</h3>
                    <p>Create personas to represent your target users</p>
                    <button className={styles.btnPrimary} onClick={handleCreatePersona}>
                        <Plus size={18} />
                        Create Persona
                    </button>
                </div>
            )}
        </div>
    )
}
