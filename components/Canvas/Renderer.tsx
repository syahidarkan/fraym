'use client'

import React from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import styles from './Renderer.module.css'

const ElementWrapper = ({ element }: { element: any }) => {
    const { selectElement, selectedIds } = useCanvasStore()
    const isSelected = selectedIds.includes(element.id)

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        selectElement(element.id, e.shiftKey)
    }

    const style = {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
    }

    return (
        <div
            className={`${styles.element} ${isSelected ? styles.selected : ''}`}
            style={style}
            onMouseDown={handleMouseDown}
        >
            {renderContent(element)}
        </div>
    )
}

const renderContent = (element: any) => {
    switch (element.type) {
        case 'rectangle':
            return <div className={styles.rectangle} />
        case 'circle':
            return <div className={styles.circle} />
        case 'image':
            return element.content ? (
                <img src={element.content} alt="User upload" className={styles.image} draggable={false} />
            ) : (
                <div className={styles.imagePlaceholder}>
                    <span>Image</span>
                </div>
            )
        case 'text':
            return <div className={styles.text}>{element.content}</div>
        case 'button':
            return <button className={styles.button}>{element.content}</button>
        case 'input':
            return <input className={styles.input} placeholder="Input" readOnly />
        case 'card':
            return <div className={styles.card} />
        default:
            return null
    }
}

export default function Renderer() {
    const elements = useCanvasStore((state) => state.elements)

    return (
        <>
            {Object.values(elements).map((el) => (
                <ElementWrapper key={el.id} element={el} />
            ))}
        </>
    )
}
