'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiStorage } from '@/lib/apiStorage'
import DiagramEditor from '@/components/DiagramEditor/DiagramEditor'
import styles from './page.module.css'

export default function DiagramPage() {
    const params = useParams()
    const projectId = params.id as string

    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            if (projectId) {
                const foundProject = await apiStorage.getProject(projectId)
                setProject(foundProject)
            }
            setLoading(false)
        }
        fetchProject()
    }, [projectId])

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading diagram...</p>
            </div>
        )
    }

    if (!project) {
        return (
            <div className={styles.error}>
                <h2>Project not found</h2>
                <p>The diagram project you're looking for doesn't exist.</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <DiagramEditor project={project} />
        </div>
    )
}
