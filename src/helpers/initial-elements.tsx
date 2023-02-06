import { Node, Position } from 'reactflow'

const initialElements: Node[] = [
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
]

export default initialElements
