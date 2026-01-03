'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Plus, FileText, Search, ChevronDown, Star,
    Folder, Trash2, MoreVertical, Clock, Home,
    LogOut, Settings as SettingsIcon,
    Edit2, Copy, Trash, RotateCcw, BrainCircuit, Network, Layout, Lightbulb, Share2, X
} from 'lucide-react'
import styles from './Dashboard.module.css'
import { Project, ProjectType } from '@/lib/storage'
import { apiStorage } from '@/lib/apiStorage'
import SettingsModal from '@/components/Modals/SettingsModal'
import NewProjectModal from '@/components/Modals/NewProjectModal'

type SidebarFilter = 'all' | 'drafts' | 'trash' | 'starred'
type SortBy = 'lastViewed' | 'lastModified' | 'name'

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>('all')
    const [sortBy, setSortBy] = useState<SortBy>('lastModified')
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Modal States
    const [renameModalOpen, setRenameModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [newName, setNewName] = useState('')
    const [showSettings, setShowSettings] = useState(false)

    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadProjects()

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveProjectMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const loadProjects = async () => {
        setIsLoading(true)
        try {
            const loadedProjects = await apiStorage.getProjects()
            setProjects(loadedProjects)
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                router.push('/login')
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let filtered = projects.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (sidebarFilter === 'drafts') {
            filtered = filtered.filter(p => p.draft && !p.deleted)
        } else if (sidebarFilter === 'trash') {
            filtered = filtered.filter(p => p.deleted)
        } else if (sidebarFilter === 'starred') {
            filtered = filtered.filter(p => p.starred && !p.deleted)
        } else {
            filtered = filtered.filter(p => !p.deleted)
        }

        filtered = filtered.sort((a, b) => {
            if (sortBy === 'lastModified' || sortBy === 'lastViewed') {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            } else {
                return a.name.localeCompare(b.name)
            }
        })

        setFilteredProjects(filtered)
    }, [searchQuery, projects, sidebarFilter, sortBy])

    const createProject = async (name: string, type: ProjectType) => {
        if (!name.trim() || !type) return

        setIsLoading(true)
        const newProject = await apiStorage.createProject(name, type, {})

        if (newProject) {
            await loadProjects()
            setIsModalOpen(false)
            navigateToProject(newProject)
        } else {
            alert('Failed to create project. Please try again.')
            setIsLoading(false)
        }
    }

    const navigateToProject = (project: Project) => {
        if (project.type === 'WIREFRAME') {
            router.push(`/project/${project.id}`)
        } else if (project.type === 'DESIGN_THINKING') {
            router.push(`/design-thinking/${project.id}`)
        } else if (project.type === 'DIAGRAM') {
            router.push(`/diagram/${project.id}`)
        }
    }

    const handleLogout = () => {
        // Clear auth cookie
        document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/login')
    }

    const handleCardClick = (project: Project) => {
        if (project.deleted) return;
        navigateToProject(project)
    }

    const getProjectIcon = (type: ProjectType) => {
        switch (type) {
            case 'WIREFRAME': return <Layout size={20} />;
            case 'DESIGN_THINKING': return <Lightbulb size={20} />;
            case 'DIAGRAM': return <Share2 size={20} />;
            default: return <FileText size={20} />;
        }
    }

    // Project Actions
    const handleRename = (project: Project) => {
        setSelectedProject(project)
        setNewName(project.name)
        setRenameModalOpen(true)
        setActiveProjectMenu(null)
    }

    const confirmRename = async () => {
        if (selectedProject && newName.trim()) {
            setIsLoading(true)
            const updatedProject = { ...selectedProject, name: newName, updatedAt: new Date().toISOString() }
            await apiStorage.updateProject(selectedProject.id, { name: newName, updatedAt: new Date().toISOString() })
            await loadProjects()
            setRenameModalOpen(false)
            setSelectedProject(null)
            setIsLoading(false)
        }
    }

    const handleDelete = (project: Project) => {
        setSelectedProject(project)
        setDeleteModalOpen(true)
        setActiveProjectMenu(null)
    }

    const confirmDelete = async () => {
        if (selectedProject) {
            setIsLoading(true)
            if (selectedProject.deleted) {
                // Permanent delete
                await apiStorage.deleteProject(selectedProject.id)
            } else {
                // Move to trash
                const updatedProject = { ...selectedProject, deleted: true, updatedAt: new Date().toISOString() }
                await apiStorage.updateProject(selectedProject.id, updatedProject)
            }
            await loadProjects()
            setDeleteModalOpen(false)
            setSelectedProject(null)
            setIsLoading(false)
        }
    }

    const handleDuplicate = async (project: Project) => {
        setIsLoading(true)
        const newName = `${project.name} (Copy)`

        // Ensure we copy the type and other necessary data
        // For duplication, we basically create a new project with the same data
        const newProject = await apiStorage.createProject(newName, project.type, project)

        if (newProject) {
            await loadProjects()
        }

        setActiveProjectMenu(null)
        setIsLoading(false)
    }

    const handleToggleStar = async (project: Project) => {
        // Optimistic update
        const newStarredStatus = !project.starred
        const updatedProject = { ...project, starred: newStarredStatus }

        // Update UI immediately (optional, but good for UX)
        setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p))

        await apiStorage.updateProject(project.id, { starred: newStarredStatus })
        setActiveProjectMenu(null)
    }

    const handleRestore = async (project: Project) => {
        setIsLoading(true)
        const updatedProject = { ...project, deleted: false, updatedAt: new Date().toISOString() }
        await apiStorage.updateProject(project.id, { deleted: false, updatedAt: new Date().toISOString() })
        await loadProjects()
        setActiveProjectMenu(null)
        setIsLoading(false)
    }

    const handleEmptyTrash = async () => {
        if (confirm('Are you sure you want to permanently delete all items in trash?')) {
            setIsLoading(true)
            const trashProjects = projects.filter(p => p.deleted)
            for (const p of trashProjects) {
                await apiStorage.deleteProject(p.id)
            }
            await loadProjects()
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.profile} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                    <div className={styles.avatar}>S</div>
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>User</span>
                        <ChevronDown size={14} />
                    </div>
                    {profileDropdownOpen && (
                        <div className={styles.profileDropdown} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => { setShowSettings(true); setProfileDropdownOpen(false); }}>
                                <SettingsIcon size={16} /> Settings
                            </button>
                            <button onClick={handleLogout}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>

                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${sidebarFilter === 'all' ? styles.active : ''}`}
                        onClick={() => setSidebarFilter('all')}
                    >
                        <Clock size={18} className={styles.navIcon} /> Recents
                    </button>
                    <button
                        className={`${styles.navItem} ${sidebarFilter === 'drafts' ? styles.active : ''}`}
                        onClick={() => setSidebarFilter('drafts')}
                    >
                        <FileText size={18} className={styles.navIcon} /> Drafts
                    </button>
                    <button
                        className={`${styles.navItem} ${sidebarFilter === 'starred' ? styles.active : ''}`}
                        onClick={() => setSidebarFilter('starred')}
                    >
                        <Star size={18} className={styles.navIcon} /> Starred
                    </button>
                    <button
                        className={`${styles.navItem} ${sidebarFilter === 'trash' ? styles.active : ''}`}
                        onClick={() => setSidebarFilter('trash')}
                    >
                        <Trash2 size={18} className={styles.navIcon} /> Trash
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${sortBy === 'lastViewed' ? styles.active : ''}`}
                                onClick={() => setSortBy('lastViewed')}
                            >
                                Last Viewed
                            </button>
                            <button
                                className={`${styles.viewBtn} ${sortBy === 'name' ? styles.active : ''}`}
                                onClick={() => setSortBy('name')}
                            >
                                Name (A-Z)
                            </button>
                        </div>

                        <button className={styles.newProjectBtn} onClick={() => setIsModalOpen(true)}>
                            <Plus size={20} /> New Project
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>Loading projects...</div>
                    ) : (
                        <div className={styles.projectGrid}>
                            {filteredProjects.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Folder size={48} className={styles.emptyIcon} />
                                    <h3>No projects found</h3>
                                    <p>Create a new project to get started</p>
                                </div>
                            ) : (
                                filteredProjects.map(project => (
                                    <div key={project.id} className={styles.projectCard} onClick={() => handleCardClick(project)}>
                                        <div className={styles.cardPreview}>
                                            {/* Preview would go here */}
                                            <div className={styles.previewPlaceholder}>
                                                {getProjectIcon(project.type)}
                                            </div>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <div className={styles.cardInfo}>
                                                <h3 className={styles.projectName}>{project.name}</h3>
                                                <p className={styles.projectMeta}>
                                                    {project.deleted ? 'Deleted' : new Date(project.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className={`${styles.starBtn} ${project.starred ? styles.starred : ''}`}
                                                    onClick={() => handleToggleStar(project)}
                                                >
                                                    <Star size={16} fill={project.starred ? "currentColor" : "none"} />
                                                </button>
                                                <div className={styles.menuWrapper}>
                                                    <button
                                                        className={styles.menuBtn}
                                                        onClick={() => setActiveProjectMenu(activeProjectMenu === project.id ? null : project.id)}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    {activeProjectMenu === project.id && (
                                                        <div className={styles.dropdownMenu} ref={menuRef}>
                                                            {project.deleted ? (
                                                                <>
                                                                    <button onClick={() => handleRestore(project)}>
                                                                        <RotateCcw size={14} /> Restore
                                                                    </button>
                                                                    <button className={styles.deleteBtn} onClick={() => handleDelete(project)}>
                                                                        <Trash size={14} /> Delete Permanently
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleRename(project)}>
                                                                        <Edit2 size={14} /> Rename
                                                                    </button>
                                                                    <button onClick={() => handleDuplicate(project)}>
                                                                        <Copy size={14} /> Duplicate
                                                                    </button>
                                                                    <button className={styles.deleteBtn} onClick={() => handleDelete(project)}>
                                                                        <Trash2 size={14} /> Move to Trash
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={createProject}
            />

            {/* Rename Modal */}
            {renameModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Rename Project</h2>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className={styles.modalInput}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button onClick={() => setRenameModalOpen(false)}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={confirmRename}>Rename</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && selectedProject && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{selectedProject.deleted ? 'Delete Permanently?' : 'Move to Trash?'}</h2>
                        <p>
                            Are you sure you want to {selectedProject.deleted ? 'delete' : 'move'}
                            <strong> {selectedProject.name} </strong>
                            {selectedProject.deleted ? 'permanently? This cannot be undone.' : 'to trash?'}
                        </p>
                        <div className={styles.modalActions}>
                            <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                            <button className={styles.deleteBtn} onClick={confirmDelete}>
                                {selectedProject.deleted ? 'Delete Forever' : 'Move to Trash'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    )
}
