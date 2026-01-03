'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Layout, Users, Folder, LogOut, Trash2, Shield, Bell, Plus } from 'lucide-react'
import styles from '../Admin.module.css'

interface User { id: string; name: string; email: string; role: string; createdAt: string; }
interface Project { id: string; name: string; userId: string; type: string; createdAt: string; }
interface Notification { id: string; title: string; message: string; type: 'info' | 'warning' | 'success'; createdAt: string; }

export default function AdminDashboard() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])

    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'notifications'>('overview')
    const [loading, setLoading] = useState(true)
    const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info' })

    // Multi-select state
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
    const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const userStr = localStorage.getItem('wireframe_user')
        if (!userStr) { router.push('/login'); return; }
        const user = JSON.parse(userStr)
        if (user.role !== 'admin') { router.push('/dashboard'); return; }
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            // Mock data for now since API routes might be disabled/mocked
            // In a real app, these would be actual API calls
            const mockUsers = [
                { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() },
                { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date().toISOString() },
                { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date().toISOString() },
            ]
            const mockProjects = [
                { id: '1', name: 'E-commerce App', userId: '2', type: 'WIREFRAME', createdAt: new Date().toISOString() },
                { id: '2', name: 'Portfolio Site', userId: '3', type: 'DESIGN_THINKING', createdAt: new Date().toISOString() },
            ]

            setUsers(mockUsers)
            setProjects(mockProjects)
            setNotifications([])

        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    // User Selection Logic
    const handleSelectUser = (id: string) => {
        const newSelected = new Set(selectedUserIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedUserIds(newSelected)
    }

    const handleSelectAllUsers = () => {
        if (selectedUserIds.size === users.length) {
            setSelectedUserIds(new Set())
        } else {
            setSelectedUserIds(new Set(users.map(u => u.id)))
        }
    }

    // Project Selection Logic
    const handleSelectProject = (id: string) => {
        const newSelected = new Set(selectedProjectIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedProjectIds(newSelected)
    }

    const handleSelectAllProjects = () => {
        if (selectedProjectIds.size === projects.length) {
            setSelectedProjectIds(new Set())
        } else {
            setSelectedProjectIds(new Set(projects.map(p => p.id)))
        }
    }

    // Bulk Actions
    const handleBulkDeleteUsers = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedUserIds.size} users?`)) return

        // In a real app, you'd call an API here
        // await fetch('/api/admin/users/bulk-delete', { method: 'POST', body: JSON.stringify({ ids: Array.from(selectedUserIds) }) })

        setUsers(users.filter(u => !selectedUserIds.has(u.id)))
        setSelectedUserIds(new Set())
    }

    const handleBulkDeleteProjects = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedProjectIds.size} projects?`)) return

        // In a real app, you'd call an API here

        setProjects(projects.filter(p => !selectedProjectIds.has(p.id)))
        setSelectedProjectIds(new Set())
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        setUsers(users.filter(u => u.id !== id))
    }

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return
        setProjects(projects.filter(p => p.id !== id))
    }

    const handleLogout = () => { localStorage.removeItem('wireframe_user'); router.push('/login'); }

    const handleCreateNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        const notif: Notification = {
            id: Date.now().toString(),
            ...newNotif,
            createdAt: new Date().toISOString()
        } as Notification
        setNotifications([...notifications, notif])
        setNewNotif({ title: '', message: '', type: 'info' })
    }

    const handleDeleteNotification = async (id: string) => {
        if (!confirm('Delete this notification?')) return;
        setNotifications(notifications.filter(n => n.id !== id));
    }

    if (loading) return <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Link href="/landing" className={styles.logo}>
                    <Shield size={20} /> <span>Admin Panel</span>
                </Link>
                <nav className={styles.nav}>
                    <button className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('overview')}><Layout size={18} /> Overview</button>
                    <button className={`${styles.navItem} ${activeTab === 'users' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('users')}><Users size={18} /> Users</button>
                    <button className={`${styles.navItem} ${activeTab === 'projects' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('projects')}><Folder size={18} /> Projects</button>
                    <button className={`${styles.navItem} ${activeTab === 'notifications' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('notifications')}><Bell size={18} /> Notifications</button>
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <button className={styles.navItem} onClick={handleLogout}><LogOut size={18} /> Logout</button>
                </div>
            </div>

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                </div>

                {activeTab === 'overview' && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}><div className={styles.statValue}>{users.length}</div><div className={styles.statLabel}>Total Users</div></div>
                        <div className={styles.statCard}><div className={styles.statValue}>{projects.length}</div><div className={styles.statLabel}>Total Projects</div></div>
                        <div className={styles.statCard}><div className={styles.statValue}>{notifications.length}</div><div className={styles.statLabel}>Active Notifications</div></div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>User Management</span>
                            {selectedUserIds.size > 0 && (
                                <div className={styles.bulkActions}>
                                    <span style={{ fontSize: '13px', color: '#4b5563' }}>{selectedUserIds.size} selected</span>
                                    <button className={styles.bulkDeleteBtn} onClick={handleBulkDeleteUsers}>
                                        <Trash2 size={14} /> Delete Selected
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={users.length > 0 && selectedUserIds.size === users.length}
                                                onChange={handleSelectAllUsers}
                                            />
                                        </th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} style={{ background: selectedUserIds.has(user.id) ? '#f9fafb' : 'transparent' }}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={selectedUserIds.has(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                />
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`${styles.roleTag} ${user.role === 'admin' ? styles.roleAdmin : styles.roleUser}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className={styles.actionButton} onClick={() => handleDeleteUser(user.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>Project Management</span>
                            {selectedProjectIds.size > 0 && (
                                <div className={styles.bulkActions}>
                                    <span style={{ fontSize: '13px', color: '#4b5563' }}>{selectedProjectIds.size} selected</span>
                                    <button className={styles.bulkDeleteBtn} onClick={handleBulkDeleteProjects}>
                                        <Trash2 size={14} /> Delete Selected
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={projects.length > 0 && selectedProjectIds.size === projects.length}
                                                onChange={handleSelectAllProjects}
                                            />
                                        </th>
                                        <th>Project Name</th>
                                        <th>Type</th>
                                        <th>Owner ID</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => (
                                        <tr key={project.id} style={{ background: selectedProjectIds.has(project.id) ? '#f9fafb' : 'transparent' }}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={selectedProjectIds.has(project.id)}
                                                    onChange={() => handleSelectProject(project.id)}
                                                />
                                            </td>
                                            <td>{project.name}</td>
                                            <td>
                                                <span className={styles.roleTag} style={{ background: '#f3f4f6', color: '#4b5563' }}>
                                                    {project.type}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{project.userId}</td>
                                            <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Link
                                                        href={
                                                            project.type === 'WIREFRAME' ? `/project/${project.id}` :
                                                                project.type === 'DESIGN_THINKING' ? `/design-thinking/${project.id}` :
                                                                    `/diagram/${project.id}`
                                                        }
                                                        target="_blank"
                                                        className={styles.actionButton}
                                                        style={{ color: '#4338ca', borderColor: '#e0e7ff', background: '#e0e7ff' }}
                                                        title="Open Project"
                                                    >
                                                        <Folder size={16} />
                                                    </Link>
                                                    <button className={styles.actionButton} onClick={() => handleDeleteProject(project.id)} title="Delete Project">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>System Notifications</div>
                        <div className={styles.formSection}>
                            <form onSubmit={handleCreateNotification}>
                                <h4 style={{ marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', color: '#4b5563', fontWeight: 600 }}>Create New Notification</h4>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <input
                                        type="text"
                                        placeholder="Notification Title"
                                        value={newNotif.title}
                                        onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                    <textarea
                                        placeholder="Message"
                                        value={newNotif.message}
                                        onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                                        className={styles.input}
                                        style={{ minHeight: '80px', resize: 'vertical' }}
                                        required
                                    />
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <select
                                            value={newNotif.type}
                                            onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value as any })}
                                            className={styles.input}
                                            style={{ width: 'auto' }}
                                        >
                                            <option value="info">Info</option>
                                            <option value="warning">Warning</option>
                                            <option value="success">Success</option>
                                        </select>
                                        <button type="submit" className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>
                                            <Plus size={16} /> Send Notification
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead><tr><th>Title</th><th>Message</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {notifications.map(notif => (
                                        <tr key={notif.id}>
                                            <td>{notif.title}</td>
                                            <td>{notif.message}</td>
                                            <td>
                                                <span
                                                    className={styles.roleTag}
                                                    style={{
                                                        background: notif.type === 'warning' ? '#fef3c7' : notif.type === 'success' ? '#dcfce7' : '#e0e7ff',
                                                        color: notif.type === 'warning' ? '#92400e' : notif.type === 'success' ? '#166534' : '#4338ca'
                                                    }}
                                                >
                                                    {notif.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className={styles.actionButton} onClick={() => handleDeleteNotification(notif.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
