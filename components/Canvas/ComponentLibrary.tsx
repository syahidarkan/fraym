'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { componentCategories } from '@/lib/componentLibrary'
import styles from './ComponentLibrary.module.css'

export default function ComponentLibrary() {
    const [selectedCategory, setSelectedCategory] = useState(componentCategories[0].name)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoriesHeight, setCategoriesHeight] = useState(250)
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const activeCategory = componentCategories.find(cat => cat.name === selectedCategory)
    const filteredComponents = activeCategory?.components.filter(comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    // Load saved categories height from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('wireframe-categories-height')
            if (saved) {
                const savedHeight = parseInt(saved)
                if (savedHeight >= 100 && savedHeight <= 500) {
                    setCategoriesHeight(savedHeight)
                }
            }
        }
    }, [])

    // Save categories height to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('wireframe-categories-height', categoriesHeight.toString())
        }
    }, [categoriesHeight])

    // Handle vertical resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return

            const containerRect = containerRef.current.getBoundingClientRect()
            const newHeight = e.clientY - containerRect.top - 80 // Subtract header height

            if (newHeight >= 100 && newHeight <= 500) {
                setCategoriesHeight(newHeight)
            }
        }

        const handleMouseUp = () => {
            setIsResizing(false)
        }

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'ns-resize'
            document.body.style.userSelect = 'none'
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isResizing])

    const handleDragStart = (e: React.DragEvent, componentId: string) => {
        e.dataTransfer.setData('componentId', componentId)
        e.dataTransfer.effectAllowed = 'copy'
    }

    // Get component description based on type
    const getComponentDescription = (type: string): string => {
        const descriptions: Record<string, string> = {
            'button': 'Interactive button element',
            'card': 'Container with border and padding',
            'navbar': 'Navigation bar with links',
            'text': 'Text label or paragraph',
            'heading': 'Large heading text',
            'input': 'Text input field',
            'checkbox': 'Checkbox with label',
            'radio': 'Radio button option',
            'select': 'Dropdown selection',
            'textarea': 'Multi-line text input',
            'table': 'Data table grid',
            'list': 'Vertical list of items',
            'image': 'Image placeholder',
            'video': 'Video player',
            'container': 'Generic container',
            'grid': '2-column grid layout',
            'section': 'Content section',
            'footer': 'Page footer',
            'sidebar': 'Side navigation panel',
            'modal': 'Popup dialog box',
            'tab': 'Tabbed interface',
            'accordion': 'Collapsible content',
            'badge': 'Small status indicator',
            'alert': 'Alert notification box',
            'progressbar': 'Progress indicator',
            'slider': 'Range slider control',
            'toggle': 'On/off switch',
            'avatar': 'User profile image',
            'divider': 'Horizontal separator',
            'breadcrumb': 'Navigation trail',
            'rectangle': 'Basic rectangle shape'
        }
        return descriptions[type] || 'UI component'
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.header}>
                <h3>Components</h3>
                <div className={styles.searchBar}>
                    <Search size={14} />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.categories} style={{ height: `${categoriesHeight}px` }}>
                {componentCategories.map((category) => {
                    const IconComponent = category.icon as any
                    return (
                        <button
                            key={category.name}
                            className={`${styles.categoryTab} ${selectedCategory === category.name ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            <IconComponent size={16} />
                            <span>{category.name}</span>
                        </button>
                    )
                })}
            </div>

            {/* Vertical Resize Handle */}
            <div
                className={styles.verticalHandle}
                onMouseDown={(e) => {
                    e.preventDefault()
                    setIsResizing(true)
                }}
            />

            <div className={styles.componentGrid}>
                {filteredComponents.length > 0 ? (
                    filteredComponents.map((component) => {
                        const IconComponent = component.icon as any
                        return (
                            <div
                                key={component.id}
                                className={styles.componentCard}
                                draggable
                                onDragStart={(e) => handleDragStart(e, component.id)}
                            >
                                <div className={styles.componentIcon}>
                                    <IconComponent size={24} />
                                </div>
                                <div className={styles.componentInfo}>
                                    <div className={styles.componentName}>{component.name}</div>
                                    <div className={styles.componentDescription}>
                                        {getComponentDescription(component.type)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className={styles.empty}>No components found</div>
                )}
            </div>
        </div>
    )
}
