'use client'

import React, { useState, useRef } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './WireframeScanner.module.css'

interface ScanResult {
    type: string
    x: number
    y: number
    width: number
    height: number
    content?: string
    zIndex?: number
}

export default function WireframeScanner({ onClose }: { onClose: () => void }) {
    const [image, setImage] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<ScanResult[] | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)

    const { addElement } = useCanvasStore()

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setImage(event.target?.result as string)
            setError(null)
        }
        reader.readAsDataURL(file)
    }

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setImage(event.target?.result as string)
            setError(null)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    // Start camera capture
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsCameraActive(true)
                setError(null)
            }
        } catch (err) {
            setError('Failed to access camera. Please check permissions.')
            console.error('Camera error:', err)
        }
    }

    // Capture photo from camera
    const capturePhoto = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0)
            const dataUrl = canvas.toDataURL('image/jpeg')
            setImage(dataUrl)
            stopCamera()
        }
    }

    // Stop camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach((track) => track.stop())
            videoRef.current.srcObject = null
            setIsCameraActive(false)
        }
    }

    // Scan wireframe using FREE client-side processing
    const scanWireframe = async () => {
        if (!image) return

        setIsScanning(true)
        setError(null)
        setResults(null)

        try {
            // Convert dataURL to File
            const res = await fetch(image)
            const blob = await res.blob()
            const file = new File([blob], "wireframe.jpg", { type: "image/jpeg" })

            // Dynamic import to avoid loading processor until needed
            const { processWireframeImage } = await import('@/lib/wireframeProcessor')

            // Process image entirely in the browser - 100% FREE!
            const elements = await processWireframeImage(file)

            // Convert to result format
            const formattedResults = elements.map(el => ({
                type: el.type,
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                content: el.content,
            }))

            setResults(formattedResults)
        } catch (err: any) {
            setError(err.message || 'Failed to scan wireframe')
            console.error('Scan error:', err)
        } finally {
            setIsScanning(false)
        }
    }

    // Add scanned elements to canvas
    const addToCanvas = () => {
        if (!results) return

        results.forEach((result) => {
            // Store expects: addElement(type, x, y, customProps)
            addElement(
                result.type as any,
                result.x,
                result.y,
                {
                    width: result.width,
                    height: result.height,
                    content: result.content || '',
                    zIndex: result.zIndex || 1,
                }
            )
        })

        onClose()
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>📸 Scan Wireframe (100% FREE!)</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.infoBanner}>
                        ✨ Free computer vision processing - runs entirely in your browser!
                    </div>

                    {!image && !isCameraActive && (
                        <div
                            className={styles.uploadArea}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={styles.uploadIcon}>📷</div>
                            <p>Drop wireframe image here</p>
                            <p className={styles.uploadSubtext}>
                                or click to browse
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}

                    {isCameraActive && (
                        <div className={styles.cameraView}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className={styles.video}
                            />
                            <div className={styles.cameraControls}>
                                <button
                                    className={styles.captureBtn}
                                    onClick={capturePhoto}
                                >
                                    📷 Capture
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={stopCamera}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {image && !isCameraActive && (
                        <div className={styles.preview}>
                            <img
                                src={image}
                                alt="Wireframe preview"
                                className={styles.previewImage}
                            />
                            <button
                                className={styles.removeBtn}
                                onClick={() => setImage(null)}
                            >
                                ✕ Remove
                            </button>
                        </div>
                    )}

                    {error && <div className={styles.error}>⚠️ {error}</div>}

                    {results && (
                        <div className={styles.results}>
                            <h3>✅ Found {results.length} elements</h3>
                            <div className={styles.elementsList}>
                                {results.map((el, i) => (
                                    <div key={i} className={styles.elementItem}>
                                        <span className={styles.elementType}>
                                            {el.type}
                                        </span>
                                        <span className={styles.elementPos}>
                                            {el.width}×{el.height} @ ({el.x},{' '}
                                            {el.y})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    {!image && !isCameraActive && (
                        <button
                            className={styles.cameraButton}
                            onClick={startCamera}
                        >
                            📷 Use Camera
                        </button>
                    )}

                    {image && !results && (
                        <button
                            className={styles.scanBtn}
                            onClick={scanWireframe}
                            disabled={isScanning}
                        >
                            {isScanning ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Scanning...
                                </>
                            ) : (
                                <>🔍 Scan Wireframe</>
                            )}
                        </button>
                    )}

                    {results && (
                        <button className={styles.addBtn} onClick={addToCanvas}>
                            ✨ Add to Canvas
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
