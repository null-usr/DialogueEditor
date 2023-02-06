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

export class RootNode {
	readonly id: string = uuidv4()

	readonly type: string = 'root'

	readonly selectable: boolean = false

	readonly data: object = {
		label: 'ROOT',
		type: 'root',
		sources: [],
		targets: [],
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
	sources: string[]
	targets: string[]
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
	useLayoutEffect(() => {
		if (nodeRef.current) {
			setDimensions({
				width: nodeRef.current.offsetWidth + dimensions.width,
				height: nodeRef.current.offsetHeight + dimensions.height,
			})
		}
	}, [])

	// useEffect(() => {
	// 	data.sources = sourceArray
	// }, [sourceArray])

	// useEffect(() => {
	// 	data.targets = targetArray
	// }, [targetArray])

	// useEffect(() => {
	// 	updateNodeInternals(id)
	// }, [data.sources, data.targets])

	const add = (type: string) => {
		if (type === 'T' && data.targets.length < 10) {
			const tmp = `target-handle-${data.targets.length + 1}`
			updateHandles(id, data.sources, [...data.targets, tmp])
		}
		if (type === 'S' && data.sources.length < 10) {
			const tmp = `source-handle-${data.sources.length + 1}`
			updateHandles(id, [...data.sources, tmp], data.targets)
		}
	}

	// need to make sure we also remove the edges from our flow
	const remove = (type: string, index: number) => {
		if (type === 'T') {
			const tmp = [...data.targets]
			const edges = reactFlowInstance.getEdges().filter((element) => {
				return (
					element.target !== data.id ||
					element.targetHandle === data.targets[index]
				)
			})
			if (edges) {
				reactFlowInstance.setEdges(edges)
			}
			tmp.splice(index, 1)
			updateHandles(id, data.sources, tmp)
		}
		if (type === 'S') {
			const tmp = [...data.sources]
			const edges = reactFlowInstance.getEdges().filter((element) => {
				return (
					element.source !== data.id ||
					element.sourceHandle !== data.sources[index]
				)
			})
			if (edges) {
				reactFlowInstance?.setEdges(edges)
			}
			tmp.splice(index, 1)
			updateHandles(id, tmp, data.targets)
		}
	}

	const positionHandle = (index: number) => {
		return 13 + 18 * index
	}

	const targetHandles = useMemo(
		() =>
			data.targets.map((x: any, i: number) => {
				const handleId = `target-handle-${i + 1}`
				return (
					<Handle
						key={handleId}
						type="target"
						position={Position.Left}
						id={handleId}
						style={{ top: positionHandle(i) }}
					/>
				)
			}),
		[data.targets, positionHandle]
	)

	const sourceHandles = useMemo(
		() =>
			data.sources.map((x: any, i: number) => {
				const handleId = `source-handle-${i + 1}`
				return (
					<Handle
						key={handleId}
						type="source"
						position={Position.Right}
						id={handleId}
						style={{ top: positionHandle(i) }}
						onContextMenu={(event) => {
							event.preventDefault()
							remove('S', i)
						}}
					/>
				)
			}),
		[data.sources, positionHandle]
	)

	return (
		<Node selected={selected}>
			<div
				style={{
					minHeight:
						data.targets.length > 0 || data.sources.length > 0
							? `${
									(Math.max(
										data.targets.length,
										data.sources.length
									) -
										1) *
										18 +
									6
							  }px`
							: ``,
				}}
				ref={nodeRef}
			>
				{targetHandles}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								className="nodrag"
								key="targetMore"
								onClick={() => add('T')}
							>
								+
							</button>
							<button
								className="nodrag"
								key="targetLess"
								onClick={() => remove('T', -1)}
							>
								-
							</button>
							{/* <Button key="targetMore" onClick={() => add('T')}>
								+
							</Button> */}
						</div>
						{/* </ButtonGroup> */}
					</div>
					<div style={{ flex: 2 }}>
						<div style={{ fontWeight: 500, fontSize: 15 }}>
							{data.label}
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								className="nodrag"
								key="sourceMore"
								onClick={() => add('S')}
							>
								+
							</button>
							<button
								className="nodrag"
								key="sourceLess"
								onClick={() => remove('S', -1)}
							>
								-
							</button>
							{/* <Button key="targetMore" onClick={() => add('T')}>
								+
							</Button> */}
						</div>
						{/* </ButtonGroup> */}
					</div>
				</div>
				{sourceHandles}
			</div>
		</Node>
	)
}
