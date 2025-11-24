'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Layout } from 'lucide-react'
import styles from './Dashboard.module.css'
import Modal from '@/components/UI/Modal'

interface Project {
  id: string
  name: string
  updatedAt: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])

  const createProject = async () => {
    if (!projectName.trim()) return

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName })
    })
    const project = await res.json()
    router.push(`/project/${project.id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <Layout size={32} className={styles.brandIcon} />
          <h1>Wireframe Builder</h1>
        </div>
        <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Layout size={64} />
          </div>
          <h2>No projects yet</h2>
          <p>Create your first wireframe project to get started.</p>
          <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
            Create Project
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map(project => (
            <div
              key={project.id}
              className={styles.card}
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <div className={styles.icon}>
                <FileText size={32} />
              </div>
              <div className={styles.info}>
                <h3>{project.name}</h3>
                <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <div className={styles.modalContent}>
          <label>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome App"
            className={styles.input}
            autoFocus
          />
          <div className={styles.modalActions}>
            <button onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
            <button onClick={createProject} className={styles.submitBtn}>Create</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
