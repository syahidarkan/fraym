import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type ElementType = 'rectangle' | 'circle' | 'text' | 'button' | 'image' | 'card' | 'input'

export interface CanvasElement {
    id: string
    type: ElementType
    x: number
    y: number
    width: number
    height: number
    content?: string
    props?: Record<string, any>
    zIndex: number
}

interface CanvasState {
    elements: Record<string, CanvasElement>
    selectedIds: string[]
    addElement: (type: ElementType, x: number, y: number) => void
    updateElement: (id: string, updates: Partial<CanvasElement>) => void
    removeElement: (id: string) => void
    selectElement: (id: string, multi: boolean) => void
    clearSelection: () => void
    moveElement: (id: string, dx: number, dy: number) => void
    setElements: (elements: CanvasElement[]) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
    elements: {},
    selectedIds: [],
    addElement: (type, x, y) => {
        const id = uuidv4()
        const newElement: CanvasElement = {
            id,
            type,
            x,
            y,
            width: type === 'text' ? 100 : 200,
            height: type === 'text' ? 40 : 100,
            zIndex: 1,
            content: type === 'text' ? 'Text' : type === 'button' ? 'Button' : undefined,
            props: {},
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
    selectElement: (id, multi) =>
        set((state) => ({
            selectedIds: multi
                ? state.selectedIds.includes(id)
                    ? state.selectedIds.filter((sid) => sid !== id)
                    : [...state.selectedIds, id]
                : [id],
        })),
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
}))
