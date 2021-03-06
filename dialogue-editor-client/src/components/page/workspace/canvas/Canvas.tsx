import React, { useContext, useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import ReactFlow, {
	ReactFlowProvider,
	removeElements,
	addEdge,
	MiniMap,
	Controls,
	Background,
	Elements,
	Connection,
	Edge,
	OnConnectStartParams,
	Position,
	EdgeTypesType,
	NodeTypesType,
} from 'react-flow-renderer'
import { v4 as uuid } from 'uuid'
import DialogueNodeType, {
	DialogueNode,
} from '../../../../helpers/DialogueNode'
import DialogueForm from '../../../../helpers/DialogueForm'
// import initialElements from './initial-elements'
import { AddButton, CanvasContainer } from './styles'
import { FlowContext } from '../../../../contexts/FlowContext'
import BasicNodeType, { BasicNode } from '../../../../helpers/BasicNode'
import Detail from '../../detail/Detail'
import { IEdgeParams } from '../../../../helpers/types'
import DataEdge, { DataEdgeType } from '../../../../helpers/DataEdge'
import RootNodeType from '../../../../helpers/RootNode'

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

const edgeTypes: EdgeTypesType = {
	data: DataEdgeType,
}

const nodeTypes: NodeTypesType = {
	basic: BasicNodeType,
	root: RootNodeType,
	dialogue: DialogueNodeType,
}

const getNodeId = () => `randomnode_${+new Date()}`

const Canvas: React.FC<{}> = (props) => {
	// for modal
	const [modalIsOpen, setIsOpen] = React.useState(false)
	const [selected, setSelected] = useState<DialogueNode | null>(null)

	// we used our shared rflow instance so that our toolbar can
	// access the nodes as well
	const rFlow = useContext(FlowContext)

	// on add option click, open the modal
	function addOption(event: any) {
		const newNode = new BasicNode(
			Math.random() * window.innerWidth - 100,
			Math.random() * window.innerHeight
		)
		rFlow.setElements((els) => els.concat(newNode))
	}

	function closeModal() {
		setIsOpen(false)
	}

	const reactFlowWrapper = useRef<any>(null)

	const onElementsRemove = (elementsToRemove: Elements<any>) =>
		rFlow.setElements((els: any) => removeElements(elementsToRemove, els))

	// ================= CONNECTION BEHAVIOR ================================
	let connectionAttempt: OnConnectStartParams | null = null

	const onConnect = (params: Edge<any> | Connection) => {
		if (params.sourceHandle) {
			const edge: Edge = new DataEdge(
				params.source!,
				params.target!,
				connectionAttempt!.handleId,
				null // not dealing with that lol
			)
			rFlow.setElements((els: any) => addEdge(edge, els))
		} else {
			rFlow.setElements((els: any) =>
				addEdge({ ...params, type: 'step' }, els)
			)
		}
		connectionAttempt = null
	}

	const onConnectStart = (
		event: React.MouseEvent,
		params: OnConnectStartParams
	) => {
		if (event.button !== 2 && params.handleType === 'source') {
			connectionAttempt = params
		}
		// console.log('on connect start', { nodeId, handleId, handleType })
	}
	const onConnectStop = (event: MouseEvent) => {
		// console.log('on connect stop', event)
	}

	// we've dragged a node into an empty spot
	const onConnectEnd = (event: MouseEvent) => {
		if (!connectionAttempt) {
			return
		}

		event.preventDefault()

		if (reactFlowWrapper == null || rFlow.reactFlowInstance == null) {
			return
		}

		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
		// const type = event.dataTransfer.getData('application/reactflow')
		const position = rFlow.reactFlowInstance.project({
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

		rFlow.setElements((els: any[]) => {
			return els.concat(newNode)
		})
		const edge: Edge = new DataEdge(
			connectionAttempt!.nodeId!,
			newNode.id,
			connectionAttempt!.handleId,
			null
		)
		rFlow.setElements((els: any) => addEdge(edge, els))

		connectionAttempt = null
	}

	// ====================== DRAG & DROP BEHAVIOUR ===========================
	const onDragOver = (event: {
		preventDefault: () => void
		dataTransfer: { dropEffect: string }
	}) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}

	const onDrop = (event: {
		preventDefault: () => void
		dataTransfer: { getData: (arg0: string) => any }
		clientX: number
		clientY: number
	}) => {
		event.preventDefault()

		if (reactFlowWrapper == null || rFlow.reactFlowInstance == null) {
			return
		}

		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
		const type = event.dataTransfer.getData('application/reactflow')
		const position = rFlow.reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		})
		let newNode: any
		switch (type) {
			case 'dialogue':
				newNode = new DialogueNode(
					'character name',
					'sample dialogue',
					setSelected,
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

		rFlow.setElements((els: any[]) => {
			return els.concat(newNode)
		})
	}

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
			setSelected,
			250,
			250
		)

		rFlow.setElements((els: any[]) => {
			return els.concat(newNode)
		})
	}

	function onLoad(_reactFlowInstance: any) {
		_reactFlowInstance.fitView()
		rFlow.setReactFlowInstance(_reactFlowInstance)
	}

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
			<ReactFlowProvider>
				<div
					style={{ width: '100%', height: '100%' }}
					className="reactflow-wrapper"
					ref={reactFlowWrapper}
				>
					<ReactFlow
						elements={rFlow.elements}
						edgeTypes={edgeTypes}
						nodeTypes={nodeTypes}
						onElementsRemove={onElementsRemove}
						onConnect={onConnect}
						onConnectStart={onConnectStart}
						onConnectStop={onConnectStop}
						onConnectEnd={onConnectEnd}
						onLoad={onLoad}
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
			</ReactFlowProvider>
			<AddButton z={1} onClick={addOption}>
				Add Dialogue Option
			</AddButton>
			{selected && (
				<Detail
					dialogueNode={selected}
					isOpen
					close={() => setSelected(null)}
				/>
			)}
			{/* {selected && (
				<Detail
					dialogue={selected.dialogue}
					setDialogue={selected.setDialogue}
					isOpen
					close={() => setSelected(null)}
				/>
			)} */}
		</CanvasContainer>
	)
}

export default Canvas
