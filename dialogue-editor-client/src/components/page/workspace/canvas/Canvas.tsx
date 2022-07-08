import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import Modal from 'react-modal'
import ReactFlow, {
	ReactFlowProvider,
	addEdge,
	MiniMap,
	Controls,
	Background,
	Connection,
	Edge,
	Node,
	OnConnectStartParams,
	Position,
	useNodesState,
	useEdgesState,
	useReactFlow,
} from 'react-flow-renderer'
import { v4 as uuid } from 'uuid'
import create from 'zustand'
import DialogueNodeType, {
	DialogueNode,
} from '../../../../helpers/nodes/DialogueNode'
import DialogueForm from '../../../../helpers/DialogueForm'
// import initialElements from './initial-elements'
import { AddButton, CanvasContainer } from './styles'
import { FlowContext } from '../../../../contexts/FlowContext'
import BasicNodeType, { BasicNode } from '../../../../helpers/nodes/BasicNode'
import NodeDetail from '../../detail/NodeDetail'
import { IEdgeParams } from '../../../../helpers/types'
import DataEdge, { DataEdgeType } from '../../../../helpers/DataEdge'
import RootNodeType from '../../../../helpers/nodes/RootNode'
import initialElements from '../../../../helpers/initial-elements'
import useStore, { State, types } from '../../../../store/store'
import ColorChooserNode from '../../../../helpers/nodes/ColorChooserNode'
import EdgeDetail from '../../detail/EdgeDetail'

// styles for the modal
const customModalStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 100,
	},
}

const Canvas: React.FC<{}> = (props) => {
	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		addNode,
		setEdges,
	} = useStore()

	// for modal
	const [modalIsOpen, setIsOpen] = React.useState(false)

	const reactFlowInstance = useReactFlow()

	// call your hook here
	// const forceUpdate = useForceUpdate()

	const nodeID = useStore((state: State) => state.nodeID)
	const edgeID = useStore((state: State) => state.edgeID)

	// zustand store
	const dispatch = useStore((store: State) => store.dispatch)

	const edgeTypes = useMemo(
		() => ({
			data: DataEdgeType,
		}),
		[]
	)

	const nodeTypes = useMemo(
		() => ({
			basic: BasicNodeType,
			root: RootNodeType,
			dialogue: DialogueNodeType,
			colorChooser: ColorChooserNode,
		}),
		[]
	)

	// on add option click, open the modal
	function addOption(event: any) {
		const newNode = new BasicNode(
			Math.random() * window.innerWidth - 100,
			Math.random() * window.innerHeight
		)
		// setNodes((els) => els.concat(newNode))
		addNode(newNode)
	}

	function closeModal() {
		setIsOpen(false)
	}

	const reactFlowWrapper = useRef<any>(null)

	// const onNodesChange = useCallback(
	// 	(changes) =>
	// 		rFlow.reactFlowInstance?.setNodes((ns) =>
	// 			applyNodeChanges(changes, ns)
	// 		),
	// 	[]
	// )
	// const onEdgesChange = useCallback(
	// 	(changes) =>
	// 		rFlow.reactFlowInstance?.setEdges((es) =>
	// 			applyEdgeChanges(changes, es)
	// 		),
	// 	[]
	// )

	// ================= CONNECTION BEHAVIOR ================================

	// useState gives us an old refernce inside of the useCallback
	// but not inside of useEffect, so we use this hack to get the correct
	// connection attempt
	const [connectionAttempt, setConnectionAttempt] =
		useState<OnConnectStartParams | null>(null)
	const connection = useRef(connectionAttempt)

	useEffect(() => {
		connection.current = connectionAttempt
	}, [connectionAttempt])

	const onCustomConnect = useCallback(
		(params: Connection) => {
			setConnectionAttempt(null)
			if (params.sourceHandle) {
				const edge: Edge = new DataEdge(
					params.source!,
					params.target!,
					connection.current!.handleId,
					null
					// setEdges
				)
				onConnect(edge)
			} else {
				onConnect({ ...params, type: 'step' })
				// setEdges((els: any) =>
				// 	addEdge({ ...params, type: 'step' }, els)
				// )
			}
		},
		[reactFlowInstance, connectionAttempt]
	)

	const onConnectStart = useCallback(
		(event: React.MouseEvent, params: OnConnectStartParams) => {
			if (event.button !== 2 && params.handleType === 'source') {
				setConnectionAttempt(params)
			}
		},
		[connectionAttempt]
	)

	// const onConnectStop = useCallback((event: MouseEvent) => {
	// 	console.log('on connect stop', event)
	// }, [])

	// we've dragged a node into an empty spot
	const onConnectEnd = useCallback(
		(event: MouseEvent) => {
			if (!connection.current) {
				return
			}

			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect()
			// const type = event.dataTransfer.getData('application/reactflow')
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const id = uuid()
			const newNode = {
				id: uuid(),
				type: 'default',
				position,
				data: { label: `default node` },
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
			}

			const edge: Edge = new DataEdge(
				connection.current!.nodeId!,
				newNode.id,
				connection.current!.handleId,
				null
				// setEdges
			)

			// setNodes((els: any[]) => {
			// 	return els.concat(newNode)
			// })
			addNode(newNode)
			reactFlowInstance.setEdges((els: any) => addEdge(edge, els))
			setConnectionAttempt(null)
		},
		[reactFlowInstance, connectionAttempt]
	)

	// ====================== DRAG & DROP BEHAVIOUR ===========================
	const onDragOver = useCallback(
		(event: {
			preventDefault: () => void
			dataTransfer: { dropEffect: string }
		}) => {
			event.preventDefault()
			event.dataTransfer.dropEffect = 'move'
		},
		[]
	)

	const onDrop = useCallback(
		(event: {
			preventDefault: () => void
			dataTransfer: { getData: (arg0: string) => any }
			clientX: number
			clientY: number
		}) => {
			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect()
			const type = event.dataTransfer.getData('application/reactflow')
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			let newNode: any
			switch (type) {
				case 'dialogue':
					newNode = new DialogueNode(
						'character name',
						'sample dialogue',
						null,
						position.x,
						position.y
					)
					break
				case 'option 2':
					newNode = {}
					break
				case 'base':
					newNode = new BasicNode(position.x, position.y, uuid())
					break
				case 'custom':
					newNode = new BasicNode(position.x, position.y, uuid())
					break
				default:
					newNode = {
						id: uuid(),
						type,
						position,
						data: { label: `${type} node` },
						sourcePosition: Position.Right,
						targetPosition: Position.Left,
					}
					break
			}

			// setNodes((els: any[]) => {
			// 	return els.concat(newNode)
			// })
			addNode(newNode)
		},
		[reactFlowInstance]
	)

	const submitModal = (event: any) => {
		closeModal()
		if (
			event == null ||
			event.character_name == null ||
			event.character_name === '' ||
			event.dialog == null ||
			event.dialog === ''
		) {
			return
		}

		const newNode = new DialogueNode(
			event.character_name,
			event.dialog,
			null,
			// setSelected,
			250,
			250
		)

		// setNodes((els: any[]) => {
		// 	return els.concat(newNode)
		// })
		addNode(newNode)
	}

	// function onInit(_reactFlowInstance: any) {
	// 	_reactFlowInstance.fitView()
	// 	rFlow.setReactFlowInstance(_reactFlowInstance)
	// }

	Modal.setAppElement('#root')

	return (
		<CanvasContainer>
			<Modal
				isOpen={modalIsOpen}
				// react/jsx-no-bind, JSX props should not use functions
				onRequestClose={closeModal}
				style={customModalStyles}
				contentLabel="Add Dialogue Option"
			>
				<button onClick={closeModal}>close</button>
				<DialogueForm callback={submitModal} />
			</Modal>
			<div
				style={{ width: '100%', height: '100%' }}
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// onConnect={onConnect}
					onConnect={onCustomConnect}
					onConnectStart={onConnectStart}
					// onConnectStop={onConnectStop}
					onConnectEnd={onConnectEnd}
					// onInit={onInit}
					onDragOver={onDragOver}
					onDrop={onDrop}
					deleteKeyCode="Delete"
					multiSelectionKeyCode="Control"
					snapToGrid
					snapGrid={[15, 15]}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
				>
					<MiniMap
						nodeStrokeColor={(n) => {
							if (n.style?.background)
								return n.style.background as string
							if (n.type === 'input') return '#0041d0'
							if (n.type === 'output') return '#ff0072'
							if (n.type === 'default') return '#1a192b'

							return '#1a192b'
						}}
						nodeColor={(n) => {
							if (n.style?.background)
								return n.style.background as string

							return '#fff'
						}}
						nodeBorderRadius={2}
					/>
					<Controls />
					<Background color="#aaa" gap={16} />
				</ReactFlow>
			</div>
			<AddButton z={1} onClick={addOption}>
				Add Dialogue Option
			</AddButton>
			<AddButton
				z={1}
				onClick={() => {
					setEdges([])
				}}
			>
				Nuke
			</AddButton>
			{nodeID && (
				<NodeDetail
					nodeID={nodeID}
					isOpen
					close={() => dispatch({ type: types.setNode, data: null })}
				/>
			)}
			{edgeID && (
				<EdgeDetail
					edgeID={edgeID}
					isOpen
					close={() => dispatch({ type: types.setEdge, data: null })}
				/>
			)}
		</CanvasContainer>
	)
}

export default Canvas
