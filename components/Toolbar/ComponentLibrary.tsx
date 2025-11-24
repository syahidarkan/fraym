'use client'

import React from 'react'
import { Square, Circle, Type, MousePointer2, Image as ImageIcon, CreditCard, LayoutTemplate } from 'lucide-react'
import styles from './ComponentLibrary.module.css'
import { ElementType } from '@/store/canvasStore'

const DraggableItem = ({ type, icon: Icon, label }: { type: ElementType, icon: any, label: string }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('elementType', type)
    }

    return (
        <div
            className={styles.item}
            draggable
            onDragStart={handleDragStart}
        >
            <Icon size={20} />
            <span>{label}</span>
        </div>
    )
}

export default function ComponentLibrary() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Components</h2>
            </div>
            <div className={styles.grid}>
                <DraggableItem type="rectangle" icon={Square} label="Rectangle" />
                <DraggableItem type="circle" icon={Circle} label="Circle" />
                <DraggableItem type="text" icon={Type} label="Text" />
                <DraggableItem type="button" icon={MousePointer2} label="Button" />
                <DraggableItem type="input" icon={LayoutTemplate} label="Input" />
                <DraggableItem type="card" icon={CreditCard} label="Card" />
                <DraggableItem type="image" icon={ImageIcon} label="Image" />
            </div>
        </div>
    )
}
