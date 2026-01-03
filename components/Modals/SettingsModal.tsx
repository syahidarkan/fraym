'use client'

import React, { useState } from 'react'
import { X, Moon, Sun, Grid, Save, Download } from 'lucide-react'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [autoSave, setAutoSave] = useState(true)
    const [showGrid, setShowGrid] = useState(true)
    const [gridSize, setGridSize] = useState(20)
    const [snapToGrid, setSnapToGrid] = useState(false)
    const [exportQuality, setExportQuality] = useState<'low' | 'medium' | 'high'>('high')

    const handleSave = () => {
        const settings = {
            theme,
            autoSave,
            showGrid,
            gridSize,
            snapToGrid,
            exportQuality
        }
        localStorage.setItem('wireframe-settings', JSON.stringify(settings))
        if (typeof window !== 'undefined' && (window as any).showToast) {
            (window as any).showToast('Settings saved!', 'success')
        }
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Settings</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Theme */}
                    <div className={styles.section}>
                        <h3>Appearance</h3>
                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Theme</label>
                                <p>Choose your preferred theme</p>
                            </div>
                            <div className={styles.themeButtons}>
                                <button
                                    className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun size={16} /> Light
                                </button>
                                <button
                                    className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon size={16} /> Dark
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className={styles.section}>
                        <h3>Canvas</h3>
                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Show Grid</label>
                                <p>Display background grid on canvas</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={(e) => setShowGrid(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Grid Size</label>
                                <p>Spacing between grid lines (px)</p>
                            </div>
                            <input
                                type="number"
                                className={styles.numberInput}
                                value={gridSize}
                                onChange={(e) => setGridSize(Number(e.target.value))}
                                min="10"
                                max="100"
                            />
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Snap to Grid</label>
                                <p>Align elements to grid automatically</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={snapToGrid}
                                    onChange={(e) => setSnapToGrid(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                    {/* General */}
                    <div className={styles.section}>
                        <h3>General</h3>
                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Auto-Save</label>
                                <p>Automatically save changes</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={autoSave}
                                    onChange={(e) => setAutoSave(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.settingInfo}>
                                <label>Export Quality</label>
                                <p>Default quality for PNG exports</p>
                            </div>
                            <select
                                className={styles.select}
                                value={exportQuality}
                                onChange={(e) => setExportQuality(e.target.value as any)}
                            >
                                <option value="low">Low (Fast)</option>
                                <option value="medium">Medium</option>
                                <option value="high">High (Best)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        <Save size={16} />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}
