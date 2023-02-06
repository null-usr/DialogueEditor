import initialElements from '@/helpers/initial-elements'
import {
	Connection,
	Edge,
	Node,
	OnEdgesChange,
	OnNodesChange,
	Position,
	updateEdge,
} from 'reactflow'
import { Schema, Workspace } from '../helpers/types'

export const types = {
	setNode: 'SET_NODE',
	editNode: 'EDIT_NODE',
	addNode: 'ADD_NODE',
	deleteNode: 'DELETE_NODE',
	setNodes: 'SET_NODES',

	customizeSchema: 'CUSTOMIZE',

	setEdge: 'SET_EDGE',
	editEdge: 'EDIT_EDGE',
	editEdgeHandle: 'EDIT_EDGE_HANDLE',
	addEdge: 'ADD_EDGE',
	deleteEdge: 'DELETE_EDGE',
	updateSourceHandle: 'UPDATE_SOURCE',
	updateTargetHandle: 'UPDATE_SOURCE',

	loadBuiltInNodes: 'DEFAULT',
	loadCustomNodes: 'CUSTOM',
	addCustomNode: 'ADD_CUSTOM',
	deleteCustomNode: 'DELETE_CUSTOM',

	createScene: 'SCENE_CREATE',
	deleteScene: 'SCENE_DELETE',
	renameScene: 'SCENE_RENAME',
	changeScene: 'SCENE_CHANGE',

	createWorkspace: 'WORKSPACE_CREATE',
	loadWorkspace: 'WORKSPACE_LOAD',
	renameWorkspace: 'WORKSPACE_RENAME',
	addCustomWorkspaceNode: 'WORKSPACE_ADD_SCHEMA',
	deleteCustomWorkspaceNode: 'WORKSPACE_DELETE_SCHEMA',
	createWorkspaceVariable: 'WORKSPACE_CREATE_VAR',
	editWorkspaceVariable: 'WORKSPACE_EDIT_VAR',
	deleteWorkspaceVariable: 'WORKSPACE_DELETE_VAR',
}

export type RFState = {
	theme: any
	setTheme: (theme: any) => void

	nodeID: string | null
	edgeID: string | null

	mode: string
	schema: string | null

	nodes: Node[]
	edges: Edge[]
	builtInNodes: Schema[]
	customNodes: Schema[]

	activeScene: string | null
	workspace: Workspace

	// Reset
	reset: () => void

	// Nodes
	setNodes: (newNodes: Node[]) => void
	onNodesChange: OnNodesChange
	editNode: (id: string) => void
	addNode: (newNode: Node<any>) => void
	setSelectedNodes: (selected: Node[]) => void
	updateDialogueData: (nodeID: string, d: string) => void
	updateNodeHandles: (
		nodeID: string,
		sources: string[],
		targets: string[]
	) => void

	// Edges
	setEdges: (newEdges: Edge[]) => void
	onEdgesChange: OnEdgesChange
	onConnect: (edge: Edge | Connection) => void
	deleteEdge: (id: string) => void

	// Utility
	dispatch: (args: { type: any; data: any }) => void
	updateNodeColor: (nodeId: string, color: string) => void
	updateNodeName: (nodeId: string, name: string) => void
}

export const reducer = (
	state: RFState,
	{ type, data }: { type: string; data: any }
) => {
	switch (type) {
		case types.setNode:
			return { nodeID: data }
		case types.addNode:
			return { nodes: state.nodes.concat(data) }
		// data is ID and new data
		case types.editNode: {
			// it's important that you create a new object here
			// in order to notify react flow about the change
			const newNodes = state.nodes.map((node) => {
				if (node.id === data.nodeID) {
					// if the ID is different, we'll need to modify
					// edges as well
					if (data.nodeData.id !== node.id) {
						node.id = data.nodeData.id
					}
					node.data = { ...data.nodeData }
				}
				return node
			})
			return { nodes: newNodes }
		}
		case types.setNodes:
			return { nodes: data }

		case types.addEdge: {
			return { edges: state.edges.concat(data) }
		}
		case types.editEdge: {
			const newEdges = state.edges.map((edge) => {
				if (edge.id === data.edgeID) {
					edge.data = data.edgeData
				}
				return edge
			})
			return { edges: newEdges }
		}
		case types.editEdgeHandle: {
			return { edges: updateEdge(data.old, data.new, state.edges) }
		}
		case types.deleteEdge: {
			const out = state.edges.filter((e: { id: string }) => e.id !== data)
			state.setEdges(out)
			return {}
		}
		case types.setEdge: {
			return { edgeID: data.nodes }
		}

		case types.updateSourceHandle: {
			const out = state.edges.map((e: Edge<any>) => {
				if (e.sourceHandle === data.old) {
					e.sourceHandle = data.new
					e.data = { ...e.data }
				}
				return e
			})
			return {}
		}
		case types.updateTargetHandle: {
			const out = state.edges.map((e: Edge<any>) => {
				if (e.targetHandle === data.old) {
					e.targetHandle = data.new
					e.data = { ...e.data }
				}
				return e
			})
			return {}
		}

		case types.loadCustomNodes: {
			return {
				customNodes: data.nodes,
			}
		}

		case types.loadBuiltInNodes: {
			return {
				builtInNodes: data.nodes,
			}
		}

		case types.addCustomNode: {
			return {
				customNodes: [
					...state.customNodes.filter((n) => n.name !== data.name),
					data,
				],
				schema: null,
				mode: '',
			}
		}

		case types.deleteCustomNode: {
			return {
				customNodes: state.customNodes.filter((n) => n.name !== data),
			}
		}

		case types.customizeSchema: {
			return {
				mode: data.mode,
				schema: data.schema,
			}
		}

		// SCENE =================================================

		case types.createScene: {
			const { scenes } = state.workspace
			scenes[data] = {
				name: data,
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				edges: [],
				viewport: { x: 0, y: 0, zoom: 100 },
			}

			// if we're creating from a null scene we need to
			// encode the current one
			if (state.activeScene === null) {
				scenes.default = {
					name: 'default',
					nodes: state.nodes,
					edges: state.edges,
					viewport: { x: 0, y: 0, zoom: 100 },
				}
			}
			return {
				workspace: {
					...state.workspace,
					scenes,
				},
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				edges: [],
				activeScene: data,
			}
		}

		case types.deleteScene: {
			const { scenes } = state.workspace
			delete scenes[data]

			return {
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		case types.renameScene: {
			const { scenes } = state.workspace

			// https://stackoverflow.com/questions/4647817/javascript-object-rename-key
			delete Object.assign(scenes, {
				[data.newName]: scenes[data.oldName],
			})[data.oldName]

			return {
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		case types.changeScene: {
			const { scenes } = state.workspace
			const newScene = state.workspace.scenes[data]

			// save our current scene
			if (state.activeScene !== null) {
				scenes[state.activeScene] = {
					...state.workspace.scenes[state.activeScene],
					nodes: state.nodes,
					edges: state.edges,
				}
			}

			return {
				activeScene: data,
				nodes: newScene.nodes,
				edges: newScene.edges,
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		// WORKSPACE ===================================================

		case types.createWorkspace: {
			return {
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				workspace: {
					name: data.workspaceName,
					scenes: {
						default: {
							name: data.workspaceName,
							nodes: initialElements,
							edges: [],
							viewport: { x: 0, y: 0, zoom: 1 },
						},
					},
					schemas: [],
					w_vars: {},
				},
				edges: [],
				activeScene: 'untitled',
			}
		}

		case types.loadWorkspace: {
			let hasScenes = false
			if (data.scenes && data.activeScene) {
				if (data.scenes[data.activeScene]) {
					hasScenes = true
				}
			}
			return {
				workspace: data.workspace,
				// eslint-disable-next-line no-nested-ternary
				nodes: hasScenes
					? data.scenes[data.activeScene].nodes
					: data.nodes
					? data.nodes
					: [],
				// eslint-disable-next-line no-nested-ternary
				edges: hasScenes
					? data.scenes[data.activeScene].edges
					: data.edges
					? data.edges
					: [],
				viewport: data.viewport ? data.viewport : undefined,
				activeScene: data.activeScene || null,
			}
		}

		case types.renameWorkspace: {
			return {
				workspace: {
					...state.workspace,
					name: data.newName,
				},
			}
		}

		case types.addCustomWorkspaceNode: {
			return {
				workspace: {
					...state.workspace,
					schemas: [
						...state.workspace.schemas.filter(
							(n) => n.name !== data.name
						),
						data,
					],
				},
			}
		}

		case types.deleteCustomWorkspaceNode: {
			return {
				workspace: {
					...state.workspace,
					schemas: state.workspace.schemas.filter(
						(n) => n.name !== data
					),
				},
			}
		}

		case types.createWorkspaceVariable: {
			const { w_vars } = state.workspace
			w_vars[data.name] = {
				type: data.type,
				options: [],
			}
			return {
				workspace: {
					...state.workspace,
					w_vars,
				},
			}
		}

		case types.editWorkspaceVariable: {
			const { w_vars } = state.workspace
			w_vars[data.name].options = data.options
			return {
				workspace: {
					...state.workspace,
					w_vars,
				},
			}
		}

		case types.deleteWorkspaceVariable: {
			const { w_vars } = state.workspace
			delete w_vars[data]
			return {
				workspace: {
					...state.workspace,
					w_vars,
				},
			}
		}

		default:
			return {}
	}
}
