import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	Background,
	Connection,
	Edge,
	Node,
	OnConnectStartParams,
	Position,
	useReactFlow,
	BackgroundVariant,
	NodeChange,
	EdgeChange,
	useEdges,
} from 'reactflow'
import { v4 as uuid } from 'uuid'
import Modal from '@/components/modal/Modal'
import DataEdge from '@/components/edges/DataEdge'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { encodeSchema } from '@/helpers/serialization/encodeSchema'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import EditNode from '@/components/forms/node/EditNode'
import { ControlsStyled, MiniMapStyled, ReactFlowStyled } from '@/helpers/theme'
import { NodeTypes, EdgeTypes } from '@/helpers/types'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import EdgeDetail from '../../detail/EdgeDetail'
import { CanvasContainer } from './styles'
import { BottomBar } from '../styles'

const Canvas: React.FC<{
	schemaName?: string | null
	nodes: Node<any>[]
	edges: Edge<any>[]
	onNodesChange: (changes: NodeChange[]) => void
	onEdgesChange: (changes: EdgeChange[]) => void
	onConnect: (connection: Connection | Edge) => void
	addNode: (newNode: Node<any>) => void
	setEdges: (edges: Edge<any>[]) => void
	setNodes: (nodes: Node<any>[]) => void
	mode?: string
}> = ({
	schemaName,
	nodes,
	edges,
	onNodesChange,
	onEdgesChange,
	onConnect,
	addNode,
	setEdges,
	setNodes,
	mode,
}) => {
	const { activeScene, customNodes: custom, workspace } = useStore()
	const { setViewport, fitView } = useReactFlow()

	// for modal
	const [sgModalOpen, setSGModalOpen] = useState(false)
	const [showSGButton, setShowSGButton] = useState(false)
	const [selectedNodes, setSelectedNodes] = useState<Node<any>[]>([])
	const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null)

	const reactFlowInstance = useReactFlow()
	const reactFlowWrapper = useRef<any>(null)

	// call your hook here
	// const forceUpdate = useForceUpdate()

	const nodeID = useStore((state) => state.nodeID)
	const edgeID = useStore((state) => state.edgeID)

	const forbiddenList = [
		...workspace.schemas.map((s) => s.name),
		...custom.map((s) => s.name),
	].filter((n) => n === schemaName)

	let schemaColor = null
	let displayName = null

	// https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
	useEffect(() => {
		// If we are working with a schema, then the incoming nodes
		// and edges will be empty so we need to initialize them
		if (schemaName) {
			displayName = schemaName.replace('@workspace/', '')

			const workspaceNodes = workspace.schemas
			const search = [...custom, ...workspaceNodes]
			const s = search.filter((n) => n.name === schemaName)[0]
			const out = decodeSchema({ x: 0, y: 0 }, s)

			schemaColor = s.color
			setEdges(out.newEdges)
			setNodes(out.newNodes)
		}
	}, [])

	// zustand store
	const dispatch = useStore((store) => store.dispatch)

	function closeModal() {
		setSGModalOpen(false)
	}

	useEffect(() => {
		fitView()
	}, [activeScene])

	// useEffect(() => {
	// 	console.log(nodes)
	// 	console.log(edges)
	// }, [nodes, edges])

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
				)
				onConnect(edge)
			} else {
				onConnect({ ...params, type: 'step' })
			}
		},
		[reactFlowInstance, connectionAttempt, edges]
	)

	const onConnectStart = useCallback(
		(
			event: React.MouseEvent<Element, MouseEvent>,
			params: OnConnectStartParams
		) => {
			if (event.button !== 2 && params.handleType === 'source') {
				setConnectionAttempt(params)
			}
		},
		[connectionAttempt]
	)

	// we've dragged a handle into an empty spot
	const onConnectEnd = useCallback(
		(event: React.MouseEvent<Element, MouseEvent>) => {
			if (!connection.current) {
				return
			}

			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect()
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
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
			)

			addNode(newNode)
			// setEdges((els: any) => addEdge(edge, els))
			onConnect(edge)
			setConnectionAttempt(null)
		},
		[reactFlowInstance, connectionAttempt, nodes, edges]
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

			const data = event.dataTransfer.getData('application/reactflow')

			const paletteItem = JSON.parse(data)

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})

			const { newNodes, newEdges } = decodeSchema(position, paletteItem)

			newNodes.forEach((n) => addNode(n))
			newEdges.forEach((e) => onConnect(e))

			// addNode(newNode)
		},
		[reactFlowInstance, nodes]
	)

	return (
		<CanvasContainer>
			<Modal withDimmer open={sgModalOpen} close={closeModal}>
				<EditNode
					forbidden={forbiddenList}
					cancel={() => setSGModalOpen(false)}
					name={displayName || undefined}
					color={schemaColor || undefined}
					saveToEditor={
						schemaName ? displayName === schemaName : false
					}
					submit={(name, color, saveToEditor) => {
						const data = encodeSchema(
							name,
							color,
							selectedNodes,
							edges
						)
						if (saveToEditor) {
							dispatch({
								type: types.addCustomNode,
								data,
							})
						} else {
							dispatch({
								type: types.addCustomWorkspaceNode,
								data: {
									...data,
									name: `@workspace/${data.name}`,
								},
							})
						}

						setSGModalOpen(false)

						// if we're in edit mode we need to get out of here
						if (schemaName) {
							setNodes([])
							setEdges([])
							dispatch({
								type: types.customizeSchema,
								data: { mode: 'active', schema: null },
							})
						}
					}}
				/>
			</Modal>
			<div
				style={{ width: '100%', height: '100%', position: 'relative' }}
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
			>
				{/* @ts-ignore */}
				<ReactFlowStyled
					nodes={nodes}
					edges={edges}
					edgeTypes={EdgeTypes}
					nodeTypes={NodeTypes}
					// onSelectionContextMenu={saveGroup}
					// looks like this is the only one that works
					onSelectionChange={(params) => {
						setSelectedNodes(params.nodes)
						if (params.nodes.length > 1 && !showSGButton) {
							setShowSGButton(true)
						} else if (params.nodes.length < 1) {
							setShowSGButton(false)
						}
					}}
					// onSelectionDragStop={(e: React.MouseEvent, nds: Node[]) => {
					// 	console.log('pong')
					// }}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// drag currently doesn't do the callback when a group is dragged
					// onNodeDragStart={(e, n, nds) => {}}
					// onNodeDragStop={(e, n, nds) => {
					// 	console.log(nds)
					// 	console.log(hoveredEdge)
					// }}
					// onConnect={onConnect}
					onConnect={onCustomConnect}
					// @ts-ignore
					onConnectStart={onConnectStart}
					// @ts-ignore
					onConnectEnd={onConnectEnd}
					// onInit={onInit}
					onDragOver={onDragOver}
					onDrop={onDrop}
					deleteKeyCode="Delete"
					multiSelectionKeyCode="Control"
					snapToGrid
					snapGrid={[15, 15]}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
					edgeUpdaterRadius={10} // maybe increase when dragging
					elevateEdgesOnSelect
					fitView
					// onEdgeContextMenu={}
					onEdgeMouseEnter={(event, edge) => {
						setHoveredEdge(edge)
					}}
					onEdgeMouseLeave={(event, edge) => {
						setHoveredEdge(null)
					}}
				>
					<MiniMapStyled
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

							if (n.type === 'base')
								return n.data.color ? n.data.color : '#1a192b'

							return '#fff'
						}}
						nodeBorderRadius={2}
						zoomable
						pannable
					/>
					<ControlsStyled />
					<Background
						color="#c0adf030"
						gap={16}
						size={3}
						variant={BackgroundVariant.Cross}
					/>
				</ReactFlowStyled>
			</div>
			<BottomBar>
				{(showSGButton || mode === 'customize') && (
					<button onClick={() => setSGModalOpen(true)}>
						Save Group
					</button>
				)}
				{mode === 'customize' && (
					<button
						onClick={() => {
							setNodes([])
							setEdges([])
							dispatch({
								type: types.customizeSchema,
								data: { mode: 'active', schema: null },
							})
						}}
					>
						Exit
					</button>
				)}
			</BottomBar>
			{nodeID && (
				<BasicNodeDetail
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
