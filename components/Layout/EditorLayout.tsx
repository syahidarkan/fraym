'use client'

import React, { useState } from 'react'
import styles from './EditorLayout.module.css'
import ComponentLibrary from '../Canvas/ComponentLibrary'
import PropertyPanel from '../Properties/PropertyPanel'
import Canvas from '../Canvas/Canvas'
import FigmaStyleToolbar from './FigmaStyleToolbar'
import LayersPanel from '../Panels/LayersPanel'
import DevicePresets from '../Canvas/DevicePresets'
import ClientOnly from '../ClientOnly'
import ResizablePanel from '../Shared/ResizablePanel'
import { ToastContainer } from '../Shared/Toast'

type ToastType = 'success' | 'error' | 'info'
interface ToastMessage {
    id: string
    message: string
    type: ToastType
}

export default function EditorLayout() {
    const [activeLeftTab, setActiveLeftTab] = useState<'layers' | 'assets' | 'devices'>('devices')
    const [zoom, setZoom] = useState(1)
    const [activeTool, setActiveTool] = useState('move')
    const [isPreview, setIsPreview] = useState(false)
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5))
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1))
    const handleResetZoom = () => setZoom(1)

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now().toString()
        setToasts(prev => [...prev, { id, message, type }])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    // Make addToast available globally for FigmaStyleToolbar
    if (typeof window !== 'undefined') {
        (window as any).showToast = addToast
    }

    return (
        <div className={styles.container}>
            {!isPreview && (
                <div className={styles.topBar}>
                    <FigmaStyleToolbar
                        zoom={zoom}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onResetZoom={handleResetZoom}
                        activeTool={activeTool}
                        onToolChange={setActiveTool}
                        onPreviewToggle={() => setIsPreview(!isPreview)}
                    />
                </div>
            )}

            <div className={styles.workspace}>
                {!isPreview && (
                    <ResizablePanel
                        defaultWidth={240}
                        minWidth={200}
                        maxWidth={400}
                        storageKey="wireframe-sidebar-width"
                    >
                        <div className={styles.leftSidebar}>
                            <div className={styles.leftTabs}>
                                <button
                                    className={`${styles.tab} ${activeLeftTab === 'devices' ? styles.active : ''}`}
                                    onClick={() => setActiveLeftTab('devices')}
                                >
                                    Devices
                                </button>
                                <button
                                    className={`${styles.tab} ${activeLeftTab === 'layers' ? styles.active : ''}`}
                                    onClick={() => setActiveLeftTab('layers')}
                                >
                                    Layers
                                </button>
                                <button
                                    className={`${styles.tab} ${activeLeftTab === 'assets' ? styles.active : ''}`}
                                    onClick={() => setActiveLeftTab('assets')}
                                >
                                    Assets
                                </button>
                            </div>
                            <div className={styles.leftContent}>
                                {activeLeftTab === 'devices' && <DevicePresets />}
                                {activeLeftTab === 'layers' && <LayersPanel />}
                                {activeLeftTab === 'assets' && <ComponentLibrary />}
                            </div>
                        </div>
                    </ResizablePanel>
                )}

                <div className={styles.canvasArea}>
                    <ClientOnly>
                        <Canvas zoom={zoom} activeTool={activeTool} />
                    </ClientOnly>
                    {isPreview && (
                        <button
                            className={styles.exitPreviewButton}
                            onClick={() => setIsPreview(false)}
                        >
                            Exit Preview
                        </button>
                    )}
                </div>

                {!isPreview && (
                    <div className={styles.rightSidebar}>
                        <PropertyPanel />
                    </div>
                )}
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    )
}
