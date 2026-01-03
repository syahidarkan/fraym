'use client'

import React from 'react'
import { Smartphone, Tablet, Monitor, Laptop, Plus } from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './DevicePresets.module.css'

interface DevicePreset {
    name: string
    width: number
    height: number
    icon: React.ReactNode
    category: 'mobile' | 'tablet' | 'desktop'
}

const devicePresets: DevicePreset[] = [
    // Mobile
    { name: 'iPhone 14 Pro', width: 393, height: 852, icon: <Smartphone size={20} />, category: 'mobile' },
    { name: 'iPhone SE', width: 375, height: 667, icon: <Smartphone size={20} />, category: 'mobile' },
    { name: 'Samsung S21', width: 360, height: 800, icon: <Smartphone size={20} />, category: 'mobile' },
    { name: 'Pixel 7', width: 412, height: 915, icon: <Smartphone size={20} />, category: 'mobile' },

    // Tablet
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: <Tablet size={20} />, category: 'tablet' },
    { name: 'iPad Air', width: 820, height: 1180, icon: <Tablet size={20} />, category: 'tablet' },
    { name: 'iPad Mini', width: 744, height: 1133, icon: <Tablet size={20} />, category: 'tablet' },
    { name: 'Samsung Tab S8', width: 800, height: 1280, icon: <Tablet size={20} />, category: 'tablet' },

    // Desktop
    { name: 'Laptop 13"', width: 1280, height: 800, icon: <Laptop size={20} />, category: 'desktop' },
    { name: 'Laptop 15"', width: 1440, height: 900, icon: <Laptop size={20} />, category: 'desktop' },
    { name: 'Desktop HD', width: 1920, height: 1080, icon: <Monitor size={20} />, category: 'desktop' },
    { name: 'Desktop 2K', width: 2560, height: 1440, icon: <Monitor size={20} />, category: 'desktop' },
    { name: 'Desktop 4K', width: 3840, height: 2160, icon: <Monitor size={20} />, category: 'desktop' },
]

export default function DevicePresets() {
    const { addElement } = useCanvasStore()
    const [activeCategory, setActiveCategory] = React.useState<'mobile' | 'tablet' | 'desktop'>('mobile')
    const [customWidth, setCustomWidth] = React.useState('1024')
    const [customHeight, setCustomHeight] = React.useState('768')

    const handleDeviceClick = (preset: DevicePreset) => {
        addElement('rectangle', 100, 100, {
            width: preset.width,
            height: preset.height,
            content: preset.name,
            type: 'rectangle',
            x: 100,
            y: 100,
            style: {
                backgroundColor: '#ffffff',
                borderColor: '#d0d7de',
                borderWidth: '2px'
            }
        })
    }

    const handleCustomFrame = () => {
        const width = parseInt(customWidth) || 1024
        const height = parseInt(customHeight) || 768

        addElement('rectangle', 100, 100, {
            width,
            height,
            content: `Custom ${width}×${height}`,
            type: 'rectangle',
            x: 100,
            y: 100,
            style: {
                backgroundColor: '#ffffff',
                borderColor: '#0969da',
                borderWidth: '2px'
            }
        })
    }

    const filteredPresets = devicePresets.filter(p => p.category === activeCategory)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Device Frames</h3>
            </div>

            <div className={styles.customFrame}>
                <label className={styles.customLabel}>Custom Size</label>
                <div className={styles.customInputs}>
                    <input
                        type="number"
                        placeholder="Width (px)"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className={styles.customInput}
                    />
                    <input
                        type="number"
                        placeholder="Height (px)"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className={styles.customInput}
                    />
                </div>
                <button onClick={handleCustomFrame} className={styles.customButton}>
                    <Plus size={16} />
                    Add Custom Frame
                </button>
            </div>

            <div className={styles.categories}>
                <button
                    className={`${styles.categoryBtn} ${activeCategory === 'mobile' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('mobile')}
                >
                    <Smartphone size={16} />
                    Mobile
                </button>
                <button
                    className={`${styles.categoryBtn} ${activeCategory === 'tablet' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('tablet')}
                >
                    <Tablet size={16} />
                    Tablet
                </button>
                <button
                    className={`${styles.categoryBtn} ${activeCategory === 'desktop' ? styles.active : ''}`}
                    onClick={() => setActiveCategory('desktop')}
                >
                    <Monitor size={16} />
                    Desktop
                </button>
            </div>

            <div className={styles.presetList}>
                {filteredPresets.map((preset, index) => (
                    <button
                        key={index}
                        className={styles.presetCard}
                        onClick={() => handleDeviceClick(preset)}
                        title={`${preset.width}x${preset.height}`}
                    >
                        <div className={styles.presetIcon}>
                            {preset.icon}
                        </div>
                        <div className={styles.presetInfo}>
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetSize}>{preset.width} × {preset.height}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
