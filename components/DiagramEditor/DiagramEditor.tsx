'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    Panel,
    ReactFlowInstance,
} from 'reactflow'
import { toPng } from 'html-to-image'
import { ChevronLeft, Save, Download, Share2 } from 'lucide-react'
import 'reactflow/dist/style.css'
import { Project } from '@/lib/storage'
import { apiStorage } from '@/lib/apiStorage'
import DiagramToolbar from './DiagramToolbar'
import DiagramPropertiesPanel from './DiagramPropertiesPanel'
import { ShapeNode } from './nodes/ShapeNode'
import styles from './DiagramEditor.module.css'

const nodeTypes = {
    shape: ShapeNode,
}

interface DiagramEditorProps {
    project: Project
}

export default function DiagramEditor({ project }: DiagramEditorProps) {
    const router = useRouter()
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(project.diagramData?.nodes || [])
    const [edges, setEdges, onEdgesChange] = useEdgesState(project.diagramData?.edges || [])
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
    const [saving, setSaving] = useState(false)

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node)
    }, [])

    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [])

    // Add new node to canvas
    const addNode = useCallback((shapeType: string, label: string) => {
        const newNode: Node = {
            id: `${shapeType}-${Date.now()}`,
            type: 'shape',
            position: { x: 250, y: 100 },
            style: { width: 100, height: 100 },
            data: { label, shapeType },
        }
        setNodes((nds) => [...nds, newNode])
    }, [setNodes])

    // Delete selected node
    const deleteSelectedNode = useCallback(() => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
            setSelectedNode(null)
        }
    }, [selectedNode, setNodes, setEdges])

    // Update node properties
    const updateNodeData = useCallback((nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: { ...node.data, ...newData },
                    }
                }
                return node
            })
        )
    }, [setNodes])

    // Save Diagram
    const handleSave = async () => {
        if (rfInstance) {
            setSaving(true)
            const flow = rfInstance.toObject()
            const updatedProject = {
                ...project,
                diagramData: {
                    nodes: flow.nodes,
                    edges: flow.edges
                },
                updatedAt: new Date().toISOString()
            }
            await apiStorage.updateProject(project.id, updatedProject)
            setSaving(false)
            alert('Diagram saved successfully!')
        }
    }

    // Export to Image
    const handleExport = useCallback(() => {
        if (reactFlowWrapper.current === null) {
            return
        }

        toPng(reactFlowWrapper.current, { cacheBust: true, backgroundColor: '#ffffff' })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${project.name}-diagram.png`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
                alert('Failed to export diagram')
            })
    }, [project.name])

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (rfInstance) {
                const flow = rfInstance.toObject()
                const updatedProject = {
                    ...project,
                    diagramData: {
                        nodes: flow.nodes,
                        edges: flow.edges
                    },
                    updatedAt: new Date().toISOString()
                }
                await apiStorage.updateProject(project.id, updatedProject)
                console.log('Auto-saved diagram')
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [rfInstance, project])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backBtn} onClick={() => router.push('/dashboard')}>
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1>{project.name}</h1>
                        <div className={styles.breadcrumb}>
                            <span>Diagram</span>
                        </div>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.actionBtn} onClick={handleSave} disabled={saving}>
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className={styles.actionBtn} onClick={handleExport}>
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            <div className={styles.workspace}>
                <DiagramToolbar
                    onAddNode={addNode}
                />

                <div className={styles.canvas} ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onInit={setRfInstance}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                        <Panel position="top-center" className={styles.panel}>
                            <div className={styles.hint}>
                                💡 Drag shapes from the toolbar, connect them with arrows
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>

                {selectedNode && (
                    <DiagramPropertiesPanel
                        node={selectedNode}
                        onUpdate={(data) => updateNodeData(selectedNode.id, data)}
                        onDelete={deleteSelectedNode}
                        onClose={() => setSelectedNode(null)}
                    />
                )}
            </div>
        </div>
    )
}
