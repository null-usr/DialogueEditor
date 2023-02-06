import { Position, XYPosition } from 'reactflow'
import { v4 as uuid } from 'uuid'
import DataEdge from '@/components/edges/DataEdge'
import { BasicNode } from '@/components/nodes/BasicNode'
import { DialogueNode } from '@/components/nodes/DialogueNode'

export const decodeSchema = (position: XYPosition, paletteItem: any) => {
	const { name, type, fields, color } = paletteItem

	const newNodes: any[] = []
	const newEdges: any[] = []

	switch (type) {
		case 'dialogue':
			newNodes.push(
				new DialogueNode(
					'character name',
					'sample dialogue',
					null,
					position.x,
					position.y
				)
			)
			break
		case 'base':
			newNodes.push(
				new BasicNode(
					name,
					position.x,
					position.y,
					uuid(),
					fields,
					color
				)
			)
			break
		case 'custom':
			newNodes.push(new BasicNode(name, position.x, position.y, uuid()))
			break
		/*
					With group we add the position to the 
				*/
		case 'group':
			// eslint-disable-next-line no-case-declarations
			const { nodes: groupNodes, edges: groupEdges } = paletteItem
			groupNodes.forEach(
				(n: {
					name: string
					type: any
					fields: any
					position: number[]
				}) => {
					switch (n.type) {
						case 'dialogue':
							newNodes.push(
								new DialogueNode(
									'character name',
									'sample dialogue',
									null,
									n.position[0] + position.x,
									n.position[1] + position.y
								)
							)
							break
						case 'base':
							newNodes.push(
								new BasicNode(
									n.name,
									n.position[0] + position.x,
									n.position[1] + position.y,
									uuid(),
									n.fields
								)
							)
							break
						case 'custom':
							newNodes.push(
								new BasicNode(
									n.name,
									n.position[0] + position.x,
									n.position[1] + position.y,
									uuid()
								)
							)
							break
						default:
							newNodes.push({
								id: uuid(),
								type,
								position: {
									x: n.position[0] + position.x,
									y: n.position[1] + position.y,
								},
								data: { label: `${type} node` },
								sourcePosition: Position.Right,
								targetPosition: Position.Left,
							})
							break
					}
				}
			)

			groupEdges.forEach(
				(e: { from: number; to: number; handle: string | null }) => {
					newEdges.push(
						new DataEdge(
							newNodes[e.from].id,
							newNodes[e.to].id,
							e.handle,
							null
						)
					)
				}
			)
			break
		default:
			newNodes.push({
				id: uuid(),
				type,
				position,
				data: { label: `${type} node` },
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
			})
			break
	}
	return { newNodes, newEdges }
}
