// we'll want to save scenes to be loaded by our editor and
// serialize lite versions to be loaded by the game engines

import { Edge, Node, ReactFlowJsonObject } from 'reactflow'
import { Field, Workspace } from '../types'

export interface ISceneData extends ReactFlowJsonObject {
	scenes?: string[]
}

export const SerializeNode = (
	name: string,
	color: string,
	type: string,
	f: Field[]
) => {
	const out = {
		name,
		color,
		type,
		fields: f,
	}
	return out
}

export const SerializeGroup = (
	name: string,
	color: string,
	nodes: Node[],
	edges: Edge[]
) => {
	const mostLeftNode = nodes.reduce((min: Node, node) =>
		min && min.position.x < node.position.x ? min : node
	)
	const out = {
		name,
		color,
		type: 'group',
		nodes: [],
		edges: [],
	}

	return out
}

export function LoadScene(scene: string): ReactFlowJsonObject {
	// https://www.thomasmaximini.com/json-stringify-symbols-and-react-components
	// in order to properly stringafy & parse generic react components
	const data: ReactFlowJsonObject = JSON.parse(scene, (k, v) => {
		const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

		return matches ? Symbol.for(matches[1]) : v
	})

	const out: ReactFlowJsonObject = {
		nodes: [],
		edges: [],
		viewport: data.viewport,
	}

	out.nodes = data.nodes
	out.edges = data.edges

	// for every element in our node list, if the fields key exists
	// we create a basic node, otherwise just push the raw react component
	// data.nodes.forEach((node) => {
	// 	if (node.fields) {
	// 		const newBasic = new BasicNode(node.x, node.y, node.id, node.fields)
	// 		out.elements.push(newBasic)
	// 	} else {
	// 		out.elements.push(node)
	// 	}
	// })

	return out
}

export function SaveScene(scene: ReactFlowJsonObject) {
	const out: ISceneData = {
		nodes: [],
		edges: [],
		viewport: { x: 0, y: 0, zoom: 0 },
	}

	// scene.elements.forEach((element) => {
	// 	const edge = element as Edge

	// 	if (edge.source) {
	// 		out.edges.push(edge)
	// 	} else {
	// 		out.nodes.push(element)
	// 	}
	// })

	// out.zoom = scene.zoom
	// out.position = scene.position

	// to allow for encoding of general react components
	return JSON.stringify(scene, (k, v) =>
		typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
	)
}

export function SaveWorkspace(workspace: Workspace) {
	return JSON.stringify(workspace, (k, v) =>
		typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
	)
}

export function LoadWorkspace(workspace: string) {
	const data: any = JSON.parse(workspace, (k, v) => {
		const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

		return matches ? Symbol.for(matches[1]) : v
	})

	return data
}

export function SerializeScene(scene: ReactFlowJsonObject) {
	const out: any = {}

	// do some processing aka remove zoom + node positions

	// scene.elements.forEach((element) => {
	// 	const node = element as BasicNode
	// 	const edge = element as Edge
	// 	if (typeof node.serialize === 'function') {
	// 		const tmp = node.serialize()
	// 		out[element.id] = tmp[element.id]
	// 	} else if (edge.source) {
	// 		edges.push(edge)
	// 	}
	// })

	// edges.forEach((edge) => {
	// 	if (edge.type !== 'data') {
	// 		out[edge.source].next = edge.target
	// 	} else {
	// 		const dataEdge = edge as DataEdge
	// 		out[edge.source][dataEdge.name] = dataEdge.target
	// 	}
	// })

	return JSON.stringify(scene)
}
