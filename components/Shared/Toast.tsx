'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import styles from './Toast.module.css'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for animation
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        info: <Info size={20} />
    }

    return (
        <div className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
            <div className={styles.icon}>{icons[type]}</div>
            <div className={styles.message}>{message}</div>
            <button className={styles.closeButton} onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
            }}>
                <X size={16} />
            </button>
        </div>
    )
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }: {
    toasts: Array<{ id: string; message: string; type: ToastType }>,
    removeToast: (id: string) => void
}) {
    return (
        <div className={styles.container}>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    )
}
