import { Edge } from 'react-flow-renderer'

export const getOutgoingEdges = (id: string, edges: Edge<any>[]) => {
	return edges.filter((edge) => edge.source === id)
}

export const getIncomingEdges = (id: string, edges: Edge<any>[]) => {
	return edges.filter((edge) => edge.target === id)
}
