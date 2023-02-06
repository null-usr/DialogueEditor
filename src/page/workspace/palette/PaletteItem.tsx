import React, { useState } from 'react'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import DeleteNode from '@/components/forms/node/DeleteNode'
import Modal from '@/components/modal/Modal'

const PaletteItem: React.FC<{
	className: string
	name: string
	type: string
	fields?: any[]
	nodes?: any[]
	edges?: any[]
	color?: string
	modable?: boolean
}> = ({
	className,
	name,
	type,
	fields,
	nodes,
	edges,
	color = 'white',
	modable = false,
	...props
}) => {
	const dispatch = useStore((store) => store.dispatch)
	const displayName = name.replace('@workspace/', '')
	const [formMode, setFormMode] = useState('')

	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		const data = JSON.stringify({
			name,
			type,
			fields,
			nodes,
			edges,
			className,
		})
		event.dataTransfer.setData('application/reactflow', data)
		event.dataTransfer.effectAllowed = 'move'
	}

	return (
		<>
			{formMode === 'delete' && (
				<Modal open withDimmer close={() => setFormMode('')}>
					<DeleteNode
						name={name}
						submit={() => {
							dispatch({
								type:
									displayName === name
										? types.deleteCustomNode
										: types.deleteCustomWorkspaceNode,
								data: name,
							})
						}}
						cancel={() => setFormMode('')}
					/>
				</Modal>
			)}
			<div
				style={{
					background: color || 'white',
					borderRadius: 6,
					height: 35,
				}}
				draggable="true"
				className="node react-flow__node-default"
				onDragStart={(event) => onDragStart(event)}
			>
				{displayName}
				{modable && (
					<>
						<button
							onClick={() => {
								dispatch({
									type: types.customizeSchema,
									data: { mode: 'customize', schema: name },
								})
							}}
						>
							E
						</button>
						<button onClick={() => setFormMode('delete')}>X</button>
					</>
				)}
			</div>
		</>
	)
}

export default PaletteItem
