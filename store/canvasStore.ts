import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type ElementType =
    | 'rectangle' | 'circle' | 'text' | 'button' | 'image' | 'card' | 'input'
    | 'heading' | 'container' | 'navbar' | 'sidebar' | 'breadcrumb' | 'tabs' | 'pagination' | 'footer'
    | 'textarea' | 'checkbox' | 'radio' | 'select' | 'switch' | 'upload' | 'search'
    | 'hero' | 'feature-grid-3' | 'feature-grid-4' | 'section'
    | 'table' | 'list' | 'stats' | 'pricing' | 'timeline'
    | 'video' | 'avatar' | 'icon' | 'gallery'
    | 'modal' | 'tooltip' | 'accordion' | 'alert' | 'badge' | 'progress'
    | 'datepicker' | 'timepicker' | 'colorpicker' | 'slider' | 'multiselect' | 'autocomplete'
    | 'rating' | 'togglegroup' | 'otpinput' | 'megamenu' | 'dropdown' | 'contextmenu'
    | 'stepper' | 'commandpalette' | 'bottomnav' | 'fab' | 'toast' | 'snackbar'
    | 'skeleton' | 'spinner' | 'emptystate' | 'carousel' | 'splitpane' | 'kanban'

export interface CanvasElement {
    id: string
    type: ElementType
    x: number
    y: number
    width: number
    height: number
    content?: string
    props?: Record<string, any>
    style?: Record<string, any>
    zIndex: number
    visible?: boolean
    locked?: boolean
}

interface CanvasState {
    elements: Record<string, CanvasElement>
    selectedIds: string[]
    addElement: (type: ElementType, x: number, y: number, customProps?: Partial<CanvasElement>) => void
    updateElement: (id: string, updates: Partial<CanvasElement>) => void
    removeElement: (id: string) => void
    selectElement: (id: string, multi: boolean) => void
    clearSelection: () => void
    moveElement: (id: string, dx: number, dy: number) => void
    setElements: (elements: CanvasElement[]) => void
    alignElements: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void
    distributeElements: (type: 'horizontal' | 'vertical') => void
    bringToFront: () => void
    sendToBack: () => void
    duplicateElements: () => void
    deleteSelected: () => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
    elements: {},
    selectedIds: [],
    addElement: (type, x, y, customProps = {}) => {
        const id = uuidv4()
        const newElement: CanvasElement = {
            id,
            type,
            x,
            y,
            width: 200,
            height: 100,
            zIndex: 1,
            content: '',
            props: {},
            visible: true,
            locked: false,
            ...customProps,
        }
        set((state) => ({
            elements: { ...state.elements, [id]: newElement },
            selectedIds: [id],
        }))
    },
    updateElement: (id, updates) =>
        set((state) => ({
            elements: {
                ...state.elements,
                [id]: { ...state.elements[id], ...updates },
            },
        })),
    removeElement: (id) =>
        set((state) => {
            const newElements = { ...state.elements }
            delete newElements[id]
            return { elements: newElements, selectedIds: [] }
        }),
    selectElement: (id, multi) => {
        console.log('Store selectElement:', id, multi)
        set((state) => ({
            selectedIds: multi
                ? state.selectedIds.includes(id)
                    ? state.selectedIds.filter((sid) => sid !== id)
                    : [...state.selectedIds, id]
                : [id],
        }))
    },
    clearSelection: () => set({ selectedIds: [] }),
    moveElement: (id, dx, dy) =>
        set((state) => {
            const el = state.elements[id]
            if (!el) return {}
            return {
                elements: {
                    ...state.elements,
                    [id]: { ...el, x: el.x + dx, y: el.y + dy },
                },
            }
        }),
    setElements: (elementsList) => {
        const elements = elementsList.reduce((acc, el) => {
            acc[el.id] = el
            return acc
        }, {} as Record<string, CanvasElement>)
        set({ elements })
    },

    // New Actions
    alignElements: (type) => set((state) => {
        const selected = state.selectedIds.map(id => state.elements[id]).filter(Boolean)
        if (selected.length < 2) return {}

        let newValue = 0
        const updates: Record<string, CanvasElement> = { ...state.elements }

        switch (type) {
            case 'left':
                newValue = Math.min(...selected.map(el => el.x))
                selected.forEach(el => updates[el.id] = { ...el, x: newValue })
                break
            case 'center':
                const centerX = (Math.min(...selected.map(el => el.x)) + Math.max(...selected.map(el => el.x + el.width))) / 2
                selected.forEach(el => updates[el.id] = { ...el, x: centerX - el.width / 2 })
                break
            case 'right':
                newValue = Math.max(...selected.map(el => el.x + el.width))
                selected.forEach(el => updates[el.id] = { ...el, x: newValue - el.width })
                break
            case 'top':
                newValue = Math.min(...selected.map(el => el.y))
                selected.forEach(el => updates[el.id] = { ...el, y: newValue })
                break
            case 'middle':
                const centerY = (Math.min(...selected.map(el => el.y)) + Math.max(...selected.map(el => el.y + el.height))) / 2
                selected.forEach(el => updates[el.id] = { ...el, y: centerY - el.height / 2 })
                break
            case 'bottom':
                newValue = Math.max(...selected.map(el => el.y + el.height))
                selected.forEach(el => updates[el.id] = { ...el, y: newValue - el.height })
                break
        }
        return { elements: updates }
    }),

    distributeElements: (type) => set((state) => {
        const selected = state.selectedIds.map(id => state.elements[id]).filter(Boolean)
        if (selected.length < 3) return {}

        const updates: Record<string, CanvasElement> = { ...state.elements }

        if (type === 'horizontal') {
            const sorted = [...selected].sort((a, b) => a.x - b.x)
            const minX = sorted[0].x
            const maxX = sorted[sorted.length - 1].x
            const totalWidth = maxX - minX
            const gap = totalWidth / (sorted.length - 1)

            sorted.forEach((el, i) => {
                updates[el.id] = { ...el, x: minX + (gap * i) }
            })
        } else {
            const sorted = [...selected].sort((a, b) => a.y - b.y)
            const minY = sorted[0].y
            const maxY = sorted[sorted.length - 1].y
            const totalHeight = maxY - minY
            const gap = totalHeight / (sorted.length - 1)

            sorted.forEach((el, i) => {
                updates[el.id] = { ...el, y: minY + (gap * i) }
            })
        }
        return { elements: updates }
    }),

    bringToFront: () => set((state) => {
        const updates: Record<string, CanvasElement> = { ...state.elements }
        const maxZ = Math.max(...Object.values(state.elements).map(el => el.zIndex))
        state.selectedIds.forEach((id, i) => {
            if (updates[id]) updates[id] = { ...updates[id], zIndex: maxZ + 1 + i }
        })
        return { elements: updates }
    }),

    sendToBack: () => set((state) => {
        const updates: Record<string, CanvasElement> = { ...state.elements }
        const minZ = Math.min(...Object.values(state.elements).map(el => el.zIndex))
        state.selectedIds.forEach((id, i) => {
            if (updates[id]) updates[id] = { ...updates[id], zIndex: minZ - 1 - i }
        })
        return { elements: updates }
    }),

    duplicateElements: () => set((state) => {
        const newElements = { ...state.elements }
        const newSelectedIds: string[] = []

        state.selectedIds.forEach(id => {
            const el = state.elements[id]
            if (el) {
                const newId = uuidv4()
                newElements[newId] = {
                    ...el,
                    id: newId,
                    x: el.x + 20,
                    y: el.y + 20,
                    zIndex: el.zIndex + 1
                }
                newSelectedIds.push(newId)
            }
        })

        return { elements: newElements, selectedIds: newSelectedIds }
    }),

    deleteSelected: () => set((state) => {
        const newElements = { ...state.elements }
        state.selectedIds.forEach(id => delete newElements[id])
        return { elements: newElements, selectedIds: [] }
    })
}))
