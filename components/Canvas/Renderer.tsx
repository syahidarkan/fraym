'use client'

import React from 'react'
import { useCanvasStore, CanvasElement, ElementType } from '@/store/canvasStore'
import styles from './Renderer.module.css'

const ElementWrapper = ({ element }: { element: CanvasElement }) => {
    const { selectElement, selectedIds } = useCanvasStore()
    const isSelected = selectedIds.includes(element.id)

    const handleMouseDown = (e: React.MouseEvent) => {
        console.log('Element MouseDown:', element.id)
        e.stopPropagation()
        selectElement(element.id, e.shiftKey)
    }

    const style: React.CSSProperties = {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        ...element.style
    }

    return (
        <div
            className={`${styles.element} ${isSelected ? styles.selected : ''}`}
            style={style}
            data-id={element.id}
        >
            {renderContent(element)}
        </div>
    )
}

const renderContent = (element: CanvasElement) => {
    const content = element.content || ''
    const lines = content.split('\n').filter(line => line.trim() !== '')

    const renderList = (items: string[], className: string) => (
        <div className={className}>
            {items.map((item, i) => (
                <div key={i} className={styles.listItem}>{item}</div>
            ))}
        </div>
    )

    switch (element.type) {
        // Basic Shapes
        case 'rectangle':
            return <div className={styles.rectangle} />
        case 'circle':
            return <div className={styles.circle} />
        case 'text':
            return <div className={styles.text}>{content}</div>
        case 'heading':
            return <div className={styles.heading}>{content}</div>
        case 'container':
            return <div className={styles.container} />

        // Navigation
        case 'navbar':
            return (
                <div className={styles.navbar}>
                    <div className={styles.navLogo}>
                        <div className={styles.logoIcon} />
                        <span className={styles.logoText}>LOGO</span>
                    </div>
                    <div className={styles.navMenu}>
                        <div className={styles.navItem}>Home</div>
                        <div className={styles.navItem}>About</div>
                        <div className={styles.navItem}>Services</div>
                        <div className={styles.navItem}>Contact</div>
                    </div>
                    <div className={styles.navActions}>
                        <button className={styles.navButton}>Login</button>
                    </div>
                </div>
            )
        case 'sidebar':
            return (
                <div className={styles.sidebar}>
                    <div className={styles.listItem}>📊 Dashboard</div>
                    <div className={styles.listItem}>📁 Projects</div>
                    <div className={styles.listItem}>⚙️ Settings</div>
                    <div className={styles.listItem}>👤 Profile</div>
                </div>
            )
        case 'breadcrumb':
            return (
                <div className={styles.breadcrumb}>
                    {lines.map((item, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className={styles.separator}>/</span>}
                            <span>{item}</span>
                        </React.Fragment>
                    ))}
                </div>
            )
        case 'tabs':
            return (
                <div className={styles.tabs}>
                    <div className={`${styles.tabItem} ${styles.active}`}>Tab 1</div>
                    <div className={styles.tabItem}>Tab 2</div>
                    <div className={styles.tabItem}>Tab 3</div>
                </div>
            )
        case 'pagination':
            return (
                <div className={styles.pagination}>
                    <div className={styles.pageItem}>&lt;</div>
                    <div className={styles.pageItem}>1</div>
                    <div className={`${styles.pageItem} ${styles.active}`}>2</div>
                    <div className={styles.pageItem}>3</div>
                    <div className={styles.pageItem}>&gt;</div>
                </div>
            )
        case 'footer':
            return (
                <div className={styles.footer}>
                    <span>© 2024 Company</span>
                    <span>•</span>
                    <span>About</span>
                    <span>•</span>
                    <span>Contact</span>
                    <span>•</span>
                    <span>Privacy</span>
                </div>
            )

        // Forms
        case 'button':
            return <button className={styles.button}>{content}</button>
        case 'input':
            return <input className={styles.input} placeholder={content} readOnly />
        case 'textarea':
            return <textarea className={styles.textarea} placeholder={content} readOnly />
        case 'checkbox':
            return (
                <div className={styles.checkboxWrapper}>
                    <div className={styles.checkbox} />
                    <span>{content}</span>
                </div>
            )
        case 'radio':
            return (
                <div className={styles.radioWrapper}>
                    <div className={styles.radio} />
                    <span>{content}</span>
                </div>
            )
        case 'select':
            return (
                <div className={styles.select}>
                    <span>{content}</span>
                    <span className={styles.chevron}>▼</span>
                </div>
            )
        case 'switch':
            return (
                <div className={styles.switchWrapper}>
                    <div className={styles.switch}><div className={styles.switchHandle} /></div>
                    <span>{content}</span>
                </div>
            )
        case 'upload':
            return (
                <div className={styles.upload}>
                    <div className={styles.uploadIcon}>☁️</div>
                    <span>{content}</span>
                </div>
            )
        case 'search':
            return (
                <div className={styles.search}>
                    <span className={styles.searchIcon}>🔍</span>
                    <span>{content}</span>
                </div>
            )

        // Layout
        case 'hero':
            return (
                <div className={styles.hero}>
                    <h1>{lines[0]}</h1>
                    <p>{lines.slice(1).join(' ')}</p>
                    <button className={styles.button}>CTA</button>
                </div>
            )
        case 'feature-grid-3':
            return (
                <div className={styles.featureGrid3}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.featureIcon} />
                            <div className={styles.featureTitle}>Feature {i}</div>
                        </div>
                    ))}
                </div>
            )
        case 'feature-grid-4':
            return (
                <div className={styles.featureGrid4}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={styles.featureCard}>
                            <div className={styles.featureIcon} />
                            <div className={styles.featureTitle}>Feature {i}</div>
                        </div>
                    ))}
                </div>
            )
        case 'card':
            return (
                <div className={styles.card}>
                    <div className={styles.cardImage} />
                    <div className={styles.cardContent}>
                        <div className={styles.cardTitle}>{lines[0] || 'Card Title'}</div>
                        <div className={styles.cardText}>{lines.slice(1).join(' ') || 'Card description goes here.'}</div>
                    </div>
                </div>
            )
        case 'section':
            return (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>{lines[0] || 'Section Title'}</div>
                    <div className={styles.sectionContent}>{lines.slice(1).join(' ') || 'Content area'}</div>
                </div>
            )

        // Data Display
        case 'table':
            return (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <div>Col 1</div><div>Col 2</div><div>Col 3</div>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.tableRow}>
                            <div>Data {i}.1</div><div>Data {i}.2</div><div>Data {i}.3</div>
                        </div>
                    ))}
                </div>
            )
        case 'list':
            return renderList(lines, styles.list)
        case 'stats':
            return (
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>1,234</div>
                        <div className={styles.statLabel}>Total Users</div>
                    </div>
                </div>
            )
        case 'pricing':
            return (
                <div className={styles.pricing}>
                    <div className={styles.pricingTitle}>{lines[0]}</div>
                    <div className={styles.pricingPrice}>{lines[1]}</div>
                    <div className={styles.pricingFeatures}>
                        {lines.slice(2).map((l, i) => <div key={i}>✓ {l}</div>)}
                    </div>
                    <button className={styles.button}>Select</button>
                </div>
            )
        case 'timeline':
            return (
                <div className={styles.timeline}>
                    {lines.map((line, i) => (
                        <div key={i} className={styles.timelineItem}>
                            <div className={styles.timelineDot} />
                            <div className={styles.timelineContent}>{line}</div>
                        </div>
                    ))}
                </div>
            )

        // Media
        case 'image':
            return element.content && element.content.startsWith('http') ? (
                <img src={element.content} alt="Upload" className={styles.image} draggable={false} />
            ) : (
                <div className={styles.imagePlaceholder}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
            )
        case 'video':
            return (
                <div className={styles.videoPlaceholder}>
                    <div className={styles.playIcon}>▶</div>
                    <span>{content}</span>
                </div>
            )
        case 'avatar':
            return <div className={styles.avatar}>👤</div>
        case 'icon':
            return <div className={styles.icon}>{content}</div>
        case 'gallery':
            return (
                <div className={styles.gallery}>
                    {[1, 2, 3, 4].map(i => <div key={i} className={styles.galleryItem} />)}
                </div>
            )

        // Interactive
        case 'modal':
            return (
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>{lines[0]}</div>
                    <div className={styles.modalBody}>{lines.slice(1).join(' ')}</div>
                    <div className={styles.modalFooter}>
                        <button className={styles.button}>Confirm</button>
                    </div>
                </div>
            )
        case 'tooltip':
            return <div className={styles.tooltip}>{content}</div>
        case 'accordion':
            return (
                <div className={styles.accordion}>
                    {lines.map((line, i) => (
                        <div key={i} className={styles.accordionItem}>
                            <div className={styles.accordionHeader}>
                                <span>{line}</span>
                                <span>▼</span>
                            </div>
                        </div>
                    ))}
                </div>
            )
        case 'alert':
            return (
                <div className={styles.alert}>
                    <span className={styles.alertIcon}>⚠️</span>
                    <span>{content}</span>
                </div>
            )
        case 'badge':
            return <div className={styles.badge}>{content}</div>
        case 'progress':
            return (
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '70%' }}></div>
                </div>
            )


        // Advanced Forms
        case 'datepicker':
            return (
                <div className={styles.datepicker}>
                    <div className={styles.pickerHeader}>{lines[0] || '📅 Select Date'}</div>
                    <div className={styles.calendarGrid}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className={styles.calendarDay}>{d}</div>
                        ))}
                    </div>
                </div>
            )
        case 'timepicker':
            return <div className={styles.timepicker}>{content}</div>
        case 'colorpicker':
            return (
                <div className={styles.colorpicker}>
                    <div className={styles.colorGrid}>
                        {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'].map((color, i) => (
                            <div key={i} className={styles.colorSwatch} style={{ background: color }} />
                        ))}
                    </div>
                    <div className={styles.colorValue}>{lines[lines.length - 1] || '#3B82F6'}</div>
                </div>
            )
        case 'slider':
            return (
                <div className={styles.slider}>
                    <div className={styles.sliderTrack}>
                        <div className={styles.sliderFill} style={{ width: '50%' }} />
                        <div className={styles.sliderThumb} style={{ left: '50%' }} />
                    </div>
                    <span className={styles.sliderValue}>{content || '50'}</span>
                </div>
            )
        case 'multiselect':
            return <div className={styles.multiselect}>{content} </div>
        case 'autocomplete':
            return <div className={styles.autocomplete}>🔍 {content}</div>
        case 'rating':
            return <div className={styles.rating}>{content}</div>
        case 'togglegroup':
            return (
                <div className={styles.togglegroup}>
                    {lines[0]?.split(' ').map((btn, i) => (
                        <div key={i} className={`${styles.toggleBtn} ${btn.includes('[') ? styles.active : ''}`}>
                            {btn.replace(/[\[\]]/g, '')}
                        </div>
                    ))}
                </div>
            )
        case 'otpinput':
            return (
                <div className={styles.otpinput}>
                    {content.split(' ').map((char, i) => (
                        <div key={i} className={styles.otpBox}>{char !== '□' ? char : ''}</div>
                    ))}
                </div>
            )

        // Advanced Navigation
        case 'megamenu':
            return (
                <div className={styles.megamenu}>
                    <div className={styles.megaHeader}>Products</div>
                    <div className={styles.megaBody}>
                        <div>Category 1</div>
                        <div>Category 2</div>
                        <div>Category 3</div>
                    </div>
                </div>
            )
        case 'dropdown':
            return (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownItem}>Option 1</div>
                    <div className={styles.dropdownItem}>Option 2</div>
                    <div className={styles.dropdownItem}>Option 3</div>
                </div>
            )
        case 'contextmenu':
            return (
                <div className={styles.contextmenu}>
                    <div className={styles.contextItem}>✂️ Cut</div>
                    <div className={styles.contextItem}>📋 Copy</div>
                    <div className={styles.contextItem}>📄 Paste</div>
                    <div className={styles.menuDivider} />
                    <div className={styles.contextItem}>🗑️ Delete</div>
                </div>
            )
        case 'stepper':
            return (
                <div className={styles.stepper}>
                    <div className={styles.stepItem}>
                        <div className={styles.stepCircle}>1</div>
                    </div>
                    <div className={styles.stepLine} />
                    <div className={styles.stepItem}>
                        <div className={styles.stepCircle}>2</div>
                    </div>
                    <div className={styles.stepLine} />
                    <div className={styles.stepItem}>
                        <div className={styles.stepCircle}>3</div>
                    </div>
                </div>
            )
        case 'commandpalette':
            return (
                <div className={styles.commandpalette}>
                    <div className={styles.commandInput}>{content}</div>
                    <div className={styles.commandResults}>
                        <div className={styles.commandItem}>New File</div>
                        <div className={styles.commandItem}>Open Project</div>
                    </div>
                </div>
            )
        case 'bottomnav':
            return (
                <div className={styles.bottomnav}>
                    <div className={styles.bottomnavItem}>🏠<br />Home</div>
                    <div className={styles.bottomnavItem}>🔍<br />Search</div>
                    <div className={styles.bottomnavItem}>➕<br />Add</div>
                    <div className={styles.bottomnavItem}>👤<br />Profile</div>
                </div>
            )
        case 'fab':
            return <div className={styles.fab}>+</div>

        // Feedback & Loading
        case 'toast':
            return (
                <div className={styles.toast}>
                    <span>✓</span>
                    <span>Success! Changes saved.</span>
                </div>
            )
        case 'snackbar':
            return (
                <div className={styles.snackbar}>
                    <span>Item deleted</span>
                    <button style={{ background: 'transparent', border: 'none', color: '#0d99ff', cursor: 'pointer' }}>UNDO</button>
                </div>
            )
        case 'skeleton':
            return (
                <div className={styles.skeleton}>
                    <div className={styles.skeletonLine} style={{ width: '100%' }} />
                    <div className={styles.skeletonLine} style={{ width: '80%' }} />
                    <div className={styles.skeletonLine} style={{ width: '60%' }} />
                </div>
            )
        case 'spinner':
            return (
                <div className={styles.spinner}>
                    <div className={styles.spinnerCircle} />
                </div>
            )
        case 'emptystate':
            return (
                <div className={styles.emptystate}>
                    <div className={styles.emptyIcon}>📭</div>
                    <div>No items found</div>
                    <div className={styles.emptyAction}>
                        <button className={styles.button}>Add New Item</button>
                    </div>
                </div>
            )

        // Advanced Layout
        case 'carousel':
            return (
                <div className={styles.carousel}>
                    <div className={styles.carouselPrev}>‹</div>
                    <div className={styles.carouselContent}>{content.replace(/[<>]/g, '')}</div>
                    <div className={styles.carouselNext}>›</div>
                </div>
            )
        case 'splitpane':
            return (
                <div className={styles.splitpane}>
                    {content.split('|').map((pane, i) => (
                        <div key={i} className={styles.pane}>{pane.trim()}</div>
                    ))}
                    <div className={styles.splitter} />
                </div>
            )
        case 'kanban':
            return (
                <div className={styles.kanban}>
                    {content.split('|').map((col, i) => (
                        <div key={i} className={styles.kanbanColumn}>
                            <div className={styles.kanbanHeader}>{col.trim()}</div>
                            <div className={styles.kanbanCard}>Task 1</div>
                            <div className={styles.kanbanCard}>Task 2</div>
                        </div>
                    ))}
                </div>
            )

        default:
            return <div className={styles.default}>{element.type}</div>
    }
}

export default function Renderer() {
    const elements = useCanvasStore((state) => state.elements)

    return (
        <>
            {Object.values(elements)
                .filter(el => el.visible !== false)
                .map((el) => (
                    <ElementWrapper key={el.id} element={el} />
                ))}
        </>
    )
}
