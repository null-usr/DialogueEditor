import React, {
	memo,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	Handle,
	isEdge,
	NodeProps,
	Position,
	useReactFlow,
	useUpdateNodeInternals,
	XYPosition,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { FlowContext } from '@/contexts/FlowContext'
import useStore from '@/store/store'
import { Node } from '@/helpers/theme'

export class DefaultNode {
	readonly id: string = uuidv4()

	readonly type: string = 'default'

	readonly selectable: boolean = false

	readonly data: object = {
		label: 'ROOT',
		type: 'source',
		// sources: [],
		// targets: [],
	}

	position: XYPosition = { x: 100, y: 100 }
	sourcePosition = Position.Left
	targetPosition = Position.Right
}

// https://github.com/wbkd/react-flow/issues/1641
export default ({
	selected,
	data,
	id,
}: NodeProps<{
	id: string
	label: string
}>) => {
	const nodeRef: any = useRef()
	const reactFlowInstance = useReactFlow()
	const updateHandles = useStore((state) => state.updateNodeHandles)

	const [dimensions, setDimensions] = useState({ width: 20, height: 20 })

	// when updating handles programmatically, this is needed
	// have to update immediately or last handle isn't registered for some reason
	const updateNodeInternals = useUpdateNodeInternals()
	updateNodeInternals(id)

	// get node dimensions
	// useLayoutEffect(() => {
	// 	if (nodeRef.current) {
	// 		setDimensions({
	// 			width: nodeRef.current.offsetWidth + dimensions.width,
	// 			height: nodeRef.current.offsetHeight + dimensions.height,
	// 		})
	// 	}
	// }, [])

	const positionHandle = (index: number) => {
		return 13 + 18 * index
	}

	return (
		<Node selected={selected}>
			<Handle
				type="target"
				position={Position.Left}
				id={id}
				// style={{ background: '#555' }}
				// isConnectable={isConnectable}
			/>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<div style={{ flex: 2 }}>
					<div style={{ fontWeight: 500, fontSize: 15 }}>
						{data.label}
					</div>
				</div>
			</div>
			<Handle
				type="source"
				position={Position.Right}
				id={id}
				// style={{ background: '#555' }}
				// isConnectable={isConnectable}
			/>
		</Node>
	)
}
