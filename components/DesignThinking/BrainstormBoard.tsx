'use client'

import { useState, useMemo } from 'react'
import { Plus, ThumbsUp, Trash2, Lightbulb } from 'lucide-react'
import { DesignThinkingProject, BrainstormBoard as BrainstormBoardType, BrainstormIdea } from '@/types/designThinking'
import styles from './BrainstormBoard.module.css'

interface BrainstormBoardProps {
    project: DesignThinkingProject
    onUpdate: (project: DesignThinkingProject) => void
}

const COLORS = ['#ffe9e9', '#f0f4ff', '#f0fff4', '#fff8f0', '#f5f5f5'];


export default function BrainstormBoard({ project, onUpdate }: BrainstormBoardProps) {
    const [activeBoardId, setActiveBoardId] = useState<string | null>(
        project.brainstormBoards?.[0]?.id || null
    )
    const [showNewBoardModal, setShowNewBoardModal] = useState(false)
    const [showNewIdeaModal, setShowNewIdeaModal] = useState(false)
    const [newBoardName, setNewBoardName] = useState('')
    const [newIdeaText, setNewIdeaText] = useState('')
    const [selectedCategoryForNewIdea, setSelectedCategoryForNewIdea] = useState('');


    const activeBoard = project.brainstormBoards?.find(b => b.id === activeBoardId)

    const boardCategories = useMemo(() => {
        if (!activeBoard) return ['General'];
        const cats = new Set(activeBoard.ideas.map(i => i.category || 'General'));
        return Array.from(cats);
    }, [activeBoard]);

    const handleCreateBoard = () => {
        if (!newBoardName.trim()) return

        const newBoard: BrainstormBoardType = {
            id: `board-${Date.now()}`,
            name: newBoardName,
            ideas: [],
            createdAt: Date.now()
        }

        const updatedProject = { ...project }
        if (!updatedProject.brainstormBoards) updatedProject.brainstormBoards = []
        updatedProject.brainstormBoards.push(newBoard)

        onUpdate(updatedProject)
        setActiveBoardId(newBoard.id)
        setNewBoardName('')
        setShowNewBoardModal(false)
    }

    const handleAddIdea = () => {
        if (!newIdeaText.trim() || !activeBoard || !selectedCategoryForNewIdea) return

        const newIdea: BrainstormIdea = {
            id: `idea-${Date.now()}`,
            content: newIdeaText,
            category: selectedCategoryForNewIdea,
            votes: 0,
            x: Math.random() * 80, // %
            y: Math.random() * 80, // %
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            createdAt: Date.now()
        }

        const updatedProject = { ...project }
        const boardIndex = updatedProject.brainstormBoards.findIndex(b => b.id === activeBoardId)
        if (boardIndex >= 0) {
            updatedProject.brainstormBoards[boardIndex].ideas.push(newIdea)
            onUpdate(updatedProject)
        }

        setNewIdeaText('')
        setShowNewIdeaModal(false)
    }

    const handleVote = (ideaId: string) => {
        if (!activeBoard) return

        const updatedProject = { ...project }
        const boardIndex = updatedProject.brainstormBoards.findIndex(b => b.id === activeBoardId)
        if (boardIndex >= 0) {
            const idea = updatedProject.brainstormBoards[boardIndex].ideas.find(i => i.id === ideaId)
            if (idea) {
                idea.votes += 1
                onUpdate(updatedProject)
            }
        }
    }

    const handleDeleteIdea = (ideaId: string) => {
        if (!confirm('Delete this idea?')) return

        const updatedProject = { ...project }
        const boardIndex = updatedProject.brainstormBoards.findIndex(b => b.id === activeBoardId)
        if (boardIndex >= 0) {
            updatedProject.brainstormBoards[boardIndex].ideas =
                updatedProject.brainstormBoards[boardIndex].ideas.filter(i => i.id !== ideaId)
            onUpdate(updatedProject)
        }
    }

    if (!activeBoard) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Lightbulb size={48} />
                    <h3>No Brainstorm Boards Yet</h3>
                    <p>Create a board to start generating ideas with your team.</p>
                    <button className={styles.btnPrimary} onClick={() => setShowNewBoardModal(true)}>
                        <Plus size={18} />
                        Create Board
                    </button>
                </div>

                {showNewBoardModal && (
                    <div className={styles.modal} onClick={() => setShowNewBoardModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h3 className={styles.modalHeader}>New Brainstorm Board</h3>
                            <div className={styles.formGroup}>
                                <label>Board Name</label>
                                <input
                                    type="text"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder="e.g., Mobile App Ideas"
                                    autoFocus
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.btnSecondary} onClick={() => setShowNewBoardModal(false)}>
                                    Cancel
                                </button>
                                <button className={styles.btnPrimary} onClick={handleCreateBoard}>
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.boardSelector}>
                    <select
                        value={activeBoardId || ''}
                        onChange={(e) => setActiveBoardId(e.target.value)}
                    >
                        {project.brainstormBoards?.map(board => (
                            <option key={board.id} value={board.id}>{board.name}</option>
                        ))}
                    </select>
                    <button className={styles.btnSecondary} onClick={() => setShowNewBoardModal(true)}>
                        <Plus size={16} />
                        New Board
                    </button>
                </div>
                <button
                    className={styles.btnPrimary}
                    onClick={() => {
                        setSelectedCategoryForNewIdea(boardCategories[0])
                        setShowNewIdeaModal(true)
                    }}
                >
                    <Plus size={18} />
                    Add Idea
                </button>
            </div>

            <div className={styles.board}>
                <div className={styles.categories}>
                    {boardCategories.map(category => {
                        const categoryIdeas = activeBoard.ideas.filter(i => i.category === category)
                        return (
                            <div key={category} className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <div className={styles.categoryTitle}>{category}</div>
                                    <div className={styles.categoryCount}>{categoryIdeas.length}</div>
                                </div>
                                <div className={styles.ideas}>
                                    {categoryIdeas.map(idea => (
                                        <div key={idea.id} className={styles.ideaCard}>
                                            <p className={styles.ideaText}>{idea.content}</p>
                                            <div className={styles.ideaFooter}>
                                                <button
                                                    className={styles.voteBtn}
                                                    onClick={() => handleVote(idea.id)}
                                                >
                                                    <ThumbsUp size={14} />
                                                    {idea.votes}
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteIdea(idea.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        className={styles.addIdeaBtn}
                                        onClick={() => {
                                            setSelectedCategoryForNewIdea(category)
                                            setShowNewIdeaModal(true)
                                        }}
                                    >
                                        <Plus size={16} />
                                        Add idea
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {showNewBoardModal && (
                <div className={styles.modal} onClick={() => setShowNewBoardModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalHeader}>New Brainstorm Board</h3>
                        <div className={styles.formGroup}>
                            <label>Board Name</label>
                            <input
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder="e.g., Mobile App Ideas"
                                autoFocus
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.btnSecondary} onClick={() => setShowNewBoardModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.btnPrimary} onClick={handleCreateBoard}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNewIdeaModal && (
                <div className={styles.modal} onClick={() => setShowNewIdeaModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalHeader}>New Idea</h3>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select value={selectedCategoryForNewIdea} onChange={(e) => setSelectedCategoryForNewIdea(e.target.value)}>
                                {boardCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Idea</label>
                            <textarea
                                value={newIdeaText}
                                onChange={(e) => setNewIdeaText(e.target.value)}
                                placeholder="Describe your idea..."
                                autoFocus
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.btnSecondary} onClick={() => setShowNewIdeaModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.btnPrimary} onClick={handleAddIdea}>
                                Add Idea
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
