import React, { useState } from 'react'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import DeleteNode from '@/components/forms/node/DeleteNode'
import Modal from '@/components/modal/Modal'
import { FlexRow } from '@/components/styles'
import { Paragraph } from '@/components/Typography/text'
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg'
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg'
import IconButton from '@/components/Button/IconButton'
import { NodeContainer } from './styles'

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
	color,
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
			<NodeContainer
				color={color}
				active={false}
				draggable="true"
				className="node react-flow__node-default"
				onDragStart={(event) => onDragStart(event)}
			>
				<FlexRow
					style={{ justifyContent: 'space-between', width: '100%' }}
				>
					<Paragraph
						color="white"
						style={{ flex: 1, textAlign: 'center' }}
					>
						{displayName}
					</Paragraph>
					{modable && (
						<FlexRow style={{ alignItems: 'center' }}>
							<IconButton
								Icon={EditIcon}
								onClick={() => {
									dispatch({
										type: types.customizeSchema,
										data: {
											mode: 'customize',
											schema: name,
										},
									})
								}}
							/>
							<IconButton
								Icon={CloseIcon}
								onClick={() => setFormMode('delete')}
							/>
						</FlexRow>
					)}
				</FlexRow>
			</NodeContainer>
		</>
	)
}

export default PaletteItem
