import { Handle, Position, NodeProps } from 'reactflow'
import styles from './FlowchartNode.module.css'

export function FlowchartNode({ data }: NodeProps) {
    const { label, type } = data

    const getClassName = () => {
        switch (type) {
            case 'flowchartDecision':
                return styles.diamond
            case 'flowchartStart':
            case 'flowchartEnd':
                return styles.circle
            default:
                return styles.rectangle
        }
    }

    return (
        <div className={`${styles.node} ${getClassName()}`}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.label}>{label}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}
