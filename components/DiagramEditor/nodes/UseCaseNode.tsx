import { Handle, Position, NodeProps } from 'reactflow'
import styles from './UseCaseNode.module.css'

export function UseCaseNode({ data }: NodeProps) {
    const { label } = data

    return (
        <div className={styles.node}>
            <Handle type="target" position={Position.Left} />
            <div className={styles.label}>{label}</div>
            <Handle type="source" position={Position.Right} />
        </div>
    )
}
