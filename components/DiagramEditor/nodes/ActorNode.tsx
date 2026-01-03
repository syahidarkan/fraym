import { Handle, Position, NodeProps } from 'reactflow'
import { User } from 'lucide-react'
import styles from './ActorNode.module.css'

export function ActorNode({ data }: NodeProps) {
    const { label } = data

    return (
        <div className={styles.node}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.actorIcon}>
                <User size={32} />
            </div>
            <div className={styles.label}>{label}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}
