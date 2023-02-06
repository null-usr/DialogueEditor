// functions for getting groups of nodes

import { Edge, getIncomers, getOutgoers, Node } from 'reactflow'
import { Queue } from './queue'

export const getLinked = (
	start: Node,
	nodes: Node[],
	edges: Edge[],
	// function that gets us our connected nodes
	// probably getOutgoing or getIncoming
	getConnected: (n: Node, nodes: Node[], edges: Edge[]) => Node[]
) => {
	const q = new Queue<Node>()

	const out: Node[] = []
	const visited: { [key: string]: boolean } = {}

	q.push(start)

	// dequeue all elements
	while (!q.isEmpty) {
		const n = q.pop()

		if (visited[n.id]) {
			// eslint-disable-next-line no-continue
			continue
		}

		visited[n.id] = true
		out.push(n)

		const connected = getConnected(n, nodes, edges)
		connected.forEach((c) => q.push(c))
	}

	return out
}

export const getForwardLinked = (start: Node, nodes: Node[], edges: Edge[]) => {
	return getLinked(start, nodes, edges, getOutgoers)
}

export const getReverseLinked = (start: Node, nodes: Node[], edges: Edge[]) => {
	return getLinked(start, nodes, edges, getIncomers)
}
