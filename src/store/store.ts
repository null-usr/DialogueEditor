import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	OnConnect,
	OnEdgesChange,
	OnNodesChange,
	Position,
	useEdges,
} from 'reactflow'
import { create } from 'zustand'
import initialElements from '../helpers/initial-elements'
import { reducer, RFState } from './reducer'

// this is our useStore hook that we can use in our components
// to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
	theme: null,
	nodeID: null,
	edgeID: null,
	nodes: initialElements,
	mode: 'active',
	schema: null,
	edges: [],
	builtInNodes: [],
	customNodes: [],
	activeScene: null,
	workspace: {
		name: null,
		scenes: {},
		schemas: [],
		w_vars: {},
	},
	reset: () => {
		set({
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
				name: null,
				scenes: {},
				schemas: [],
				w_vars: {},
			},
		})
	},

	setTheme: (theme: any) => {
		set({
			theme,
		})
	},

	updateNodeHandles: (nodeID, sources, targets) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeID) {
					node.data = {
						...node.data,
						sources,
						targets,
					}
				}
				return node
			}),
		})
	},
	setNodes: (newNodes: Node[]) => {
		set({ nodes: newNodes })
	},
	setEdges: (newEdges: Edge[]) => {
		set({ edges: newEdges })
	},
	addNode: (newNode: Node<any>) => {
		set({
			nodes: get().nodes.concat(newNode),
		})
	},
	onNodesChange: (changes: NodeChange[]) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		})
	},
	setSelectedNodes: (selected: Node[]) => {
		set({
			nodes: get().nodes.map((n) => {
				if (selected.find((s) => s.id === n.id)) n.selected = true
				return n
			}),
		})
	},
	onEdgesChange: (changes: EdgeChange[]) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		})
	},
	onConnect: (connection: Connection | Edge) => {
		set({
			edges: addEdge(connection, get().edges),
		})
	},
	updateDialogueData: (nodeID: string, d: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeID) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, dialogue: d }
				}
				return node
			}),
		})
	},
	deleteEdge: (id: string) => set({ edgeID: id }),
	editNode: (id: string) => set({ nodeID: id }),
	dispatch: (args: { type: any; data: any }) =>
		// @ts-ignore
		set((state) => reducer(state, args)),
	updateNodeColor: (nodeId: string, color: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, color }
				}

				return node
			}),
		})
	},
	updateNodeName: (nodeId: string, name: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, name }
				}

				return node
			}),
		})
	},
}))

export default useStore
