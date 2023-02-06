import { Edge, Node, Viewport } from 'reactflow'
import DialogueNodeType, { DialogueNode } from '@/components/nodes/DialogueNode'
import BasicNodeType, { BasicNode } from '@/components/nodes/BasicNode'
import ColorChooserNode from '@/components/nodes/ColorChooserNode'
import RootNodeType from '@/components/nodes/RootNode'
import SourceNodeType from '@/components/nodes/SourceNode'
import DefaultNodeType from '@/components/nodes/DefaultNode'
import { DataEdgeType } from '@/components/edges/DataEdge'

export const NodeTypes = {
	base: BasicNodeType,
	root: RootNodeType,
	source: SourceNodeType,
	default: DefaultNodeType,
	dialogue: DialogueNodeType,
	colorChooser: ColorChooserNode,
}

export const EdgeTypes = {
	data: DataEdgeType,
}

export interface iFieldData {
	[key: string]: string
}

export type Field = {
	key: string
	type: string
	value?: any
}

// Schema for drag & drop nodes
export interface Schema {
	name: string
	type: string
	className: string
	color?: string
	fields?: any[]
	// our schema can also represent a group of nodes
	nodes?: any[]
	edges?: any[]
}

export type Scene = {
	name: string | null
	nodes: Node<any>[]
	edges: Edge<any>[]
	viewport: Viewport
}

export type Workspace = {
	name: string | null // when the name is null, that's when we ask when they save, what they want to name it
	scenes: { [key: string]: Scene }
	schemas: Schema[]
	w_vars: {
		[key: string]: {
			type: 'number' | 'string'
			options: number[] | string[]
		}
	}
}
