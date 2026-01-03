import { Handle, Position, NodeProps, NodeResizer } from 'reactflow'
import styles from './ShapeNode.module.css'

export function ShapeNode({ data, selected }: NodeProps) {
    const { label, shapeType = 'rectangle' } = data

    const renderShape = () => {
        // SVG paths are defined in a 100x100 coordinate system
        // We use preserveAspectRatio="none" to stretch them to fill the node
        switch (shapeType) {
            case 'rectangle':
                return <rect x="2" y="2" width="96" height="96" rx="2" vectorEffect="non-scaling-stroke" />
            case 'rounded':
                return <rect x="2" y="2" width="96" height="96" rx="10" vectorEffect="non-scaling-stroke" />
            case 'ellipse':
                return <ellipse cx="50" cy="50" rx="48" ry="48" vectorEffect="non-scaling-stroke" />
            case 'circle':
                return <circle cx="50" cy="50" r="48" vectorEffect="non-scaling-stroke" />
            case 'diamond':
                return <polygon points="50,2 98,50 50,98 2,50" vectorEffect="non-scaling-stroke" />
            case 'triangle':
                return <polygon points="50,2 98,98 2,98" vectorEffect="non-scaling-stroke" />
            case 'parallelogram':
                return <polygon points="25,2 98,2 75,98 2,98" vectorEffect="non-scaling-stroke" />
            case 'hexagon':
                return <polygon points="25,2 75,2 98,50 75,98 25,98 2,50" vectorEffect="non-scaling-stroke" />
            case 'cylinder':
                return (
                    <g>
                        <path d="M2,15 v70 a48,10 0 0,0 96,0 v-70" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                        <ellipse cx="50" cy="15" rx="48" ry="10" vectorEffect="non-scaling-stroke" />
                        <path d="M2,15 v70" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                        <path d="M98,15 v70" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                    </g>
                )
            case 'cloud':
                return <path d="M25,50 a20,20 0 0,1 0,-40 a20,20 0 0,1 40,-10 a20,20 0 0,1 30,20 a15,15 0 0,1 0,30 z" vectorEffect="non-scaling-stroke" />
            case 'document':
                return <path d="M2,2 h96 v70 q-24,25 -48,0 q-24,-25 -48,0 z" vectorEffect="non-scaling-stroke" />
            case 'database':
                return (
                    <g>
                        <ellipse cx="50" cy="10" rx="48" ry="8" vectorEffect="non-scaling-stroke" />
                        <path d="M2,10 v80 a48,8 0 0,0 96,0 v-80" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                        <path d="M2,10 v80" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                        <path d="M98,10 v80" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                    </g>
                )
            case 'note':
                return <path d="M2,2 h70 l26,26 v70 h-96 z M70,2 v26 h26" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
            case 'actor':
                return (
                    <g fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="50" cy="15" r="10" vectorEffect="non-scaling-stroke" />
                        <line x1="50" y1="25" x2="50" y2="60" vectorEffect="non-scaling-stroke" />
                        <line x1="20" y1="40" x2="80" y2="40" vectorEffect="non-scaling-stroke" />
                        <line x1="50" y1="60" x2="20" y2="90" vectorEffect="non-scaling-stroke" />
                        <line x1="50" y1="60" x2="80" y2="90" vectorEffect="non-scaling-stroke" />
                    </g>
                )
            default:
                return <rect x="2" y="2" width="96" height="96" rx="2" vectorEffect="non-scaling-stroke" />
        }
    }

    return (
        <div className={`${styles.node} ${selected ? styles.selected : ''}`}>
            <NodeResizer
                color="#4f46e5"
                isVisible={selected}
                minWidth={50}
                minHeight={50}
            />

            <Handle type="target" position={Position.Top} className={styles.handle} />
            <Handle type="target" position={Position.Left} className={styles.handle} />

            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                className={styles.svg}
                preserveAspectRatio="none"
            >
                {renderShape()}
            </svg>

            <div className={styles.labelContainer}>
                <div className={styles.label}>{label}</div>
            </div>

            <Handle type="source" position={Position.Bottom} className={styles.handle} />
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </div>
    )
}
