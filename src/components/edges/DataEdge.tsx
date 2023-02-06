import React, {
	createRef,
	forwardRef,
	useImperativeHandle,
	useState,
	FC,
	useContext,
	useEffect,
} from 'react'
import {
	applyEdgeChanges,
	Connection,
	Edge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
	getMarkerEnd,
	getSmoothStepPath,
	useReactFlow,
} from 'reactflow'

import useStore from '@/store/store'
import { types } from '@/store/reducer'

const foreignObjectSize = 40

export const DataEdgeType: FC<EdgeProps> = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	sourceHandleId,
	targetHandleId,
	data,
	markerEnd,
}) => {
	const [edgePath, centerX, centerY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	const dispatch = useStore((store) => store.dispatch)

	const [name, setName] = useState(data.name || 'placeholder')

	const updateName = (newName: string) => {
		setName(newName)
	}

	useEffect(() => {
		data.name = name
	}, [name])

	return (
		<>
			{/* look into interactionWidth for easier to select edges */}
			{/* https://reactflow.dev/docs/api/edges/edge-options/#options */}
			<path
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
				fillRule="evenodd"
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px)`,
						pointerEvents: 'all',
						backgroundColor: 'white',
						border: '1px solid grey',
						padding: 10,
						borderRadius: 5,
						fontSize: 12,
						fontWeight: 700,
						zIndex: 1001, // don't want edges on top of this
					}}
				>
					<div>
						<button
							className="edgebutton nopan"
							onClick={(event) =>
								dispatch({ type: types.setEdge, data: id })
							}
						>
							o
						</button>
					</div>
					{sourceHandleId}
					<div>
						<button
							className="edgebutton nopan"
							onClick={(event) =>
								dispatch({ type: types.deleteEdge, data: id })
							}
						>
							×
						</button>
					</div>
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

// similar to BasicNode, need to get fields from it
class DataEdge implements Connection {
	id: string
	type = 'data'
	source: string
	target: string
	sourceHandle: string | null
	targetHandle: string | null

	name: string
	edgeData: any
	data: any = {}

	constructor(
		source: string,
		target: string,
		sourceHandle: string | null,
		targetHandle: string | null,
		name?: string
	) {
		this.id = `${source}-${sourceHandle}-${target}`

		if (name) {
			this.name = name
		} else {
			this.name = ''
		}

		this.source = source
		this.sourceHandle = sourceHandle
		this.target = target
		this.targetHandle = targetHandle

		this.edgeData = createRef()
		this._set_data()
	}

	_set_data() {
		this.data = {
			name: this.name,
			fields: [],
		}
	}
}

export default DataEdge
