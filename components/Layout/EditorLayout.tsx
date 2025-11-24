'use client'

import React from 'react'
import Canvas from '../Canvas/Canvas'
import ComponentLibrary from '../Toolbar/ComponentLibrary'
import PropertyPanel from '../Properties/PropertyPanel'
import TopBar from './TopBar'
import styles from './EditorLayout.module.css'

export default function EditorLayout() {
    return (
        <div className={styles.container}>
            <div className={styles.layoutColumn}>
                <TopBar />
                <div className={styles.workspace}>
                    <aside className={styles.sidebar}>
                        <ComponentLibrary />
                    </aside>
                    <main className={styles.main} id="canvas-workspace">
                        <Canvas />
                    </main>
                    <aside className={styles.properties}>
                        <PropertyPanel />
                    </aside>
                </div>
            </div>
        </div>
    )
}
