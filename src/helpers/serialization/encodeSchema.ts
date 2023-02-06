import { Edge, Node } from 'reactflow'
import { getOutgoingEdges } from '../edgeHelpers'
import { SerializeNode } from './serialization'

export const encodeSchema = (
	name: string,
	color: string,
	groupNodes: Node<any>[],
	edges: Edge[]
) => {
	const data = {
		type: 'group',
		name,
		color,
		nodes: [],
		edges: [],
	}

	const basePosition = groupNodes[0].position
	const idMap: {
		[key: string]: number
	} = {} // string and index
	const groupEdges: Edge[] = []

	// encode nodes w/ base position offset
	groupNodes.forEach((n) => {
		const gN = SerializeNode(
			n.data.name,
			n.data.color,
			'base',
			n.data.fields
		)
		const o = {
			...gN,
			position: [
				n.position.x - basePosition.x,
				n.position.y - basePosition.y,
			],
		}

		idMap[n.id] = data.nodes.length
		// @ts-ignore
		data.nodes.push(o)
		groupEdges.push(...getOutgoingEdges(n.id, edges))
	})

	// filter & normalize edges
	groupEdges.forEach((e) => {
		// look into map, if the to and from both exist, use their
		// ids & the to node's key for it
		const from = idMap[e.source]
		// eslint-disable-next-line no-nested-ternary
		const handle = e.sourceHandle
			? e.sourceHandle === e.source
				? ''
				: e.sourceHandle
			: ''
		const to = idMap[e.target]

		if (to !== undefined && from !== undefined) {
			// @ts-ignore
			data.edges.push({ handle, to, from })
		}
	})

	return data
}
